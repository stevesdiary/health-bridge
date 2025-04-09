import { ExecException } from "child_process";
import { Router, Request as ExpressRequest, Response } from "express";
// import { commonController } from '../commonCotroller';
const verifyRouter = Router();

// verifyRouter.post('/send-code', async (req: ExpressRequest, res: Response) => {
//   await verifyController.sendCode(req, res);
// })

// verifyRouter.post('/verify', async (req: ExpressRequest, res: Response) => {
//   await commonController.verify(req, res);
// })

export default verifyRouter;