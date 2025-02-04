import { Request, Response, NextFunction } from 'express';

// declare namespace Express {
//   export interface Request {
//     user: JwtPayload;  // Using your existing JwtPayload interface
//   }
// }

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized - No user found in request'
      });
      return;
    }
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};