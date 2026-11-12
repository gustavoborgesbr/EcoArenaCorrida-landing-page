import React from 'react';
import {
  Navigation,
  ExternalLink,
  Flag,
} from 'lucide-react';
import { ModalityDistance } from '../types/index.ts';

interface RaceMapProps {
  onSelectDistance?: (distance: ModalityDistance) => void;
}

export const RaceMap: React.FC<RaceMapProps> = () => {
  const googleMapsNavUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Massagueira,+Marechal+Deodoro+-+AL';
  const wazeNavUrl = 'https://waze.com/ul?q=Massagueira+Marechal+Deodoro';

  return (
    <section id="percurso" className="w-full max-w-full overflow-x-hidden py-6 sm:py-8 bg-slate-50 text-slate-800 relative">
      <div className="w-full max-w-lg sm:max-w-4xl mx-auto px-3.5 sm:px-6 space-y-4 min-w-0">
        <div className="space-y-1 text-left">
          <p className="text-xs font-semibold text-emerald-700">
            Ponto de Encontro & Percurso
          </p>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Massagueira · Porta da Eco Arena (5 Km)
          </h2>
          <p className="text-xs text-slate-600">
            Concentração na sexta-feira, 20/11 às 19h · Percurso plano na orla da Massagueira
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="relative w-full h-48 sm:h-64 bg-slate-100">
            <iframe
              title="Mapa do Percurso Massagueira Eco Arena"
              src="https://maps.google.com/maps?q=Massagueira,+Marechal+Deodoro+-+AL&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
            <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/80 text-[11px] pointer-events-none">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Flag className="w-3 h-3 text-emerald-600" />
                <span>Largada: Porta da Eco Arena</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Abrir localização no GPS do celular:</span>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <a
                href={googleMapsNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={wazeNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <span>Waze</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

