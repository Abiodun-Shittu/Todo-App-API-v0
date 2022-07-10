import express from 'express';
import userController from '../controllers/userController.js';
import userMiddleware from '../middlewares/userMiddleware.js';

// Initaialize router
const router = express.Router();

// Find all users
router.get('/users', userController.getUsers);

// Create users
router.post('/users', userMiddleware.validateUser, userController.createUser);

// Find a Specific User with Id
router.get('/users/:id', userController.getUser);

// Update User Details
// .put() can also be used to update the user details that is if you want to completely change all the details
// .patch() is used in order to just change one of the details of the user
router.patch('/users/:id', userController.updateUser);

// Delete User
router.delete('/users/:id', userController.deleteUser);

// Export Router
export default router;