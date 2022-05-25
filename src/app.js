const express = require("express");
const ejs = require("ejs")

// Express App
const app = express();

const port = 8000;

// Set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/api/v0/ping', (req, res) => {
    res.send("ToDo Application is Live")
})

// SignUp route
app.get('/api/v0/signup', (req, res) => {
    res.render('index', { title: "SignUp Page" })
})

// Listen For Request
app.listen(port, () => {
    console.log(`Now Listening on port ${port}`);
});