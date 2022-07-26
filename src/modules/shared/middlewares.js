import JWT from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader.split(' ')[1];
      req.token = bearerToken;
  } else {
      return res.sendStatus(403);
  }
  try {
      JWT.verify(req.token, process.env.SECRET_KEY)
      next();
  } catch (error) {
      return res.status(400).json({
          statusCode: 400,
          message: "Invalid Token",
      })
  } 
}
