CREATE DATABASE chat_folderz;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profile table
CREATE TABLE user_profile (
    user_id TEXT PRIMARY KEY, -- user's ID
    user_name VARCHAR(256) NOT NULL, -- user's name
    pwd VARCHAR(256), -- user's password
    email VARCHAR(256) UNIQUE NOT NULL, -- user's email
    profile_image TEXT, -- user's profile image
    created_at TIMESTAMP DEFAULT NOW(), -- user's account creation date
    is_verified BOOLEAN DEFAULT FALSE, -- user's verification status
    customer_id TEXT UNIQUE -- STRIPE customer id, must be unique
    verification_token VARCHAR(512), -- user's verification code
);

-- User subscription table
CREATE TABLE user_subscription (
    customer_id TEXT PRIMARY KEY, -- STRIPE customer id.
    subscription_duration VARCHAR(10) NOT NULL, -- Whether the subscription is 'yearly' or 'monthly'.
    has_access BOOLEAN DEFAULT FALSE, -- Whether the subscription is active or canceled.
    customer_email VARCHAR(256) NOT NULL, -- The email of the user.
    user_id TEXT, -- Reference to the user profile
    customer_country VARCHAR(50),
    customer_name VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the subscription was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the subscription was last updated
    expires_at TIMESTAMP
);

