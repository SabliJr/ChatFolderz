import { query } from "../config/dbConfig";
import { Request, Response } from "express";
import {
  ACCESS_SECRET_KEY,
  REFRESH_TOKEN_SECRET,
  CLIENT_URL,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
} from "../Constants";
import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";

// Logout creator
const userLogout = async (req: Request, res: Response) => {
  try {
    // Get the token from the request
    // This will depend on how you're sending the token (e.g., in the Authorization header, in a cookie, etc.)
    const token = req.cookies.refreshToken;

    // Add the token to the blacklist
    // await addToBlacklist(token);
    // Clear the refreshToken cookie
    res.clearCookie("refreshToken", {
      secure: true,
      sameSite: "strict",
      httpOnly: true,
      domain: ".wishties.com",
      path: "/",
    });

    // Send the success response
    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
};

const client = new OAuth2Client(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  "postmessage"
);
const exchangeCodeForTokens = async (code: string) => {
  const { tokens } = await client.getToken({
    code,
  });
  return tokens;
};

// Google Sign Up
const onAuthWithGoogle = async (req: Request, res: Response) => {
  const { token } = req.query;
  console.log("The incoming token: ", token);

  try {
    const tokens = await exchangeCodeForTokens(token as string);

    // Verify the token ID
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token as string, // Use the ID token from the tokens
      audience: GOOGLE_OAUTH_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    const user_id = payload?.sub as string;
    const email = payload?.email;
    const user_name = payload?.name;
    const picture = payload?.picture;

    // Check if the user exists in the database
    const userExists = await query(
      "SELECT * FROM user_profile WHERE email = $1",
      [email]
    );

    // Check if the customer has already paid
    let get_customer_id = await query(
      "SELECT * FROM user_subscription WHERE customer_email=$1",
      [email]
    );

    let customer_id;
    if (get_customer_id.rows.length > 0)
      customer_id = get_customer_id?.rows[0].customer_id;

    if (userExists.rows.length > 0) {
      // If they do, log them in
      const { user_id, customer_id } = userExists.rows[0];
      const accessToken = await jwt.sign(
        { user_id },
        ACCESS_SECRET_KEY as string,
        { expiresIn: "30m" }
      );

      const refreshToken = await jwt.sign(
        { user_id },
        REFRESH_TOKEN_SECRET as string,
        { expiresIn: "10d" }
      );

      res
        .status(202)
        .cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 10,
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          secure: true,
          // domain: '.sponsorwave.com',
        })
        .json({
          success: true,
          message: "The login was successful!",
          user: {
            user_id,
            customer_id,
          },
          accessToken: accessToken,
        });
    } else {
      // If they don't, store their info in the database and log them in
      await query(
        "INSERT INTO user_profile (user_id, user_name, email, is_verified, profile_image) VALUES($1, $2, $3, $4, $5)",
        [user_id, user_name, email, true, picture]
      );

      const accessToken = await jwt.sign(
        { user_id },
        ACCESS_SECRET_KEY as string,
        { expiresIn: "30m" }
      );

      const refreshToken = await jwt.sign(
        { user_id },
        REFRESH_TOKEN_SECRET as string,
        { expiresIn: "10d" }
      );

      res
        .status(201)
        .cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 10,
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          secure: true,
          // domain: '.sponsorwave.com',
        })
        .json({
          success: true,
          message: "The registration was successful.",
          user: {
            user_id,
            customer_id,
          },
          accessToken,
        });
    }
  } catch (error) {
    console.error("Error verifying Google token:", error);
    // Handle the error
    res.status(500).json({
      error: "Something went wrong verifying with Google, please try again!",
    });
  }
};

export { userLogout, onAuthWithGoogle };
