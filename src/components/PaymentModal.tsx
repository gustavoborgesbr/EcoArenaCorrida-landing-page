import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Share2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
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
  const [showQrCode, setShowQrCode] = useState(true);

  const pixPayload = generatePixPayload({
    pixKey: config.pixKey.replace(/\D/g, ''),
    merchantName: config.pixReceiverName || 'EQUARENA',
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
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    pixPayload
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 p-6 sm:p-7 relative text-white">
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold w-fit mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            Inscrição Registrada • Etapa Final
          </div>

          <h2 id="payment-modal-title" className="text-2xl sm:text-3xl font-black font-heading uppercase text-white">
            PAGAMENTO PIX & CONFIRMAÇÃO
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Parabéns, <strong className="text-white">{participant.fullName}</strong>! Sua vaga está pré-reservada.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">
                Taxa de Confirmação {participant.isEarlyBird && '(100 Primeiros)'}
              </span>
              <div className="text-2xl font-black text-emerald-600 font-heading">
                R$ {participant.feeAmount.toFixed(2).replace('.', ',')}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">
                Cód. da Inscrição
              </span>
              <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                #{participant.id}
              </span>
            </div>
          </div>

          {/* Pix Instructions Alert */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Instruções de Pagamento e Envio</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              1. Pague a taxa de <strong>R$ {participant.feeAmount.toFixed(2).replace('.', ',')}</strong> via Pix.<br />
              2. <strong>Envie o comprovante para o mesmo número</strong>, que é o WhatsApp oficial da Equarena.<br />
              3. Nossa equipe valida na hora e envia seu comprovante definitivo com o número de peito!
            </p>
          </div>

          {/* Pix Key and Actions */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Chave Pix (WhatsApp da Equarena)
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Favorecido: {config.pixReceiverName}
                </span>
              </div>

              {/* Key display with copy button */}
              <div className="flex items-center justify-between gap-3 bg-white px-3.5 py-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="font-mono font-bold text-sm sm:text-base text-emerald-700 select-all truncate">
                  {config.pixKey}
                </span>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all shrink-0 cursor-pointer"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Chave</span>
                    </>
                  )}
                </button>
              </div>

              {/* QR Code toggle and view */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>{showQrCode ? 'Ocultar QR Code Pix' : 'Exibir QR Code Pix'}</span>
                </button>

                {showQrCode && (
                  <div className="mt-3 p-4 bg-white rounded-2xl flex flex-col items-center justify-center gap-2.5 max-w-xs mx-auto border border-slate-200 shadow-md">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code Pix Equarena"
                      className="w-48 h-48 rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[11px] text-slate-700 font-medium text-center">
                      Abra o app do seu banco e aponte a câmera para pagar R$ {participant.feeAmount.toFixed(2).replace('.', ',')}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPayload}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 border-t border-slate-100 pt-2 w-full justify-center cursor-pointer"
                    >
                      {copiedPayload ? 'Código Copiado!' : 'Copiar Código Pix Copia e Cola'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="space-y-3">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl font-black text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer text-center"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Enviar Comprovante no WhatsApp da Equarena</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </a>

            <p className="text-[11px] text-slate-500 text-center">
              Ao clicar, você será direcionado ao WhatsApp da Equarena ({config.whatsAppNumber}) com
              sua mensagem pré-preenchida. Basta anexar o print do comprovante!
            </p>
          </div>

          {/* Secondary Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onViewTicket}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
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
