import { Router, Request as ExpressRequest, Response } from "express";

import { checkRole } from "../../middlewares/authorisation";
import authentication from "../../middlewares/authentication";
import doctorController from '../doctor/doctor.controller';
// import { verifyDoctor } from '../services/doctor.registration';
const doctorRouter = Router()

doctorRouter.post('/register', async (req: ExpressRequest, res: Response) => {
  await doctorController.register(req, res);
});

doctorRouter.post('/verify', async (req: ExpressRequest, res: Response) => {
  await doctorController.verifyDoctor(req, res);
})
doctorRouter.get('/all', async (req: ExpressRequest, res: Response) => {
  await doctorController.allDoctors(req, res);
})
doctorRouter.get('/one/:id', async (req: ExpressRequest, res: Response) => {
  await doctorController.oneDoctor(req, res);
})
doctorRouter.put('/update/:id', async (req: ExpressRequest, res: Response) => {
  await doctorController.verifyDoctor(req, res);
})
doctorRouter.delete('/delete/:id', async (req: ExpressRequest, res: Response) => {
  await doctorController.verifyDoctor(req, res);
})



export default doctorRouter;