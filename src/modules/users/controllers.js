import { v4 } from "uuid";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

import AppException from "../../utils/exceptions/AppException.js";
import pool from "../../database/database.js";

dotenv.config();

export async function getUsers(_, res, next) {
	try {
		const allUsers = await pool.query(
			"SELECT unique_id, name, email FROM users"
		);
		res.json(allUsers.rows);
	} catch (err) {
		next(err);
	}
}

export async function createUser(req, res, next) {
	try {
		const hashPassword = await bcrypt.hash(req.body.password, 10);
		const { name, email } = req.body;
		const password = hashPassword;

		const user = {
			id: v4(),
			name,
			email,
			password,
		};
		const checkEmail = await pool.query(
			"SELECT email FROM  users WHERE email = $1",
			[email]
		);
		if (checkEmail.rowCount) {
			throw new AppException(403, "Email Already Exists");
		}

		const newUser = await pool.query(
			"INSERT INTO users (unique_id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING unique_id, name, email",
			[user.id, user.name, user.email, user.password]
		);
		const token = JWT.sign(
			{ id: newUser.rows[0].unique_id, email: newUser.rows[0].email },
			process.env.SECRET_KEY,
			{
				expiresIn: "24h",
			}
		);
		return res.status(201).json({
			statusCode: 201,
			data: newUser.rows[0],
			token,
		});
	} catch (err) {
		next(err);
	}
}

export async function loginUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const findUser = await pool.query(
			"SELECT unique_id, email, password FROM users WHERE email = $1",
			[email]
		);
		if (!findUser.rowCount) {
			throw new AppException(404, "Unable to retrieve user");
		}

		if (await bcrypt.compare(password, findUser.rows[0].password)) {
			const token = JWT.sign(
				{
					id: findUser.rows[0].unique_id,
					email: findUser.rows[0].email,
				},
				process.env.SECRET_KEY,
				{ expiresIn: "24h" }
			);
			return res.status(200).json({
				statusCode: 200,
				message: "success",
				data: {
					token,
				},
			});
		} else {
			throw new AppException(401, "Unable to authenticate user.");
		}
	} catch (err) {
		next(err);
	}
}

export async function getUser(req, res, next) {
	try {
		const { id } = req.params;
		const findUser = await pool.query(
			"SELECT unique_id, name, email FROM users WHERE unique_id = $1",
			[id]
		);
		if (!findUser.rowCount) {
			throw new AppException(404, "Unable to retrieve user");
		}
		return res.status(200).json({
			statusCode: 200,
			data: findUser.rows[0],
		});
	} catch (err) {
		next(err);
	}
}

export async function updateUser(req, res, next) {
	try {
		const { id } = req.params;
		const { name, email, password } = req.body;
		const findUser = await pool.query(
			"SELECT name, email, password FROM users WHERE unique_id = $1",
			[id]
		);
		if (!findUser.rowCount) {
			throw new AppException(404, "Unable to retrieve user");
		}
		if (name) {
			const updateName = await pool.query(
				"UPDATE users SET name = $1 WHERE unique_id = $2 RETURNING name",
				[name, id]
			);
			findUser.rows[0].name = updateName.rows[0].name;
		}
		if (email) {
			const updateEmail = await pool.query(
				"UPDATE users SET email = $1 WHERE unique_id = $2 RETURNING email",
				[email, id]
			);
			findUser.rows[0].email = updateEmail.rows[0].email;
		}
		if (password) {
			const hashPassword = await bcrypt.hash(password, 10);
			const updatePassword = await pool.query(
				"UPDATE users SET password = $1 WHERE unique_id = $2 RETURNING password",
				[hashPassword, id]
			);
			findUser.rows[0].password = updatePassword.rows[0].password;
		}
		return res.status(200).json({
			statusCode: 200,
			data: findUser.rows[0],
		});
	} catch (err) {
		next(err);
	}
}

export async function deleteUser(req, res, next) {
	try {
		const { id } = req.params;
		const findUser = await pool.query(
			"SELECT name FROM users WHERE unique_id = $1",
			[id]
		);
		if (!findUser.rowCount) {
			throw new AppException(404, "Unable to retrieve user");
		}
		pool.query("DELETE FROM users WHERE unique_id = $1", [id]);
		return res.status(410).json({
			statusCode: 410,
			message: "User successfully deleted",
		});
	} catch (err) {
		next(err);
	}
}
