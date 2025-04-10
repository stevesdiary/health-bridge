export interface PaymentInitiationData {
  amount: number;
  email: string;
  currency?: string;
}

export interface PaymentVerificationData {
  reference: string;
}

export interface PaymentResponse {
  statusCode: number;
  status: string;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string
    reference: string;
  } | null
}
