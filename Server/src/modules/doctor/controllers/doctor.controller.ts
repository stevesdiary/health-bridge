import { Request as ExpressRequest, Response } from "express";
import * as yup from 'yup';

import { doctorRegistrationSchema, idSchema, userVerificationSchema, doctorUpdateSchema } from "../../../utils/validator";
import { registerDoctor, verifyDoctor, findDoctors, findOneDoctor, updateDoctor } from '../services/doctor.registration';
import { ValidationErrorResponse, DoctorRegistrationDTO, DoctorRegistrationRequest } from '../../types/type';
import { DoctorSpecialty } from '../model/doctor.model';

const doctorController = {
  register: async (req: DoctorRegistrationRequest, res: Response): Promise<Response> => {
    try {
      const validatedDoctorInfo = await doctorRegistrationSchema.validate(req.body, {abortEarly: false});

      const doctorData: DoctorRegistrationDTO = {
        first_name: validatedDoctorInfo.first_name,
        last_name: validatedDoctorInfo.last_name,
        email: validatedDoctorInfo.email,
        phone: validatedDoctorInfo.phone,
        specialty: validatedDoctorInfo.specialty as DoctorSpecialty,
        hospital_email: validatedDoctorInfo.hospital_email
      }
      const doctor = await registerDoctor(doctorData);
      if (!doctor) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to register doctor',
          data: null
        });
      }
      return res.status(doctor.statusCode).send({
        status: doctor.status,
        message: doctor.message + (doctor.statusCode === 201 ? ' Check your email for verification code' : ''),
        data: doctor.data
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.log('ERROR DUE TO VALIDATION', error)
        const errors: ValidationErrorResponse[] = error.inner.map(err => ({
          field: err.path || 'unknown',
          message: err.message
        }));
        
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          data: errors
        });
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: errorMessage
      });
    }
  },

  verifyDoctor : async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const validatedData = await userVerificationSchema.validate(req.body, { abortEarly: false });
      
      const { email, code } = validatedData;
  
      const verificationResult = await verifyDoctor({ email, code });

      return res.status(verificationResult.statusCode).json(verificationResult)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors.map(errorMsg => ({
            message: errorMsg
          }))
        });
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: errorMessage
      });
    }
  },

  allDoctors: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const doctors = await findDoctors();
      return res.status(doctors.statusCode).json({
        status: doctors.status,
        message: doctors.message,
        data: doctors.data
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  },

  oneDoctor: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const id = await idSchema.validate(req.params.id, { abortEarly: false });
      
      const doctor = await findOneDoctor(id);
      return res.status(doctor.statusCode).json({
        status: doctor.status,
        message: doctor.message,
        data: doctor.data
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  },

  updateDoctor: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const id = await idSchema.validate(req.params.id, { abortEarly: false });
      const validatedData = await doctorUpdateSchema.validate(req.body, { abortEarly: false });
      const doctordData = {
        ...validatedData,
        specialty: validatedData.specialty as DoctorSpecialty
      };
      const doctor = await updateDoctor(id, doctordData);
      return res.status(doctor.statusCode).json({
        status: doctor.status,
        message: doctor.message,
        data: doctor.data
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

}

export default doctorController;