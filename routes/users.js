const express = require("express");
const { v4: uuidv4 } = require('uuid');

// Initaialize router
const router = express.Router();

// Create an array to store user data
let users = [];

// Find all users
router.get('/users', (req, res) => {
    res.json(users)
});

// Create users
router.post('/users', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const user = {
        data: {
            id: uuidv4(),
            email,
            name,
        }
    };
    users.push(user);
    res.json(user);
});

// Export Router
module.exports = router;