import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/customError';
import { sessionStore } from '../utils/session';
import { query } from '../config/db';

/**
 * Authentication and authorization middleware.
 * Supports JWT Bearer tokens as well as active browser sessions.
 * Usage: auth('ADMIN', 'USER') or auth() for any authenticated user
 */
export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userId: string | null = null;
      let userRole: string | null = null;
      let userEmail: string | null = null;
      let userName: string | null = null;

      // 1. Try Bearer token
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token) {
          try {
            const decoded = verifyToken(token);
            userId = decoded.id;
            userRole = decoded.role;
            userEmail = decoded.email;
            userName = decoded.name;
          } catch (err) {
            // Invalid token, continue to check session
          }
        }
      }

      // 2. Try session fallback
      if (!userId) {
        const activeId = sessionStore.getUserId();
        if (activeId) {
          userId = activeId;
        }
      }

      // 3. Try custom header
      if (!userId && req.headers['x-user-id']) {
        userId = req.headers['x-user-id'] as string;
      }

      if (!userId) {
        throw new AppError('Not authenticated. Please sign in.', 401);
      }

      // Query database to ensure user still exists and get latest details
      const userRes = await query(
        'SELECT id, name, email, phone, role, status, profile_image, address, bio, emergency_contact FROM users WHERE id = $1',
        [userId]
      );

      if (userRes.rows.length === 0) {
        sessionStore.clear();
        throw new AppError('User account not found', 401);
      }

      const dbUser = userRes.rows[0];
      req.user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role.toUpperCase(),
      };

      // Role check if required
      if (requiredRoles.length > 0) {
        const currentRole = (req.user.role || '').toUpperCase();
        const allowed = requiredRoles.map((r) => r.toUpperCase());
        const isAuthorized = allowed.some((r) => {
          if (r === currentRole) return true;
          if ((r === 'ADMIN' || r === 'DIRECTOR') && (currentRole === 'ADMIN' || currentRole === 'DIRECTOR')) return true;
          if ((r === 'USER' || r === 'MEMBER') && (currentRole === 'USER' || currentRole === 'MEMBER')) return true;
          return false;
        });

        if (!isAuthorized) {
          throw new AppError(`Forbidden: Requires role [${requiredRoles.join(', ')}]`, 403);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

