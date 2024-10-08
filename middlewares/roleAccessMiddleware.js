//role access middleware
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load environment variables

const roleAccessMiddleware = (roles) => {

    return(req, res, next) => {
        try{
            //Check if user exists in the request obj and if role is included
            if (!req.user || !roles.includes(req.user.role)) {
                //Return 403 if role is not allowed
                return res.status(403).json({ error: 'Access denied' });
            }

            next();

        }catch(error){
            console.error('Error during token and role verification:', error);
            return res.status(500).json({error: 'Internal Server Error Verifiying Role Access'});
        }
    }

}

module.exports = roleAccessMiddleware;