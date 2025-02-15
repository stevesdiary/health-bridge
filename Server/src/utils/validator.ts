import * as yup from 'yup';

import { AppointmentStatus } from '../modules/types/appointment.type';

export const userRegistrationSchema = yup.object().shape({
  first_name: yup
    .string()
    .trim()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters'),

  last_name: yup
    .string()
    .trim()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters'),
  
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Invalid email format'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
      'Password must include uppercase, lowercase, number, and special character'
    ),
  
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

export const idSchema = yup.string().required('Id is required');

export const userUpdateSchema = yup.object().shape({
  // name: yup.string().optional(),
  // email: yup.string().email('Invalid email format').optional(),
  password: yup.string().trim()
  .min(6, 'Password must be at least 6 characters')
  .optional(),
  confirm_password: yup.string()
  .min(6, 'Password must be at least 6 characters')
  .oneOf([yup.ref('password')], 'Passwords must match')

});

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const userVerificationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Invalid email format'),
  
  code: yup
    .string()
    .trim()
    .required('Verification code is required')
    .length(6, 'Verification code must be 6 digits')
});
export const hospitalVerificationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Invalid email format'),
  
  code: yup
    .string()
    .trim()
    .required('Verification code is required')
    .length(6, 'Verification code must be 6 digits')
});

export const hospitalRegistrationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(
      /^(0[7-9]\d{9}|\+234[7-9]\d{9})$/, 
      'Invalid Nigerian phone number'
    ),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
  services: yup.array().of(yup.string()).optional(),
  open: yup.boolean().optional(),
  consultation_fee: yup.number().required('Consultation fee is required'),
  accepted_insurance: yup.array().of(yup.string()).optional(),
  role: yup.string().optional(),
  rating: yup.number().optional()
});
export const hospitalUpdateSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(
      /^(0[7-9]\d{9}|\+234[7-9]\d{9})$/, 
      'Invalid Nigerian phone number'
    ),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
  services: yup.array().of(yup.string()).optional(),
  open: yup.boolean().optional(),
  consultation_fee: yup.number().required('Consultation fee is required'),
  accepted_insurance: yup.array().of(yup.string()).optional(),
});

export const searchSchema = yup.object({
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(10),
  search: yup.string().optional()
});

export const appointmentCreateSchema = yup.object().shape({
  user_id: yup.string()
    .transform((value) => value?.replace(/^"|"$/g, ''))
    .required('User ID is required'),
  doctor_id: yup.string()
    .transform((value) => value?.replace(/^"|"$/g, ''))
    .required('Doctor ID is required'),
  hospital_id: yup.string()
    .transform((value) => value?.replace(/^"|"$/g, ''))
    .required('Hospital ID is required'),
  date: yup.string()
    .transform((value) => value?.replace(/^"|"$/g, ''))
    .required('Date is required'),
  start_time: yup.string()
    .transform((value) => value?.replace(/^"|"$/g, ''))
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)')
    .required('Start time is required'),
  end_time: yup.string()
    .transform((value) => value?.replace(/^"|"$/g, ''))
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)')
    .required('End time is required'),
  notes: yup.string()
    .transform((value) => value?.replace(/^"|"$/g, ''))
    .optional(),
});
// .transform((value) => {
//   // Define Record type for the accumulator
//   return Object.keys(value).reduce<Record<string, unknown>>((acc, key) => {
//     acc[key] = typeof value[key] === 'string' 
//       ? value[key].replace(/^"|"$/g, '') 
//       : value[key];
//     return acc;
//   }, {});
// })

// export const appointmentCreateSchema = yup.object().shape({
//   user_id: yup.string().required('User ID is required'),
//   doctor_id: yup.string().required('Doctor ID is required'),
//   // date: yup.date()
//   //   .min(new Date(), 'Appointment date cannot be in the past')
//   //   .required('Appointment date is required'),
//   time: yup.string().required('Time is required'),
//   hospital_id: yup.string().required('Hospital Id is required'),
//   date: yup.string()
//     // .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
//     .required('Date is required'),
//   note: yup.string().max(500, 'Note cannot exceed 500 characters'),
//   // start_time: yup.string()
//   //   .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)')
//   //   .required('Start time is required'),
//   // end_time: yup.string()
//   //   .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)')
//   //   .required('End time is required'),
  
//   // status: yup.string().oneOf(Object.values(AppointmentStatus)),
//   status: yup.string().oneOf(['scheduled', 'cancelled', 'completed']).required()
// });

export const doctorRegistrationSchema = yup.object().shape({
  first_name: yup.string()
    .min(3, 'First name must be at least 3 characters')
    .required('First name is required'),
  last_name: yup.string()
    .min(3, 'Last name must be at least 3 characters')
    .required('Last name is required'),
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup.string().optional(),
  specialty: yup.string()
    .required('Specialty is required'),
  hospital_email: yup.string()
    .required('Hospital email is required'),
});

export const updateAppointmentSchema = yup.string().required('Status is required');
