import * as yup from 'yup';

export const userRegistrationSchema = yup.object().shape({
  id: yup.string().uuid().optional(),
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().trim()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#-+={}\[\]\\]).{6,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  ),
  confirm_password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  phone: yup.string().optional(),
  role: yup.string().optional(),
});

export const idSchema = yup.string().required('Id is required');

export const userUpdateSchema = yup.object().shape({
  name: yup.string().optional(),
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
  email: yup.string().email('Invalid email format').required('Email is required'),
  code: yup.string().required('Verification code is required'),
});

export const providerRegistrationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  specialisation: yup.string().optional(),
  address: yup.string().required('Address is required'),
  services: yup.array().of(yup.string()).required('Services is required'),
  opening_time: yup.string().required('Opening time is required'),
  closing_time: yup.string().required('Closing time is required'),
  available: yup.boolean().optional(),
  consultation_fee: yup.number().required('Consultation fee is required'),
  accepted_insurance: yup.array().of(yup.string()).optional(),
  role: yup.string().optional(),
});

export const searchSchema = yup.object({
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(10),
  search: yup.string().optional()
});
