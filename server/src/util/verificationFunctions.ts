import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, EMAIL_HOST, CLIENT_URL } from "../Constants";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

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

export { generateVerificationToken, isValidAuthToken };
