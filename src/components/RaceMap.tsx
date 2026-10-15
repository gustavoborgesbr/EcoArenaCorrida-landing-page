import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Droplets,
  Flag,
  Share2,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ModalityDistance } from '../types/index.ts';

interface RaceMapProps {
  onSelectDistance?: (distance: ModalityDistance) => void;
}

export const RaceMap: React.FC<RaceMapProps> = ({ onSelectDistance }) => {
  const [activeTab, setActiveTab] = useState<ModalityDistance>('5km');
  const [copiedLink, setCopiedLink] = useState(false);

  const routeDetails = {
    '3km': {
      title: '3 km Caminhada da Família',
      tag: 'Leve & Inclusivo',
      distance: '3.000 metros',
      elevationGain: '+6m',
      difficulty: 'Iniciante',
      turnaround: 'Orla da Lagoa Manguaba (em frente ao Restaurante do Zezinho)',
      description:
        'Percurso acolhedor com vista panorâmica da Lagoa Manguaba. Largada na Mansão Verde, segue pela orla arborizada e faz a curva de retorno no km 1,5 com hidratação no local.',
      hydrationPoints: ['Largada (0 km)', 'Posto Orla (1,5 km)', 'Chegada (3 km)'],
      landmarks: [
        'Concentração na Mansão Verde',
        'Trecho orla da Lagoa Manguaba',
        'Ponto de hidratação e retorno',
        'Reta final e portal de chegada',
      ],
    },
    '5km': {
      title: '5 km Corrida Rápida',
      tag: 'Mais Popular',
      distance: '5.000 metros',
      elevationGain: '+11m',
      difficulty: 'Intermediário / PB',
      turnaround: 'Final da Orla da Massagueira (acesso ao Polo Gastronômico)',
      description:
        'Percurso 100% plano e animado à beira da lagoa, ideal para buscar seu melhor tempo (PB) ao som dos cantores Joy Davidson e energia extra do Monster Energy Drink!',
      hydrationPoints: ['Largada na Eco Arena (0 km)', 'Posto 1 (2,0 km)', 'Ponto de Retorno (2,5 km)', 'Chegada (5 km)'],
      landmarks: [
        'Largada oficial na porta da Eco Arena',
        'Extensão completa do percurso',
        'Ponto de retorno com cronometragem',
        'Pórtico de chegada e grande festa com sorteios',
      ],
    },
    '10km': {
      title: '10 km Desafio Pro',
      tag: 'Alta Performance',
      distance: '10.000 metros',
      elevationGain: '+22m',
      difficulty: 'Avançado',
      turnaround: '2 voltas no circuito da Orla da Massagueira',
      description:
        'Circuito dinâmico em duas voltas pela orla da Lagoa Manguaba. Percurso veloz e rítmico, com apoio constante de hidratação e torcida ao passar novamente em frente à Mansão Verde.',
      hydrationPoints: ['Largada (0 km)', 'Posto 1 (2,5 km)', 'Passagem Mansão Verde (5 km)', 'Posto 2 (7,5 km)', 'Chegada (10 km)'],
      landmarks: [
        'Largada rápida na Mansão Verde',
        '1ª volta completa na orla da lagoa',
        'Passagem pelo funil dos 5 km com torcida',
        '2ª volta e sprint final pelo pórtico',
      ],
    },
  };

  const currentRoute = routeDetails[activeTab];

  // GPS links for Massagueira, Marechal Deodoro - AL
  const googleMapsNavUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Massagueira,+Marechal+Deodoro+-+AL';
  const wazeNavUrl = 'https://waze.com/ul?q=Massagueira+Marechal+Deodoro';

  const handleShare = () => {
    const text = `🏃 Veja o trajeto da Corrida Ecoarena na Massagueira (Marechal Deodoro - AL) contornando a Lagoa Manguaba: ${window.location.origin}#percurso`;
    if (navigator.share) {
      navigator.share({
        title: 'Trajeto Corrida Ecoarena Massagueira',
        text,
        url: `${window.location.origin}#percurso`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section id="percurso" className="py-16 sm:py-24 bg-slate-50 text-slate-900 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Compass className="w-4 h-4 text-emerald-600" />
            Mapa Oficial do Percurso
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-slate-900">
            TRAJETO NA MASSAGUEIRA &{' '}
            <span className="text-emerald-600">ORLA DA LAGOA</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Largada e chegada na <strong>Mansão Verde</strong>, contornando a orla da Lagoa Manguaba em Marechal Deodoro (AL).
            Percurso 100% plano, pavimentado e com visual deslumbrante para a sua corrida!
          </p>
        </div>

        {/* Modalidade / Distância Tab Switcher */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-full overflow-x-auto">
            {(['3km', '5km', '10km'] as ModalityDistance[]).map((dist) => {
              const isSelected = activeTab === dist;
              return (
                <button
                  key={dist}
                  type="button"
                  onClick={() => {
                    setActiveTab(dist);
                    if (onSelectDistance) onSelectDistance(dist);
                  }}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{dist.toUpperCase()}</span>
                  <span className="ml-1.5 text-[10px] font-normal opacity-90 hidden sm:inline">
                    {dist === '3km' ? 'Caminhada' : dist === '5km' ? 'Corrida' : 'Desafio'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Google Maps Iframe */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            {/* Map Top Bar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm">Massagueira, Marechal Deodoro - AL</div>
                  <div className="text-xs text-slate-400">Ponto Central: Mansão Verde • Orla da Lagoa</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
                  title="Compartilhar rota"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{copiedLink ? 'Copiado!' : 'Compartilhar'}</span>
                </button>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-100">
              <iframe
                title="Mapa do Percurso Massagueira Marechal Deodoro"
                src="https://maps.google.com/maps?q=Massagueira,+Marechal+Deodoro+-+AL&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />

              {/* Floating Overlay Badge on Map */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs pointer-events-none">
                <div className="font-black text-slate-900 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Largada: Mansão Verde</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Beira da Lagoa Manguaba • {activeTab}
                </div>
              </div>
            </div>

            {/* GPS Navigation Callout Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 text-center sm:text-left">
                <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Navegue pelo GPS até a linha de largada na Mansão Verde:</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <a
                  href={googleMapsNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href={wazeNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
                >
                  <span>Waze</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Route Technical Info & Checkpoints */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Route Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs uppercase font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {currentRoute.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mt-1">
                    {currentRoute.title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Distância</span>
                  <span className="text-xl font-black text-emerald-600 font-heading">
                    {currentRoute.distance}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentRoute.description}
              </p>

              {/* Technical Badges */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-slate-500 block text-[11px] font-semibold">Altimetria</span>
                  <span className="font-extrabold text-slate-900 text-sm">{currentRoute.elevationGain} (Plano)</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-slate-500 block text-[11px] font-semibold">Piso</span>
                  <span className="font-extrabold text-slate-900 text-sm">100% Asfalto</span>
                </div>
              </div>

              {/* Route checkpoints */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-xs uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Pontos de Passagem & Retorno:</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600">
                  {currentRoute.landmarks.map((landmark, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{landmark}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hydration Points */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
                  <Droplets className="w-4 h-4 text-emerald-600" />
                  <span>Hidratação Oficial Powerade no Percurso:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentRoute.hydrationPoints.map((point, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-white px-2.5 py-1 rounded-lg text-emerald-800 font-bold border border-emerald-200 shadow-xs"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA to Register */}
              <a
                href="#inscricao"
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-md shadow-emerald-600/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Garantir Vaga no Percurso de {activeTab} (R$ 5,00)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
