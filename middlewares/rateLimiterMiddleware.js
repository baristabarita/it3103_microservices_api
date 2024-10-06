//rate limiter middleware
const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
    windowsMs: 15 * 60 * 1000, //15 minutes
    max: 100, //Limit each IP to 100 requests per windowMs (or 15 minutes)
    message: 'Too many requests, please try again later.'
});

module.exports = rateLimitMiddleware;