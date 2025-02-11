import { Request as ExpressRequest, Response } from "express";
import * as yup from 'yup';

// import { doctorRegistration, verifyDoctor } from '../services/doctor.registration';
import { doctorRegistrationSchema, userVerificationSchema } from "../../../utils/validator";
import { abort } from "process";
import { registerDoctor } from '../services/doctor.registration';
import { ValidationErrorResponse, DoctorRegistrationDTO, DoctorRegistrationRequest } from '../../types/type';
import { DoctorSpecialty } from '../model/doctor.model';
import { verifyDoctor } from '../../doctor/services/doctor.registration';

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
      // return
      return res.status(verificationResult.statusCode).json(verificationResult)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failerd',
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
  }

}



export default doctorController;