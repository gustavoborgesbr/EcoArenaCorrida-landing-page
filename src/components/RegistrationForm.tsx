import React, { useState, useRef } from 'react';
import {
  User,
  CreditCard,
  Phone,
  Mail,
  CheckSquare,
  Square,
  AlertCircle,
  ShieldCheck,
  MessageCircle,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { EventConfig, ModalityDistance, Participant } from '../types/index.ts';
import {
  calculateRegistrationFee,
  formatCPF,
  formatPhone,
  validateCPF,
  validatePhone,
  buildWhatsAppMessage,
  generateWhatsAppLink,
} from '../utils/validation.ts';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  config: EventConfig;
  participants: Participant[];
  selectedDistance?: ModalityDistance;
  onRegistered: (participant: Participant, whatsAppUrl: string) => void;
  onFormStart?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isOpen,
  onClose,
  config,
  participants,
  onRegistered,
  onFormStart,
}) => {
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPresence, setConfirmPresence] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasStartedRef = useRef(false);

  const activeCount = participants.filter((p) => p.status !== 'cancelled').length;
  const feeInfo = calculateRegistrationFee(
    activeCount,
    config.earlyBirdLimit,
    config.earlyBirdFee || 10,
    config.standardFee || 10
  );

  const handleFieldFocus = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      if (onFormStart) onFormStart();
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
    if (errors.cpf) setErrors((prev) => ({ ...prev, cpf: '' }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Informe seu nome e sobrenome.';
    }

    if (!validateCPF(cpf)) {
      newErrors.cpf = 'CPF inválido. Confira os 11 dígitos.';
    } else {
      const cleanInputCpf = cpf.replace(/\D/g, '');
      const alreadyExists = participants.some(
        (p) => p.cpf.replace(/\D/g, '') === cleanInputCpf && p.status !== 'cancelled'
      );
      if (alreadyExists) {
        newErrors.cpf = 'Este CPF já possui inscrição! Use "Consultar" no topo.';
      }
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Digite um e-mail válido ou deixe em branco.';
    }

    if (phone.trim() && !validatePhone(phone)) {
      newErrors.phone = 'Digite o telefone com DDD ou deixe em branco.';
    }

    if (!confirmPresence) {
      newErrors.confirmPresence = 'Marque a confirmação para reservar seus benefícios.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const nextNumber = participants.length + 1;
    const id = `EQ-${String(nextNumber).padStart(3, '0')}`;
    const bibNumber = 100 + nextNumber;
    const fee = feeInfo.fee > 0 ? feeInfo.fee : 10;

    const newParticipant: Participant = {
      id,
      bibNumber,
      fullName: fullName.trim(),
      rg: 'ISENTO',
      cpf,
      email: email.trim() || undefined,
      phone: phone.trim() || 'Via WhatsApp',
      distance: '5km',
      shirtSize: 'M',
      confirmedPresence: confirmPresence,
      emergencyName: '',
      emergencyPhone: '',
      isEarlyBird: feeInfo.isEarlyBird,
      feeAmount: fee,
      status: 'pending_payment',
      registeredAt: new Date().toISOString(),
      paymentMethod: 'pix',
      whatsappRedirected: true,
    };

    const whatsAppMessage = buildWhatsAppMessage({
      fullName: newParticipant.fullName,
      cpf: newParticipant.cpf,
      email: email.trim(),
      phone: phone.trim(),
      distance: '5 Km',
      fee: newParticipant.feeAmount,
      registrationId: newParticipant.id,
      bibNumber: newParticipant.bibNumber,
      isEarlyBird: newParticipant.isEarlyBird,
    });

    const whatsAppUrl = generateWhatsAppLink(config.whatsAppNumber, whatsAppMessage);

    setIsSubmitting(false);
    onRegistered(newParticipant, whatsAppUrl);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="registration-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
        >
          {/* Modal Card - Clicking outside on backdrop does NOT close; only the X button closes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto text-slate-800"
          >
            {/* Modal Header with X close button */}
            <div className="bg-emerald-600 px-4 py-4 text-white flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-emerald-100 block truncate">
                  Corre de Sexta • 20/11 às 19h • 5 Km
                </span>
                <h2
                  id="registration-modal-title"
                  className="text-base sm:text-lg font-bold tracking-tight text-white truncate"
                >
                  Inscrição Antecipada (R$ {(feeInfo.fee || 10).toFixed(2).replace('.', ',')})
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar formulário de inscrição"
                title="Fechar"
                className="p-2 rounded-xl bg-black/15 hover:bg-black/30 text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[82vh] overflow-y-auto" noValidate>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                Informe apenas seu <strong className="text-slate-800">Nome e CPF</strong> para gerar o{' '}
                <strong className="text-slate-800">Pix de R$ 10,00</strong> e confirmar direto pelo seu{' '}
                <strong className="text-slate-800">WhatsApp</strong>.
              </p>

              {/* 1. Nome Completo (Obrigatório) */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    onFocus={handleFieldFocus}
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="Ex: Lucas Fernandes"
                    className={`w-full bg-slate-50 border ${
                      errors.fullName ? 'border-red-400' : 'border-slate-200 focus:border-emerald-600'
                    } rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* 2. CPF (Obrigatório) */}
              <div>
                <label htmlFor="cpf" className="block text-xs font-semibold text-slate-700 mb-1">
                  CPF <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="cpf"
                    type="tel"
                    inputMode="numeric"
                    maxLength={14}
                    onFocus={handleFieldFocus}
                    value={cpf}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    className={`w-full bg-slate-50 border ${
                      errors.cpf ? 'border-red-400' : 'border-slate-200 focus:border-emerald-600'
                    } rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors font-mono`}
                  />
                </div>
                {errors.cpf && (
                  <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.cpf}
                  </p>
                )}
              </div>

              {/* 3. E-mail (Opcional) & 4. Telefone (Opcional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                      E-mail
                    </label>
                    <span className="text-[10px] font-medium text-slate-400">Opcional</span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      onFocus={handleFieldFocus}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="seuemail@exemplo.com"
                      className={`w-full bg-slate-50 border ${
                        errors.email ? 'border-red-400' : 'border-slate-200 focus:border-emerald-600'
                      } rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                      Telefone
                    </label>
                    <span className="text-[10px] font-medium text-slate-400">Opcional</span>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={15}
                      onFocus={handleFieldFocus}
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(82) 99999-0000"
                      className={`w-full bg-slate-50 border ${
                        errors.phone ? 'border-red-400' : 'border-slate-200 focus:border-emerald-600'
                      } rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors font-mono`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Presence & Benefits Checkbox */}
              <div>
                <div
                  onClick={() => {
                    setConfirmPresence(!confirmPresence);
                    if (errors.confirmPresence) {
                      setErrors((prev) => ({ ...prev, confirmPresence: '' }));
                    }
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    confirmPresence
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="mt-0.5 text-emerald-600 shrink-0">
                    {confirmPresence ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-800 block">
                      Quero garantir minha inscrição antecipada (R$ 10,00)
                    </span>
                    Inclui Monster Energy, participação nos 5 sorteios, hidratação e número de peito.
                  </div>
                </div>
                {errors.confirmPresence && (
                  <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.confirmPresence}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Gerando Inscrição...'
                      : 'Continuar para Pix (R$ 10) e WhatsApp'}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-slate-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Para fechar esta janela, toque no botão X no canto superior direito
                  </span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

