import express from 'express';

import { loginUser, getUsers, createUser, getUser, updateUser, deleteUser } from './controllers.js';
import { validateUser } from './middlewares.js';
import { verifyToken } from '../shared/middlewares.js';

const router = express.Router();

router.get('/', getUsers);

router.post('/', validateUser, createUser);

router.post('/login', loginUser)

router.get('/:id', verifyToken, getUser);

router.patch('/:id', verifyToken, updateUser);

router.delete('/:id', verifyToken, deleteUser);

export default router;
