import { v4 } from "uuid";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

import AppException from "../../utils/exceptions/AppException.js";
import pool from "../database/database.js";

dotenv.config();

export function getUsers(_, res) {
	pool.query("SELECT * FROM users", (err, result) => {
		if (!err) res.json(result.rows);
	});
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
			password
		}

		pool.query(
			"INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
			[user.id, user.name, user.email, user.password],
			(err, result) => {
				if (!err) {
					const token = JWT.sign({ id: user.id, email },
						process.env.SECRET_KEY, {
						expiresIn: "24h",
					}
					);
					return res.status(201).json({
						statusCode: 201,
						data: result.rows[0],
						token,
					});
				}
			});
	}
	catch (err) {
		next(err);
	}
}

export async function loginUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [email])
		if (!findUser.rowCount) {
			throw new AppException(404, "Unable to retrieve user");
		}
		
		if (await bcrypt.compare(password, findUser)) {
			const token = JWT.sign({ id: findUser.id, email: findUser.email },
				process.env.SECRET_KEY, { expiresIn: "24h" }
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

export async function getUser(req, res) {
	const { id } = req.params;
	const findUser = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [id])
	if (!findUser.rowCount) {
		throw new AppException(404, "Unable to retrieve user");
	}
	console.log(findUser.rowCount);
	return res.status(200).json({
		statusCode: 200,
		data: findUser.rows,
	});
}

export async function updateUser(req, res) {
	const { id } = req.params;
	const name = req.body.name;
	const email = req.body.email;
	const hashPassword = await bcrypt.hash(req.body.password, 10);
	const updateUser = await pool.query("UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
		[name, email, hashPassword, id]);
	if (!updateUser) {
		throw new AppException(404, "Unable to retrieve user");
	}
	return res.status(200).json({
		statusCode: 200,
		data: updateUser.rows[0],
	});
}

export async function deleteUser(req, res) {
	const { id } = req.params;
	const deleteUser = await pool.query("DELETE FROM users WHERE id = $1", [id])
	if (!deleteUser) {
		throw new AppException(404, "Unable to retrieve user");
	}

	return res.status(410).json({
		statusCode: 410,
		message: "User successfully deleted",
	});
}