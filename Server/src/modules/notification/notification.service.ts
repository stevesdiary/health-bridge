import { Appointment, Reason } from '../appointment/appointment.model';
import { User } from '../user/user.model';
import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';
import { sendEmail } from '../services/email.service';
import { EmailResponse, NotificationResponse } from '../types/type';
import { Hospital } from '../hospital/hospital.model';

interface NotificationMessage {
  user_id: string;
  appointment_id: string;
  message: string;
  type: 'reminder' | 'confirmation' | 'cancellation';
  timestamp: Date;
  date: Date;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendAppointmentReminder(appointment_id: string): Promise<NotificationResponse> {
    try {
      const appointment = await Appointment.findOne({
        where: { id: appointment_id },
        include: [
          { model: Patient, 
            include: [{ model: User, attributes: ['first_name', 'email', 'phone'] }]
          },
          { model: Hospital, attributes: ['email', 'name', 'address'] },
          { model: Doctor, attributes: ['first_name', 'last_name'] }
        ]
      });
        
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // const reminderTime = new Date(appointment.date);
      const message = `
        Dear ${appointment.patient?.user?.first_name},

        This is a reminder for your upcoming appointment:
        Date: ${appointment.date}
        Time: ${appointment.start_time}
        Doctor: Dr. ${appointment.doctor?.first_name} ${appointment.doctor?.last_name}
        Venue: ${appointment.hospital?.address}

        Please arrive 10 minutes before your scheduled time and remember to take your hospital card and any other necessary items along.

        Best regards,
        Health Bridge Team
      `;
      const emailOption = { 
        to: appointment.patient?.user?.email as string, 
        subject: 'Appointment Reminder', 
        text: message 
      };
      const emailResponse = await sendEmail(emailOption);
      if (!emailResponse || !emailResponse.messageId || emailResponse.accepted.length < 1) {
        throw new Error('Failed to send email');
      }
      if (emailResponse.accepted?.length > 0 && emailResponse.messageId) {
        await appointment.update({
          reminder_sent: true
        }, 
        {
          where: {
            id: appointment_id
          }
        });
      }

      return {
        statusCode: 200,
        status: 'success',
        message: 'Appointment reminder sent successfully',
        data: emailResponse.response
      }
    } catch (error) {
      console.error('Error sending appointment reminder:', error);
      throw error;
    }
  }

  async sendAppointmentConfirmation(appointment_id: string): Promise<NotificationResponse> {
    try {
      const appointment = await Appointment.findOne({
        where: { id: appointment_id },
        include: [
          { model: Patient, 
            include: [{ model: User, attributes: ['first_name', 'email', 'phone'] }]
          },
          { model: Hospital, attributes: ['email', 'name', 'address'] },
          { model: Doctor, attributes: ['first_name', 'last_name', 'phone'] }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const message = `
        Dear ${appointment.patient?.user?.first_name},

        Your appointment has been confirmed:
        Date: ${appointment.date}
        Time: ${appointment.start_time}
        Doctor: Dr. ${appointment.doctor?.first_name} ${appointment.doctor?.last_name}
        Venue: ${appointment.hospital?.address}

        If you need to reschedule or cancel, please do so at least 24 hours in advance.

        Best regards,
        Health Bridge Team
      `;

      const emailResponse = await sendEmail({ to: appointment.patient?.user?.email as string, subject: 'Appointment Confirmation', text: message });

      await appointment.update({
        status: 'confirmed'
      }, 
      {
        where: {
          id: appointment_id
        }
      });
      return {
        statusCode: 200,
        status: 'success',
        message: 'Appointment confrimation sent successfully',
        data: emailResponse.response
      }
    } catch (error) {
      console.error('Error sending appointment confirmation:', error);
      throw error;
    }
  }

  async sendAppointmentCancellation(appointment_id: string, reason: string): Promise<void> {
    try {
      const appointment = await Appointment.findOne({
        where: { id: appointment_id },
        include: [
          { model: Patient, 
            include: [{ model: User, attributes: ['first_name', 'email', 'phone'] }]
          },
          { model: Hospital, attributes: ['email', 'name', 'address'] },
          { model: Doctor, attributes: ['first_name', 'last_name'] }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const message = `
        Dear ${appointment.patient?.user?.first_name},

        Your appointment has been cancelled:
        Date: ${appointment.date}
        Time: ${appointment.start_time}
        Reason: ${appointment.reason}
        Doctor: Dr. ${appointment.doctor?.first_name} ${appointment.doctor?.last_name}

        Please visit our website to schedule a new appointment.

        Best regards,
        Health Bridge Team
      `;

      await sendEmail({ to: appointment.patient?.user?.email as string, subject: 'Appointment Cancellation', text: message });
      await appointment.update({
        status: 'cancelled',
        reason: reason
      }, {
        where: {
          id: appointment_id
        }
      })

    } catch (error) {
      console.error('Error sending appointment cancellation:', error);
      throw error;
    }
  }
}

export default NotificationService;
