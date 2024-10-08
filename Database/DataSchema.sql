CREATE DATABASE chat_folderz;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profile table
CREATE TABLE user_profile (
    user_id TEXT PRIMARY KEY, -- user's ID
    user_name VARCHAR(256) NOT NULL, -- user's name
    email VARCHAR(256) UNIQUE NOT NULL, -- user's email
    profile_image TEXT, -- user's profile image
    created_at TIMESTAMP DEFAULT NOW(), -- user's account creation date
    is_verified BOOLEAN DEFAULT FALSE, -- user's verification status
    customer_id TEXT UNIQUE, -- STRIPE customer id, must be unique
    has_access BOOLEAN DEFAULT FALSE, -- Whether the user's subscription is still active or canceled.
    expires_at TIMESTAMP, -- The time the subscription expires
    subscription_state VARCHAR(256) -- This will the state of the subscription whether it's active or canceled!
);

CREATE INDEX idx_customer_id ON user_profile(customer_id);
CREATE INDEX idx_email ON user_profile(email);

-- User subscription table
CREATE TABLE user_subscription (
    customer_id TEXT PRIMARY KEY, -- STRIPE customer id.
    subscription_duration VARCHAR(10) NOT NULL, -- Whether the subscription is 'yearly' or 'monthly'.
    subscription_type VARCHAR(50),
    customer_email VARCHAR(256) NOT NULL, -- The email of the user.
    user_id TEXT REFERENCES user_profile(user_id) ON DELETE CASCADE, -- Reference to the user profile
    customer_country VARCHAR(50),
    customer_name VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the subscription was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- When the subscription was last updated
);

