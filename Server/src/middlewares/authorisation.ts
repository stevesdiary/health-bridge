import { Request, Response, NextFunction } from 'express';
// import { UserRole } from '../utils/roles';
// declare global {
//   namespace Express {
//     interface Request {
//       user: {
//         id: string;
//         role: UserRole;
//       };
//     }
//   }
// }

// export function authorise(roles: UserRole[]) {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const user = req.user;

//         if (!user || !roles.includes(user.role)) {
//           return res.status(403).json({ message: 'Forbidden! You are not authorised to access this page' });
//         }
//         next();
//     };
// }


export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user.role;

    if (!roles.includes(userRole)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};