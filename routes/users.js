const express = require("express");

// Initaialize router
const router = express.Router();

// Create an array to store user data
let users = [];

// Find all users
router.get('/users', (req, res) => {
    res.json(users)
})

// Create users
router.post('/create', (req, res) => {
    const user = req.body;
    users.push(user);
    res.send(`You account has been successfully created`);
});

// Export Router
module.exports = router;