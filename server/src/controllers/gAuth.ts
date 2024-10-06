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

    const user_id = payload?.sub as string;
    const email = payload?.email;
    const user_name = payload?.name;
    const picture = payload?.picture;

    // Check if the user exists in the database and handle login/registration
    // Same code as before...
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(500).json({
      error: "Something went wrong verifying with Google, please try again!",
    });
  }
};

export { onAuthWithGoogle, userLogout };