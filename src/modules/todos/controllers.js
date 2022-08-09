import { v4 } from 'uuid';

import { todos } from '../database/database.js';
import AppException from '../../utils/exceptions/AppException.js';

export function getTodos(_, res) {
	res.json(todos);
};

export function createTodo(req, res, next) {
	try {
		const title = req.body.title;
		const status = req.body.status
		const date = req.body.date;
		const todo = {
			id: v4(),
			title,
			status,
			date,
		}
		todos.push(todo);
		return res.status(201).json({
			statcode: 201,
			data: {
				id: todo.id,
				title: todo.title,
				status: todo.status,
				date: todo.date,
			}
		})
	} catch (err) {
		next(err);
	};
};

export function getTodo(req, res) {
	const id = req.params.id;
	const findTodo = todos.find((todo) => todo.id === id);
	if (!findTodo) {
		throw new AppException(404, "Unable to retrieve todo")
	}
	return res.json({
		id: findTodo.id,
		title: findTodo.title,
		status: findTodo.status,
		date: findTodo.date,
	});

};

export function updateTodo(req, res) {
	const id = req.params.id;
	const title = req.body.title;
	const status = req.body.status
	const date = req.body.date;
	const updateTodo = todos.find((todo) => todo.id === id);
	if (!updateTodo) {
		throw new AppException(404, "Unable to retrieve todo")
	}
	if (title) {
		updateTodo.title = title;
	}
	if (status) {
		updateTodo.status = status;
	}
	if (date) {
		updateTodo.date = date;
	}
	return res.json({
		id: updateTodo.id,
		name: updateTodo.name,
		status: updateTodo.status,
		date: updateTodo.date,
	});
};

export function deleteTodo(req, res) {
	const id = req.params.id;
	const deleteTodo = todos.find((todo) => todo.id === id);
	if (!deleteTodo) {
		throw new AppException(404, "Unable to retrieve todo")
	};
	todos = todos.filter((todo) => todo.id !== id);
	res.json(todos);
};