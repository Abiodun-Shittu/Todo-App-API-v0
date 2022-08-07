export function logErrors(err, req, res, next) {
  console.error("ERROR Occurred: ", err);
  next(err);
}

export function errorHandler (err, _, res, next) {
  const responseBody = {
    statusCode: 500,
    message: "Oops, an error occurred. Please contact the system admin.",
  };

  switch (err.statusCode) {
    case 400:
      responseBody.statusCode = 400;
      responseBody.message = err.message;
      break;
    case 401:
      responseBody.statusCode = 401;
      responseBody.message = err.message;
      break;
      case 403:
      responseBody.statusCode = 403;
      responseBody.message = err.message;
      break;
    case 404:
      responseBody.statusCode = 404;
      responseBody.message = err.message;
      break;
    case 422:
      responseBody.statusCode = 422;
      responseBody.message = err.message;
      responseBody["errors"] = err.errors;
      break;
    default:
      break;
  }

  return res.status(responseBody.statusCode)
            .json(responseBody);
}
