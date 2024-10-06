//rate limiter middleware
const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
    windowsMs: 15 * 60 * 1000, //15 minutes
    max: 10, //Limit each IP to 100 requests per window
    legacyHeaders: false, //disables the 'X-rateLimit-*' headers
    message: 'Too many requests, please try again later.'
});

module.exports = rateLimitMiddleware;