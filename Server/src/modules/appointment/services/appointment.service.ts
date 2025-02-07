import { Appointment } from '../models/appointment.model';
import { User } from '../../user/models/user.model';
import { Hospital } from '../../hospital/models/hospital.model';

import { AppointmentCreateDTO, AppointmentStatus, AppointmentResponse } from '../../types/appointment.type';
import { Doctor } from '../../doctor/model/doctor.model';
// import { User } from '../../user/models/user.model';
import { ApiResponse } from '../../types/type';
import sequelize from '../../../core/database';
import { Op } from 'sequelize';

export class AppointmentService {
  async createAppointment(
    appointmentData: AppointmentCreateDTO
  ): Promise<ApiResponse<AppointmentResponse>> {
    const transaction = await sequelize.transaction();

    try {
      const conflictingAppointment = await Appointment.findOne({
        where: {
          doctor_id: appointmentData.doctor_id,
          date: appointmentData.date,
          [Op.or]: [
            {
              start_time: {
                [Op.between]: [
                  appointmentData.start_time, 
                  appointmentData.end_time
                ]
              }
            },
            {
              end_time: {
                [Op.between]: [
                  appointmentData.start_time, 
                  appointmentData.end_time
                ]
              }
            }
          ]
        },
        transaction
      });

      if (conflictingAppointment) {
        await transaction.rollback();
        return {
          statusCode: 400,
          status: 'fail',
          message: 'Doctor is not available at the selected time',
          data: null
        };
      }

      // Verify doctor and user exist
      const [doctor, user] = await Promise.all([
        Doctor.findByPk(appointmentData.doctor_id, { transaction }),
        User.findByPk(appointmentData.patient_id, { transaction })
      ]);

      if (!doctor) {
        await transaction.rollback();
        return {
          statusCode: 404,
          status: 'fail',
          message: 'Doctor not found',
          data: null
        };
      }

      if (!user) {
        await transaction.rollback();
        return {
          statusCode: 404,
          status: 'fail',
          message: 'User not found',
          data: null
        };
      }

      // Create appointment
      const appointment = await Appointment.create(
        {
          ...appointmentData,
          status: AppointmentStatus.PENDING
        },
        { transaction }
      );

      await transaction.commit();

      return {
        statusCode: 201,
        status: 'success',
        message: 'Appointment created successfully',
        data: {
          id: appointment.id,
          ...appointmentData,
          status: AppointmentStatus.PENDING
        }
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Appointment Creation Error:', error);
      
      return {
        statusCode: 500,
        status: 'error',
        message: 'Failed to create appointment',
        data: null
      };
    }
  }
}

export const appointmentService = new AppointmentService();

