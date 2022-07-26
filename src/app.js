import express from 'express';

import appRouter from './routes.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/v0', appRouter);

app.listen(port, () => {
    console.log(`Now Listening on port: http://localhost:${port}`);
});

export default app;
