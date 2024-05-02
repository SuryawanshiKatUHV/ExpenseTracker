const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate the token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The callback function to call the next middleware or request handler.
 */
const authenticator = (req, res, next) => {
  console.log(`Invoked authenticator...`);

  // Retrieve the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_VALUE

  console.log(`req.headers=${JSON.stringify(req.headers)}`);
  console.log(`token=${token}`);

  // Check if the token exists
  if (token == null) {
    return res.sendStatus(401); // If no token, return Unauthorized
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // If token is not valid, return Forbidden
    }

    // Set the user in the request object
    req.user = user;
    console.log(`authenticator : req.user=${JSON.stringify(req.user)}`);

    // Proceed to the next middleware or request handler
    next();
  });
};

module.exports = authenticator;
