import React, { useState } from 'react';
import { Search, Settings, Trophy, Users, LogOut, ShieldCheck } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full max-w-full overflow-hidden bg-slate-50/90 backdrop-blur-md border-b border-slate-200/70 text-slate-900">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">
        {/* Logo / Brand */}
        <a href="#" className="flex items-center gap-2 group min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-white shrink-0">
            {!logoError ? (
              <img
                src="/assets/logo.png"
                alt="Eco Arena Logo"
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            )}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-lg font-extrabold tracking-tight text-slate-900 uppercase font-heading truncate">
              ECO ARENA
            </span>
          </div>
        </a>

        {/* Dynamic Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isAdmin ? (
            <>
              <div
                className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] sm:text-xs font-bold shrink-0"
                title={`Sessão Administrativa Conectada (${currentUser?.email || 'Admin'})`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="uppercase tracking-wider">ADMIN</span>
              </div>

              <button
                onClick={onOpenAdmin}
                type="button"
                className="flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold text-slate-800 bg-slate-100 hover:bg-emerald-50 transition-colors border border-slate-200 cursor-pointer"
                aria-label={`Painel Inscritos (${participants.length})`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">Inscritos</span>
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {participants.length}
                </span>
              </button>

              <button
                onClick={onOpenSettings}
                type="button"
                aria-label="Configurações do Evento"
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={onLogout}
                type="button"
                aria-label="Encerrar sessão de Administrador"
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              </button>
            </>
          ) : (
            <>
              {/* Consultar Inscrição */}
              <button
                onClick={onOpenLookup}
                type="button"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100/90 hover:bg-slate-200/80 transition-colors border border-slate-200/80 cursor-pointer shrink-0"
                aria-label="Consultar Inscrição"
              >
                <Search className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Consultar</span>
              </button>

              {/* Inscrever-se CTA */}
              <button
                onClick={onScrollToForm}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-2xs transition-all cursor-pointer shrink-0"
                aria-label="Inscrever-se antecipadamente na corrida por R$ 10,00"
              >
                <span>Inscrever-se</span>
                <span className="bg-black/20 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                  R$ {Math.round(config.earlyBirdFee || 10)}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
