const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      code: 401,
      message: 'Missing or invalid Authorization header',
      data: null,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // gắn user info vào req
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      code: 403,
      message: 'Invalid or expired token',
      data: null,
    });
  }
}

module.exports = { authMiddleware };
