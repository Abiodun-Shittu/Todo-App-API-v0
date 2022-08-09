import { Router } from 'express';

import userRouter from './modules/users/routes.js';
import todoRouter from './modules/todos/routes.js';

const appRouter = Router();

appRouter.use('/ping', function (_, res) {
	return res.status(200).json({
		statusCode: 200,
		message: "TODO API is running",
	});
});

appRouter.use('/users', userRouter);
appRouter.use('/todos', todoRouter);

export default appRouter;
