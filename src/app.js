const express = require("express");

// Express App
const app = express();

const port = 8000;

app.get('/api/v0/ping', (req, res) => {
    res.send("ToDo Application is Live")
})

// Listen For Request
app.listen(port, () => {
    console.log(`Now Listening on port ${port}`);
});