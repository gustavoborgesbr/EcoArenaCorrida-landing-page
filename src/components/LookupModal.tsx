import React, { useState } from 'react';
import { Search, X, User, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Participant } from '../types/index.ts';
import { formatCPF } from '../utils/validation.ts';

interface LookupModalProps {
  participants: Participant[];
  onClose: () => void;
  onSelectParticipant: (participant: Participant) => void;
}

export const LookupModal: React.FC<LookupModalProps> = ({
  participants,
  onClose,
  onSelectParticipant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);

  const cleanQuery = searchTerm.replace(/\D/g, '');
  const results = participants.filter((p) => {
    if (!searchTerm.trim()) return false;
    const cleanCpf = p.cpf.replace(/\D/g, '');
    const cleanRg = p.rg.replace(/\D/g, '');
    const matchesCpf = cleanQuery && cleanCpf.includes(cleanQuery);
    const matchesRg = cleanQuery && cleanRg.includes(cleanQuery);
    const matchesName = p.fullName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesCpf || matchesRg || matchesName;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lookup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 id="lookup-modal-title" className="text-xl font-bold font-heading uppercase text-slate-900">
                CONSULTAR INSCRIÇÃO
              </h2>
              <p className="text-xs text-slate-500">
                Digite seu CPF, RG ou Nome Completo cadastrado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar busca"
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d+$/.test(val.replace(/\D/g, '')) && val.length <= 14) {
                    setSearchTerm(formatCPF(val));
                  } else {
                    setSearchTerm(val);
                  }
                  setSearched(false);
                }}
                placeholder="Ex: 000.000.000-00 ou Nome"
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              Buscar Inscrição
            </button>
          </form>

          {/* Results list */}
          <div className="space-y-3">
            {searched && results.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Nenhuma inscrição encontrada para "{searchTerm}".
                </p>
                <p className="text-xs text-slate-500">
                  Verifique se digitou o CPF corretamente ou faça sua inscrição agora mesmo.
                </p>
              </div>
            )}

            {results.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectParticipant(p)}
                className="bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {p.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>CPF: {p.cpf}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{p.distance}</span>
                    <span>•</span>
                    <span>#{p.id}</span>
                  </div>
                  <div className="pt-1">
                    {p.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                        <Clock className="w-3.5 h-3.5" /> Aguardando Comprovante Pix
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <span className="text-xs text-emerald-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ver Voucher <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
