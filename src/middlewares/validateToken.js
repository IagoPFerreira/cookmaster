const jwt = require('jsonwebtoken');

const secret = 'supersegredosecreto';

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'missing auth token' });

  try {    
    const token = jwt.verify(authorization, secret);

    req.user = token;

    next();
  } catch (error) {
    res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = {
  validateToken,
};