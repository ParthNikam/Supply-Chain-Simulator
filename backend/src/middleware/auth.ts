import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {pb} from "../config/pocketbase";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

interface PocketBaseJWTPayload {
  id: string; // user record ID
  collectionId: string;
  exp: number;
  type: string;
  refreshable: boolean;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies?.pb_auth_token;

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    let decoded: PocketBaseJWTPayload;

    try {
      decoded = jwt.verify(token, process.env.PB_JWT_SECRET) as PocketBaseJWTPayload;
      console.log(decoded);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch user from PocketBase
    const user = await pb.collection('users').getOne(decoded.id);

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Authentication error' });
  }
};
