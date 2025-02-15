import RabbitMQConnection from '../../core/rabbitmq';

interface NotificationMessage {
  userId: string;
  appointmentId: string;
  message: string;
  type: 'reminder' | 'confirmation' | 'cancellation';
  timestamp: Date;
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

  async sendAppointmentReminder(userId: string, appointmentId: string, appointmentTime: Date) {
    const notification: NotificationMessage = {
      userId,
      appointmentId,
      message: `Reminder: You have an appointment scheduled for ${appointmentTime.toLocaleString()}`,
      type: 'reminder',
      timestamp: new Date()
    };
    await this.rabbitMQ.sendToQueue(this.QUEUE_NAME, notification);
  }

  async sendAppointmentConfirmation(userId: string, appointmentId: string, appointmentTime: Date) {
    const notification: NotificationMessage = {
      userId,
      appointmentId,
      message: `Your appointment has been confirmed for ${appointmentTime.toLocaleString()}`,
      type: 'confirmation',
      timestamp: new Date()
    };
    await this.rabbitMQ.sendToQueue(this.QUEUE_NAME, notification);
  }

  async sendAppointmentCancellation(userId: string, appointmentId: string) {
    const notification: NotificationMessage = {
      userId,
      appointmentId,
      message: 'Your appointment has been cancelled',
      type: 'cancellation',
      timestamp: new Date()
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
