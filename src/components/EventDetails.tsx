import React from 'react';
import {
  MapPin,
  Clock,
  Flame,
  Music,
  Gift,
  CheckCircle2,
  MessageCircle,
  HeartHandshake,
} from 'lucide-react';
import { EventConfig, ModalityDistance } from '../types/index.ts';

interface EventDetailsProps {
  config: EventConfig;
  onSelectDistance?: (distance: ModalityDistance) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ config, onSelectDistance }) => {
  const feeAmount = config.earlyBirdFee || 10;

  const prizes = [
    {
      badge: '1º Sorteio',
      title: '3 Meses de Treino na Eco Arena',
      bonus: 'Avaliação física completa com plano exclusivo',
    },
    {
      badge: '2º Sorteio',
      title: '1 Whey + 1 Mês de Treino',
      bonus: 'Avaliação física completa na Eco Arena',
    },
    {
      badge: '3º Sorteio',
      title: '1 Creatina + Copo Exclusivo',
      bonus: 'Avaliação física na Eco Arena',
    },
    {
      badge: '4º Sorteio',
      title: '1 Mês de Aula Coletiva',
      bonus: 'Avaliação física na Eco Arena',
    },
    {
      badge: '5º Sorteio',
      title: '30 Dias de Treino Completo',
      bonus: 'Academia + Aulas Coletivas + Avaliação física',
    },
  ];

  return (
    <section id="detalhes" className="w-full max-w-full overflow-x-hidden py-6 sm:py-8 bg-slate-50 text-slate-800 relative">
      <div className="w-full max-w-lg sm:max-w-4xl mx-auto px-3.5 sm:px-6 space-y-5 min-w-0">
        {/* Section Title */}
        <div className="space-y-1 text-left">
          <p className="text-xs font-semibold text-emerald-700">
            Benefícios & Estrutura do Evento
          </p>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
            O que está incluso na inscrição de R$ {feeAmount.toFixed(2).replace('.', ',')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            A corrida na rua é livre para comemorar com a galera. A taxa simbólica de{' '}
            <strong className="text-slate-800">R$ {feeAmount.toFixed(2).replace('.', ',')}</strong> garante seus benefícios exclusivos e participação nos sorteios:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* Left: Benefits Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100">
            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-xs leading-relaxed">
                <h3 className="font-bold text-slate-900">Monster Energy Drink na Largada</h3>
                <p className="text-slate-600">
                  Lata de energético garantida na concentração para começar os 5 Km.
                </p>
              </div>
            </div>

            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Music className="w-4 h-4" />
              </div>
              <div className="text-xs leading-relaxed">
                <h3 className="font-bold text-slate-900">Jó & Deyvisson + Paredão Confirmado</h3>
                <p className="text-slate-600">
                  Música ao vivo puxando o percurso de 5 Km na orla da Massagueira.
                </p>
              </div>
            </div>

            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="text-xs leading-relaxed">
                <h3 className="font-bold text-slate-900">Número de Peito & Hidratação</h3>
                <p className="text-slate-600">
                  Identificação oficial de corredor inscrito e pontos de hidratação.
                </p>
              </div>
            </div>

            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs leading-relaxed">
                <h3 className="font-bold text-slate-900">Sexta-feira, 20/11 às 19h</h3>
                <p className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Porta da Eco Arena - Massagueira</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: 5 Prizes Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Exclusivo para Inscritos</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                  5 Sorteios de Aniversário Eco Arena
                </h3>
              </div>
            </div>

            <div className="w-full rounded-xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
              {prizes.map((p, idx) => (
                <div key={idx} className="py-2.5 px-3 flex items-start justify-between gap-2 text-xs min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span className="text-[11px] font-bold text-emerald-700 shrink-0">
                        {p.badge} ·
                      </span>
                      <strong className="text-slate-900 font-semibold break-words">{p.title}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 min-w-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{p.bonus}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onSelectDistance?.('5km')}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Abrir Formulário de Inscrição (R$ {feeAmount.toFixed(2).replace('.', ',')})</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

