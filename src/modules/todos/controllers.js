import { v4 } from "uuid";

import pool from "../../database/database.js";
import AppException from "../../utils/exceptions/AppException.js";

export async function getTodos(req, res, next) {
	try {
		const allTodos = await pool.query(
			"SELECT todo_id, user_id, title, status, due_date, created_at, updated_at FROM todos WHERE user_id = $1",
			[req.userId]
		);
		res.json(allTodos.rows);
	} catch (err) {
		next(err);
	}
}

export async function createTodo(req, res, next) {
	try {
		let today = new Date();

		let strDate = "Y-m-d h:M:s"
			.replace("Y", today.getFullYear())
			.replace("m", today.getMonth() + 1)
			.replace("d", today.getDate())
			.replace("h", today.getHours())
			.replace("M", today.getMinutes())
			.replace("s", today.getSeconds());
		const todo_id = v4();
		const user_id = req.userId;
		const { title, status, dueDate } = req.body;
		const createdAt = strDate;
		const updatedAt = strDate;
		const todo = {
			todo_id,
			user_id,
			title,
			status,
			dueDate,
			createdAt,
			updatedAt,
		};
		const newTodo = await pool.query(
			"INSERT INTO todos (todo_id, user_id, title, status, due_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING todo_id, user_id, title, status, due_date, created_at, updated_at",
			[
				todo.todo_id,
				todo.user_id,
				todo.title,
				todo.status,
				todo.dueDate,
				todo.createdAt,
				todo.updatedAt,
			]
		);
		return res.status(201).json({
			statuscode: 201,
			data: newTodo.rows[0],
		});
	} catch (err) {
		next(err);
	}
}

export async function getTodo(req, res, next) {
	try {
		const { id } = req.params;
		const findTodo = await pool.query(
			"SELECT todo_id, user_id, title, status, due_date, created_at, updated_at FROM todos WHERE todo_id = $1",
			[id]
		);
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
		let today = new Date();

		let strDate = "Y-m-d h:M:s"
			.replace("Y", today.getFullYear())
			.replace("m", today.getMonth() + 1)
			.replace("d", today.getDate())
			.replace("h", today.getHours())
			.replace("M", today.getMinutes())
			.replace("s", today.getSeconds());

		const { id } = req.params;
		const { title, status, dueDate } = req.body;
		const updatedAt = strDate;
		const findTodo = await pool.query(
			"SELECT todo_id, user_id, title, status, due_date, created_at, updated_at FROM todos WHERE todo_id = $1",
			[id]
		);
		if (!findTodo.rowCount) {
			throw new AppException(404, "Unable to retrieve todo");
		} else if (findTodo.rows[0].user_id === req.userId) {
			if (title) {
				const updateTitle = await pool.query(
					"UPDATE todos SET title = $1, updated_at = $2 WHERE todo_id = $3 RETURNING title, updated_at",
					[title, updatedAt, id]
				);
				findTodo.rows[0].title = updateTitle.rows[0].title;
				findTodo.rows[0].updated_at = updateTitle.rows[0].updated_at;
			}
			if (status) {
				const updateStatus = await pool.query(
					"UPDATE todos SET status = $1, updated_at = $2 WHERE todo_id = $3 RETURNING status, updated_at",
					[status, updatedAt, id]
				);
				findTodo.rows[0].status = updateStatus.rows[0].status;
				findTodo.rows[0].updated_at = updateStatus.rows[0].updated_at;
			}
			if (dueDate) {
				const updateDate = await pool.query(
					"UPDATE todos SET due_date = $1, updated_at = $2 WHERE todo_id = $3 RETURNING due_date, updated_at",
					[dueDate, updatedAt, id]
				);
				findTodo.rows[0].due_date = updateDate.rows[0].due_date;
				findTodo.rows[0].updated_at = updateDate.rows[0].updated_at;
			}
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

export async function deleteTodo(req, res, next) {
	try {
		const { id } = req.params;
		const findTodo = await pool.query(
			"SELECT user_id, title FROM todos WHERE todo_id = $1",
			[id]
			);
		if (!findTodo.rowCount) {
			throw new AppException(404, "Unable to retrieve todo");
		} else if (findTodo.rows[0].user_id === req.userId) {
			pool.query("DELETE FROM todos WHERE todo_id = $1", [id]);
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
