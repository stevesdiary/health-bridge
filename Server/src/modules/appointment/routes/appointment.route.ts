import { Router, Request as ExpressRequest, Response } from "express";

import { checkRole } from "../../../middlewares/authorisation";
import  appointmentController from "../controllers/appointment.controller";

const appointmentRouter = Router();

appointmentRouter.post('/create', async (req: ExpressRequest, res: Response) => {
  await appointmentController.bookAppointment(req, res);
})

appointmentRouter.get('/all', async (req: ExpressRequest, res: Response) => {
  await appointmentController.getAppointments(req, res);
})

appointmentRouter.get('/one', async (req: ExpressRequest, res: Response) => {
  await appointmentController.getOneAppointmentRecord(req, res);
})

appointmentRouter.put('/update/:id', async (req: ExpressRequest, res: Response) => {
  await appointmentController.updateAppointment(req, res);
})

appointmentRouter.post('/cancel/:id', async (req: ExpressRequest, res: Response) => {
  await appointmentController.cancelAppointment(req, res);
})

appointmentRouter.delete('/delete', async (req: ExpressRequest, res: Response) => {
  await appointmentController.deleteAppointmentRecord(req, res);
})

export default appointmentRouter;