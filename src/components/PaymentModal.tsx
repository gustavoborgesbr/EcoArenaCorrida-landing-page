import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  Share2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Smartphone,
  ArrowRight,
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
  onWhatsAppClick?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  participant,
  config,
  onClose,
  onViewTicket,
  onWhatsAppClick,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(true);

  const feeAmount = participant.feeAmount > 0 ? participant.feeAmount : 10.0;

  const pixPayload = generatePixPayload({
    pixKey: config.pixKey.replace(/\D/g, ''),
    merchantName: config.pixReceiverName || 'ECO ARENA',
    merchantCity: config.pixReceiverCity || 'MARECHAL DEODORO',
    amount: feeAmount,
    txid: participant.id.replace('-', ''),
  });

  const whatsAppMessage = buildWhatsAppMessage({
    fullName: participant.fullName,
    cpf: participant.cpf,
    email: participant.email,
    phone: participant.phone !== 'Via WhatsApp' ? participant.phone : undefined,
    distance: '5 Km',
    fee: feeAmount,
    registrationId: participant.id,
    bibNumber: participant.bibNumber,
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

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    pixPayload
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 max-h-[92vh] flex flex-col"
      >
        {/* Soft Top Header */}
        <div className="bg-emerald-600 px-4 py-4 relative text-white shrink-0">
          <button
            onClick={onClose}
            type="button"
            aria-label="Fechar janela"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/15 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1 text-emerald-100 text-[11px] font-medium mb-0.5">
            <Sparkles className="w-3 h-3 text-emerald-200" />
            <span>Inscrição #{participant.bibNumber || participant.id} Registrada</span>
          </div>

          <h2 id="payment-modal-title" className="text-base sm:text-lg font-bold tracking-tight text-white">
            Confirmação via WhatsApp e Pix
          </h2>
          <p className="text-[11px] text-emerald-100 mt-0.5">
            {participant.fullName} • Taxa de Benefícios: <strong>R$ {feeAmount.toFixed(2).replace('.', ',')}</strong>
          </p>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto">
          {/* Primary Action 1: Direct WhatsApp Button */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>1. Confirmar no WhatsApp da Eco Arena</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                R$ {feeAmount.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Seus dados já foram preenchidos na mensagem! Toque abaixo para enviar sua confirmação e o comprovante no WhatsApp:
            </p>

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onWhatsAppClick) onWhatsAppClick();
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Abrir Conversa no WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Primary Action 2: QR Code Pix & Copia e Cola */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                2. Pagamento Pix dos Benefícios (R$ {feeAmount.toFixed(2).replace('.', ',')})
              </span>
            </div>

            <div className="relative inline-block mx-auto bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
              {qrLoaded ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code Pix Eco Arena"
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg object-contain mx-auto"
                  onError={() => setQrLoaded(false)}
                />
              ) : (
                <div className="w-36 h-36 rounded-lg bg-slate-100 flex flex-col items-center justify-center p-3 text-slate-500 text-xs">
                  <QrCode className="w-8 h-8 text-slate-400 mb-1.5" />
                  <span>Código: #{participant.id}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-0.5">
              <button
                type="button"
                onClick={handleCopyPayload}
                className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  copiedPayload
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Código Pix Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copiar Pix Copia e Cola (R$ {feeAmount.toFixed(2).replace('.', ',')})</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`pix:${pixPayload}`}
                  onClick={handleCopyPayload}
                  className="py-2 px-3 rounded-xl text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>App do Banco</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="py-2 px-3 rounded-xl text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{copiedKey ? 'Chave Copiada!' : 'Chave Telefone'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Voucher & Close */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={onViewTicket}
              className="flex-1 py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ver Comprovante (#{participant.bibNumber})</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-3.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
