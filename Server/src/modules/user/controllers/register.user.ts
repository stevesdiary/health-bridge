import { Request as ExpressRequest, Response } from 'express';
import * as yup from 'yup';

import { verifyUser, registerUser } from '../services/user.registration';
import { userRegistrationSchema, userVerificationSchema } from '../../../utils/validator';
import { TypedRequest, UserData, UserResponse, VerifyRequest } from '../../types/type';

interface ValidationErrorResponse {
  field: string;
  message: string;
}

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
        // Check for Yup validation error
        if (error instanceof yup.ValidationError) {
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

  verifyUser: async (req: VerifyRequest, res: Response): Promise<Response> => {
    try {
      const verify = userVerificationSchema.validate(req.body, { abortEarly: false });
      
      const { email, code } = verify as unknown as { email: string, code: string };
      const verifyRequest: VerifyRequest = {
        body: { email, code },
      } as VerifyRequest;
      const user = await verifyUser(verifyRequest);
      return res.status(user.statusCode).send({ status: (user.status), message: (user.message), data: (user.data)})
    } catch (error) {
      return res.status(500).send({
        error: error
      })
    }
  },
};

export default userRegistration;
