import RabbitMQConnection from '../../core/rabbitmq';
import { Appointment } from '../appointment/models/appointment.model';
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
  private rabbitMQ: RabbitMQConnection;
  private readonly QUEUE_NAME = 'appointment_notifications';

  private constructor() {
    this.rabbitMQ = RabbitMQConnection.getInstance();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    await this.rabbitMQ.connect();
    await this.rabbitMQ.createQueue(this.QUEUE_NAME);
  }

  async sendAppointmentReminder(user_id: string, appointment_id: string, appointmentTime: Date) {
    const appointmentData = await Appointment.findOne({
      where: {
        id: appointment_id,
        user_id: user_id
      },
      attributes: ['date', 'time', 'doctor_id']
    });
    const notification: NotificationMessage = {
      user_id: user_id,
      appointment_id,
      message: `Reminder: You have an appointment scheduled for ${appointmentTime.toLocaleString()}`,
      type: 'reminder',
      timestamp: new Date(),
      date: appointmentTime
    };
    await this.rabbitMQ.sendToQueue(this.QUEUE_NAME, notification);
  }

  async sendAppointmentConfirmation(user_id: string, appointment_id: string, appointmentTime: Date) {
    const notification: NotificationMessage = {
      user_id: user_id,
      appointment_id: appointment_id,
      message: `Your appointment has been confirmed for ${appointmentTime.toLocaleString()}`,
      type: 'confirmation',
      timestamp: new Date(),
      date: appointmentTime
    };
    await this.rabbitMQ.sendToQueue(this.QUEUE_NAME, notification);
  }

  async sendAppointmentCancellation(user_id: string, appointment_id: string, appointmentTime: Date) {
    const notification: NotificationMessage = {
      user_id: user_id,
      appointment_id: appointment_id,
      message: 'Your appointment has been cancelled',
      type: 'cancellation',
      timestamp: new Date(),
      date: appointmentTime
    };
    await this.rabbitMQ.sendToQueue(this.QUEUE_NAME, notification);
  }

  async processNotifications(callback: (notification: NotificationMessage) => Promise<void>) {
    await this.rabbitMQ.consume(this.QUEUE_NAME, async (msg) => {
      if (msg) {
        const notification: NotificationMessage = JSON.parse(msg.content.toString());
        await callback(notification);
      }
    });
  }
}

export default NotificationService;
