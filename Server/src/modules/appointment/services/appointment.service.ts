import { Appointment } from '../models/appointment.model';
import { User } from '../../user/models/user.model';
import { Provider } from '../../provider/models/provider.model';

export class AppointmentService {
  async createAppointment(
    user_id: string, 
    provider_id: string, 
    date: Date,
    time: string
  ) {
    
    const user = await User.findByPk(user_id);
    const provider = await Provider.findByPk(provider_id);

    if (!user || !provider) {
      throw new Error('User or Provider not found');
    }
    
    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
      time,
      status: 'scheduled'
    });

    return appointment;
  }

  async getUserAppointments(user_id: string) {
    return await Appointment.findAll({
      where: { user_id },
      include: [
        { 
          model: User, 
          attributes: ['name', 'email'] 
        },
        { 
          model: Provider, 
          attributes: ['name', 'specialization'] 
        }
      ]
    });
  }

  async cancelAppointment(appointment_id: string, user_id: string) {
    const appointment = await Appointment.findOne({
      where: { 
        id: appointment_id, 
        user_id 
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return appointment;
  }
}