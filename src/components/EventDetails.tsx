import React, { useState } from 'react';
import {
  Trophy,
  Activity,
  HeartPulse,
  Sparkles,
  Shirt,
  MapPin,
  Clock,
  Compass,
  Users,
  Flame,
  Music,
  Gift,
  CheckCircle2,
  AlertTriangle,
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
      desc: 'A queridinha dos corredores! Trajeto dinâmico, com pontos de hidratação. Excelente para buscar seu melhor tempo pessoal nos 5K.',
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
    {
      time: '19h00',
      title: 'Concentração & Monster Energy Drink',
      desc: 'Concentração na porta da Eco Arena com Monster Energy Drink logo no início da corrida garantindo energia extra!',
    },
    {
      time: '19h20',
      title: 'Aquecimento com os Cantores Joy Davidson',
      desc: 'Os cantores Joy Davidson entram no comando para animar cada passo com muita música e vibração ao vivo!',
    },
    {
      time: '19h30',
      title: 'Largada Oficial da Corrida Arena (4 Anos)',
      desc: 'Contagem regressiva e largada oficial de todas as distâncias na porta da Eco Arena.',
    },
    {
      time: '20h30',
      title: 'Chegada Festiva & Ponto de Hidratação',
      desc: 'Recepção dos atletas com muita festa na pista, frutas da estação e água gelada.',
    },
    {
      time: '20h45',
      title: 'Grande Sorteio dos 5 Prêmios Imperdíveis',
      desc: 'Momento mais esperado: sorteio ao vivo dos 5 prêmios especiais de aniversário com a comunidade reunida!',
    },
  ];

  const prizes = [
    {
      place: '1º Lugar',
      emoji: '🥇',
      badge: '1º PRÊMIO',
      title: '3 Meses de Treino na Eco Arena',
      bonus: 'Avaliação física completa com plano de treino exclusivo',
      highlight: true,
      cardBorder: 'border-amber-400 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white',
      badgeBg: 'bg-amber-500 text-slate-950',
    },
    {
      place: '2º Lugar',
      emoji: '🥈',
      badge: '2º PRÊMIO',
      title: '1 Pote de Whey Protein',
      bonus: 'Avaliação física + 1 mês de treino na Eco Arena',
      highlight: false,
      cardBorder: 'border-slate-300 bg-white',
      badgeBg: 'bg-slate-700 text-white',
    },
    {
      place: '3º Lugar',
      emoji: '🥉',
      badge: '3º PRÊMIO',
      title: '1 Pote de Creatina',
      bonus: 'Avaliação física na Eco Arena + Copo exclusivo',
      highlight: false,
      cardBorder: 'border-orange-300 bg-white',
      badgeBg: 'bg-orange-700 text-white',
    },
    {
      place: '4º Lugar',
      emoji: '🏅',
      badge: '4º PRÊMIO',
      title: 'Avaliação Física na Eco Arena',
      bonus: '+ 1 mês de treino de aula coletiva',
      highlight: false,
      cardBorder: 'border-emerald-300 bg-white',
      badgeBg: 'bg-emerald-700 text-white',
    },
    {
      place: '5º Lugar',
      emoji: '🎖️',
      badge: '5º PRÊMIO',
      title: '30 Dias de Treino Completo',
      bonus: 'Academia + aulas coletivas + Avaliação física na Eco Arena',
      highlight: false,
      cardBorder: 'border-teal-300 bg-white',
      badgeBg: 'bg-teal-700 text-white',
    },
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
                  alt="Comunidade Eco Arena"
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
                <div className="text-2xl sm:text-3xl font-black font-heading">4 ANOS</div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  Comunidade Eco Arena em Festa!
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Community Description with Event Context */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200">
              [ 4 ANOS DE ECO ARENA ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-slate-900 leading-none">
              A COMUNIDADE POR TRÁS DE CADA GRANDE CORRIDA
            </h2>
            <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed">
              Prepare o tênis, porque a festa é na pista! A Corrida Arena chegou para celebrar os 4 anos da Eco Arena em grande estilo, e você é o nosso convidado especial!
            </p>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p className="flex items-start gap-2.5">
                <span className="text-lg">🔥</span>
                <span>
                  <strong>Monster Energy Drink:</strong> estará com a gente logo no início da corrida, garantindo aquela energia extra pra você dar o seu melhor do começo ao fim!
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="text-lg">🎤</span>
                <span>
                  <strong>Música ao vivo:</strong> os cantores Joy Davidson vão puxar a corrida, animando cada passo com muita música e vibração contagiante!
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="text-lg">🎁</span>
                <span>
                  <strong>Sorteios Imperdíveis:</strong> 5 prêmios imperdíveis com planos de treino, suplementos Whey e Creatina, além de avaliações físicas completas!
                </span>
              </p>
            </div>
            <div className="pt-2">
              <a
                href="#inscricao"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              >
                <span>GARANTIR VAGA POR R$ 5,00 (100 PRIMEIROS)</span>
              </a>
            </div>
          </div>
        </div>

        {/* 🎁 DEDICATED SECTION: 5 SORTEIOS IMPERDÍVEIS */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-12 text-white shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Gift className="w-4 h-4 text-amber-400" />
              Sorteios de Aniversário
            </div>
            <h3 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-white">
              🎁 SORTEIOS IMPERDÍVEIS
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              É esporte, é festa, é comemoração! Concorra a 5 prêmios exclusivos de 4 Anos da Eco Arena durante a celebração da corrida.
            </p>
          </div>

          {/* 5 Prize Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            {prizes.map((p, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 relative border ${
                  p.highlight
                    ? 'border-amber-400/80 bg-gradient-to-b from-amber-500/15 to-slate-900/90 shadow-xl shadow-amber-500/10 md:col-span-2 lg:col-span-1'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      p.highlight
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {p.badge}
                  </span>
                  <span className="text-3xl">{p.emoji}</span>
                </div>

                <h4 className="text-lg sm:text-xl font-black font-heading text-white tracking-tight mb-2">
                  {p.title}
                </h4>

                <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p.bonus}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom notice pill */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white">
                  ⚠️ Válido somente para os 100 primeiros inscritos!
                </div>
                <div className="text-xs text-slate-300">
                  Taxa de inscrição promocional de apenas R$ 5,00. Garanta seu lugar antes que esgote!
                </div>
              </div>
            </div>
            <a
              href="#inscricao"
              className="px-6 py-3 rounded-xl text-xs font-black uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shrink-0 shadow-lg"
            >
              Inscrever-se Agora
            </a>
          </div>
        </div>

        {/* Section Heading: Modalidades & Desafios */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Compass className="w-4 h-4 text-emerald-600" />
            Modalidades & Estrutura
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-slate-900">
            ESCOLHA SEU DESAFIO NA{' '}
            <span className="text-emerald-600">ECO ARENA</span>
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

        {/* Experiência da Corrida (Replaces old kit section - Medalha Finisher removed) */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-green-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-emerald-900/50">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                Estrutura & Atrações Oficiais
              </span>
              <h3 className="text-2xl sm:text-4xl font-black font-heading text-white">
                O QUE VAI ROLAR NA CORRIDA ARENA?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                Tudo preparado com carinho para celebrar os 4 anos de Eco Arena em grande estilo!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              {/* Card 1: Monster Energy */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Monster Energy Drink</h4>
                  <p className="text-xs text-slate-300 mt-1">Logo no início para aquela energia extra</p>
                </div>
              </div>

              {/* Card 2: Cantores Joy Davidson */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Joy Davidson ao Vivo</h4>
                  <p className="text-xs text-slate-300 mt-1">Puxando a corrida com música e vibração</p>
                </div>
              </div>

              {/* Card 3: 5 Sorteios Imperdíveis */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">5 Sorteios Imperdíveis</h4>
                  <p className="text-xs text-slate-300 mt-1">Treinos, Whey, Creatina e avaliações</p>
                </div>
              </div>

              {/* Card 4: Número de Peito & Camiseta */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <Shirt className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Número de Peito</h4>
                  <p className="text-xs text-slate-300 mt-1">Identificação oficial e suporte completo</p>
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
                <p className="text-xs text-slate-500">Programe-se para não perder a concentração às 7h da noite!</p>
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
                    <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
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
                <h4 className="font-bold text-base text-slate-900">Na porta da Eco Arena</h4>
                <p className="text-sm text-slate-600">Concentração marcada para as 7h da noite (19h00)</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2 shadow-sm">
                <div className="font-bold text-slate-900">Informações Importantes:</div>
                <p>• Concentração às 7h da noite (19h00) pontualmente na porta da Eco Arena.</p>
                <p>• Monster Energy Drink entregue no início da prova para aquela energia extra.</p>
                <p>• Show dos cantores Joy Davidson ao vivo para comandar a animação.</p>
                <p>• Sorteios dos 5 prêmios imperdíveis ao término da prova para os atletas inscritos.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <a
                href="#inscricao"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              >
                <span>Inscrever-se por R$ {config.earlyBirdFee.toFixed(2).replace('.', ',')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
