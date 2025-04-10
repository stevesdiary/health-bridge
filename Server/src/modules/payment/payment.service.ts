import axios from 'axios';
import { PaymentInitiationData, PaymentVerificationData, PaymentResponse } from '../types/payment.types';
import { getFromRedis, saveToRedis } from '../../core/redis';
import { customAlphabet } from 'nanoid';

export const initiatePayment = async (paymentData: PaymentInitiationData): Promise<PaymentResponse> => {
  try {
    const cacheKey = `payment:initiate:${paymentData.email}`;
    const nanoid = customAlphabet("1234567890")
    const generatePaystackReference = nanoid(10);
    const params = {
      amount: paymentData.amount * 100, // Convert to kobo
      email: paymentData.email,
      currency: paymentData.currency || 'NGN',
      reference: generatePaystackReference,
      callback_url: `${process.env.PAYSTACK_CALLBACK_URL}`
    }
    const config = { headers: {
      'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }};
    const response = await axios.post(params.callback_url, params, config);
    if (!response || response.status !== 200) {
      return {
        statusCode: 400,
        status: 'failure',
        message: 'Payment not initiated',
        data: null
      }
    }
    const paymentResponse = {
      data: {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference
      }
    };
    console.log(paymentResponse);
    await saveToRedis(cacheKey, JSON.stringify(paymentResponse), 1800); // 30 minutes cache

    return {
      statusCode: 200,
      status: 'success',
      message: 'Payment initiated successfully',
      data: {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference
      }
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to initiate payment',
      data: null
    };
  }
};

export const verifyPayment = async (verificationData: PaymentVerificationData): Promise<PaymentResponse> => {
  try {
    const cacheKey = `payment:verify:${verificationData.reference}`;
    
    const cachedVerification = await getFromRedis(cacheKey);
    if (cachedVerification) {
      return JSON.parse(cachedVerification);
    }

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${verificationData.reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    
    const verificationResponse = {
      statusCode: 200,
      status: 'success',
      message: 'Payment verified successfully',
      data: response.data.data
    };

    await saveToRedis(cacheKey, JSON.stringify(verificationResponse), 3600);

    return verificationResponse;
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to verify payment',
      data: null
    };
  }
};
