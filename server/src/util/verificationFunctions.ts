import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from "../constants";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { query } from "../config/dbConfig";
import { Request, Response } from "express";

const generateVerificationToken = (username: string, creator_id: string) => {
  // Generate a hash of the username
  const uuid = uuidv4() as string;
  const hash = crypto
    .createHash("sha256")
    .update(uuid)
    .digest("hex")
    .substring(0, 10);

  // Use the hash as a unique identifier in the token
  const token = jwt.sign(
    { hash, username, creator_id },
    REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1h" }
  ); // Set to 1 hour
  return token;
};

const isValidAuthToken = (authToken: string) => {
  try {
    jwt.verify(authToken, REFRESH_TOKEN_SECRET as string);
    return true;
  } catch (error) {
    return false;
  }
};

const checkUserAccess = async (userId: string) => {
  const result = await query(
    "SELECT has_access, expires_at FROM user_profile WHERE user_id=$1",
    [userId]
  );

  if (result.rows.length > 0) {
    const { has_access, expires_at } = result.rows[0];
    const now = new Date();

    if (has_access && expires_at > now) {
      return true; // User has access
    }
  }

  return false; // User does not have access
};

const verifyUser = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.accessToken || !cookies.userId) {
    res.sendStatus(401);
    return null;
  }

  const accessToken = cookies.accessToken;
  try {
    const decoded = await jwt.verify(
      accessToken as string,
      REFRESH_TOKEN_SECRET as string
    );
    const { user_id: id } = decoded as { exp: number; user_id: string };

    let user = await query("SELECT * FROM user_profile WHERE user_id=$1", [id]);
    if (user.rows.length === 0) {
      res.status(403).json({
        success: false,
        message: "User not found",
      });
      return null;
    }

    return id;
  } catch (error) {
    res.sendStatus(403);
    return null;
  }
};

export {
  generateVerificationToken,
  isValidAuthToken,
  checkUserAccess,
  verifyUser,
};
