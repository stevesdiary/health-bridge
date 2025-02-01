import { Request, Response } from 'express';
import * as yup from 'yup';

import { providerOnboarding } from '../services/provider.onboarding';
import { getProviders } from '../services/provider.services';
import { providerRegistrationSchema, searchSchema } from '../../../utils/validator';
import { ProviderOnboardingResponse, SearchData } from '../../types/type';


const providerController = {
  register: async (req: Request, res: Response): Promise<Response> => {
    try {
      const validatedData = await providerRegistrationSchema.validate(req.body, { 
        abortEarly: false 
      });
      const response: ProviderOnboardingResponse = {
        statusCode: 200,
        status: "success",
        message: "Provider registered",
        data: []
      }
      const providerRegistrationData = validatedData;
      const provider = await providerOnboarding(providerRegistrationData);
      if (!provider) {
        return res.status(500).json({
          statusCode: 500,
          status: "error",
          message: "Failed to create provider",
          data: null
        });
      }
      
      return res.status(provider.statusCode).json( response);
      
    } catch (error) {
        if (error instanceof yup.ValidationError) {
          return res.status(400).send({ error: error.errors });
        };
        console.error('Error creating provider:', error);
        return res.status(500).send({ message: 'Error creating provider', error: error });
    }
  },

  getProviders: async (req: Request, res: Response ) => {
    try {
      const searchData = await searchSchema.validate(req.body, {abortEarly: false, strict: true});
      const providers = await getProviders(searchData);
      return res.status(providers.statusCode).json({
        status: providers.status,
        message: providers.message,
        data: providers
      })
      // if(!providers) {
        
      // }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      
      console.error('Error fetching providers:', error);
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

export default providerController;