import express from 'express';

import { loginUser, getUsers, createUser, getUser, updateUser, deleteUser } from './controllers.js';
import { validateUser } from './middlewares.js';
import SharedMiddlewares from '../shared/middlewares.js';

const router = express.Router();

router.get('/', getUsers);

router.post(
  '/',
  SharedMiddlewares.generateRequiredBodyParamsValidatorMiddleware(['name', 'email', 'password']),
  validateUser,
  createUser,
);

router.post(
  '/login',
  SharedMiddlewares.generateRequiredBodyParamsValidatorMiddleware(['email', 'password']),
  loginUser,
);

router.get('/:id', SharedMiddlewares.verifyToken, getUser);

router.patch('/:id', SharedMiddlewares.verifyToken, updateUser);

router.delete('/:id', SharedMiddlewares.verifyToken, deleteUser);

export default router;
