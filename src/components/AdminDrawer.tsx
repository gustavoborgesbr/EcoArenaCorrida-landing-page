import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  ShieldCheck,
  Lock,
  LogOut,
  AlertCircle,
  MessageCircle,
  History,
  Settings,
  UserCheck,
  Ban,
  ArrowRight,
  TrendingUp,
  Receipt,
  Eye,
  BarChart3,
  MousePointerClick,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AnalyticsStats, AuditLog, EventConfig, Participant } from '../types/index.ts';
import {
  loginWithDirectPassword,
  logoutAdmin,
  subscribeToAuthState,
} from '../services/authService.ts';
import {
  confirmParticipantPayment,
  cancelParticipantRegistration,
  deleteParticipantDoc,
  subscribeToAuditLogs,
  saveEventConfigToFirestore,
} from '../services/firestoreService.ts';
import { formatPhone } from '../utils/validation.ts';
import { DEFAULT_ANALYTICS } from '../data/initialData.ts';

interface AdminDrawerProps {
  participants: Participant[];
  config: EventConfig;
  analytics?: AnalyticsStats;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  onViewParticipantTicket?: (p: Participant) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  participants,
  config,
  analytics = DEFAULT_ANALYTICS,
  isOpen,
  onClose,
  onViewParticipantTicket,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'athletes' | 'funnel' | 'audit' | 'settings'>('athletes');

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [settingsForm, setSettingsForm] = useState<EventConfig>(config);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setSettingsForm(config);
  }, [config]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser && isOpen) {
      const unsub = subscribeToAuditLogs((logs) => {
        setAuditLogs(logs);
      });
      return () => unsub();
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(''), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      await loginWithDirectPassword(authPassword);
      showToast('Painel do Organizador desbloqueado!');
      setAuthPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Senha incorreta.';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      showToast('Sessão encerrada.');
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const handleConfirmPayment = async (p: Participant) => {
    if (!currentUser?.email) return;
    try {
      await confirmParticipantPayment(
        p.id,
        currentUser.email,
        'Confirmado via WhatsApp / Painel Admin'
      );
      showToast(`Inscrição de ${p.fullName} confirmada!`);
    } catch (err) {
      console.error(err);
      showToast('Erro ao confirmar no Firestore.');
    }
  };

  const handleCancelRegistration = async (p: Participant) => {
    if (!currentUser?.email) return;
    try {
      await cancelParticipantRegistration(
        p.id,
        currentUser.email,
        'Cancelado pelo administrador no painel'
      );
      showToast(`Inscrição de ${p.fullName} cancelada.`);
    } catch (err) {
      console.error(err);
      showToast('Erro ao cancelar inscrição.');
    }
  };

  const handleDelete = async (p: Participant) => {
    if (!currentUser?.email) return;
    try {
      await deleteParticipantDoc(p.id, currentUser.email, p.fullName);
      setConfirmDeleteId(null);
      showToast(`Atleta ${p.fullName} removido.`);
    } catch (err) {
      console.error(err);
      showToast('Erro ao excluir do Firestore.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;
    setSavingSettings(true);
    try {
      await saveEventConfigToFirestore(settingsForm, currentUser.email);
      showToast('Configurações do evento atualizadas no Firestore!');
    } catch (err) {
      console.error(err);
      showToast('Erro ao gravar configurações no banco de dados.');
    } finally {
      setSavingSettings(false);
    }
  };

  const getWhatsAppAthleteUrl = (p: Participant) => {
    const cleanPhone = p.phone.replace(/\D/g, '');
    const fullNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const message = encodeURIComponent(
      `Olá ${p.fullName}! Tudo bem? Aqui é da organização do *Corre de Sexta (Eco Arena - 20/11 às 19h)*. ` +
        `Recebemos sua inscrição *#${p.bibNumber || p.id}* (5 Km). Sua vaga está confirmada!`
    );
    return `https://wa.me/${fullNumber}?text=${message}`;
  };

  // Metrics
  const pendingCount = participants.filter((p) => p.status === 'pending_payment').length;
  const confirmedCount = participants.filter((p) => p.status === 'confirmed').length;
  const cancelledCount = participants.filter((p) => p.status === 'cancelled').length;
  const totalActive = participants.filter((p) => p.status !== 'cancelled').length;
  const totalRevenue = participants
    .filter((p) => p.status === 'confirmed')
    .reduce((acc, curr) => acc + (curr.feeAmount || 0), 0);
  const pendingRevenue = participants
    .filter((p) => p.status === 'pending_payment')
    .reduce((acc, curr) => acc + (curr.feeAmount || 0), 0);

  // Funnel Metrics
  const pageViews = Math.max(analytics.pageViews || 0, totalActive);
  const ctaClicks = Math.max(analytics.ctaClicks || 0, totalActive);
  const formStarts = Math.max(analytics.formStarts || 0, totalActive);
  const whatsappRedirects = Math.max(analytics.whatsappRedirects || 0, totalActive);
  const conversionRate =
    pageViews > 0 ? ((totalActive / pageViews) * 100).toFixed(1) : '0.0';
  const clickToRegRate =
    ctaClicks > 0 ? ((totalActive / ctaClicks) * 100).toFixed(1) : '0.0';

  // Filtered participants
  const filtered = participants.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.cpf.includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q) ||
      (p.bibNumber && String(p.bibNumber).includes(q));
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'Codigo',
      'Num_Peito',
      'Nome_Completo',
      'CPF',
      'Email',
      'Telefone',
      'Distancia',
      'Status',
      'Valor_R$',
      'Data_Inscricao',
    ];

    const rows = participants.map((p) => [
      p.id,
      p.bibNumber || '',
      `"${p.fullName.replace(/"/g, '""')}"`,
      p.cpf,
      p.email || '',
      p.phone,
      p.distance,
      p.status,
      p.feeAmount.toFixed(2),
      p.registeredAt,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `corre_de_sexta_inscritos_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-5xl bg-white border-l border-slate-200 text-slate-900 flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 block">
                  Gestão Mobile & Métricas de Acesso
                </span>
                {currentUser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    <UserCheck className="w-3 h-3" /> Conectado
                  </span>
                )}
              </div>
              <h2 id="admin-drawer-title" className="text-lg sm:text-2xl font-black font-heading uppercase text-white">
                PAINEL DE INSCRITOS & ACESSOS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={handleLogout}
                type="button"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Fechar painel"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {actionSuccessMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          </div>
        )}

        {!currentUser ? (
          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-heading uppercase text-slate-900">
                  Acesso do Organizador
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Digite a senha direta da Eco Arena para abrir o painel de inscritos, métricas e configurações.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-direct-password"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Senha do Painel
                  </label>
                  <input
                    id="admin-direct-password"
                    type="password"
                    required
                    autoFocus
                    value={authPassword}
                    onChange={(e) => {
                      setAuthPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Digite a senha (ecoarena2025)"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{authLoading ? 'Desbloqueando...' : 'Abrir Painel'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Top Navigation Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 pt-2.5 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('athletes')}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'athletes'
                      ? 'bg-white text-emerald-800 border-slate-200 border-b-white shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Inscritos ({participants.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('funnel')}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'funnel'
                      ? 'bg-white text-emerald-800 border-slate-200 border-b-white shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>Acessos & Conversão</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('audit')}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'audit'
                      ? 'bg-white text-emerald-800 border-slate-200 border-b-white shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Auditoria</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-white text-emerald-800 border-slate-200 border-b-white shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-4 h-4 text-emerald-600" />
                  <span>Configurações</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: ATHLETES */}
            {activeTab === 'athletes' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Quick Overview Strip: Accesses, Clicks, Registered, WhatsApp */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-100 border-b border-slate-200 text-xs">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block font-semibold text-[11px]">Acessos na Página</span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xl font-black font-heading text-slate-900">{pageViews}</span>
                      <span className="text-[10px] font-bold text-emerald-600">Visitas</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block font-semibold text-[11px]">Cliques p/ Inscrever</span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xl font-black font-heading text-blue-600">{ctaClicks}</span>
                      <span className="text-[10px] font-bold text-blue-600">{clickToRegRate}% conv.</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-2xs">
                    <span className="text-emerald-800 block font-bold text-[11px]">Total de Inscritos</span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xl font-black font-heading text-emerald-600">{totalActive}</span>
                      <span className="text-[10px] font-bold text-slate-500">/ {config.earlyBirdLimit} vagas</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-green-700 block font-bold text-[11px]">Idas ao WhatsApp</span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xl font-black font-heading text-green-600">{whatsappRedirects}</span>
                      <span className="text-[10px] font-bold text-green-700">{conversionRate}% total</span>
                    </div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-3.5 border-b border-slate-200 space-y-2.5 bg-white">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome, CPF, e-mail, telefone ou nº de peito..."
                        className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={exportCSV}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-300 cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Exportar Planilha CSV</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 font-semibold">
                      <Filter className="w-3.5 h-3.5" /> Percurso:
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      5 Km Único
                    </span>

                    <span className="text-slate-500 ml-1 font-semibold">Status:</span>
                    {[
                      { key: 'all', label: `Todos (${participants.length})` },
                      { key: 'confirmed', label: `Confirmados (${confirmedCount})` },
                      { key: 'pending_payment', label: `Pendentes (${pendingCount})` },
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setFilterStatus(s.key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          filterStatus === s.key
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Athlete List */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-slate-50">
                  {filtered.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      Nenhum inscrito encontrado com os filtros selecionados.
                    </div>
                  ) : (
                    filtered.map((p) => (
                      <div
                        key={p.id}
                        className={`bg-white border rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs ${
                          p.status === 'confirmed'
                            ? 'border-emerald-200'
                            : p.status === 'pending_payment'
                            ? 'border-amber-200 bg-amber-50/20'
                            : 'border-slate-200 opacity-70'
                        }`}
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg text-[11px] border border-emerald-200">
                              #{p.bibNumber || p.id}
                            </span>
                            <strong className="text-sm font-black text-slate-900 truncate">
                              {p.fullName}
                            </strong>
                            <span className="font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {p.feeAmount === 0 ? 'Grátis (100 Primeiros)' : `R$ ${p.feeAmount.toFixed(2).replace('.', ',')}`}
                            </span>
                          </div>

                          <div className="text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1 font-medium">
                            <span>CPF: {p.cpf}</span>
                            {p.email && (
                              <>
                                <span>•</span>
                                <span className="text-slate-700 font-semibold">✉️ {p.email}</span>
                              </>
                            )}
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">
                              📱 {p.phone && p.phone !== 'Via WhatsApp' ? p.phone : 'Contato via WhatsApp'}
                            </span>
                            <span>•</span>
                            <span>5 Km</span>
                            <span>•</span>
                            <span className="text-slate-400">
                              {new Date(p.registeredAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          {p.phone && p.phone.replace(/\D/g, '').length >= 10 && (
                            <a
                              href={getWhatsAppAthleteUrl(p)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-500 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>Chamar no WhatsApp</span>
                            </a>
                          )}

                          {p.status !== 'confirmed' ? (
                            <button
                              type="button"
                              onClick={() => handleConfirmPayment(p)}
                              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirmar</span>
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Confirmado</span>
                            </span>
                          )}

                          {onViewParticipantTicket && (
                            <button
                              type="button"
                              onClick={() => onViewParticipantTicket(p)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Ver Voucher / Número de Peito"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {p.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleCancelRegistration(p)}
                              className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                              title="Cancelar inscrição"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}

                          {confirmDeleteId === p.id ? (
                            <button
                              type="button"
                              onClick={() => handleDelete(p)}
                              className="px-2.5 py-1.5 rounded-xl bg-red-600 text-white text-[11px] font-bold cursor-pointer"
                            >
                              Confirmar Exclusão
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(p.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remover definitivamente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FUNNEL & ACCESS ANALYTICS */}
            {activeTab === 'funnel' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
                        Métricas em Tempo Real (Firebase)
                      </span>
                      <h3 className="text-xl font-black font-heading text-slate-900 uppercase mt-0.5">
                        FUNIL DE ACESSOS & CONVERSÃO MOBILE
                      </h3>
                    </div>
                    <TrendingUp className="w-7 h-7 text-emerald-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs font-bold text-slate-500">1. Acessos na Página</span>
                      <div className="text-3xl font-black font-heading text-slate-900">{pageViews}</div>
                      <span className="text-[11px] text-slate-500 block">
                        Pessoas que abriram a landing page
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                      <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                        <MousePointerClick className="w-3.5 h-3.5" />
                        2. Cliques em Inscrever-se
                      </span>
                      <div className="text-3xl font-black font-heading text-blue-700">{ctaClicks}</div>
                      <span className="text-[11px] text-blue-700 block">
                        {formStarts} iniciaram o preenchimento
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-xs font-bold text-emerald-800">3. Inscrições Concluídas</span>
                      <div className="text-3xl font-black font-heading text-emerald-700">{totalActive}</div>
                      <span className="text-[11px] text-emerald-700 block">
                        Restam {Math.max(0, config.earlyBirdLimit - totalActive)} vagas das {config.earlyBirdLimit}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-green-50 border border-green-200 space-y-1">
                      <span className="text-xs font-bold text-green-800">4. Redirecionados ao WhatsApp</span>
                      <div className="text-3xl font-black font-heading text-green-700">{whatsappRedirects}</div>
                      <span className="text-[11px] text-green-700 font-bold block">
                        Taxa de Conversão: {conversionRate}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Funnel Bars */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-extrabold uppercase text-slate-700">
                      Proporção do Funil de Inscrição
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Visitantes da Página</span>
                          <span>{pageViews} (100%)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-700 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-blue-800 mb-1">
                          <span>Interesse / Cliques para Inscrever</span>
                          <span>
                            {ctaClicks} ({pageViews > 0 ? Math.min(100, Math.round((ctaClicks / pageViews) * 100)) : 0}%)
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${pageViews > 0 ? Math.min(100, Math.round((ctaClicks / pageViews) * 100)) : 0}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-emerald-800 mb-1">
                          <span>Inscrições Finalizadas & WhatsApp Acionado</span>
                          <span>
                            {totalActive} ({conversionRate}%)
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{
                              width: `${pageViews > 0 ? Math.min(100, Math.max(8, Math.round((totalActive / pageViews) * 100))) : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FINANCIAL AUDIT TRAIL */}
            {activeTab === 'audit' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-slate-200 bg-white">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-emerald-800 block">
                        Receita Efetivada
                      </span>
                      <span className="text-2xl font-black font-heading text-emerald-700">
                        R$ {totalRevenue.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <Receipt className="w-8 h-8 text-emerald-600 opacity-80" />
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-amber-800 block">
                        Receita Pendente
                      </span>
                      <span className="text-2xl font-black font-heading text-amber-700">
                        R$ {pendingRevenue.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <Clock className="w-8 h-8 text-amber-600 opacity-80" />
                  </div>

                  <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-slate-700 block">
                        Eventos Auditados
                      </span>
                      <span className="text-2xl font-black font-heading text-slate-900">
                        {auditLogs.length}
                      </span>
                    </div>
                    <History className="w-8 h-8 text-slate-500 opacity-80" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs bg-white rounded-2xl border border-slate-200 p-6">
                      Nenhum registro de auditoria gravado ainda.
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {log.action}
                            </span>
                            <span className="font-mono text-slate-400 text-[11px]">#{log.id}</span>
                          </div>
                          <p className="text-slate-800 font-medium">{log.details}</p>
                          <div className="text-[11px] text-slate-500">
                            Admin: <strong>{log.adminEmail}</strong> • {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: EVENT CONFIG & BATCHES */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
                <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto space-y-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
                  <div>
                    <h3 className="text-lg font-black font-heading text-slate-900 uppercase">
                      WhatsApp Oficial, Pix & Vagas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure o número de WhatsApp que recebe as inscrições automáticas e a chave Pix.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Link ou Número do WhatsApp Oficial
                        </label>
                        <input
                          type="text"
                          value={settingsForm.whatsAppNumber}
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, whatsAppNumber: e.target.value });
                          }}
                          placeholder="https://wa.me/message/HVASE7FUQGZ4B1"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Chave Pix da Eco Arena
                        </label>
                        <input
                          type="text"
                          value={settingsForm.pixKey}
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, pixKey: e.target.value });
                          }}
                          placeholder="(82) 99999-0000 ou CNPJ/E-mail"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Limite 1º Lote (Vagas)
                        </label>
                        <input
                          type="number"
                          value={settingsForm.earlyBirdLimit}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              earlyBirdLimit: parseInt(e.target.value) || 100,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Valor 1º Lote (R$ 0 = Grátis)
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          min="0"
                          value={settingsForm.earlyBirdFee}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              earlyBirdFee: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Valor Lote Extra (R$)
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          min="0"
                          value={settingsForm.standardFee}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              standardFee: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {savingSettings ? 'Salvando...' : 'Salvar Configurações'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
