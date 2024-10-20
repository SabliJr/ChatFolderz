import { query } from "../config/dbConfig";
import { Request, Response } from "express";
import {
  REFRESH_TOKEN_SECRET,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
} from "../constants";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

async function createRefreshToken(user_id: string, user_name: string) {
  const refreshToken = await jwt.sign(
    { user_id, user_name },
    REFRESH_TOKEN_SECRET as string,
    { expiresIn: "10d" }
  );
  return refreshToken;
}

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
      // domain: ".wishties.com",
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

  console.log("The token to exchange: ", accessToken);

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
      const { user_id } = userExists?.rows[0];

      const refreshToken = await createRefreshToken(user_id, user_name);
      res.status(202).json({
        success: true,
        message: "The login was successful!",
        user: {
          user_id,
        },
        accessToken: refreshToken,
      });
    } else {
      // If they don't, store their info in the database and log them in
      await query(
        "INSERT INTO user_profile (user_id, user_name, email, is_verified, profile_image) VALUES($1, $2, $3, $4, $5)",
        [user_id, user_name, email, email_verified, picture]
      );

      const refreshToken = await createRefreshToken(user_id, user_name);
      console.log(user_id);
      res.status(201).json({
        success: true,
        message: "The registration was successful.",
        user: {
          user_id,
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

export { onAuthWithGoogle, userLogout };
