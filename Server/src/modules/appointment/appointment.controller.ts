import yup from 'yup';
import dayjs from 'dayjs';
import { Response, Request as ExpressRequest } from 'express';
import { appointmentCreateSchema, idSchema, searchSchema, appointmentStatusSchema } from '../../utils/validator';
import { AppointmentCreateDTO } from '../types/appointment.type';
import appointmentService from './appointment.service';

const appointmentController = {
  bookAppointment: async (req: ExpressRequest, res: Response) => {
    try {
      const user =  req.user;
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
          data: null
        });
      }

      const validatedData = await appointmentCreateSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });
      // let endTime = { end_time: validatedData.end_time };
      let time = { start_time: validatedData.start_time };

      let [hour, minute] = time.start_time.split(':').map(Number);
      let start_time = dayjs().hour(hour).minute(minute).second(0);
      let formattedStartTime = start_time.format('h:mm A');
      let end_time = start_time.add(1, 'hour');
      let formattedEndTime = end_time.format('h:mm A');

      const appointmentData: AppointmentCreateDTO = {
        user_id: user.id,
        doctor_id: validatedData.doctor_id,
        // patient_id: user.id,
        hospital_id: validatedData.hospital_id,
        date: validatedData.date,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        notes: validatedData.notes || ''
      };
  
      const result = await appointmentService.createAppointment(appointmentData);
      
      if (!result) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to create appointment',
          data: null
        });
      }

      return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      // if (error instanceof yup.ValidationError) {
      //   return res.status(400).json({
      //     status: 'error',
      //     message: 'Validation failed',
      //     errors: error.inner.map(err => ({
      //       field: err.path || 'unknown',
      //       message: err.message
      //     }))
      //   });
      // }
  
      console.error('Appointment Creation Error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        data: null
      });
    }
  },

  getAppointments: async (req: ExpressRequest, res: Response) => {
    try {
      const searchData = await searchSchema.validate(req.body, { abortEarly: false });
      const appointments = await appointmentService.getAppointments(searchData);
      return res.status(appointments.statusCode).json({
        status: appointments.status,
        message: appointments.message,
        data: appointments.data
      })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      console.error('Error', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  getOneAppointmentRecord: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const id = await idSchema.validate(req.params.id, {abortEarly: false});
      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed, Id is required',
          errors: 'Invalid ID'
        });
      }
      const appointment = await appointmentService.getOneAppointmentRecord(id);
      
      return res.status(appointment?.statusCode || 500).send({
        status: (appointment?.status),
        message: appointment?.message,
        data: appointment?.data
      })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).send({
          error: error
        });
      }
      
      console.error('Error: ', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  updateAppointment: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const id = await idSchema.validate(req.params.id, {abortEarly: false});
      const status = await appointmentStatusSchema.validate(req.body, {abortEarly: false });
      const updateAppointment = await appointmentService.updateAppointment(id, status);
      if (!updateAppointment) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to update appointment',
          data: null
        });
      }

      return res.status(updateAppointment.statusCode).json({
        status: updateAppointment.status,
        message: updateAppointment.message,
        data: updateAppointment.data
      });

    } catch (error) {
      // if (error instanceof yup.ValidationError) {
      //   return res.status(400).json({
      //     status: 'error',
      //     message: 'Validation failed',
      //     errors: error.errors
      //   });
      // }
      
      console.error('Error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  deleteAppointmentRecord: async (req: ExpressRequest, res: Response) => {
    try {
      const id = await idSchema.validate(req.params.id, {abortEarly: false});
      const deleteAppointment = await appointmentService.deleteAppointmentRecord(id);
      return {
        statusCode: deleteAppointment.statusCode,
        status: deleteAppointment.status,
        message: deleteAppointment.message,
        data: deleteAppointment.data
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      
      console.error('Error: ', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  cancelAppointment: async (req: ExpressRequest, res: Response) => {
    try {
      const id = await idSchema.validate(req.params.id, {abortEarly: false});
      const cancelAppoinntmet = await appointmentService.cancelAppointment(id);
      return {
        statusCode: cancelAppoinntmet?.statusCode,
        status: cancelAppoinntmet?.status,
        message: cancelAppoinntmet?.message,
        data: cancelAppoinntmet?.data
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      
      console.error('Error: ', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });     
    }
  }
}

export default appointmentController;
