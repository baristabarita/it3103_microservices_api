const jwt = require('jsonwebtoken');

module.exports = {
  name: 'validate-jwt',
  policy: ({ secret }) => {
    return (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.sendStatus(401);
      }

      jwt.verify(token, secret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    };
  },
  schema: {
    $id: 'http://express-gateway.io/schemas/policies/validate-jwt.json',
    type: 'object',
    properties: {
      secret: {
        type: 'string'
      }
    },
    required: ['secret']
  }
};
