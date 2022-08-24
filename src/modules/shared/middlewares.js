import JWT from 'jsonwebtoken';

import AppException from '../../utils/exceptions/AppException.js';

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearerToken = bearerHeader.split(' ')[1];
		req.token = bearerToken;
	} else {
		throw new AppException(403, "Access Denied")
	}
	try {
		JWT.verify(req.token, process.env.SECRET_KEY, (err, payload) => {
			if (err) {
				throw new AppException(400, "Bad Request")
			} else {
				req.userId = payload.id;
			}
		})
		next();
	} catch (err) {
		throw new AppException(401, "Unauthorized")
	}
}

function generateRequiredBodyParamsValidatorMiddleware(requiredParameters = []) {
	return (req, _, next) => {
		try {
			let message = "";
			const errors = {};

			requiredParameters.forEach(requiredParam => {
				if (!req.body[requiredParam]) {
					message = "Unprocessable data";
					errors[requiredParam] = `${requiredParam} is required.`;
				}
			});

			if (Object.keys(errors).length > 0) {
				throw new AppException(422, message, errors);
			}

			next();
		} catch (err) {
			next(err);
		}
	};
}

export default {
	verifyToken,
	generateRequiredBodyParamsValidatorMiddleware,
}
