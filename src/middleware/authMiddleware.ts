import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { Config } from '../config/config';
import { User } from '../model/user';

const secretKey = Config.ACCESS_TOKEN_KEY;

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  
  if (!token || !token.startsWith('Bearer ')) {
    res.status(401).json({error: 'Access Forbidden'});
    return;
  }

  const parseToken = token.substring(7);
  
  jsonwebtoken.verify(parseToken, secretKey!, async (err, payload) => {
    if (err) {
      res.status(401).json({error: 'Access Forbidden'});
      return;
    }

    const decodedId = (payload as any).userId;
    if (!await User.findById(decodedId)) {
      res.status(401).json({error: 'Access Forbidden'});
    }
    req.userId = decodedId;
    next();
  });
}
