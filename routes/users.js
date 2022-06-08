const express = require("express");
const { use } = require("express/lib/application");
const userController = require('../controllers/userController');

// Initaialize router
const router = express.Router();

// Create User Validation
const validateUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (name.length >= 100) {
        res.json({ error: "Your Name should not be greater than 100 characters" })
    } else if (email.length >= 100) {
        res.json({ error: "Your email should not be greater than 100 characters" })
    } else if (password.length < 10 || password.length > 30) {
        res.json({ error: "Your password should be greater than 10 and less than 30 characters" })
    } else {
        next();
    }
};

// Find all users
router.get('/users', userController.getUsers);

// Create users
router.post('/users', validateUser, userController.createUser);

// Find a Specific User with Id
router.get('/users/:id', userController.getUser);

// Update User Details
// .put() can also be used to update the user details that is if you want to completely change all the details
// .patch() is used in order to just change one of the details of the user
router.patch('/users/:id', userController.updateUser);

// Delete User
router.delete('/users/:id', userController.deleteUser);

// Export Router
module.exports = router;