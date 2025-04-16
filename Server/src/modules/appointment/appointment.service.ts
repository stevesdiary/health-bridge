import { Op } from 'sequelize';

import { Appointment } from './appointment.model';
import { User } from '../user/user.model';
import { Hospital } from '../hospital/hospital.model';
import { AppointmentCreateDTO, AppointmentStatus, AppointmentResponse } from '../types/appointment.type';
import { Doctor } from '../doctor/doctor.model';
import { ApiResponse, SearchData } from '../types/type';
import sequelize from '../../core/database';
import { Patient } from '../patient/patient.model';



const appointmentService = {
  createAppointment: async (
    appointmentData: AppointmentCreateDTO
  ): Promise<ApiResponse<AppointmentResponse>> => {
    const transaction = await sequelize.transaction();
    console.log('Appointment Data:', JSON.stringify(appointmentData, null, 2));

    Object.keys(appointmentData).forEach(key => {
      console.log(`${key} type:`, typeof appointmentData[key]);
    });
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

      // const [doctor, user, hospital] = await Promise.all([
        // Doctor.findByPk(appointmentData.doctor_id, { transaction }),
      //   User.findByPk(appointmentData.user_id, { transaction }),
      //   Hospital.findByPk(appointmentData.hospital_id, { transaction })
      // ]);
      const [doctor, user, hospital] = await Promise.all([
        // Doctor.findOne({ 
        //   where: { email: appointmentData.doctor_email},
        //   transaction
        // }),
        Doctor.findByPk(appointmentData.doctor_id, { transaction }),
        User.findByPk(appointmentData.user_id,{
          attributes: {
            include: ['id']
          },
          include: [
            {
              model: Patient,
              as: "patient",
              attributes: {
                include: ['id']
              },
            }
          ],
        transaction }),
        Hospital.findByPk(appointmentData.hospital_id, { transaction })
      ]);

      if (!doctor || !user || !hospital) {
        await transaction.rollback();
        return {
          statusCode: 404,
          status: 'fail',
          message: 'Required parameters not found (Doctor,User, Hospital)',
          data: null
        };
      }
      console.log('User with patient id', user?.dataValues.patient?.id);
      if (!user) {
        await transaction.rollback();
        return {
          statusCode: 404,
          status: 'fail',
          message: 'User not found',
          data: null
        };
      }

      // if (!hospital) {
      //   await transaction.rollback();
      //   return {
      //     statusCode: 404,
      //     status: 'fail',
      //     message: 'Hospital not found',
      //     data: null
      //   };
      // }

      // Create appointment
      const appointment = await Appointment.create(
        {
          ...appointmentData,
          patient_id: user?.dataValues.patient?.id,
          status: AppointmentStatus.pending
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
          patient_id: appointment.patient_id,
          ...appointmentData,
          status: AppointmentStatus.pending
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
  },

  getAppointments: async (SearchData: SearchData) => {
    try {
      const appointments = await Appointment.findAll({
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['id'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email'],
              },
            ],
          },
          {
            model: Doctor,
            as: 'doctor',
            attributes: ['id', 'first_name', 'last_name', 'email', 'specialty'],
          },
          {
            model: Hospital,
            as: 'hospital',
            attributes: ['id', 'name', 'address'],
          }
        ]
      });
      if (!appointments || appointments.length === 0) {
        return {
          statusCode: 404,
          status: 'fail',
          message: 'No appointments found',
          data: null,
        };        
      }
      return {
        statusCode: 200,
        status: 'success',
        message: 'Appointments fetched from database',
        data: appointments,
      };      
    } catch (error) { 
      console.error('Error in get appointment service:', error);
      throw new Error('Failed to fetch hospitals');
    }
  },

  getOneAppointmentRecord: async (id: string) => {
    try {
      const getOne = await Appointment.findByPk(id);
      if (!getOne) {
        return {
          statusCode: 404,
          status: 'fail',
          message: 'Record not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        status: 'success',
        message: 'Record found',
        data: getOne
      }
    } catch (error) {
      
    }
  },

  updateAppointment: async (id: string, status: string) => {
    try {
      const update = await Appointment.update(
        { status: status},
        {where: {id}},
      )
      if (update) {
        return {
          statusCode: 200,
          status: 'success',
          message: 'Appointment updated',
          data: null
        }
      }
    } catch (error) {
      console.log('Error cancelling appoitmet', error);
      throw error;
    }
  },

  cancelAppointment: async (id: string) => {
    try {
      const cancel = await Appointment.update(
        { status: 'cancelled'},
        {where: {id}},
      )
      if (cancel) {
        return {
          statusCode: 200,
          status: 'success',
          message: 'Appointment cancelled',
          data: null
        }
      }
    } catch (error) {
      console.log('Error cancelling appoitmet', error);
      throw error;
    }
  },

  deleteAppointmentRecord: async (id: string) => {
    try {
      const deleteRecord = await Appointment.destroy(
        {where: {id}},
      )
      if (deleteRecord > 0) {
        return {
          statusCode: 200,
          status: 'success',
          message: 'Appointment record deleted',
          data: null
        }
      }

      return {
        statusCode: 404,
        status: 'fail',
        message: 'Appointment record not found or already deleted',
        data: null        
      }
    } catch (error) {
      console.log('Error deleting appoitmet record', error);
      throw error;
    }
  }
}

export default appointmentService;

