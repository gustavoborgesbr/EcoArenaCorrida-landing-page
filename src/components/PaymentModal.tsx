import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Share2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Smartphone,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { EventConfig, Participant } from '../types/index.ts';
import {
  buildWhatsAppMessage,
  generateWhatsAppLink,
  generatePixPayload,
} from '../utils/validation.ts';

interface PaymentModalProps {
  participant: Participant;
  config: EventConfig;
  onClose: () => void;
  onViewTicket: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  participant,
  config,
  onClose,
  onViewTicket,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(true);

  // Generate official EMVCo Pix BR Code payload with exact fee amount
  const pixPayload = generatePixPayload({
    pixKey: config.pixKey.replace(/\D/g, ''),
    merchantName: config.pixReceiverName || 'ECO ARENA',
    merchantCity: config.pixReceiverCity || 'SALVADOR',
    amount: participant.feeAmount,
    txid: participant.id.replace('-', ''),
  });

  const whatsAppMessage = buildWhatsAppMessage({
    fullName: participant.fullName,
    cpf: participant.cpf,
    rg: participant.rg,
    distance: participant.distance,
    fee: participant.feeAmount,
    registrationId: participant.id,
    isEarlyBird: participant.isEarlyBird,
  });

  const whatsAppLink = generateWhatsAppLink(config.whatsAppNumber, whatsAppMessage);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(config.pixKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 3000);
  };

  const handleOpenBankApp = (e: React.MouseEvent) => {
    // Also copy payload automatically as backup when user taps to open bank app
    navigator.clipboard.writeText(pixPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 3000);
  };

  // High quality QR Code image generated via reliable API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
    pixPayload
  )}`;

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 text-slate-900">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 p-6 sm:p-7 relative text-white">
          <button
            onClick={onClose}
            type="button"
            aria-label="Fechar janela"
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold w-fit mb-2 border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Inscrição Registrada • Pagamento Pix</span>
          </div>

          <h2 id="payment-modal-title" className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-tight text-white">
            PAGAMENTO PIX & CONFIRMAÇÃO
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Parabéns, <strong className="text-white">{participant.fullName}</strong>! Sua vaga está pré-reservada.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Highlighted Fee & Registration Status Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50/70 to-slate-50 rounded-2xl p-4 sm:p-5 border border-emerald-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-extrabold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  {participant.isEarlyBird ? 'Taxa Promocional (100 Primeiros)' : 'Taxa de Inscrição'}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-heading tracking-tight mt-0.5">
                  R$ {participant.feeAmount.toFixed(2).replace('.', ',')}
                </div>
                <span className="text-xs text-slate-600 font-medium block mt-0.5">
                  Valor exato configurado no QR Code e no link abaixo
                </span>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-emerald-200/60 pt-2 sm:pt-0">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                  Cód. Inscrição
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                  #{participant.id}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 mt-1">
                  {participant.distance} • Porta da Eco Arena
                </span>
              </div>
            </div>
          </div>

          {/* Central QR Code Display */}
          <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>QR Code Pix com Valor Exato (R$ {participant.feeAmount.toFixed(2).replace('.', ',')})</span>
            </div>

            {/* QR Code Container */}
            <div className="relative inline-block mx-auto bg-white p-4 rounded-2xl border-2 border-emerald-500/30 shadow-md group">
              {qrLoaded ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code Pix Oficial da Corrida Arena"
                  className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl object-contain mx-auto"
                  onError={() => setQrLoaded(false)}
                />
              ) : (
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl bg-slate-100 flex flex-col items-center justify-center p-4 text-slate-500 text-xs">
                  <QrCode className="w-12 h-12 text-slate-400 mb-2" />
                  <span>Use o botão Copia e Cola abaixo para pagar</span>
                </div>
              )}

              {/* Exact Value Floating Tag */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-600 text-white px-3.5 py-1 rounded-full text-xs font-black shadow-md border border-white">
                R$ {participant.feeAmount.toFixed(2).replace('.', ',')}
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-sm mx-auto pt-2 leading-relaxed">
              Abra o aplicativo do seu banco, escolha <strong>Pix</strong> e aponte a câmera para ler o código acima.
            </p>

            {/* Direct Links and Actions Right Below the QR Code */}
            <div className="pt-2 space-y-2.5 max-w-md mx-auto">
              {/* Button 1: Pix Copia e Cola */}
              <button
                type="button"
                onClick={handleCopyPayload}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer ${
                  copiedPayload
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                }`}
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Código Pix Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-700" />
                    <span>Copiar Código Pix Copia e Cola</span>
                  </>
                )}
              </button>

              {/* Button 2: Direct Banking App Link */}
              <a
                href={`pix:${pixPayload}`}
                onClick={handleOpenBankApp}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Pagar via Pix no Celular / Abrir App do Banco</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              {/* Quick Key Fallback Display */}
              <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-200 text-left text-xs">
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Chave Pix (Telefone / WhatsApp):</span>
                  <span className="font-mono font-bold text-slate-800">{config.pixKey}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedKey ? 'Copiada!' : 'Copiar Chave'}
                </button>
              </div>
            </div>
          </div>

          {/* Primary CTA: Enviar Comprovante no WhatsApp da Eco Arena */}
          <div className="space-y-3 pt-1">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer text-center"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Enviar Comprovante no WhatsApp da Eco Arena</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Etapa importante:</strong> Após pagar o Pix de R$ {participant.feeAmount.toFixed(2).replace('.', ',')}, clique no botão acima para enviar o print no WhatsApp. Nossa coordenação valida seu pagamento e libera seu número de peito na hora!
              </p>
            </div>
          </div>

          {/* Secondary Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onViewTicket}
              className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Ver Comprovante Digital</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
