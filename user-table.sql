-- DATABASE --
CREATE DATABASE todo_app;

-- USER TABLE --
CREATE TABLE users
(
	id SERIAL PRIMARY KEY,
	unique_id VARCHAR(36) UNIQUE,
	name VARCHAR(100),
	email VARCHAR(100) UNIQUE,
	password VARCHAR(100)
);

-- TEST USER DATA --
INSERT INTO users
	(unique_id, name, email, password)
VALUES
	(uuid_generate_v4(), 'Abiodun Shittu', 'jerrywizklay1@gmail.com', '0123456789');

-- TODO TABLE --
CREATE TABLE todos
(
	id SERIAL PRIMARY KEY,
	todo_id VARCHAR(36) UNIQUE,
	user_id VARCHAR(36),
	title VARCHAR(200),
	status VARCHAR(50),
	due_date TIMESTAMP,
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(unique_id)
);

-- TEST TODO DATA --
INSERT INTO todos
	(todo_id, title, status, due_date, created_at, updated_at)
VALUES
	(uuid_generate_v4(), 'Build A Todo Application', 'Ongoing', '2023-04-15', '2022-10-02', '2022-10-02');
