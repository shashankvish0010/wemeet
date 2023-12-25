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

CREATE TABLE Meetings(
    id VARCHAR PRIMARY KEY,
    meeting_id VARCHAR,
    user_email VARCHAR,
    host_email VARCHAR,
    scheduled_time VARCHAR,
    scheduled_date VARCHAR
)