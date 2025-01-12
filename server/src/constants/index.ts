import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8000;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Payments, stripe
const STRIPES_SECRET_KEY = process.env.STRIPES_SECRET_KEY;
const STRIPES_PUBLISHABLE_KEY = process.env.STRIPES_PUBLISHABLE_KEY;
const STRIPES_CLIENT_ID = process.env.STRIPES_CLIENT_ID;
const STRIPES_REDIRECT_URI = process.env.STRIPES_REDIRECT_URI;
const WEBHOOK_SIGNING_SECRET = process.env.WEBHOOK_SIGNING_SECRET;

// Database
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;

// Google stuff
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

export {
  PORT,
  ACCESS_SECRET_KEY,
  REFRESH_TOKEN_SECRET,
  STRIPES_SECRET_KEY,
  STRIPES_PUBLISHABLE_KEY,
  STRIPES_CLIENT_ID,
  STRIPES_REDIRECT_URI,
  WEBHOOK_SIGNING_SECRET,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
  DATABASE_HOST,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  DATABASE_PORT,
};