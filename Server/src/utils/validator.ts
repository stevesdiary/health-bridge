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
  // state: yup.string().required('State is required'),
  // city: yup.string().required('City is required'),
  // specialisation: yup.string().optional(),
  address: yup.string().required('Address is required'),
  services: yup.array().of(yup.string()).optional(),
  // opening_time: yup.string().required('Opening time is required'),
  // closing_time: yup.string().required('Closing time is required'),
  open: yup.boolean().optional(),
  // consultation_fee: yup.number().required('Consultation fee is required'),
  // accepted_insurance: yup.array().of(yup.string()).optional(),
  role: yup.string().optional(),
  rating: yup.number().optional()
});

export const searchSchema = yup.object({
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(10),
  search: yup.string().optional()
});

export const appointmentCreateSchema = yup.object().shape({
  patient_id: yup.string().uuid('Invalid user ID').required('User ID is required'),
  doctor_id: yup.string().uuid('Invalid doctor ID').required('Doctor ID is required'),
  date: yup.date()
    .min(new Date(), 'Appointment date cannot be in the past')
    .required('Appointment date is required'),
  start_time: yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .required('Start time is required'),
  end_time: yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .required('End time is required')
    .test('is-after-start', 'End time must be after start time', function(end_time) {
      const { start_time } = this.parent;
      return new Date(`1970-01-01T${end_time}`) > new Date(`1970-01-01T${start_time}`);
    }),
  reason: yup.string()
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason cannot exceed 500 characters')
    .required('Appointment reason is required'),
  status: yup.mixed<AppointmentStatus>()
    .oneOf(Object.values(AppointmentStatus), 'Invalid appointment status')
    .default(AppointmentStatus.PENDING)
});

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
