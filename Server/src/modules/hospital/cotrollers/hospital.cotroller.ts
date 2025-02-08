import { Request, Response } from 'express';
import * as yup from 'yup';

import { hospitalOnboarding, verifyHospital } from '../services/hospital.onboarding';
import { getHospitals } from '../services/hospital.services';
import { hospitalRegistrationSchema, searchSchema, hospitalVerificationSchema } from '../../../utils/validator';
import { ProviderOnboardingResponse, SearchData } from '../../types/type';


const hospitalController = {
  registerHospital: async (req: Request, res: Response): Promise<Response> => {
    try {
      const validatedData = await hospitalRegistrationSchema.validate(req.body, { 
        abortEarly: false 
      });
      const response: ProviderOnboardingResponse = {
        statusCode: 200,
        status: "success",
        message: "Hospital registered",
        data: []
      }
      const hospitalRegistrationData = validatedData;
      const hospital = await hospitalOnboarding(hospitalRegistrationData);
      if (!hospital) {
        return res.status(500).json({
          statusCode: 500,
          status: "error",
          message: "Failed to create hospital",
          data: null
        });
      }
      
      return res.status(hospital.statusCode).json( response);
      
    } catch (error) {
        if (error instanceof yup.ValidationError) {
          return res.status(400).send({ error: error.errors });
        };
        console.error('Error creating hospital:', error);
        return res.status(500).send({ message: 'Error creating hospital', error: error });
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
      // if(!hospitals) {
        
      // }
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

  getOneProvider: async (req: Request, res: Response ) => {

  },

  updateProvider: async ( req: Request, res: Response) => {

  },

  removeProvider: async ( req: Request, res: Response) => {

  }
}

export default hospitalController;