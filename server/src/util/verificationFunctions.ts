import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from "../constants";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { query } from "../config/dbConfig";

const generateVerificationToken = (username: string, creator_id: string) => {
  // Generate a hash of the username
  const uuid = uuidv4() as string;
  const hash = crypto.createHash('sha256')
    .update(uuid)
    .digest('hex')
    .substring(0, 10);

  // Use the hash as a unique identifier in the token
  const token = jwt.sign({ hash, username, creator_id }, REFRESH_TOKEN_SECRET as string, { expiresIn: '1h' }); // Set to 1 hour
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

export { generateVerificationToken, isValidAuthToken, checkUserAccess };
