export type ModalityDistance = '3km' | '5km' | '10km';
export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';

export interface Participant {
  id: string;
  bibNumber?: number;
  fullName: string;
  rg: string;
  cpf: string;
  phone: string;
  email?: string;
  birthDate?: string;
  gender?: 'M' | 'F' | 'Outro';
  distance: ModalityDistance;
  shirtSize: ShirtSize;
  confirmedPresence: boolean;
  emergencyName: string;
  emergencyPhone: string;
  isEarlyBird: boolean;
  feeAmount: number;
  status: 'pending_payment' | 'confirmed' | 'cancelled';
  registeredAt: string;
  paymentMethod: 'pix';
  notes?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  pixCode?: string;
}

export interface EventConfig {
  eventName: string;
  organizerName: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:mm
  locationName: string;
  locationAddress: string;
  pixKey: string;
  pixKeyType: 'telefone' | 'cpf' | 'email' | 'aleatoria';
  pixReceiverName: string;
  pixReceiverCity: string;
  whatsAppNumber: string; // (XX) XXXXX-XXXX
  earlyBirdLimit: number; // 100
  earlyBirdFee: number; // 5.00
  standardFee: number; // 25.00
}

export type AuditActionType =
  | 'CONFIRM_PAYMENT'
  | 'CANCEL_REGISTRATION'
  | 'UPDATE_SETTINGS'
  | 'MANUAL_REGISTRATION'
  | 'DELETE_REGISTRATION';

export interface AuditLog {
  id: string;
  action: AuditActionType;
  participantId?: string;
  participantName?: string;
  amount?: number;
  adminEmail: string;
  details: string;
  timestamp: string;
}
