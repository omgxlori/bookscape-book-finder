import jwt, { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

/** Authenticated User Interface */
export interface AuthenticatedUser extends JwtPayload {
  _id: string;
  username: string;
  email: string;
}

/** Extend Express Request */
declare module 'express' {
  export interface Request {
    user?: AuthenticatedUser;
  }
}

/** Secret Key */
const secretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';

/** Middleware for REST APIs (Express) */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, secretKey) as AuthenticatedUser;
      req.user = decoded; // ✅ Properly sets `req.user`
      next();
    } catch (err) {
      console.error('Invalid Token:', err);
      res.sendStatus(403); // Forbidden
    }
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

/** Token Signing Function */
export const signToken = (username: string, email: string, _id: string): string => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

/** Middleware for Apollo Context */
export const authMiddleware = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization || '';

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, secretKey) as AuthenticatedUser;

        if (req.body?.operationName) {
          console.log('✅ Authenticated User:', decoded);
        }

        return { user: decoded };
      } catch (err) {
        if (err instanceof Error) {
          console.error('❌ Invalid Token:', err.message);
        } else {
          console.error('❌ Unknown error:', err);
        }
        return { user: null };
      }
    }
  }

  return { user: null };
};




