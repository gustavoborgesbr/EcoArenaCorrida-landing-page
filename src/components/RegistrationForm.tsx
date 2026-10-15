import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  CreditCard,
  Phone,
  FileText,
  CheckSquare,
  Square,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { EventConfig, ModalityDistance, Participant, ShirtSize } from '../types/index.ts';
import {
  formatCPF,
  formatPhone,
  formatRG,
  validateCPF,
  validatePhone,
  calculateRegistrationFee,
} from '../utils/validation.ts';

interface RegistrationFormProps {
  config: EventConfig;
  participants: Participant[];
  selectedDistance?: ModalityDistance;
  onRegistered: (participant: Participant) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  config,
  participants,
  selectedDistance = '5km',
  onRegistered,
}) => {
  const [fullName, setFullName] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [distance, setDistance] = useState<ModalityDistance>(selectedDistance);
  const [shirtSize, setShirtSize] = useState<ShirtSize>('M');
  const [confirmPresence, setConfirmPresence] = useState(true);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing tier
  const feeInfo = calculateRegistrationFee(
    participants.length,
    config.earlyBirdLimit,
    config.earlyBirdFee,
    config.standardFee
  );

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    if (errors.cpf) {
      setErrors((prev) => ({ ...prev, cpf: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleEmergencyPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setEmergencyPhone(formatted);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 4) {
      newErrors.fullName = 'Informe o nome completo do atleta (mínimo 4 caracteres).';
    }

    if (!rg.trim() || rg.trim().length < 4) {
      newErrors.rg = 'Informe o RG / Documento de Identidade.';
    }

    if (!cpf.trim()) {
      newErrors.cpf = 'Informe o número do CPF.';
    } else if (!validateCPF(cpf)) {
      newErrors.cpf = 'CPF inválido. Verifique os 11 dígitos.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Informe o número de WhatsApp para confirmação.';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Número de telefone/WhatsApp incompleto.';
    }

    if (!confirmPresence) {
      newErrors.confirmPresence = 'É obrigatório confirmar a sua presença no evento.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'Você precisa concordar com as regras e declaração de saúde.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#22c55e', '#10b981', '#3b82f6'],
      });
    } catch {
      // Ignore in headless
    }

    const nextBib = 100 + participants.length + 1;
    const newParticipant: Participant = {
      id: `EQ-${String(participants.length + 1).padStart(3, '0')}`,
      bibNumber: nextBib,
      fullName: fullName.trim(),
      rg: formatRG(rg),
      cpf: cpf.trim(),
      phone: phone.trim(),
      distance,
      shirtSize,
      confirmedPresence: confirmPresence,
      emergencyName: emergencyName.trim(),
      emergencyPhone: emergencyPhone.trim(),
      isEarlyBird: feeInfo.isEarlyBird,
      feeAmount: feeInfo.fee,
      status: 'pending_payment',
      registeredAt: new Date().toISOString(),
      paymentMethod: 'pix',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onRegistered(newParticipant);
    }, 400);
  };

  return (
    <section id="inscricao" className="py-16 sm:py-24 bg-slate-50 text-slate-900 relative border-b border-slate-200">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-bold uppercase tracking-wider mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  Inscrição Oficial
                </div>
                <h2 className="text-2xl sm:text-4xl font-black uppercase font-heading tracking-tight text-white">
                  FORMULÁRIO DE INSCRIÇÃO & CONFIRMAÇÃO
                </h2>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                  Preencha seus dados para garantir seu número de peito na Corrida Arena • 4 Anos de Eco Arena.
                </p>
              </div>

              {/* Fee Pill */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 text-center border border-white/15 shrink-0">
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-amber-200 block">
                  {feeInfo.isEarlyBird ? 'Taxa Promocional (100 Primeiros)' : 'Taxa de Inscrição'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-heading">
                  R$ {feeInfo.fee.toFixed(2).replace('.', ',')}
                </span>
                {feeInfo.isEarlyBird && (
                  <span className="block text-[10px] text-amber-200 mt-0.5 font-bold">
                    Restam {feeInfo.remainingEarlyBirdSpots} vagas a R$ 5,00!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8" noValidate>
            {/* Step 1: Personal info requested by user */}
            <div className="space-y-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                <User className="w-4 h-4 text-emerald-600" />
                1. Dados Pessoais do Atleta
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Nome Completo */}
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      placeholder="Ex: Carlos Eduardo de Oliveira"
                      className={`w-full bg-slate-50 border ${
                        errors.fullName ? 'border-red-500' : 'border-slate-300 focus:border-emerald-600'
                      } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-sm`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Identidade / RG */}
                <div>
                  <label htmlFor="rg" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Identidade / RG <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="rg"
                      type="text"
                      value={rg}
                      onChange={(e) => {
                        setRg(e.target.value);
                        if (errors.rg) setErrors((prev) => ({ ...prev, rg: '' }));
                      }}
                      placeholder="Ex: 12.345.678-9"
                      className={`w-full bg-slate-50 border ${
                        errors.rg ? 'border-red-500' : 'border-slate-300 focus:border-emerald-600'
                      } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-sm`}
                    />
                  </div>
                  {errors.rg && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.rg}
                    </p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <label htmlFor="cpf" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CPF <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="cpf"
                      type="text"
                      maxLength={14}
                      value={cpf}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      className={`w-full bg-slate-50 border ${
                        errors.cpf ? 'border-red-500' : 'border-slate-300 focus:border-emerald-600'
                      } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors font-mono shadow-sm`}
                    />
                  </div>
                  {errors.cpf && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.cpf}
                    </p>
                  )}
                </div>

                {/* WhatsApp / Celular */}
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp / Telefone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="phone"
                      type="text"
                      maxLength={15}
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(00) 00000-0000"
                      className={`w-full bg-slate-50 border ${
                        errors.phone ? 'border-red-500' : 'border-slate-300 focus:border-emerald-600'
                      } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors font-mono shadow-sm`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Você usará este mesmo número para enviar o comprovante do Pix para a Equarena.
                  </span>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Modality & Kit */}
            <div className="space-y-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                2. Modalidade & Kit da Prova
              </h3>

              {/* Distance Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Selecione sua Distância <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: '3km' as const, label: '3 km Caminhada', desc: 'Iniciantes & Família' },
                    { id: '5km' as const, label: '5 km Corrida', desc: 'Mais popular' },
                    { id: '10km' as const, label: '10 km Corrida', desc: 'Desafio Pro' },
                  ].map((item) => {
                    const isSelected = distance === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDistance(item.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-slate-900 shadow-sm ring-1 ring-emerald-600'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-slate-900">{item.label}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* T-shirt size */}
              <div>
                <label htmlFor="shirtSize" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tamanho da Camiseta Dry-Fit Oficial
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(['PP', 'P', 'M', 'G', 'GG', 'XG'] as ShirtSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setShirtSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        shirtSize === size
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label htmlFor="emergencyName" className="block text-xs font-semibold text-slate-600 mb-1">
                    Nome do Contato de Emergência (Opcional)
                  </label>
                  <input
                    id="emergencyName"
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Ex: Mãe, Cônjuge ou Amigo"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyPhone" className="block text-xs font-semibold text-slate-600 mb-1">
                    Telefone de Emergência (Opcional)
                  </label>
                  <input
                    id="emergencyPhone"
                    type="text"
                    maxLength={15}
                    value={emergencyPhone}
                    onChange={handleEmergencyPhoneChange}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Presence confirmation */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div
                onClick={() => {
                  setConfirmPresence(!confirmPresence);
                  if (errors.confirmPresence) {
                    setErrors((prev) => ({ ...prev, confirmPresence: '' }));
                  }
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  confirmPresence
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="mt-0.5 text-emerald-600 shrink-0">
                  {confirmPresence ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>SIM! Confirmo expressamente minha presença na Corrida Arena (4 Anos Eco Arena).</span>
                    <span className="text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      Obrigatório
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Ao confirmar, você garante seu número de peito, Monster Energy Drink na largada, show ao vivo com os cantores Joy Davidson e participação nos 5 sorteios imperdíveis de aniversário, com a taxa promocional de apenas R$ {feeInfo.fee.toFixed(2).replace('.', ',')} para os 100 primeiros atletas.
                  </p>
                </div>
              </div>
              {errors.confirmPresence && (
                <p className="text-xs text-red-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.confirmPresence}
                </p>
              )}

              {/* Health and Terms Checkbox */}
              <div
                onClick={() => {
                  setAgreeTerms(!agreeTerms);
                  if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                }}
                className="flex items-start gap-3 cursor-pointer text-xs text-slate-600 hover:text-slate-900 transition-colors pt-1"
              >
                <div className="mt-0.5 shrink-0">
                  {agreeTerms ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  Declaro estar em plenas condições físicas e de saúde para a prática esportiva na Corrida
                  Equarena e concordo com o regulamento do evento.
                </div>
              </div>
              {errors.agreeTerms && (
                <p className="text-xs text-red-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            {/* Submission Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processando inscrição...</span>
                ) : (
                  <>
                    <span>Prosseguir para Pagamento Pix & Envio no WhatsApp</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  Próxima etapa: Chave Pix da Equarena e botão para enviar comprovante via WhatsApp
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
