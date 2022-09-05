import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

import AppException from '../../utils/exceptions/AppException.js';
import { users } from '../database/database.js'

dotenv.config();


export function getUsers(_, res) {
	res.json(users);
};

export async function createUser(req, res, next) {
	try {
		const hashPassword = await bcrypt.hash(req.body.password, 10);
		const name = req.body.name;
		const email = req.body.email;
		const password = hashPassword;
		const user = {
			id: v4(),
			name,
			email,
			password
		};

		users.push(user);

		const token = JWT.sign({ id: user.id, email }, process.env.SECRET_KEY, { expiresIn: "24h" })
		return res.status(201).json({
			statusCode: 201,
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token,
		});
	} catch (err) {
		next(err);
	}
};

export async function loginUser(req, res, next) {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const findUser = users.find((user) => user.email === email);
		if (!findUser) {
			throw new AppException(404, "Unable to retrieve user")
		}
		
		if (await bcrypt.compare(password, findUser.password)) {
			const token = JWT.sign({ id: findUser.id, email: findUser.email }, process.env.SECRET_KEY, { expiresIn: "24h" })
			return res.status(200).json({
				statusCode: 200,
				message: "success",
				data: {
					token,
				}
			});

		} else {
			throw new AppException(401, "Unable to authenticate user.");
		}

	} catch (err) {
		next(err);
	}
}

export function getUser(req, res) {
	const id = req.params.id;
	const findUser = users.find((user) => user.id === id);
	if (!findUser) {
		throw new AppException(404, "Unable to retrieve user")
	}
	return res.status(200).json({
		statusCode: 200,
		data: {
			id: findUser.id,
			name: findUser.name,
			email: findUser.email,
		},
	});
};

export async function updateUser(req, res) {
	const id = req.params.id;
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const updateUser = users.find((user) => user.id === id);
	if (!updateUser) {
		throw new AppException(404, "Unable to retrieve user")
	}
	if (name) {
		updateUser.name = name;
	}
	if (email) {
		updateUser.email = email;
	}
	if (password) {
		const hashPassword = await bcrypt.hash(password, 10);
		updateUser.password = hashPassword;
	}
	return res.status(200).json({
		statusCode: 200,
		data: {
			id: updateUser.id,
			name: updateUser.name,
			email: updateUser.email,
		},
	});
}

export function deleteUser(req, res) {
	const id = req.params.id;
	const deleteUser = users.find((user) => user.id === id);
	if (!deleteUser) {
		throw new AppException(404, "Unable to retrieve user")
	};
	const indexOfUser = users.findIndex((user) => user.id === id);
	users.splice(indexOfUser);
	return res.status(410).json({
		statusCode: 410,
		message: "User successfully deleted"
	});
};