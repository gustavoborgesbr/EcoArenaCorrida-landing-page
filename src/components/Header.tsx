import React, { useState } from 'react';
import { Search, Settings, Trophy, Users, Zap, Lock, LogOut, ShieldCheck } from 'lucide-react';
import { User } from 'firebase/auth';
import { EventConfig, Participant } from '../types/index.ts';

interface HeaderProps {
  config: EventConfig;
  participants: Participant[];
  currentUser: User | null;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onOpenSettings: () => void;
  onScrollToForm: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  participants,
  currentUser,
  onOpenLookup,
  onOpenAdmin,
  onOpenSettings,
  onScrollToForm,
  onLogout,
}) => {
  const [logoError, setLogoError] = useState(false);
  const isAdmin = Boolean(currentUser);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/70 text-slate-900 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-18 flex items-center justify-between gap-2">
        {/* Logo / Brand */}
        <a href="#" className="flex items-center gap-2 group shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/50 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform text-white shrink-0">
            {!logoError ? (
              <img
                src="/assets/logo.png"
                alt="Ecoarena Mansão Verde Logo"
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            )}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm sm:text-xl font-black tracking-tight text-slate-900 uppercase font-heading leading-tight truncate">
              ECOARENA
            </span>
            <span className="hidden xs:inline-flex text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200 shrink-0">
              MANSÃO VERDE
            </span>
          </div>
        </a>

        {/* Dynamic Navigation Actions based on Firebase Auth State */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {isAdmin ? (
            /* ADMIN VIEW: Badge Admin, Painel Inscritos, Configurações, Sair */
            <>
              {/* Badge Admin with active status indicator */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shrink-0 shadow-xs"
                title={`Sessão Administrativa Conectada (${currentUser?.email || 'Admin'})`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="uppercase tracking-wider text-[11px] font-extrabold">ADMIN</span>
                <span className="hidden xl:inline text-[11px] text-emerald-700 max-w-[120px] truncate">
                  ({currentUser?.email?.split('@')[0]})
                </span>
              </div>

              {/* Painel Inscritos */}
              <button
                onClick={onOpenAdmin}
                type="button"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:text-emerald-950 bg-slate-100/80 hover:bg-emerald-50 active:bg-emerald-100 transition-colors border border-slate-200/80 hover:border-emerald-300 cursor-pointer shadow-xs"
                title="Abrir Painel de Gestão dos Inscritos"
                aria-label={`Painel Inscritos (${participants.length})`}
              >
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">Painel Inscritos</span>
                <span className="bg-emerald-600 text-white font-extrabold text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full shadow-xs">
                  {participants.length}
                </span>
              </button>

              {/* Configurações */}
              <button
                onClick={onOpenSettings}
                type="button"
                aria-label="Configurações do Evento"
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200 active:bg-slate-300 transition-colors border border-slate-200/80 cursor-pointer shadow-xs"
                title="Configurar Chave Pix, WhatsApp e Valores"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline">Configurações</span>
              </button>

              {/* Sair (Logout) */}
              <button
                onClick={onLogout}
                type="button"
                aria-label="Encerrar sessão de Administrador"
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 transition-colors border border-rose-200/70 cursor-pointer shadow-xs"
                title="Desconectar do Firebase Auth"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </>
          ) : (
            /* VISITOR / ATHLETE VIEW: Consultar Inscrição, Inscrever-se, Botão discreto Acesso Admin */
            <>
              {/* Consultar Inscrição */}
              <button
                onClick={onOpenLookup}
                type="button"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 bg-slate-100/90 hover:bg-slate-200/90 active:bg-slate-300 transition-colors border border-slate-200 cursor-pointer shadow-xs"
                title="Consulte sua inscrição pelo CPF"
                aria-label="Consultar Inscrição"
              >
                <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">Consultar Inscrição</span>
                <span className="sm:hidden">Consultar</span>
              </button>

              {/* Inscrever-se CTA */}
              <button
                onClick={onScrollToForm}
                type="button"
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-xs shadow-emerald-600/20 hover:shadow-sm hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shrink-0"
                aria-label={`Inscrever-se na corrida por R$ ${config.earlyBirdFee.toFixed(2).replace('.', ',')}`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Inscrever-se</span>
                <span className="bg-black/25 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded font-mono">
                  R$ {Math.round(config.earlyBirdFee)}
                </span>
              </button>

              {/* Botão Discreto de Acesso Admin */}
              <button
                onClick={onOpenAdmin}
                type="button"
                aria-label="Acesso Administrativo (Login)"
                title="Acesso Administrativo"
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors border border-transparent hover:border-slate-200/60 cursor-pointer ml-0.5"
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 hover:text-slate-600" />
                <span className="sr-only">Acesso Administrativo</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
