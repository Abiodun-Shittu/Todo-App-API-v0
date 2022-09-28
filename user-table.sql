-- DATABASE --
CREATE DATABASE todo_app;

-- USER TABLE --
CREATE TABLE users
(
	id SERIAL PRIMARY KEY,
	unique_id VARCHAR(36),
	name VARCHAR(100),
	email VARCHAR(100) UNIQUE,
	password VARCHAR(100)
);

-- TEST USER DATA --
INSERT INTO users
	(unique_id, name, email, password)
VALUES
	(uuid_generate_v4(), 'Abiodun Shittu', 'jerrywizklay1@gmail.com', '0123456789');
