import { Request, Response } from 'express';
import NotificationService from '../notification/notification.service';
// import { handleError } from '../../middlewares/error.handler';

const notificationController = {
  sendReminder: async (req: Request, res: Response) => {
    try {
      const { appointment_id } = req.params;
      const notificationService = NotificationService.getInstance();
      
      const notify = await notificationService.sendAppointmentReminder(appointment_id);
      
      return res.status(notify.statusCode).json({
        status: notify.status,
        message: notify.message,
        data: notify.data
      });
    } catch (error) {
      // const errorResponse = handleError(error);
      // return res.status(errorResponse.statusCode).json(errorResponse);
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
        data: error
      })
    }
  },

  sendConfirmation: async (req: Request, res: Response) => {
    try {
      const { appointment_id } = req.params;
      const notificationService = NotificationService.getInstance();
      
      await notificationService.sendAppointmentConfirmation(appointment_id);
      
      return res.status(200).json({
        status: 'success',
        message: 'Confirmation sent successfully'
      });
    } catch (error) {
      // const errorResponse = handleError(error);
      // return res.status(errorResponse.statusCode).json(errorResponse);
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
        data: error
      })
    }
  },

  sendCancellation: async (req: Request, res: Response) => {
    try {
      const { appointment_id } = req.params;
      const { reason } = req.body;
      const notificationService = NotificationService.getInstance();
      
      await notificationService.sendAppointmentCancellation(appointment_id, reason);
      
      return res.status(200).json({
        status: 'success',
        message: 'Cancellation notification sent successfully'
      });
    } catch (error) {
      // const errorResponse = handleError(error);
      // return res.status(errorResponse.statusCode).json(errorResponse);
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
        data: error
      })
    }
  }
};

export default notificationController;