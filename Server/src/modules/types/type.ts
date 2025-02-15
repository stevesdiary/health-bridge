import { Request, Response } from 'express';
import { AppointmentStatus } from './appointment.type';
import { DoctorSpecialty } from '../doctor/model/doctor.model';

export interface UserAttributes {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
}

export interface UserData extends Omit<UserAttributes, 'id'> {
  confirm_password?: string;
}

export interface DoctorRegistrationDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialty: DoctorSpecialty;
  hospital_email: string;
}

export interface DoctorRegistrationRequest extends Request {
  body: DoctorRegistrationDTO;
}

export interface TypedRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
  };
}

export interface hospitalRegData extends Request {
  body: {
    name: string;
    email: string;
    address: string;
    phone: string;
    services: string[];

  }
}

export interface VerifyRequest extends Request {
  body: {
    email: string;
    code: string;
  }
}

export interface UserData {
  name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

export interface UserResponse {
  statusCode: number;
  status: 'success' | 'fail' | 'error';
  message: string;
  data: string[] | null;
}

export interface UserController {
  create(req: TypedRequest, res: Response): Promise<Response>;
  updateUser(req: TypedRequest, res: Response): Promise<Response>;
}
export interface ServiceResponse {
  statusCode: number;
  status: string;
  message: string;
  data: unknown | any[];
}
export interface UserResponseData {
  statusCode: number;
  status: string, // 'success' | 'fail' | 'error';
  message: string;
  data: unknown | null;
}

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
};

export interface EmailResponse {
  statusCode: number;
  status: string;
  message: string;
  data: unknown;
}

export interface loginData {
  email: string;
  password: string;
}

export interface UserRole {
  id: string;
  email: string;
  role: string[];
}

export interface ValidationResult {
  email: string;
  code: string;
}

export interface VerificationResponse {
  statusCode: number;
  status: string;
  message: string;
  data?: unknown;
}

export interface VerificationRequestBody {
  email: string;
  code: string
}

export interface ProviderOnboardingResponse {
  statusCode: number;
  status: string;
  message: string;
  data: unknown;
}

export interface ProviderRegistrationData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface SearchData {
  search?: string;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      // ... other user properties
    };
  }
}

export interface ValidationErrorResponse {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  status: 'success' | 'error' | 'fail';
  message: string;
  data: T | null;
}

export interface AppointmentCreateDTO {
  user_id: string;        // Required in DTO but missing in validation
  patient_id: string;
  doctor_id: string;
  date: string | Date;    // Allow both string and Date
  start_time: string;
  end_time: string;
  reason?: string;        // Optional
  note?: string;         // Required in DTO but missing in validation
  status: AppointmentStatus;
}

// export interface AuthenticatedRequest extends Request {
//   user?: {
//     id: string;
//     email: string;
//     role: UserRole;
//   };
// }

export interface ApiResponse<T> {
  statusCode: number;
  status: 'success' | 'error' | 'fail';
  message: string;
  data: T | null;
}

export interface AppointmentResponse {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
}