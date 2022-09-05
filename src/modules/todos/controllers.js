import { todos} from '../database/database.js';
import AppException from '../../utils/exceptions/AppException.js';
import { v4 } from 'uuid';


export function getTodos(req, res) {
	res.json(todos.filter((todo) => todo.userId === req.userId));
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
	else if (findTodo.userId === req.userId) {
		return res.status(200).json({
			statusCode: 200,
			data: {
				id: findTodo.id,
				userId: findTodo.userId,
				title: findTodo.title,
				status: findTodo.status,
				dueDate: findTodo.dueDate,
				createdAt: findTodo.createdAt,
				updatedAt: findTodo.updatedAt,
			},
		});
	}
	else {
		throw new AppException(403, "Unauthorized")
	}
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
	else if (updateTodo.userId === req.userId) {
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
	}
	else {
		throw new AppException(403, "Unauthorized")
	}
};

export function deleteTodo(req, res) {
	const id = req.params.id;
	const deleteTodo = todos.find((todo) => todo.id === id);
	if (!deleteTodo) {
		throw new AppException(404, "Unable to retrieve todo")
	}
	else if (deleteTodo.userId === req.userId) {
		const indexOfTodo = todos.findIndex((todo) => todo.id === id );
		todos.splice(indexOfTodo, 1);
		return res.status(410).json({
			statusCode: 410,
			message: "Todo successfully deleted"
		});
	}
	else {
		throw new AppException(403, "Unauthorized")
	}
};