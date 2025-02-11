import { Request, Response } from 'express';
import * as yup from 'yup';

import { hospitalOnboarding, verifyHospital } from '../services/hospital.onboarding';
import { getHospitals, getOneHospital } from '../services/hospital.services';
import { hospitalRegistrationSchema, searchSchema, hospitalVerificationSchema } from '../../../utils/validator';
import { ProviderOnboardingResponse, SearchData, ValidationErrorResponse, hospitalRegData } from '../../types/type';


const hospitalController = {
  registerHospital: async (req: hospitalRegData, res: Response) => {
    try {
      const validatedData = await hospitalRegistrationSchema.validate(req.body, { 
        abortEarly: false 
      });
      
      const hospital = await hospitalOnboarding(validatedData);
      if (!hospital) {
        res.status(500).json({
          statusCode: 500,
          status: "error",
          message: "Failed to create hospital",
          data: null
        });
      }
      if (hospital)
        return res.status(hospital.statusCode).json({
          status: hospital.status,
          message: hospital.message,
          data: hospital.data
        });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.map(err => ({
          field: err.path || 'unknown',
          message: err.message,
          type: err.type
        }));
        
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors
        });
      }
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  verifyHospital: async (req: Request, res: Response ) => {
    try {
      const validatedData = await hospitalVerificationSchema.validate(req.body, { abortEarly: false });
      
      const { email, code } = validatedData;
      const verificationResult = await verifyHospital({ email, code });

      return res.status(verificationResult.statusCode).json(verificationResult);
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

  getHospitals: async (req: Request, res: Response ) => {
    try {
      const searchData = await searchSchema.validate(req.body, {abortEarly: false, strict: true});
      const hospitals = await getHospitals(searchData);
      return res.status(hospitals.statusCode).json({
        status: hospitals.status,
        message: hospitals.message,
        data: hospitals
      })

    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      
      console.error('Error fetching hospitals:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  // getOneHospital: async (req: Request, res: Response ) => {

  // },

  // updateHospital: async ( req: Request, res: Response) => {

  // },

  // removeHospital: async ( req: Request, res: Response) => {

  // }
}

export default hospitalController;