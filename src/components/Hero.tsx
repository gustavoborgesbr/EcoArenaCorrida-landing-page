import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import { EventConfig, Participant } from '../types/index.ts';

interface HeroProps {
  config: EventConfig;
  participants: Participant[];
  onScrollToForm: () => void;
  onScrollToDetails: () => void;
}

const CheckeredFlagIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    aria-hidden="true"
  >
    <rect x="3" y="2" width="2" height="20" rx="1" fill="#0f172a" />
    <circle cx="4" cy="2" r="1.5" fill="#10b981" />
    <path
      d="M5 3.5H20C20.5523 3.5 21 3.94772 21 4.5V13.5C21 14.0523 20.5523 14.5 20 14.5H5V3.5Z"
      fill="#0f172a"
    />
    <rect x="5" y="3.5" width="3.75" height="2.75" fill="#10b981" />
    <rect x="12.5" y="3.5" width="3.75" height="2.75" fill="#10b981" />
    <rect x="8.75" y="6.25" width="3.75" height="2.75" fill="#10b981" />
    <rect x="16.25" y="6.25" width="3.75" height="2.75" fill="#10b981" />
    <rect x="5" y="9" width="3.75" height="2.75" fill="#10b981" />
    <rect x="12.5" y="9" width="3.75" height="2.75" fill="#10b981" />
    <rect x="8.75" y="11.75" width="3.75" height="2.75" fill="#10b981" />
    <rect x="16.25" y="11.75" width="3.75" height="2.75" fill="#10b981" />
  </svg>
);

export const Hero: React.FC<HeroProps> = ({
  config,
  onScrollToForm,
  onScrollToDetails,
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white text-slate-900 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/90">
      {/* Decorative ambient background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-teal-300/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-green-300/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Celebration Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300/80 text-emerald-900 text-xs sm:text-sm font-bold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>4 ANOS DE ECO ARENA • FESTA NA PISTA</span>
            </div>

            {/* Title & Subtitle Container */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-black uppercase tracking-tight leading-tight text-slate-950 font-heading flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-slate-900 inline-flex items-center gap-2.5">
                  <CheckeredFlagIcon />
                  <span>CORRIDA ARENA:</span>
                </span>
                <span className="text-emerald-700">4 ANOS DE ECO ARENA</span>
                <span className="text-slate-900 inline-flex items-center">
                  <CheckeredFlagIcon />
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-normal leading-relaxed max-w-2xl">
                Prepare o tênis, porque a festa é na pista! A Corrida Arena chegou para celebrar os 4 anos da Eco Arena em grande estilo, e você é o nosso convidado especial!
              </p>
            </div>

            {/* Event Key Meta Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-1 max-w-xl">
              <div className="bg-white/95 border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-3 sm:p-4 text-left transition-all shadow-xs hover:shadow-md">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-1">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Data</span>
                </div>
                <div className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900">
                  {new Date(config.eventDate + 'T12:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="bg-white/95 border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-3 sm:p-4 text-left transition-all shadow-xs hover:shadow-md">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Concentração</span>
                </div>
                <div className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900">
                  7h da noite (19h)
                </div>
              </div>

              <div className="bg-white/95 border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-3 sm:p-4 text-left transition-all shadow-xs hover:shadow-md">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Local</span>
                </div>
                <div className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 truncate" title="Porta da Eco Arena">
                  Porta da Eco Arena
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onScrollToForm}
                type="button"
                className="group flex items-center justify-center gap-3 px-7 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Inscrever-se por R$ {config.earlyBirdFee.toFixed(2).replace('.', ',')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onScrollToDetails}
                type="button"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-colors shadow-xs"
              >
                <span>Ver Atrações & Sorteios</span>
              </button>
            </div>

            {/* Event Highlights & Context Cards (Replaces old generic trust points) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs">
                <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 text-sm">
                  🔥
                </span>
                <span><strong>Monster Energy Drink</strong> logo no início da corrida!</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs">
                <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-sm">
                  🎤
                </span>
                <span>Cantores <strong>Joy Davidson</strong> puxando o som na pista</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs">
                <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-sm">
                  🎁
                </span>
                <span><strong>5 Sorteios Imperdíveis</strong> (Treinos, Whey, Creatina)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-sm">
                  ⚠️
                </span>
                <span>Taxa de apenas <strong>R$ 5,00</strong> (100 primeiras vagas!)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Vivid, High-Impact Photo Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Soft decorative aura behind image */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-400/30 via-teal-300/25 to-green-400/30 rounded-3xl blur-xl -z-10 opacity-75" />

              {/* Main Photo Card */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 bg-white shadow-2xl shadow-emerald-950/15 group">
                <img
                  src={!imgError ? '/assets/foto2.jpg' : '/assets/runner.jpg'}
                  alt="Galera da Eco Arena reunida"
                  className="w-full h-[340px] sm:h-[410px] lg:h-[470px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  onError={() => setImgError(true)}
                />

                {/* Subtle gradient sheen at bottom for badge contrast */}
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent pointer-events-none" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Porta da Eco Arena • 7h da noite
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
                    4 Anos
                  </span>
                </div>

                {/* Bottom Celebration Caption */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/10 text-left">
                  <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    Monster Energy + 🎤 Joy Davidson ao vivo!
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    É esporte, é festa, é comemoração! Chama a galera, garanta sua vaga entre os 100 primeiros e venha viver essa noite!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
