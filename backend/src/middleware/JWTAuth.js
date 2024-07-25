import jwt from 'jsonwebtoken';

const verifyJWT = () => (req, res, next) => {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send();
    }

    // Verify the token
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
        if (err) {
            return res.status(403).send();
        }

        // Extract userId from the token payload
        req.userId = decoded._id;

        // Proceed to the next middleware/route handler
        next();
    });
}

export default verifyJWT;

