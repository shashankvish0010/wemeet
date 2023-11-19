CREATE DATABASE wemeet;

CREATE TABLE Users(
    id: VARCHAR PRIMARY KEY,
    firstname: VARCHAR,
    lastname: VARCHAR,
    user_password: VARCHAR,
    email: VARCHAR,
    account_verified: BOOLEAN 
)