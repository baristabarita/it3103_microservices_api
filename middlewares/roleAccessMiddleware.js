//role access middleware
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'yourSecretKey';

const roleAccessMiddleware = (roles) => {

    return(req, res, next) => {
        try{
            
            if (!req.user || !roles.includes(req.user.role)) {
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