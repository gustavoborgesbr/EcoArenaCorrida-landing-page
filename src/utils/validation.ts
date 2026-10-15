/**
 * Pure validation and calculation functions for Corrida Equarena
 */

export interface RegistrationInput {
  fullName: string;
  rg: string;
  cpf: string;
  phone: string;
  confirmPresence: boolean;
  distance: string;
  tshirtSize: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface FeeCalculation {
  fee: number;
  isEarlyBird: boolean;
  remainingEarlyBirdSpots: number;
  badgeText: string;
}

/**
 * Validates a Brazilian CPF number with check digits algorithm
 */
export function validateCPF(cpf: string): boolean {
  if (!cpf) return false;
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;

  // Reject identical digits like 11111111111
  if (/^(\d)\1{10}$/.test(clean)) return false;

  // First check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  // Second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10), 10)) return false;

  return true;
}

/**
 * Masks input into CPF pattern: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Masks phone number into BR format: (00) 00000-0000 or (00) 0000-0000
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length > 0 ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Validates phone has at least 10 or 11 digits
 */
export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

/**
 * Formats RG string
 */
export function formatRG(value: string): string {
  return value.trim().toUpperCase().slice(0, 15);
}

/**
 * Calculates current registration fee based on early bird count
 * Early bird: first 100 registrations pay R$ 5,00
 */
export function calculateRegistrationFee(
  currentRegistrationsCount: number,
  earlyBirdLimit: number = 100,
  earlyBirdFee: number = 5,
  standardFee: number = 25
): FeeCalculation {
  const remaining = Math.max(0, earlyBirdLimit - currentRegistrationsCount);
  const isEarlyBird = currentRegistrationsCount < earlyBirdLimit;
  const fee = isEarlyBird ? earlyBirdFee : standardFee;

  let badgeText = '';
  if (isEarlyBird) {
    badgeText = `Lote Promocional R$ ${earlyBirdFee.toFixed(2).replace('.', ',')} (${remaining} vagas restantes)`;
  } else {
    badgeText = `Lote Normal R$ ${standardFee.toFixed(2).replace('.', ',')}`;
  }

  return {
    fee,
    isEarlyBird,
    remainingEarlyBirdSpots: remaining,
    badgeText,
  };
}

/**
 * Cleans phone number to international WhatsApp format (e.g. 5571999998888)
 */
export function cleanWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  return `55${digits}`;
}

/**
 * Builds the WhatsApp pre-filled message text to confirm presence and send receipt
 */
export function buildWhatsAppMessage(params: {
  fullName: string;
  cpf: string;
  rg: string;
  distance: string;
  fee: number;
  registrationId: string;
  isEarlyBird: boolean;
}): string {
  const formattedFee = `R$ ${params.fee.toFixed(2).replace('.', ',')}`;
  const loteInfo = params.isEarlyBird ? 'Lote Promocional (100 Primeiros)' : 'Lote Regular';

  return `🏃 *COMPROVANTE DE INSCRIÇÃO - CORRIDA EQUARENA*

Olá, Equipe Equarena!
Acabei de preencher minha inscrição e confirmar presença pelo site! 

📋 *Dados do Atleta:*
• *Nome:* ${params.fullName.trim()}
• *CPF:* ${params.cpf}
• *RG:* ${params.rg}
• *Modalidade:* ${params.distance}
• *Valor:* ${formattedFee} (${loteInfo})
• *Cód. Inscrição:* #${params.registrationId}

📎 *Segue em anexo o meu comprovante de pagamento Pix.*
Por favor, confirmem minha vaga. Nos vemos na largada! 🔥🏅`;
}

/**
 * Generates WhatsApp URL
 */
export function generateWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = cleanWhatsAppNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates an EMVCo compliant Pix BR Code payload (payload do Pix Copia e Cola)
 */
export function generatePixPayload(params: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid?: string;
}): string {
  const formatField = (id: string, value: string): string => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const cleanPixKey = params.pixKey.trim();
  const cleanName = params.merchantName.trim().slice(0, 25).toUpperCase();
  const cleanCity = params.merchantCity.trim().slice(0, 15).toUpperCase();
  const formattedAmount = params.amount.toFixed(2);
  const txid = (params.txid || 'EQUARENA').slice(0, 25);

  // Payload Format Indicator
  let payload = formatField('00', '01');

  // Point of Initiation Method: 12 (Dynamic) or 11 (Static)
  payload += formatField('01', '12');

  // Merchant Account Information (GUI + Key)
  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', cleanPixKey);
  payload += formatField('26', `${gui}${key}`);

  // Merchant Category Code
  payload += formatField('52', '0000');

  // Transaction Currency (986 = BRL)
  payload += formatField('53', '986');

  // Transaction Amount
  payload += formatField('54', formattedAmount);

  // Country Code
  payload += formatField('58', 'BR');

  // Merchant Name
  payload += formatField('59', cleanName);

  // Merchant City
  payload += formatField('60', cleanCity);

  // Additional Data Field Template (txid)
  const txidField = formatField('05', txid);
  payload += formatField('62', txidField);

  // CRC16 section ID and length
  payload += '6304';

  // Compute CRC16 (CCITT-FALSE)
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  const hexCrc = (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
  return `${payload}${hexCrc}`;
}
