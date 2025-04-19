import { Router, Request as ExpressRequest, Response } from "express";

import { checkRole } from "../../middlewares/authorisation";
import  appointmentController from "./appointment.controller";
import authentication from '../../middlewares/authentication';

const appointmentRouter = Router();

appointmentRouter.post('/book', 
  authentication,
  // checkRole(['user', 'admin']), 
  async (req: ExpressRequest, res: Response) => {
  await appointmentController.bookAppointment(req, res);
})

appointmentRouter.get('/all', 
  // authentication, checkRole(['user', 'admin']), 
async (req: ExpressRequest, res: Response) => {
  await appointmentController.getAppointments(req, res);
})

appointmentRouter.get('/one/:id', 
  // authentication, checkRole(['user', 'admin']), 
  async (req: ExpressRequest, res: Response) => {
  await appointmentController.getOneAppointmentRecord(req, res);
})

appointmentRouter.put('/update/:id', 
  // authentication, checkRole(['user', 'admin']), 
  async (req: ExpressRequest, res: Response) => {
  await appointmentController.updateAppointment(req, res);
})

appointmentRouter.post('/cancel/:id', authentication, checkRole(['user', 'admin']), async (req: ExpressRequest, res: Response) => {
  await appointmentController.cancelAppointment(req, res);
})

appointmentRouter.delete('/delete', authentication, checkRole(['admin']), async (req: ExpressRequest, res: Response) => {
  await appointmentController.deleteAppointmentRecord(req, res);
})

export default appointmentRouter;