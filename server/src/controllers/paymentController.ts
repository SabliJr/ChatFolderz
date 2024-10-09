import { Request, Response } from "express";
import stripe from "../config/payment";
import { WEBHOOK_SIGNING_SECRET } from "../Constants/index";
import { query } from "../config/dbConfig";
import { checkUserAccess } from "../util/verificationFunctions";

const onCheckOut = async (req: Request, res: Response) => {
  const { price_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id as string, // Price ID for either monthly or yearly plan
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 1, // This will give the user a 1-day free trial
      },
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    res.status(500).send({
      error: error.message,
      message: "There was an error creating the subscription",
    });
  }
};

const onSubscriptionSuccess = async (req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.query.session_id as string
  );

  if (session.payment_status === "paid") {
    let customer_id = session.customer;
    let customer_email = session.customer_details?.email;
    let customer_country = session.customer_details?.address?.country;
    let customer_name = session.customer_details?.name;
    let created_at = new Date(session.created * 1000);
    let expiry_date = new Date(session.expires_at * 1000);
    let subscription_state = session.status;

    // Use INSERT ... ON CONFLICT to handle duplicate customer_id
    await query(
      `INSERT INTO user_subscription (customer_id, customer_email, customer_country, customer_name, created_at)
       VALUES($1, $2, $3, $4, $5)
       ON CONFLICT (customer_id)
       DO UPDATE SET
         customer_email = EXCLUDED.customer_email,
         customer_country = EXCLUDED.customer_country,
         customer_name = EXCLUDED.customer_name,
         updated_at = CURRENT_TIMESTAMP
         `,
      [customer_id, customer_email, customer_country, customer_name, created_at]
    );

    let isCustomerHasAccount = await query(
      "SELECT * FROM user_profile WHERE email=$1",
      [customer_email]
    );

    let { user_id } = isCustomerHasAccount.rows[0];
    await query(
      "UPDATE user_subscription SET user_id=$1 WHERE customer_id=$2",
      [user_id, customer_id]
    );

    await query(
      "UPDATE user_profile SET customer_id=$1, has_access=$2, expires_at=$3, subscription_state=$4 WHERE user_id=$5",
      [customer_id, true, expiry_date, subscription_state, user_id]
    );

    let user_has_payed = await checkUserAccess(user_id);
    res.status(200).json({
      message: "Subscription successful, thanks!",
      user: {
        user_has_payed: user_has_payed,
      },
    });
  } else {
    console.error("There was a problem inserting user's infos");
    res.status(400).json({ message: "Payment not successful" });
  }
};

const onStripeWebhooks = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res.status(400).send("Stripe Signature is missing");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req?.rawBody as Buffer,
      sig,
      WEBHOOK_SIGNING_SECRET as string
    );

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded

        console.log("The payment success: ", paymentIntentSucceeded);
        break;
      case "customer.subscription.deleted": // When a subscription ends
        {
          const customerSubscriptionDeleted = event.data.object;
          const customerId = customerSubscriptionDeleted.customer;
          const expiresAt = new Date(
            customerSubscriptionDeleted.current_period_end * 1000 // This is the subscription end date
          );

          console.log("subscriptionDeleted: ", customerSubscriptionDeleted);
          // Update the database to reflect the subscription cancellation
          await query(
            "UPDATE user_profile SET subscription_state=$1, expires_at=$2, has_access=$3 WHERE customer_id=$4",
            ["Canceled", expiresAt, true, customerId]
          );

          // Update the subscription state to 'canceled' and set updated_at to the current time
          await query(
            "UPDATE user_subscription SET updated_at=CURRENT_TIMESTAMP WHERE customer_id=$1",
            [customerId]
          );
        }
        break;
      case "customer.subscription.created":
        {
          const subscriptionCreated = event.data.object;
          const customerId = subscriptionCreated.customer;
          const subscriptionStatus = subscriptionCreated.status; // e.g., 'trialing', 'active'
          const expiresAt = new Date(
            subscriptionCreated.current_period_end * 1000
          ); // Subscription end date
          const startDate = new Date(subscriptionCreated.start_date * 1000); // Subscription start date
          const plan = subscriptionCreated.items.data[0].plan; // Get the plan details
          const subscription_duration = plan.interval;

          console.log("subscriptionCreated: ", subscriptionCreated);

          // Update the database to reflect the new subscription
          await query(
            "UPDATE user_profile SET subscription_state=$1, expires_at=$2, has_access=$3 WHERE customer_id=$4",
            [subscriptionStatus, expiresAt, true, customerId]
          );

          // Update the subscription information in the user_subscription table
          await query(
            `UPDATE user_subscription 
            SET subscription_duration=$1, updated_at=CURRENT_TIMESTAMP, last_subscription_start_date=$2
            WHERE customer_id=$3`,
            [subscription_duration, startDate, customerId]
          );
        }
        break;
      case "customer.subscription.updated":
        const customerSubscriptionUpdated = event.data.object;
        const updatedCustomerId = customerSubscriptionUpdated.customer;
        const subscriptionStatus = customerSubscriptionUpdated.status; // e.g., 'active', 'past_due', etc.
        const expiresAt = new Date(
          customerSubscriptionUpdated.current_period_end * 1000
        );

        console.log("subscriptionUpdated: ", customerSubscriptionUpdated);

        // Update the subscription state and expires_at based on the new status
        const now = new Date();
        let has_access = expiresAt > now ? true : false;
        await query(
          "UPDATE user_profile SET subscription_state=$1, expires_at=$2, has_access=$3 WHERE customer_id=$4",
          [subscriptionStatus, expiresAt, has_access, updatedCustomerId]
        );

        await query(
          "UPDATE user_subscription SET updated_at=CURRENT_TIMESTAMP WHERE customer_id=$1",
          [updatedCustomerId]
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send("Webhook received!");
  } catch (err: any) {
    console.error("There was an error catching payment events: ", err);
    res.status(400).send(`Webhook Error: ${err?.message}`);
  }
};

async function getCustomerSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });

  return subscriptions.data; // This will return an array of subscription objects
}

const onCancelSubscription = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken || !cookies.userId) return res.sendStatus(401);

  const userId = cookies.userId;
  let { customer_id } = req.query;

  try {
    let subscriptions = await getCustomerSubscriptions(customer_id as string);
    let { expires_at } = (
      await query("SELECT * FROM user_profile WHERE user_id=$1", [userId])
    ).rows[0];

    // Cancel the subscription immediately
    // const canceledSubscription = await stripe.subscriptions.del(subscriptionId);

    // Ensure subscriptions is an array and get the first subscription ID
    if (Array.isArray(subscriptions) && subscriptions.length > 0) {
      let subscriptionId = subscriptions[0].id;

      // Cancel the subscription immediately
      const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      res.status(200).json({
        message: "Subscription canceled successfully",
        subscription_state: "Canceled",
        accessTime: expires_at,
      });
    } else {
      res.status(404).json({ message: "No subscriptions found" });
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({
      message:
        "An error occurred while canceling the subscription. Please try again or contact support if the issue persists.",
    });
  }
};

export {
  onCheckOut,
  onSubscriptionSuccess,
  onStripeWebhooks,
  onCancelSubscription,
};
