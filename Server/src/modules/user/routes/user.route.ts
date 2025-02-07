import { Router, Request as ExpressRequest, Response } from 'express';

import userRegistration from '../controllers/register.user';
import userController from '../controllers/user.controller';
import { TypedRequest } from '../../types/type';
import { checkRole } from '../../../middlewares/authorisation';
import authentication from '../../../middlewares/authentication';


const userRouter = Router();

userRouter.post("/register", async (req: TypedRequest, res: Response) => {
  await userRegistration.register(req, res);
});

userRouter.post("/verify", async (req: ExpressRequest, res: Response) => {
  await userRegistration.verifyUser(req, res);
});

userRouter.get('/all', authentication, checkRole(['PATIENT', 'ADMIN']), async (req: ExpressRequest, res: Response) => {
  await userController.getAllUsers(req, res)
});

userRouter.get('/one/:id', checkRole(['user', 'admin']), async (req: ExpressRequest, res: Response) => {
  await userController.getOneUser(req, res);
});

userRouter.delete('/delete/:id', checkRole(['user', 'admin']), async (req: ExpressRequest, res: Response) => {
  await userController.deleteUser(req, res);
})

export default userRouter;
