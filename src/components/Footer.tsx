import React, { useState } from 'react';
import { Trophy, MessageCircle, MapPin, ShieldCheck, Lock, LogOut } from 'lucide-react';
import { User } from 'firebase/auth';
import { EventConfig } from '../types/index.ts';

interface FooterProps {
  config: EventConfig;
  currentUser: User | null;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onScrollToForm: () => void;
  onLogout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  currentUser,
  onOpenLookup,
  onOpenAdmin,
  onScrollToForm,
  onLogout,
}) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-emerald-500/40 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 shrink-0">
                {!logoError ? (
                  <img
                    src="/assets/logo.png"
                    alt="Ecoarena Mansão Verde"
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Trophy className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <span className="text-2xl font-black font-heading uppercase tracking-tight text-white">
                ECOARENA MANSÃO VERDE
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Incentivando o esporte, a saúde e o bem-estar da nossa comunidade na Massagueira.
              Venha correr, caminhar e superar marcas com a gente na orla da Lagoa Manguaba!
            </p>

            <div className="pt-2 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Oficial: <strong>{config.whatsAppNumber}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{config.locationName}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onScrollToForm}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Garantir Inscrição (R$ {config.earlyBirdFee.toFixed(2).replace('.', ',')})
                </button>
              </li>
              <li>
                <a href="#percurso" className="hover:text-white transition-colors text-emerald-400 font-bold">
                  Mapa do Percurso (Massagueira)
                </a>
              </li>
              <li>
                <a href="#detalhes" className="hover:text-white transition-colors">
                  Percursos (3km, 5km, 10km)
                </a>
              </li>
              <li>
                <a href="#detalhes" className="hover:text-white transition-colors">
                  Kit do Atleta & Cronograma
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLookup}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Consultar Minha Inscrição
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Organizer / Admin access */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span>Área do Organizador</span>
              {currentUser && (
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Conectado
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentUser
                ? `Logado como ${currentUser.email || 'Administrador'}. Acesse o painel de atletas, aprove comprovantes do WhatsApp e audite o evento.`
                : 'Área reservada para a equipe organizadora gerenciar inscrições, conferir comprovantes do WhatsApp e configurar parâmetros da corrida.'}
            </p>

            {currentUser ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Painel de Inscritos</span>
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/60 transition-colors cursor-pointer"
                    title="Encerrar sessão de Administrador"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer group"
                title="Acesso exclusivo para administradores"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                <span>Acesso Administrativo (Login)</span>
              </button>
            )}
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Equarena Sports. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1 justify-center">
            Feito para corredores com energia e paixão pelo esporte.
          </p>
        </div>
      </div>
    </footer>
  );
};
