import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Trophy,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { EventConfig, Participant } from '../types/index.ts';
import { buildWhatsAppMessage, generateWhatsAppLink } from '../utils/validation.ts';

interface TicketModalProps {
  participant: Participant;
  config: EventConfig;
  onClose: () => void;
}

const VIEWED_TICKETS_STORAGE_KEY = 'ecoarena_viewed_tickets_v1';

const CONFETTI_COLORS = [
  '#10b981', // emerald-500
  '#34d399', // emerald-400
  '#059669', // emerald-600
  '#fbbf24', // amber-400
  '#a7f3d0', // emerald-200
];

export const TicketModal: React.FC<TicketModalProps> = ({
  participant,
  config,
  onClose,
}) => {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [showConfettiParticles, setShowConfettiParticles] = useState(false);

  const feeAmount = participant.feeAmount > 0 ? participant.feeAmount : 10;

  // Deterministic confetti particles for motion/react animation inside the modal
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const spreadX = Math.cos(angle) * (60 + (i % 5) * 28);
        const fallY = 120 + (i % 6) * 35;
        const rotate = (i % 2 === 0 ? 1 : -1) * (180 + (i * 37) % 180);
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const delay = (i % 7) * 0.03;
        const isCircle = i % 3 === 0;
        return { id: i, spreadX, fallY, rotate, color, delay, isCircle };
      }),
    []
  );

  useEffect(() => {
    let firstTime = true;
    try {
      const raw = localStorage.getItem(VIEWED_TICKETS_STORAGE_KEY);
      const viewedIds: string[] = raw ? JSON.parse(raw) : [];
      if (viewedIds.includes(participant.id)) {
        firstTime = false;
      } else {
        const updated = [...viewedIds, participant.id];
        localStorage.setItem(VIEWED_TICKETS_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      firstTime = true;
    }

    if (firstTime) {
      setIsFirstOpen(true);
      setShowConfettiParticles(true);

      try {
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.6 },
          colors: CONFETTI_COLORS,
        });
      } catch {
        // Fallback to in-modal motion/react particles
      }

      const timer = setTimeout(() => {
        setShowConfettiParticles(false);
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [participant.id]);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-6 text-slate-800"
      >
        {/* Framer-Motion Confetti Burst Overlay (First Open Only) */}
        <AnimatePresence>
          {showConfettiParticles && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden flex items-start justify-center"
            >
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, x: 0, y: 24, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    x: p.spreadX,
                    y: p.fallY,
                    scale: [0, 1.15, 0.85],
                    rotate: p.rotate,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.9,
                    delay: p.delay,
                    ease: 'easeOut',
                  }}
                  style={{ backgroundColor: p.color }}
                  className={`absolute top-6 ${
                    p.isCircle ? 'w-2.5 h-2.5 rounded-full' : 'w-3 h-2 rounded-xs'
                  } shadow-2xs`}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-emerald-600 px-4 py-4 flex items-center justify-between text-white relative z-10">
          <div className="flex items-center gap-2.5">
            <motion.div
              initial={isFirstOpen ? { scale: 0, rotate: -25 } : false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.1 }}
              className="p-1.5 rounded-xl bg-white/15 border border-white/20"
            >
              <Trophy className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-[10px] font-medium text-emerald-100 block">
                Comprovante de Inscrição Antecipada
              </span>
              <h2 id="ticket-modal-title" className="text-base sm:text-lg font-bold tracking-tight text-white">
                Corre de Sexta • Eco Arena
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar comprovante"
            className="p-1.5 rounded-full bg-black/15 hover:bg-black/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bib Ticket Card */}
        <div className="p-4 sm:p-5 space-y-4 relative z-10">
          {/* First-Time Celebration Banner */}
          <AnimatePresence>
            {isFirstOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.12 }}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.25, 1] }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                  className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-emerald-950 leading-tight">
                    Inscrição gerada com sucesso!
                  </p>
                  <p className="text-[11px] text-emerald-700 leading-snug">
                    Seu número de peito oficial já está reservado.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold">Número de Peito</span>
                <motion.div
                  initial={isFirstOpen ? { scale: 0.7, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 18, delay: 0.18 }}
                  className="text-3xl font-extrabold font-heading text-emerald-600 origin-left"
                >
                  #{participant.bibNumber || participant.id}
                </motion.div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-semibold block">Taxa de Benefícios</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                  R$ {feeAmount.toFixed(2).replace('.', ',')} • 5 Km
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <span className="text-slate-500 font-medium block text-[11px]">Participante</span>
                <strong className="text-slate-900 text-sm block mt-0.5 truncate">{participant.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[11px]">CPF</span>
                <span className="text-slate-800 font-mono text-xs block mt-0.5">{participant.cpf}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[11px]">Contato</span>
                <span className="text-emerald-700 font-medium text-xs block mt-0.5 truncate">
                  {participant.email || participant.phone || 'Via WhatsApp'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 space-y-1 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold">Sexta-feira, 20/11 às 19h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Porta da Eco Arena - Massagueira</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              {participant.status === 'confirmed' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Benefícios Confirmados
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px] border border-amber-200">
                  <Clock className="w-3 h-3" />
                  Aguardando Confirmação no WhatsApp
                </span>
              )}
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 space-y-2.5">
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Envie seu comprovante de R$ {feeAmount.toFixed(2).replace('.', ',')} no WhatsApp da Eco Arena para validar seus benefícios (Monster Energy, 5 Sorteios e Número de Peito).
            </p>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Confirmar no WhatsApp da Eco Arena</span>
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Salvar / Imprimir</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

