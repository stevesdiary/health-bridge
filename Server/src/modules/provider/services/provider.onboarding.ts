import { Request, Response, Request as ExpressRequest } from 'express';
import { Provider } from '../../../modules/provider/models/provider.model';
import { ProviderRegistrationData, SearchData } from '../../types/type';
import { customAlphabet } from 'nanoid';
import { getFromRedis, saveToRedis } from '../../../core/redis';
import sendEmail from '../../../modules/user/services/email.service';
import { CreationAttributes } from 'sequelize';

export const providerOnboarding = async (providerData: CreationAttributes<Provider>) => {
  try {
    const emailExists = await Provider.findOne({ 
      where: { 
        email: providerData.email 
      } 
    });

    if (emailExists) {
      return {
        statusCode: 400,
        status: 'fail',
        message: 'Provider already exists',
        data: null
      }
    }
    const provider = await Provider.create(providerData);
    if (provider) {
      const nanoid = customAlphabet('1234567890', 6)();
      const verificationCode = nanoid;
      await saveToRedis(`verify:${provider.email}`, verificationCode, 600);
      const emailPayload = {
        to: provider.email,
        subject: 'Email Verification',
        text: `Your verification code is ${verificationCode}`,
      };
      await sendEmail(emailPayload);
    }
  } catch (error) {
    console.error('Error creating provider:', error);
    throw new Error('Error creating provider');
    
  }
}
