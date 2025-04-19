export interface PaymentRequestData {
  amount: number;
  email: string;
  currency: string;
  payment_provider?: string;
  payment_method: string;
  // user_id: string;
}

export interface FetchPaymentsRequestData {
  limitNumber?: number;
  pageNumber?: number;
}

export interface PaymentInitiationData {
  patient_id: string;
  paymentMethod?: string;
  payment_type?: string;
  amount: number;
  email: string;
  currency: string;
  appointment_id?: string;
  paymentProvider: string;
}

export interface PaymentVerificationData {
  reference: string;
}
export interface AllPaymentsResponse {
  statusCode: number;
  status: string;
  message: string;
  data?: unknown;
}
export interface PaymentResponse {
  statusCode: number;
  status: string;
  message: string;
  data?: {
    authorization_url: string;
    // access_code: string
    reference: string;
  } | null
}
