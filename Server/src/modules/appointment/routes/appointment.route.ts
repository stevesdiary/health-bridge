import { Router, Request as ExpressRequest, Response } from "express";

import { checkRole } from "../../../middlewares/authorisation";
import { appointmentController } from "../controllers/appointment.controller";

const appointmentRouter = Router();

appointmentRouter.post('/create', async (req: ExpressRequest, res: Response) => {
  await appointmentController.createAppointment(req, res);
})

export default appointmentRouter;