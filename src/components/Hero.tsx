import React from 'react';
import {
  Calendar,
  MapPin,
  ArrowDown,
  Flame,
  Music,
  Gift,
  MessageCircle,
  HeartHandshake,
} from 'lucide-react';
import { EventConfig, Participant } from '../types/index.ts';
import { calculateRegistrationFee } from '../utils/validation.ts';

interface HeroProps {
  config: EventConfig;
  participants: Participant[];
  onScrollToForm: () => void;
  onScrollToDetails: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  participants,
  onScrollToForm,
  onScrollToDetails,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const activeCount = participants.filter((p) => p.status !== 'cancelled').length;
  const feeInfo = calculateRegistrationFee(
    activeCount,
    config.earlyBirdLimit,
    config.earlyBirdFee || 10,
    config.standardFee || 10
  );

  const [isPosterExpanded, setIsPosterExpanded] = React.useState(false);
  const posterSrc = !imgError ? '/assets/aistudio/image_f7969708.png' : '/assets/foto2.jpg';

  return (
    <section className="relative w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 pt-4 pb-6 sm:pt-8 sm:pb-12 border-b border-slate-200/70">
      <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center min-w-0">
          {/* Expanded Poster Card - Shows complete uncropped poster at full container width */}
          <div className="lg:col-span-6 order-1 lg:order-2 min-w-0 w-full">
            <div className="relative mx-auto w-full">
              <div
                onClick={() => setIsPosterExpanded(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setIsPosterExpanded(true);
                }}
                aria-label="Ampliar cartaz oficial do Corre de Sexta"
                className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-950 shadow-md cursor-zoom-in group"
              >
                <img
                  src={posterSrc}
                  alt="Corre de Sexta - Jó & Deyvisson + Paredão Confirmado - 20/11 às 19h"
                  className="w-full h-auto max-h-[560px] sm:max-h-[640px] object-contain mx-auto block transition-transform duration-300 group-hover:scale-[1.01]"
                  onError={() => setImgError(true)}
                />

                {/* Soft Top Floating Info */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-emerald-300">
                    <span>Percurso 5 Km</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600/95 text-white text-[11px] font-semibold shadow-xs">
                    20/11 • 19h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Soft Typography & Compact List Cards */}
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-3.5 text-left min-w-0 w-full">
            {/* Balanced, Non-Aggressive Title & Description */}
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug text-slate-900 font-heading break-words">
                Corre de Sexta na <span className="text-emerald-600">Eco Arena</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                Prepare o tênis para celebrar os 4 anos da Eco Arena em um percurso leve de{' '}
                <strong className="text-slate-800">5 Km</strong> com música ao vivo, amigos e muita energia boa.
              </p>
            </div>

            {/* Compact List Cards (100% fluid for narrow mobile screens) */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 shadow-2xs overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs min-w-0">
                <div className="flex items-center gap-2 text-slate-600 min-w-0">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Data e horário</span>
                </div>
                <strong className="text-slate-900 font-semibold text-right shrink-0">20/11 às 19h</strong>
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs min-w-0">
                <div className="flex items-center gap-2 text-slate-600 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Local e percurso</span>
                </div>
                <strong className="text-slate-900 font-semibold text-right shrink-0">Massagueira • 5 Km</strong>
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs min-w-0">
                <div className="flex items-center gap-2 text-slate-600 min-w-0">
                  <Music className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">Atração</span>
                </div>
                <strong className="text-slate-900 font-semibold text-right truncate">Jó & Deyvisson + Paredão</strong>
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs min-w-0">
                <div className="flex items-center gap-2 text-slate-600 min-w-0">
                  <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">Benefícios</span>
                </div>
                <strong className="text-slate-900 font-semibold text-right truncate">Monster + 5 Sorteios</strong>
              </div>
            </div>

            {/* Friendly & Transparent R$ 10 Benefits Explanation */}
            <div className="w-full p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 min-w-0">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Inscrição Antecipada com Benefícios</span>
                </span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0">
                  R$ {feeInfo.fee.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                A corrida na rua é aberta para comemorar com a galera! A taxa simbólica de{' '}
                <strong className="text-slate-800">R$ 10,00 na inscrição antecipada</strong> serve para custear os{' '}
                <strong className="text-slate-800">benefícios do evento</strong> (Monster Energy, participação nos 5 sorteios, hidratação e número de peito).
              </p>
            </div>

            {/* Smooth Mobile Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0.5 w-full">
              <button
                onClick={onScrollToForm}
                type="button"
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs active:scale-[0.99] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">Inscrever-se Antecipadamente (R$ 10)</span>
                <ArrowDown className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={onScrollToDetails}
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 transition-colors cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Ver Benefícios e Sorteios</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Poster Lightbox Modal */}
      {isPosterExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cartaz Oficial Corre de Sexta Ampliado"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xs"
        >
          <div className="relative max-w-2xl w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsPosterExpanded(false)}
              aria-label="Fechar cartaz ampliado"
              className="self-end mb-2 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/20"
            >
              <span>Fechar ✕</span>
            </button>
            <img
              src={posterSrc}
              alt="Cartaz Oficial Corre de Sexta - 20/11 às 19h"
              className="w-full max-h-[82vh] object-contain rounded-2xl border border-white/15 shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

