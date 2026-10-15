import React from 'react';
import {
  X,
  Trophy,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
} from 'lucide-react';
import { EventConfig, Participant } from '../types/index.ts';
import { buildWhatsAppMessage, generateWhatsAppLink } from '../utils/validation.ts';

interface TicketModalProps {
  participant: Participant;
  config: EventConfig;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  participant,
  config,
  onClose,
}) => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-white" />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-200 block">
                Comprovante Oficial de Inscrição
              </span>
              <h2 id="ticket-modal-title" className="text-xl sm:text-2xl font-black font-heading tracking-tight uppercase text-white">
                CORRIDA EQUARENA
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar comprovante"
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bib Ticket Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6 relative overflow-hidden space-y-5 shadow-sm">
            {/* Athletic Ribbons */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold">Número de Peito</span>
                <div className="text-4xl sm:text-5xl font-black font-heading text-emerald-600 tracking-wider">
                  #{participant.bibNumber || participant.id}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 uppercase font-bold block">Modalidade</span>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm border border-emerald-200">
                  {participant.distance}
                </span>
              </div>
            </div>

            {/* Athlete Info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase font-bold block">Nome do Atleta</span>
                <strong className="text-slate-900 text-sm block mt-0.5 truncate">{participant.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-bold block">CPF</span>
                <span className="text-slate-800 font-mono text-sm block mt-0.5">{participant.cpf}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-bold block">Identidade / RG</span>
                <span className="text-slate-800 font-mono text-sm block mt-0.5">{participant.rg}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-bold block">Tamanho da Camiseta</span>
                <span className="text-slate-800 font-bold text-sm block mt-0.5">{participant.shirtSize}</span>
              </div>
            </div>

            {/* Event Meta */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-1.5 text-xs text-slate-700 shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">
                  {new Date(config.eventDate + 'T12:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  às {config.eventTime}h
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="truncate font-medium">{config.locationName}</span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">Status da Vaga:</span>
              {participant.status === 'confirmed' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Presença & Pagamento Confirmados
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200">
                  <Clock className="w-3.5 h-3.5" />
                  Aguardando envio do comprovante Pix
                </span>
              )}
            </div>
          </div>

          {participant.status !== 'confirmed' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <p className="text-xs text-slate-600">
                Ainda não enviou o comprovante de <strong>R$ {participant.feeAmount.toFixed(2).replace('.', ',')}</strong>?
                Envie agora para o WhatsApp da Equarena para liberar sua vaga definitiva!
              </p>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Enviar Comprovante pelo WhatsApp</span>
              </a>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer border border-slate-300"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
