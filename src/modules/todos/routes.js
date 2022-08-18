import express from 'express';

import { getTodos, createTodo, getTodo, updateTodo, deleteTodo } from './controllers.js';
import SharedMiddlewares from '../shared/middlewares.js';

const router = express.Router();

router.get('/', getTodos);

router.post(
    '/',
    SharedMiddlewares.verifyToken,
    SharedMiddlewares.generateRequiredBodyParamsValidatorMiddleware(['title', 'status', 'date']),
    createTodo,
);

router.get('/:id', SharedMiddlewares.verifyToken, getTodo);

router.patch('/:id', SharedMiddlewares.verifyToken, updateTodo);

router.delete('/:id', SharedMiddlewares.verifyToken, deleteTodo);

export default router;