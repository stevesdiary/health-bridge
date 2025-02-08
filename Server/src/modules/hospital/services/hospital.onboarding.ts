import { customAlphabet } from 'nanoid';

import { Hospital } from '../models/hospital.model';
import { getFromRedis, saveToRedis } from '../../../core/redis';
import sendEmail from '../../user/services/email.service';
import { CreationAttributes } from 'sequelize';

export const hospitalOnboarding = async (hospitalData: CreationAttributes<Hospital>) => {
  try {
    const emailExists = await Hospital.findOne({ 
      where: { 
        email: hospitalData.email 
      } 
    });

    if (emailExists) {
      return {
        statusCode: 400,
        status: 'fail',
        message: 'Hospital already exists',
        data: null
      }
    }
    const hospital = await Hospital.create(hospitalData);
    if (hospital) {
      const nanoid = customAlphabet('1234567890', 6)();
      const verificationCode = nanoid;
      let key = `verify:${hospital.email}`;
      await saveToRedis(key, verificationCode, 600);
      const emailPayload = {
        to: hospital.email as string,
        subject: 'Email Verification',
        text: `Your verification code is ${verificationCode}`,
      };
      await sendEmail(emailPayload);
    }
  } catch (error) {
    console.error('Error creating hospital:', error);
    throw new Error('Error creating hospital');
    
  }
}

export const verifyHospital = async ({email, code}: {email: string, code: string} ) => {
  try {
    const verificationCode = await getFromRedis(`verify:${email}`)
    if (verificationCode === code) {
      await Hospital.update(
        { verified: true },
        { where: { email } }
      );
      return {
        statusCode: 200,
        status: "success",
        message: "Hospital verified",
        data: null
      };
    }
    return {
      statusCode: 400,
      status: "fail",
      message: "Invalid verification code",
      data: null
    };
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
}