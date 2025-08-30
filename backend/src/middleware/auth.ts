import { Request, Response, NextFunction } from 'express';
import { pb } from "../config/pocketbase";


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


export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    // Save the token to PocketBase auth store
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    pb.authStore.save(token, null);
    
    // Verify the token by making a request to PocketBase API
    const userData = await pb.collection('users').authRefresh();
    console.log('✅ Token verified, user data:', userData);

    // Attach user to request
    req.user = {
      id: userData.record.id,
      email: userData.record.email,
      role: userData.record.role || 'user',
    };

    next(); 
  } catch (err) {
    return res.status(500).json({ error: 'Authentication error' });
  } finally {
    pb.authStore.clear();
  }
};