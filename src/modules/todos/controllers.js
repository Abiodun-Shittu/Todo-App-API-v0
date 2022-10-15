import { v4 } from "uuid";

import pool from "../../database/database.js";
import AppException from "../../utils/exceptions/AppException.js";
import queries from "./queries.js";

export async function getTodos(req, res, next) {
	try {
		const allTodos = await pool.query(queries.allTodos, [req.userId]);
		res.json(allTodos.rows);
	} catch (err) {
		next(err);
	}
}

export async function createTodo(req, res, next) {
	try {
		const todo_id = v4();
		const user_id = req.userId;
		const { title, status, dueDate } = req.body;
		const createdAt = new Date();
		const updatedAt = new Date();
		const todo = {
			todo_id,
			user_id,
			title,
			status,
			dueDate,
			createdAt,
			updatedAt,
		};
		await pool.query(queries.newTodo, [
			todo.todo_id,
			todo.user_id,
			todo.title,
			todo.status,
			todo.dueDate,
			todo.createdAt,
			todo.updatedAt,
		]);
		return res.status(201).json({
			statuscode: 201,
			message: "Todo Successfully Created",
		});
	} catch (err) {
		next(err);
	}
}

export async function getTodo(req, res, next) {
	try {
		const { id } = req.params;
		const findTodo = await pool.query(queries.findTodo, [id]);
		if (!findTodo.rowCount) {
			throw new AppException(404, "Unable to retrieve todo");
		} else if (findTodo.rows[0].user_id === req.userId) {
			return res.status(200).json({
				statusCode: 200,
				data: findTodo.rows[0],
			});
		} else {
			throw new AppException(403, "Unauthorized");
		}
	} catch (err) {
		next(err);
	}
}

export async function updateTodo(req, res, next) {
	try {
		const { id } = req.params;
		const { title, status, dueDate } = req.body;
		const updatedAt = new Date();
		const findTodo = await pool.query(queries.findTodo, [id]);
		if (!findTodo.rowCount) {
			throw new AppException(404, "Unable to retrieve todo");
		} else if (findTodo.rows[0].user_id === req.userId) {
			if (title) {
				const updateTitle = await pool.query(queries.updateTitle, [
					title,
					updatedAt,
					id,
				]);
				findTodo.rows[0].title = updateTitle.rows[0].title;
				findTodo.rows[0].updated_at = updateTitle.rows[0].updated_at;
			}
			if (status) {
				const updateStatus = await pool.query(queries.updateStatus, [
					status,
					updatedAt,
					id,
				]);
				findTodo.rows[0].status = updateStatus.rows[0].status;
				findTodo.rows[0].updated_at = updateStatus.rows[0].updated_at;
			}
			if (dueDate) {
				const updateDate = await pool.query(queries.updateDate, [
					dueDate,
					updatedAt,
					id,
				]);
				findTodo.rows[0].due_date = updateDate.rows[0].due_date;
				findTodo.rows[0].updated_at = updateDate.rows[0].updated_at;
			}
			return res.status(200).json({
				statusCode: 200,
				message: "Todo Successfully Updated",
			});
		} else {
			throw new AppException(403, "Unauthorized");
		}
	} catch (err) {
		next(err);
	}
}

export async function deleteTodo(req, res, next) {
	try {
		const { id } = req.params;
		const findTodo = await pool.query(queries.findTodo, [id]);
		if (!findTodo.rowCount) {
			throw new AppException(404, "Unable to retrieve todo");
		} else if (findTodo.rows[0].user_id === req.userId) {
			pool.query(queries.deleteTodo, [id]);
			return res.status(410).json({
				statusCode: 410,
				message: "Todo successfully deleted",
			});
		} else {
			throw new AppException(403, "Unauthorized");
		}
	} catch (err) {
		next(err);
	}
}
