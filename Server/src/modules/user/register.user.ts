import { Request as ExpressRequest, Response } from 'express';
import * as yup from 'yup';

import { verifyUser, registerUser, resendCode } from './services/user.registration';
import { userRegistrationSchema, userVerificationSchema, emailSchema } from '../../utils/validator';
import { TypedRequest, ValidationErrorResponse,  } from '../types/type';


const userRegistration = {
  register: async (req: TypedRequest, res: Response): Promise<Response> => {
      try {
        const validatedData = await userRegistrationSchema.validate(req.body, { 
          abortEarly: false 
        });
        
        const { confirm_password, ...userData } = validatedData;
        const user = await registerUser(userData);
        
        return res.status(user.statusCode).send({
          status: user.status,
          message: user.message + (user.statusCode === 201 ? ' Check your email for verification code' : ''),
          data: user.data
        });
      } catch (error: unknown) {
        if (error instanceof yup.ValidationError) {
          console.log('ERROR DUE TO VALIDATION', error)
          const errors: ValidationErrorResponse[] = error.inner.map(err => ({
            field: err.path || 'unknown',
            message: err.message
          }));
          
          return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors
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

  verifyUser: async (req: ExpressRequest, res: Response ): Promise<Response> => {
    try {
      const validatedData = await userVerificationSchema.validate(req.body, { abortEarly: false });
      
      const { email, code } = validatedData;
      const verificationResult = await verifyUser({ email, code });

      return res.status(verificationResult.statusCode).json(verificationResult);
    } catch (error: unknown) {
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

  resendCode: async (req: TypedRequest, res: Response): Promise<Response> => {
    try {
      const emailPayload = await emailSchema.validate(req.body, { abortEarly: false });
      
      const resend = await resendCode(emailPayload.email);
      
      return res.status(resend.statusCode).send({ 
        status: 'success', 
        message: 'Verification code resent',
        data: resend.data
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).send({
          status: 'error',
          errors: error.errors
        });
      }
      
      return res.status(500).send({
        status: 'error',
        message: 'Internal server error',
        details: error instanceof Error ? error.message : error
      });
    }
  }
};

export default userRegistration;
