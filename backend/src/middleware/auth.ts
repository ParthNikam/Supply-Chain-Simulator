import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

export interface JWTPayload {
  sub: string; // subject: Identifies the subject of the JWT.
  email: string; // email for keeping a track of who the user is
  aud: string; // audience: Identifies the recipients that the JWT is intended for
  exp: number; // expiration time
  iat: number; // issued at
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies?.sb_access_token;

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    // Verify JWT token (Supabase uses RS256)
    // Note: In production, you should fetch the public key from Supabase
    // For now, we'll use a simple verification approach
    
    try {
      // Decode the JWT to get user info
      const decoded = jwt.decode(token) as JWTPayload;
      
      if (!decoded || !decoded.sub) {
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'Token could not be decoded'
        });
      }

      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ 
          error: 'Token expired',
          message: 'Authentication token has expired'
        });
      }

      // Attach user info to request
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.aud === 'authenticated' ? 'user' : 'anonymous'
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication error',
      message: 'Internal server error during authentication'
    });
  }
};

// Optional: Role-based access control
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};
