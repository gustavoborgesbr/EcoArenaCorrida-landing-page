import React, { useState } from 'react';
import { Trophy, MessageCircle, MapPin } from 'lucide-react';
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
    <footer className="w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-700 border-t border-slate-200/80 pt-8 pb-8">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          {/* Brand & Event Info */}
          <div className="sm:col-span-7 space-y-3 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-white shrink-0">
                {!logoError ? (
                  <img
                    src="/assets/logo.png"
                    alt="Eco Arena Mansão Verde"
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Trophy className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <span className="text-base sm:text-lg font-extrabold font-heading uppercase tracking-tight text-slate-900 truncate">
                ECO ARENA · A MANSÃO VERDE
              </span>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Comemoração dos 4 anos da Eco Arena na Massagueira. Corre de Sexta com Jó & Deyvisson + Paredão e Monster Energy Drink no dia 20/11 às 19h.
            </p>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <a
                  href={
                    /^https?:\/\//i.test(config.whatsAppNumber)
                      ? config.whatsAppNumber
                      : `https://${config.whatsAppNumber.replace(/^\/+/, '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline truncate"
                >
                  Falar no WhatsApp Oficial da Eco Arena
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{config.locationName}</span>
              </div>
            </div>
          </div>

          {/* Quick Links + Subtle Admin Button Below Links */}
          <div className="sm:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Atalhos Rápidos
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={onScrollToForm}
                  className="hover:text-emerald-800 transition-colors cursor-pointer text-emerald-700 font-semibold"
                >
                  Fazer Inscrição Antecipada (R$ {Math.round(config.earlyBirdFee || 10)})
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLookup}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Consultar Minha Inscrição
                </button>
              </li>
              <li>
                <a href="#detalhes" className="hover:text-slate-900 transition-colors">
                  Benefícios & 5 Sorteios
                </a>
              </li>
              <li>
                <a href="#percurso" className="hover:text-slate-900 transition-colors">
                  Localização & Percurso 5 Km
                </a>
              </li>
            </ul>

            {/* Small, subtle button right below the footer links */}
            <div className="pt-1.5">
              {currentUser ? (
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    Painel Admin (Conectado)
                  </button>
                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="px-2 py-1 rounded-lg text-[11px] text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Sair
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 transition-colors cursor-pointer"
                >
                  Acesso Organizador
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-200/80 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Eco Arena. Todos os direitos reservados.</p>
          <p>Massagueira · Marechal Deodoro - AL</p>
        </div>
      </div>
    </footer>
  );
};

