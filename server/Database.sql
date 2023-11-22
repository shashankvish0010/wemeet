CREATE DATABASE wemeet;

CREATE TABLE Users(
    id VARCHAR PRIMARY KEY,
    firstname VARCHAR,
    lastname VARCHAR,
    user_password VARCHAR,
    email VARCHAR,
    account_verified BOOLEAN 
)

CREATE TABLE Events(
    id VARCHAR PRIMARY KEY,
    event_name VARCHAR,
    duration VARCHAR,
    user_email VARCHAR,
    event_description VARCHAR,
    active BOOLEAN
)