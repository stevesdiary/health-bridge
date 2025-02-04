import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointment.service';

export class AppointmentController {
  private appointmentService: AppointmentService;

  constructor() {
    this.appointmentService = new AppointmentService();
  }

  createAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, provider_id, date, time } = req.body;

      if (!isValidTimeFormat(time)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid time format. Please use HH:MM format',
          data: null
        })
      }
      
      const appointment = await this.appointmentService.createAppointment(
        user_id, 
        provider_id, 
        new Date(date),
        time
      );

      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ error: 'Server error' });
    }
  }

  getUserAppointments = async (req: Request, res: Response) => {
    try {
      const user_id = req.params.user_id;
      const appointments = await this.appointmentService.getUserAppointments(user_id);
      
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  cancelAppointment = async (req: Request, res: Response) => {
    try {
      const { appointment_id } = req.params;
      if (!req.user){
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user_id = req.user.id;

      const appointment = await this.appointmentService.cancelAppointment(
        appointment_id, 
        user_id
      );

      res.status(200).json(appointment);
    } catch (error) {
      console.log('Error', error)
      res.status(400).json({ error: 'Error occured' });
    }
  }
}

function isValidTimeFormat(time: string): boolean {
  // Regular expression to match HH:MM format (24-hour)
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}
