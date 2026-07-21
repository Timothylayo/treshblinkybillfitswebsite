import bcrypt     from 'bcryptjs';
import jwt        from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { config } from '../config/app.config.js';

// ----------------------------------------------------------------
// POST /api/auth/login
// ----------------------------------------------------------------
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.fail('Email and password are required', 400);
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return res.fail('Invalid email or password', 401);
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.fail('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      config.auth.jwtSecret,
      { expiresIn: '1d' }
    );

    // Set token as HttpOnly cookie — JS cannot read this
    res.cookie('tbf_token', token, {
      httpOnly: true,   // blocks JavaScript access completely
      secure:   config.nodeEnv === 'production', // HTTPS only in production
      sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax', // blocks cross-site requests
      maxAge:   1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    // Only return non-sensitive admin info — no token in response body
    return res.success({
      admin: {
        id:    admin.id,
        name:  admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ----------------------------------------------------------------
// GET /api/auth/me
// ----------------------------------------------------------------
export async function getMe(req, res, next) {
  try {
    const admin = await prisma.admin.findUnique({
      where:  { id: req.admin.adminId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!admin) return res.fail('Admin not found', 404);
    return res.success(admin);
  } catch (err) {
    next(err);
  }
}

// ----------------------------------------------------------------
// POST /api/auth/logout
// ----------------------------------------------------------------
export async function logout(req, res, next) {
  try {
    // Clear the cookie
    res.clearCookie('tbf_token', {
      httpOnly: true,
      secure:   config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    });
    return res.success({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

// ----------------------------------------------------------------
// PATCH /api/auth/password
// ----------------------------------------------------------------
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.fail('Both current and new password are required', 400);
    }
    if (newPassword.length < 8) {
      return res.fail('New password must be at least 8 characters', 400);
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.adminId },
    });

    const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isValid) return res.fail('Current password is incorrect', 401);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({
      where: { id: req.admin.adminId },
      data:  { passwordHash },
    });

    return res.success({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
}