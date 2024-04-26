const jwt = require('jsonwebtoken');

// Middleware to authenticate the token
const authenticator = (req, res, next) => {
  console.log(`Invoked authenticator...`);
  // Retrieve the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_VALUE

  console.log(`req.headers=${JSON.stringify(req.headers)}`);
  console.log(`token=${token}`);

  if (token == null) {
    return res.sendStatus(401); // If no token, return Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // If token is not valid, return Forbidden
    }

    req.user = user; // Set the user in the request object
    console.log(`authenticator : req.user=${JSON.stringify(req.user)}`);
    next(); // Proceed to the next middleware or request handler
  });
};

module.exports = authenticator;