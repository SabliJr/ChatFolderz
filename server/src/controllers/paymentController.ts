import { Request, Response } from "express";
import stripe from "../config/payment";
import { WEBHOOK_SIGNING_SECRET } from "../Constants/index";
import { query } from "../config/dbConfig";
import { checkUserAccess } from "../util/verificationFunctions";

// Plans
const plans = [
  {
    price: 7.99,
    duration: "/month",
    subscription_type: "monthly",
  },
  {
    price: 76.7,
    duration: "/yearly",
    subscription_type: "yearly",
  },
];

const onCheckOut = async (req: Request, res: Response) => {
  const { price_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id as string,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    res.status(500).send({
      error: error.message,
      message: "There was an error creating subscription",
    });
  }
};

const onSubscriptionSuccess = async (req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.query.session_id as string
  );

  try {
    let customer_id;
    let customer_email;
    if (session.payment_status === "paid") {
      customer_email = session.customer_details?.email;
      customer_id = session.customer;
    }

    let userInfo;
    if (customer_id && customer_email) {
      userInfo = await query(
        "SELECT * FROM user_profile WHERE customer_id=$1 AND email=$2",
        [customer_id, customer_email]
      );
    }

    let { user_id } = userInfo?.rows[0];
    let user_has_payed = user_id ? checkUserAccess(user_id) : null;

    res.status(200).json({
      message: "All good, give them access!",
      user_has_payed: user_has_payed,
    });
  } catch (err: any) {
    console.error(
      "There was an error during payment verification from the landing page: ",
      err
    );
    res.status(400).json({ message: "Payment wasn't successful" });
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
        const session = await stripe.checkout.sessions.retrieve(
          paymentIntentSucceeded.id
        );

        let customer_id = session.customer;
        let customer_email = session.customer_details?.email;
        let customer_country = session.customer_details?.address?.country;
        let customer_name = session.customer_details?.name;
        let created_at = new Date(session.created * 1000);
        let expiry_date = new Date(session.expires_at * 1000);
        let subscription_state = session.status;
        let subscription_duration;
        let subscription_type;
        plans
          .filter(
            (plan) =>
              plan.price === Number((session.amount_total as number) / 100)
          )
          .forEach((plan) => {
            subscription_duration = plan.duration;
            subscription_type = plan.subscription_type;
          });

        // Use INSERT ... ON CONFLICT to handle duplicate customer_id
        await query(
          `INSERT INTO user_subscription (customer_id, subscription_type, subscription_duration, customer_email, customer_country, customer_name, created_at)
     VALUES($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (customer_id)
     DO UPDATE SET
       subscription_type = EXCLUDED.subscription_type,
       subscription_duration = EXCLUDED.subscription_duration,
       customer_email = EXCLUDED.customer_email,
       customer_country = EXCLUDED.customer_country,
       customer_name = EXCLUDED.customer_name,
       updated_at = CURRENT_TIMESTAMP`,
          [
            customer_id,
            subscription_type,
            subscription_duration,
            customer_email,
            customer_country,
            customer_name,
            created_at,
          ]
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

        break;
      case "customer.subscription.deleted": // When a subscription ends
        {
          const customerSubscriptionDeleted = event.data.object;
          const customerId = customerSubscriptionDeleted.customer;
          const expiresAt = new Date(
            customerSubscriptionDeleted.current_period_end * 1000 // This is the subscription end date
          );

          // Update the database to reflect the subscription cancellation
          await query(
            "UPDATE user_profile SET subscription_state=$1, expires_at=$2, has_access=$3 WHERE customer_id=$4",
            ["canceled", expiresAt, true, customerId]
          );

          // Update the subscription state to 'canceled' and set updated_at to the current time
          await query(
            "UPDATE user_subscription SET updated_at=CURRENT_TIMESTAMP WHERE customer_id=$1",
            [customerId]
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

export { onCheckOut, onSubscriptionSuccess, onStripeWebhooks };
