import { query } from "../config/dbConfig";
import { Request, Response } from "express";
import {
  REFRESH_TOKEN_SECRET,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
} from "../Constants";
import jwt from "jsonwebtoken";
import { checkUserAccess } from "../util/verificationFunctions";

import { OAuth2Client } from "google-auth-library";

// Logout creator
const userLogout = async (req: Request, res: Response) => {
  try {
    // Get the token from the request
    // This will depend on how you're sending the token (e.g., in the Authorization header, in a cookie, etc.)
    const token = req.cookies.refreshToken;

    // Clear out the cookie from the browser and that's it!
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

const getUserDetails = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// Google Sign Up
const onAuthWithGoogle = async (req: Request, res: Response) => {
  const { accessToken, idToken: token } = req.body;

  try {
    // Directly verify the token received from the frontend
    const ticket = await client.verifyIdToken({
      idToken: token, // Use the access token directly
      audience: GOOGLE_OAUTH_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    const userInfo = await getUserDetails(accessToken);

    const user_name = userInfo.names?.[0]?.displayName;
    const picture = userInfo.photos?.[0]?.url;
    const user_id = payload?.sub as string;
    const email = payload?.email;
    const email_verified = payload?.email_verified;

    // Check if the user exists in the database
    const userExists = await query(
      "SELECT * FROM user_profile WHERE user_id=$1",
      [user_id]
    );

    if (userExists.rows.length > 0) {
      // If they do, log them in
      const { user_id, user_name, customer_id, has_access } =
        userExists?.rows[0];

      const refreshToken = await jwt.sign(
        { user_id, user_name },
        REFRESH_TOKEN_SECRET as string,
        { expiresIn: "20d" }
      );

      res.status(202).json({
        success: true,
        message: "The login was successful!",
        user: {
          user_id,
          user_name,
          customer_id,
          has_access,
        },
        accessToken: refreshToken,
      });
    } else {
      // If they don't, store their info in the database and log them in
      let user_registration = await query(
        "INSERT INTO user_profile (user_id, user_name, email, is_verified, profile_image) VALUES($1, $2, $3, $4, $5) RETURNING *",
        [user_id, user_name, email, email_verified, picture]
      );

      const { customer_id, has_access } = user_registration.rows[0];

      const refreshToken = await jwt.sign(
        { user_id, user_name },
        REFRESH_TOKEN_SECRET as string,
        { expiresIn: "10d" }
      );

      res.status(201).json({
        success: true,
        message: "The registration was successful.",
        user: {
          user_id,
          user_name,
          customer_id,
          has_access,
        },
        accessToken: refreshToken,
      });
    }
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(500).json({
      error: "Something went wrong verifying with Google, please try again!",
    });
  }
};

const onGetCredentials = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken || !cookies.userId) return res.sendStatus(401);
  const userId = cookies.userId;

  try {
    let user_has_payed = checkUserAccess(userId);

    res.status(200).json({
      message: "Everything is fine, the user has payed!",
      user: {
        user_has_payed: user_has_payed,
      },
    });
  } catch (error) {
    console.error("There was an err getting user's credentials: ", error);
    res.status(500).json({
      error:
        "Something went wrong getting user's credentials, please refresh the page!",
    });
  }
};

export { onAuthWithGoogle, userLogout, onGetCredentials };