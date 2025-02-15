import appointmentService from '../appointment/services/appointment.service';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

type Identifier = string;
export interface AppointmentCreateDTO {
  [x: string]: Identifier | undefined;
  user_id: string;
  doctor_id: string;
  hospital_id: string;
  date: string; // ISO date string
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  notes: string;
  status?: AppointmentStatus;
}



export interface AppointmentResponse {
  id: string;
  user_id: string;
  hospital_id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
}

export interface ApiResponse<T> {
  statusCode: number;
  status: 'success' | 'error' | 'fail';
  message: string;
  data: T | null;
}

export interface AppointmentService {
  createAppointment(appointmentData: AppointmentCreateDTO): Promise<ApiResponse<AppointmentResponse>>;
  
  getAppointment(id: string): Promise<ApiResponse<AppointmentResponse>>;
  
  getAppointments(filters: {
    patient_id?: string;
    doctor_id?: string;
    date?: string;
    status?: AppointmentStatus;
  }): Promise<ApiResponse<AppointmentResponse[]>>;
  
  updateAppointmentStatus(
    id: string, 
    status: AppointmentStatus
  ): Promise<ApiResponse<AppointmentResponse>>;
  
  cancelAppointment(id: string): Promise<ApiResponse<AppointmentResponse>>;
  
  checkConflicts(
    doctor_id: string,
    date: string,
    start_time: string,
    end_time: string
  ): Promise<ApiResponse<boolean>>;
}

export interface AppointmentUpdateResponse {
  statusCode: number;
  status: 'success' | 'error';
  message: string;
  data: string[] | null;
}

export interface AppointmentUpdateRequest {
  status: AppointmentStatus;
}