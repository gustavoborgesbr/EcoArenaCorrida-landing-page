import React, { useState } from 'react';
import { Camera, Users, Award, Sparkles } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'community' | 'race' | 'podium'>('all');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const photos = [
    {
      id: 1,
      category: 'community',
      title: 'Comunidade Ecoarena Mansão Verde',
      subtitle: 'Nossa galera reunida com muita energia antes da largada.',
      src: '/assets/foto2.jpg',
      aspect: 'aspect-[16/10]',
    },
    {
      id: 2,
      category: 'race',
      title: 'Hidratação Powerade & Superação',
      subtitle: 'Atletas focados buscando seus melhores tempos na pista.',
      src: '/assets/foto2.jpg',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 3,
      category: 'podium',
      title: 'Espírito Esportivo & Amizade',
      subtitle: 'Celebração e alegria em cada quilômetro percorrido.',
      src: '/assets/foto2.jpg',
      aspect: 'aspect-[1/1]',
    },
  ];

  const filteredPhotos = photos.filter(
    (p) => activeTab === 'all' || p.category === activeTab
  );

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Camera className="w-4 h-4 text-emerald-600" />
            Galeria de Fotos Oficial
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-slate-900">
            MOMENTOS QUE MARCAM A{' '}
            <span className="text-emerald-600">ECOARENA</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Confira os melhores registros das edições anteriores, treinos na Mansão Verde e a energia contagiante dos nossos corredores.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {[
            { id: 'all', label: 'Todas as Fotos', icon: Sparkles },
            { id: 'community', label: 'Galera & Comunidade', icon: Users },
            { id: 'race', label: 'Na Pista & Hidratação', icon: Camera },
            { id: 'podium', label: 'Celebração', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Responsive Masonry / Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            const hasError = imgErrors[photo.id];
            return (
              <div
                key={photo.id}
                className="group relative bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`w-full ${photo.aspect} relative overflow-hidden bg-slate-950 flex items-center justify-center`}>
                  {!hasError ? (
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [photo.id]: true }))
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                      <Camera className="w-10 h-10 text-emerald-400 mb-1" />
                      <span className="font-bold text-sm">{photo.title}</span>
                      <p className="text-xs text-slate-400">Adicione suas fotos em <code className="text-emerald-300 font-mono">public/assets/</code></p>
                    </div>
                  )}

                  {/* Gradient Overlay & Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-emerald-600 text-white w-fit mb-2">
                      Ecoarena Mansão Verde
                    </span>
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-emerald-300 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {photo.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
