const express = require("express");
const { v4: uuidv4 } = require('uuid');

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
}

// Create an array to store user data
let users = [];

// Find all users
router.get('/users', (req, res) => {
    res.json(users)
});

// Create users
router.post('/users', validateUser, (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const user = {
        id: uuidv4(),
        email,
        name,
    };
    users.push(user);
    res.status(200).json(user);
});

// Find a Specific User with Id
router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const findUser = users.find(user => user.id === id);
    res.json(findUser);
});

// Update User Details
// .put() can also be used to update the user details that is if you want to completely change all the details
// .patch() is used in order to just change one of the details of the user
router.patch('/users/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const updateUser = users.find(user => user.id === id);
    if (name) {
        updateUser.name = name;
    }
    if (email) {
        updateUser.email = email;
    }

    res.json(updateUser);
})

// Export Router
module.exports = router;