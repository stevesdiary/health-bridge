import { Router, Request as ExpressRequest, Response } from "express";

import { checkRole } from "../../../middlewares/authorisation";
import authentication from "../../../middlewares/authentication";
import doctorController from '../../doctor/controllers/doctor.controller';
// import { verifyDoctor } from '../services/doctor.registration';
const doctorRouter = Router()

doctorRouter.post('/register', async (req: ExpressRequest, res: Response) => {
  await doctorController.register(req, res);
});

doctorRouter.post('/verify', async (req: ExpressRequest, res: Response) => {
  await doctorController.verifyDoctor(req, res);
})

export default doctorRouter;