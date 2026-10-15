import React, { useState } from 'react';
import { X, Settings, Save, Phone, DollarSign, Calendar, Check } from 'lucide-react';
import { EventConfig } from '../types/index.ts';
import { formatPhone } from '../utils/validation.ts';

interface SettingsModalProps {
  config: EventConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: EventConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<EventConfig>(config);
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-xl font-bold font-heading uppercase text-slate-900">
                CONFIGURAÇÕES DA EQUARENA
              </h2>
              <p className="text-xs text-slate-500">
                Ajuste os dados do WhatsApp, Pix e parâmetros da corrida
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar configurações"
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* WhatsApp & Pix */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-700">
              <Phone className="w-4 h-4" />
              <span>Chave Pix & WhatsApp da Equarena</span>
            </div>

            <div>
              <label htmlFor="whatsAppNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Oficial da Equarena (Onde os comprovantes serão recebidos)
              </label>
              <input
                id="whatsAppNumber"
                type="text"
                value={formData.whatsAppNumber}
                onChange={(e) => {
                  const val = formatPhone(e.target.value);
                  setFormData({ ...formData, whatsAppNumber: val, pixKey: val });
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono shadow-sm"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                *O número do Pix é automaticamente o mesmo número do WhatsApp da Equarena.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="pixReceiverName" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Titular do Pix
                </label>
                <input
                  id="pixReceiverName"
                  type="text"
                  value={formData.pixReceiverName}
                  onChange={(e) =>
                    setFormData({ ...formData, pixReceiverName: e.target.value })
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="pixReceiverCity" className="block text-xs font-semibold text-slate-700 mb-1">
                  Cidade do Titular
                </label>
                <input
                  id="pixReceiverCity"
                  type="text"
                  value={formData.pixReceiverCity}
                  onChange={(e) =>
                    setFormData({ ...formData, pixReceiverCity: e.target.value })
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-700">
              <DollarSign className="w-4 h-4" />
              <span>Valores & Lote Promocional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="earlyBirdLimit" className="block text-xs font-semibold text-slate-700 mb-1">
                  Limite 1º Lote (Vagas)
                </label>
                <input
                  id="earlyBirdLimit"
                  type="number"
                  min={1}
                  max={500}
                  value={formData.earlyBirdLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      earlyBirdLimit: parseInt(e.target.value, 10) || 100,
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="earlyBirdFee" className="block text-xs font-semibold text-slate-700 mb-1">
                  Taxa Promocional (R$)
                </label>
                <input
                  id="earlyBirdFee"
                  type="number"
                  step="0.5"
                  min={1}
                  value={formData.earlyBirdFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      earlyBirdFee: parseFloat(e.target.value) || 5,
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="standardFee" className="block text-xs font-semibold text-slate-700 mb-1">
                  Taxa Normal (R$)
                </label>
                <input
                  id="standardFee"
                  type="number"
                  step="1"
                  min={5}
                  value={formData.standardFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      standardFee: parseFloat(e.target.value) || 25,
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Dados do Evento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="eventDate" className="block text-xs font-semibold text-slate-700 mb-1">
                  Data da Corrida
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="eventTime" className="block text-xs font-semibold text-slate-700 mb-1">
                  Horário de Largada
                </label>
                <input
                  id="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) =>
                    setFormData({ ...formData, eventTime: e.target.value })
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="locationName" className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Local
              </label>
              <input
                id="locationName"
                type="text"
                value={formData.locationName}
                onChange={(e) =>
                  setFormData({ ...formData, locationName: e.target.value })
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors cursor-pointer"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Configurações Salvas!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
