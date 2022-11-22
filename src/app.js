import express from "express";
import cors from "cors";

import appRouter from "./routes.js";
import { errorHandler } from "./utils/index.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/v0", appRouter);

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Now Listening on port: http://localhost:${port}`);
});

export default app;
