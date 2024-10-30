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
    subscription_state VARCHAR(256), -- This will the state of the subscription whether it's active or canceled!
    is_canceled  BOOLEAN DEFAULT FALSE, -- This to check wether the canceled or not to modify the ui in the front
    plan_type VARCHAR(50) CHECK (plan_type IN ('onetime', 'subscription')) DEFAULT 'subscription' -- One-time or subscription
);

CREATE INDEX idx_customer_id ON user_profile(customer_id);
CREATE INDEX idx_email ON user_profile(email);

-- User subscription table
CREATE TABLE user_subscription (
    customer_id TEXT PRIMARY KEY, -- STRIPE customer id.
    subscription_duration VARCHAR(50),
    customer_email VARCHAR(256) NOT NULL, -- The email of the user.
    user_id TEXT UNIQUE REFERENCES user_profile(user_id) ON DELETE CASCADE, -- Reference to the user profile
    customer_country VARCHAR(50),
    customer_name VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the subscription was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the subscription was last updated
    last_subscription_start_date VARCHAR(256)
);

CREATE TABLE user_folders (
    folder_id TEXT PRIMARY KEY,
    folder_name VARCHAR(256),
    folder_color VARCHAR(256),
    chats JSONB[], -- Store chats as JSONB array
    user_id TEXT NOT NULL REFERENCES user_profile(user_id) ON DELETE CASCADE
);

-- Linked accounts table
CREATE TABLE user_linked_accounts (
    account_id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES user_profile(user_id) ON DELETE CASCADE, -- Foreign key to user profile
    account_type VARCHAR(50) CHECK (account_type IN ('google')), -- Type of account linked
    account_email VARCHAR(256) NOT NULL, -- Email of the linked account
    linked_at TIMESTAMP DEFAULT NOW(), -- When the account was linked
    profile_image TEXT,
    user_name VARCHAR(256)
);

-- A query to check wether the user still has access or not
SELECT *
FROM user_profile
WHERE user_id = 'some_user_id'
AND (
    (plan_type = 'onetime') OR
    (plan_type = 'subscription' AND expires_at > NOW())
);
