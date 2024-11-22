--- This contians some of the hard queries to remember ---

-- A query to check wether the user still has access or not
SELECT *
FROM user_profile
WHERE user_id = 'some_user_id'
AND (
    (plan_type = 'onetime') OR
    (plan_type = 'subscription' AND expires_at > NOW())
);
