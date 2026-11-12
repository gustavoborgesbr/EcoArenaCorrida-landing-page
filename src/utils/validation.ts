/**
 * Pure validation and calculation functions for Corre de Sexta - Eco Arena
 */

export interface RegistrationInput {
  fullName: string;
  rg?: string;
  cpf: string;
  email?: string;
  phone?: string;
  confirmPresence: boolean;
  distance: string;
  tshirtSize?: string;
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

  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

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
 * Validates phone has at least 10 or 11 digits (when provided)
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
 */
export function calculateRegistrationFee(
  currentRegistrationsCount: number,
  earlyBirdLimit: number = 100,
  earlyBirdFee: number = 10,
  standardFee: number = 10
): FeeCalculation {
  const remaining = Math.max(0, earlyBirdLimit - currentRegistrationsCount);
  const isEarlyBird = currentRegistrationsCount < earlyBirdLimit;
  const fee = isEarlyBird ? earlyBirdFee : standardFee;

  const badgeText = `Taxa de Benefícios R$ ${fee.toFixed(2).replace('.', ',')} (${remaining} vagas restantes)`;

  return {
    fee,
    isEarlyBird,
    remainingEarlyBirdSpots: remaining,
    badgeText,
  };
}

/**
 * Cleans phone number to international WhatsApp format (e.g. 5582999998888)
 */
export function cleanWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  return `55${digits}`;
}

/**
 * Builds the WhatsApp pre-filled message text to confirm presence, registration and R$ 10 benefits fee
 */
export function buildWhatsAppMessage(params: {
  fullName: string;
  cpf: string;
  email?: string;
  phone?: string;
  rg?: string;
  distance: string;
  fee: number;
  registrationId: string;
  bibNumber?: number;
  isEarlyBird: boolean;
}): string {
  const formattedFee = `R$ ${params.fee.toFixed(2).replace('.', ',')}`;
  const bibText = params.bibNumber ? `#${params.bibNumber}` : `#${params.registrationId}`;

  const extraLines: string[] = [];
  if (params.email && params.email.trim()) {
    extraLines.push(`• *E-mail:* ${params.email.trim()}`);
  }
  if (params.phone && params.phone.trim()) {
    extraLines.push(`• *Telefone:* ${params.phone.trim()}`);
  }

  return `🏃 *INSCRIÇÃO ANTECIPADA - CORRE DE SEXTA (ECO ARENA)*

Olá, Equipe Eco Arena! Acabei de preencher minha inscrição antecipada pelo site para garantir os benefícios do evento:

👤 *Dados do Participante:*
• *Nome:* ${params.fullName.trim()}
• *CPF:* ${params.cpf}${extraLines.length > 0 ? '\n' + extraLines.join('\n') : ''}
• *Nº de Peito / Cód:* ${bibText} (${params.registrationId})
• *Percurso:* 5 Km • Sexta, 20/11 às 19h (Massagueira)
• *Taxa de Benefícios & Sorteios:* *${formattedFee}*

📎 Estou enviando esta mensagem pelo meu WhatsApp para confirmar minha inscrição e o pagamento via Pix dos ${formattedFee} (Monster Energy, 5 Sorteios e estrutura)!`;
}

/**
 * Generates WhatsApp URL from either a phone number or a direct WhatsApp URL
 */
export function generateWhatsAppLink(phoneOrUrl: string, text: string): string {
  const trimmed = (phoneOrUrl || '').trim();
  const encodedText = encodeURIComponent(text);

  if (/^https?:\/\//i.test(trimmed) || /^(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(trimmed)) {
    const fullUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    if (fullUrl.includes('chat.whatsapp.com')) {
      return fullUrl;
    }
    const separator = fullUrl.includes('?') ? '&' : '?';
    if (fullUrl.includes('text=')) {
      return fullUrl;
    }
    return `${fullUrl}${separator}text=${encodedText}`;
  }

  const cleanPhone = cleanWhatsAppNumber(trimmed);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
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
  const txid = (params.txid || 'ECOARENA').slice(0, 25);

  let payload = formatField('00', '01');
  payload += formatField('01', '12');

  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', cleanPixKey);
  payload += formatField('26', `${gui}${key}`);

  payload += formatField('52', '0000');
  payload += formatField('53', '986');
  if (params.amount > 0) {
    payload += formatField('54', formattedAmount);
  }
  payload += formatField('58', 'BR');
  payload += formatField('59', cleanName);
  payload += formatField('60', cleanCity);

  const txidField = formatField('05', txid);
  payload += formatField('62', txidField);

  payload += '6304';

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
