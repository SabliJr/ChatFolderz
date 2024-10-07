import { Request, Response } from "express";
import stripe from "../config/payment";
import {
  REFRESH_TOKEN_SECRET,
  SERVER_URL,
  CLIENT_URL,
  WEBHOOK_SIGNING_SECRET,
} from "../Constants/index";
import jwt from "jsonwebtoken";
import { query, pool } from "../config/dbConfig";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

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
  const cookies = req.cookies;
  // if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  const { price_id } = req.query;

  console.log("The cookies: ", refreshToken);

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

  if (session.payment_status === "paid") {
    let customer_id = session.customer;
    let has_access = true;
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
        (plan) => plan.price === Number((session.amount_total as number) / 100)
      )
      .forEach((plan) => {
        subscription_duration = plan.duration;
        subscription_type = plan.subscription_type;
      });

    console.log("sub duration: ", subscription_duration);
    console.log("sub_type: ", subscription_type);
    console.log(subscription_state);

    // Use INSERT ... ON CONFLICT to handle duplicate customer_id
    await query(
      `INSERT INTO user_subscription (customer_id, subscription_type, subscription_duration, has_access, customer_email, customer_country, customer_name, created_at, expires_at, subscription_state)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (customer_id)
       DO UPDATE SET
         subscription_type = EXCLUDED.subscription_type,
         subscription_duration = EXCLUDED.subscription_duration,
         has_access = EXCLUDED.has_access,
         customer_email = EXCLUDED.customer_email,
         customer_country = EXCLUDED.customer_country,
         customer_name = EXCLUDED.customer_name,
         updated_at = CURRENT_TIMESTAMP,
         expires_at = EXCLUDED.expires_at,
         subscription_state = EXCLUDED.subscription_state`,
      [
        customer_id,
        subscription_type,
        subscription_duration,
        has_access,
        customer_email,
        customer_country,
        customer_name,
        created_at,
        expiry_date,
        subscription_state,
      ]
    );

    let isCustomerHasAccount = query(
      "SELECT * FROM user_profile WHERE email=$1",
      [customer_email]
    );

    let la_user = (await isCustomerHasAccount).rows;
    let user_id;
    if (la_user.length > 0) user_id = la_user?.[0].user_id;

    await query(
      "UPDATE user_subscription SET user_id=$1 WHERE customer_id=$2",
      [user_id, customer_id]
    );

    await query("UPDATE user_profile SET customer_id=$1 WHERE user_id=$2", [
      customer_id,
      user_id,
    ]);

    res.status(200).json({
      message: "Subscription successful, thanks!",
      user: {
        customer_id,
      },
    });
  } else {
    console.log("We are here MF!");
    res.status(400).json({ message: "Payment not successful" });
  }
};

export { onCheckOut, onSubscriptionSuccess };
