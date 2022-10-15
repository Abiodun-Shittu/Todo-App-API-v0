import { v4 } from "uuid";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

import AppException from "../../utils/exceptions/AppException.js";
import pool from "../../database/database.js";
import queries from "./queries.js";

dotenv.config();

export async function getUsers(_, res, next) {
	try {
		const allUsers = await pool.query(queries.allUsers);
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
		const checkEmail = await pool.query(queries.checkMail, [email]);
		if (checkEmail.rowCount) {
			throw new AppException(403, "Email Already Exists");
		}

		const newUser = await pool.query(queries.newUser, [
			user.id,
			user.name,
			user.email,
			user.password,
		]);
		console.log(newUser)
		const token = JWT.sign(
			{ id: newUser.rows[0].unique_id, email: newUser.rows[0].email },
			process.env.SECRET_KEY,
			{
				expiresIn: "24h",
			}
		);
		return res.status(201).json({
			statusCode: 201,
			message: "User Successfully Created",
			token,
		});
	} catch (err) {
		next(err);
	}
}

export async function loginUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const findUser = await pool.query(queries.findUser, [email]);
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
		const getUser = await pool.query(queries.getUser, [id]);
		if (!getUser.rowCount) {
			throw new AppException(404, "Unable to retrieve user");
		}
		return res.status(200).json({
			statusCode: 200,
			data: getUser.rows[0],
		});
	} catch (err) {
		next(err);
	}
}

export async function updateUser(req, res, next) {
	try {
		const { id } = req.params;
		const { name, email, password } = req.body;
		const updateUser = await pool.query(queries.updateUser, [id]);
		if (!updateUser.rowCount) {
			throw new AppException(404, "Unable to retrieve user");
		}
		if (name) {
			const updateName = await pool.query(queries.updateName, [name, id]);
			updateUser.rows[0].name = updateName.rows[0].name;
		}
		if (email) {
			const updateEmail = await pool.query(queries.updateEmail, [
				email,
				id,
			]);
			updateUser.rows[0].email = updateEmail.rows[0].email;
		}
		if (password) {
			const hashPassword = await bcrypt.hash(password, 10);
			const updatePassword = await pool.query(queries.updatePassword, [
				hashPassword,
				id,
			]);
			updateUser.rows[0].password = updatePassword.rows[0].password;
		}
		return res.status(200).json({
			statusCode: 200,
			message: "User Successfully Updated",
		});
	} catch (err) {
		next(err);
	}
}

export async function deleteUser(req, res, next) {
	try {
		const { id } = req.params;
		const findUser = await pool.query(queries.getUser, [id]);
		if (!findUser.rowCount) {
			throw new AppException(404, "Unable to retrieve user");
		}
		pool.query(queries.deleteUser, [id]);
		return res.status(410).json({
			statusCode: 410,
			message: "User successfully deleted",
		});
	} catch (err) {
		next(err);
	}
}
