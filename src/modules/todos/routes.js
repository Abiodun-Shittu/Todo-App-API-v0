import express from 'express';

import { getTodos, createTodo, getTodo, updateTodo, deleteTodo } from './controllers.js';
import SharedMiddlewares from '../shared/middlewares.js';

const router = express.Router();

router.get('/', getTodos);

router.post(
    '/',
    SharedMiddlewares.generateRequiredBodyParamsValidatorMiddleware(['title', 'status', 'date']),
    createTodo,
);

router.get('/:id', getTodo);

router.patch('/:id', updateTodo);

router.delete('/:id', deleteTodo);

export default router;