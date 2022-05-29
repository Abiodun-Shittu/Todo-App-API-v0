const express = require("express");

// Import router
const userRouter = require('../routes/users.js')

// Express App
const app = express();
const port = 8000;

app.use(express.json());
app.use('/api/v0/ping', userRouter);

app.get('/api/v0/ping', (req, res) => {
    res.send("ToDo Application is Live")
})

// Listen For Request
app.listen(port, () => {
    console.log(`Now Listening on port ${port}`);
});