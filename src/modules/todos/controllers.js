import { todos, users } from '../database/database.js';
import AppException from '../../utils/exceptions/AppException.js';
import { v4 } from 'uuid';


export function getTodos(_, res) {
	res.json(todos);
};

export function createTodo(req, res, next) {
	try {
		let today = new Date();
		
		let strDate = 'Y-m-d h:M:s'
			.replace('Y', today.getFullYear())
			.replace('m', today.getMonth()+1)
			.replace('d', today.getDate())
			.replace('h', today.getHours())
			.replace('M', today.getMinutes())
			.replace('s', today.getSeconds());
		const id = v4();
		const userId = req.userId;
		const title = req.body.title;
		const status = req.body.status;
		const dueDate = req.body.dueDate;
		const createdAt = strDate;
		const updatedAt = strDate;
		const todo = {
			id,
			userId,
			title,
			status,
			dueDate,
			createdAt,
			updatedAt,
		}
		todos.push(todo);
		return res.status(201).json({
			statcode: 201,
			data: {
				id: todo.id,
				userId: todo.userId,
				title: todo.title,
				status: todo.status,
				dueDate: todo.dueDate,
				createdAt: todo.createdAt,
				updatedAt: todo.updatedAt,
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
	return res.status(200).json({
		statusCode: 200,
		data: {
			userId: findTodo.userId,
			title: findTodo.title,
			status: findTodo.status,
			dueDate: findTodo.dueDate,
			createdAt: findTodo.createdAt,
			updatedAt: findTodo.updatedAt,
		},
	});

};

export function updateTodo(req, res) {
	let today = new Date();
		
	let strDate = 'Y-m-d h:M:s'
		.replace('Y', today.getFullYear())
		.replace('m', today.getMonth()+1)
		.replace('d', today.getDate())
		.replace('h', today.getHours())
		.replace('M', today.getMinutes())
		.replace('s', today.getSeconds());

	const id = req.params.id;
	const title = req.body.title;
	const status = req.body.status
	const dueDate = req.body.dueDate;
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
	if (dueDate) {
		updateTodo.dueDate = dueDate;
	}
	updateTodo.updatedAt = strDate;
	return res.status(200).json({
		statusCode: 200,
		data: {
			userId: updateTodo.userId,
			title: updateTodo.title,
			status: updateTodo.status,
			dueDate: updateTodo.dueDate,
			createdAt: updateTodo.createdAt,
			updatedAt: updateTodo.updatedAt,
		},
	});
};

export function deleteTodo(req, res) {
	const id = req.params.id;
	const deleteTodo = todos.find((todo) => todo.id === id);
	if (!deleteTodo) {
		throw new AppException(404, "Unable to retrieve todo")
	};
	todos = todos.filter((todo) => todo.id !== id);
	return res.status(204).json({
		statusCode: 204,
		message: "Todo successfully deleted"
	});
};