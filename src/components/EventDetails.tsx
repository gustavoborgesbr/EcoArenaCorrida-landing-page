import React, { useState } from 'react';
import {
  Trophy,
  Activity,
  HeartPulse,
  Sparkles,
  Shirt,
  Award,
  Apple,
  MapPin,
  Clock,
  Compass,
  Users,
} from 'lucide-react';
import { EventConfig } from '../types/index.ts';

interface EventDetailsProps {
  config: EventConfig;
  onSelectDistance?: (distance: '3km' | '5km' | '10km') => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  config,
  onSelectDistance,
}) => {
  const [photoError, setPhotoError] = useState(false);

  const distances = [
    {
      id: '3km' as const,
      title: '3 km Caminhada',
      subtitle: 'Família & Iniciantes',
      desc: 'Percurso acolhedor, plano e 100% asfaltado. Ideal para quem quer se movimentar, curtir com a família ou começar no esporte sem pressão de tempo.',
      color: 'from-emerald-600 to-teal-600',
      tag: 'Ritmo Leve',
      icon: HeartPulse,
    },
    {
      id: '5km' as const,
      title: '5 km Corrida',
      subtitle: 'Iniciantes & Amadores',
      desc: 'A queridinha dos corredores! Trajeto dinâmico, com pontos de hidratação a cada 2,5km. Excelente para buscar seu melhor tempo pessoal nos 5K.',
      color: 'from-green-600 to-emerald-600',
      tag: 'Mais Popular',
      icon: Activity,
    },
    {
      id: '10km' as const,
      title: '10 km Corrida',
      subtitle: 'Desafio Avançado',
      desc: 'Para quem busca superar barreiras e colocar o treino à prova. Percurso completo com altimetria desafiadora e suporte de hidratação reforçado.',
      color: 'from-teal-700 to-emerald-700',
      tag: 'Alta Performance',
      icon: Trophy,
    },
  ];

  const schedule = [
    { time: '05h45', title: 'Concentração & Entrega de Numerais', desc: 'Chegue cedo para retirar seu número de peito e guardar pertences na base Ecoarena.' },
    { time: '06h15', title: 'Aquecimento Coletivo com Treinadores', desc: 'Alongamento dinâmico e ativação muscular comandado pela equipe Mansão Verde.' },
    { time: '06h30', title: 'Largada Oficial (3K, 5K e 10K)', desc: 'Contagem regressiva e largada de todas as categorias na Mansão Verde.' },
    { time: '08h00', title: 'Mesa de Frutas & Hidratação', desc: 'Espaço recuperação com isotônicos gelados Powerade, frutas da estação e massagem.' },
    { time: '08h30', title: 'Premiação e Cerimônia Finisher', desc: 'Entrega de troféus para pódios e celebração com todos os atletas.' },
  ];

  return (
    <section id="detalhes" className="py-16 sm:py-24 bg-white text-slate-900 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Reference Image Layout Style: The Community Behind Every Great Run */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Offset Image Card with Active Members Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] bg-slate-900">
              {!photoError ? (
                <img
                  src="/assets/foto2.jpg"
                  alt="Comunidade Ecoarena Mansão Verde"
                  className="w-full h-full object-cover"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-emerald-950 to-slate-900 flex items-center justify-center text-white">
                  <Users className="w-16 h-16 text-emerald-400" />
                </div>
              )}
              {/* Active members floating badge */}
              <div className="absolute bottom-6 left-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl border border-emerald-500">
                <div className="text-2xl sm:text-3xl font-black font-heading">3,724+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">Atletas & Membros Ativos</div>
              </div>
            </div>
          </div>

          {/* Right Column: Community Description */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200">
              [ QUEM SOMOS ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-slate-900 leading-none">
              A COMUNIDADE POR TRÁS DE CADA GRANDE CORRIDA
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Construa resistência, melhore sua performance e cruze cada linha de chegada com confiança através de treinamento guiado e uma comunidade motivadora.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sed placerat turpis molestie fames facilisis enim pellentesque sodales netus dictum. Quis a placerat ex efficitur ante. Pede scelerisque convallis tempus erat tellus. Duis urna magna ac auctor vel torquent quisque suscipit porta ante.
            </p>
            <div className="pt-2">
              <a
                href="#inscricao"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              >
                <span>SAIBA MAIS SOBRE O EVENTO</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section Heading: Modalidades & Desafios */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Compass className="w-4 h-4 text-emerald-600" />
            Modalidades & Estrutura
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-slate-900">
            ESCOLHA SEU DESAFIO NA{' '}
            <span className="text-emerald-600">ECOARENA</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Um evento pensado para todos os níveis: da primeira caminhada ao atleta que busca
            bater seu recorde. Estrutura profissional com segurança e muita energia.
          </p>
        </div>

        {/* 3 Distances Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {distances.map((dist) => {
            const Icon = dist.icon;
            return (
              <div
                key={dist.id}
                className="group relative bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {dist.tag}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${dist.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black font-heading tracking-tight text-slate-900">
                      {dist.title}
                    </h3>
                    <p className="text-sm font-bold text-emerald-600">
                      {dist.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {dist.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-semibold">Taxa Promocional</span>
                    <span className="text-lg font-black text-emerald-600 font-heading">
                      R$ {config.earlyBirdFee.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  {onSelectDistance && (
                    <button
                      onClick={() => onSelectDistance(dist.id)}
                      type="button"
                      className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-200 hover:bg-emerald-600 text-slate-800 hover:text-white transition-colors cursor-pointer shadow-sm"
                    >
                      Selecionar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kit do Atleta Showcase */}
        <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                Incluso na sua inscrição
              </span>
              <h3 className="text-2xl sm:text-4xl font-black font-heading text-white">
                O QUE VEM NO KIT DO CORREDOR?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                Toda a estrutura foi pensada para você viver uma experiência inesquecível do início ao fim.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <Shirt className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Camiseta Dry-Fit</h4>
                  <p className="text-xs text-slate-300">Tecido leve e respirável</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-300 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Medalha Finisher</h4>
                  <p className="text-xs text-slate-300">Metal pesado exclusivo</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Frutas & Isotônico</h4>
                  <p className="text-xs text-slate-300">Powerade e frutas à vontade</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Número de Peito</h4>
                  <p className="text-xs text-slate-300">Com chip e alfinetes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cronograma */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <Clock className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-xl font-bold font-heading uppercase text-slate-900">
                  Cronograma Oficial do Evento
                </h3>
                <p className="text-xs text-slate-500">Programe-se para não perder a largada!</p>
              </div>
            </div>

            <div className="space-y-4">
              {schedule.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span className="font-mono text-sm font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-200 shrink-0">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Localização & Ponto de Encontro */}
          <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <MapPin className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-xl font-bold font-heading uppercase text-slate-900">
                    Local de Concentração
                  </h3>
                  <p className="text-xs text-slate-500">Ponto de partida e chegada</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-base text-slate-900">{config.locationName}</h4>
                <p className="text-sm text-slate-600">{config.locationAddress}</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2 shadow-sm">
                <div className="font-bold text-slate-900">Dicas para o dia:</div>
                <p>• Estacionamento amplo nas imediações da Mansão Verde.</p>
                <p>• Traga seu comprovante no celular para agilizar a retirada do número.</p>
                <p>• Use calçado adequado para corrida e hidrate-se no dia anterior.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  config.locationName + ' ' + config.locationAddress
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-800 transition-colors border border-slate-300 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                Ver no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
