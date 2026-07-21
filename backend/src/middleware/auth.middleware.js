import jwt        from 'jsonwebtoken';
import { config } from '../config/app.config.js';

export function requireAuth(req, res, next) {
  // Read token from HttpOnly cookie — not from header
  const token = req.cookies?.tbf_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error:   'Access denied. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    req.admin     = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error:   'Session expired. Please log in again.',
    });
  }
}