import express, { Request as ExpressRequest, Response} from 'express';
import notificationController from './notification.controller';

const notificationRouter = express.Router();

notificationRouter.post('/reminder/:appointment_id', async (req: ExpressRequest, res: Response) => {
  await notificationController.sendReminder(req, res);
});

notificationRouter.post('/confirmation/:appointment_id', async (req: ExpressRequest, res: Response) => {
  await notificationController.sendConfirmation(req, res);
});

notificationRouter.post('/cancellation/:appointment_id', async (req: ExpressRequest, res: Response) => {
  await notificationController.sendCancellation(req, res);
});

export default notificationRouter;