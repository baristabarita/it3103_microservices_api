//authMiddleWare.js

const jwt = require(`jsonwebtoken`);
require('dotenv').config(); //Load Environment Variable

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers[`authorization`];
    const token = authHeader &&  authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); //Forbidden
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;

//Just needs to test the Authentication by Importing it into the Product and Order