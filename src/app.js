import express from 'express';

// Import router
import userRoutes from '../routes/users.js';

// Express App
const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use('/api/v0', userRoutes);

app.get('/api/v0/ping', (req, res) => {
    res.send("ToDo Application is Live")
});

// Listen For Request
app.listen(port, () => {
    console.log(`Now Listening on port: http://localhost:${port}`);
});

export default app;