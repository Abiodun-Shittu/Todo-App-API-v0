import JWT from 'jsonwebtoken';

// Create User Validation
const validateUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (name?.length >= 100) {
        res.json({ error: "Your Name should not be greater than 100 characters" })
    } else if (email?.length >= 100) {
        res.json({ error: "Your email should not be greater than 100 characters" })
    } else if (password?.length < 10 || password?.length > 30) {
        res.json({ error: "Your password should be greater than 10 and less than 30 characters" })
    } else {
        next();
    }
};

const verifyToken = (req, res, next) => {
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

export default { 
    validateUser,
    verifyToken
};