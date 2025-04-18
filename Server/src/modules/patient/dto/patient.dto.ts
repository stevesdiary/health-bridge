export interface CreatePatientDto {
  user_id: string;
  date_of_birth: Date;
  blood_type: string;
  allergies?: string;
  medical_history?: string;
  emergency_contact: string;
  emergency_contact_phone: string;
  insurance_provider?: string;
  insurance_number?: string;
}

export class UpdatePatientDto {
  user_id?: number;
  dateOf_birth?: Date;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
  emergency_contact?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_number?: string;
}