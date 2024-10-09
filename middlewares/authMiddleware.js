//authMiddleWare.js

const jwt = require('jsonwebtoken');
const path = require('path');

//Load Environment Variable
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const authenticateToken = (req, res, next) => {
    //Extracts the token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        //Return 401 Unauthorized if no token was provided
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    //Verify token using secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // If token verification fails, send 403 forbidden status  
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }
        //If valid token, attach user object to request then proceed to next middleware
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;