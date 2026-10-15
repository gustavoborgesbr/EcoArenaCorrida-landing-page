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
  Flame,
  ShieldCheck,
  Lock,
  LogOut,
  FileSpreadsheet,
  AlertCircle,
  MessageCircle,
  ExternalLink,
  DollarSign,
  History,
  Settings,
  UserCheck,
  Ban,
  ArrowRight,
  TrendingUp,
  Receipt,
  Eye,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AuditLog, EventConfig, Participant } from '../types/index.ts';
import { loginAdmin, registerAdmin, logoutAdmin, subscribeToAuthState, ADMIN_PRIMARY_EMAIL } from '../services/authService.ts';
import {
  confirmParticipantPayment,
  cancelParticipantRegistration,
  deleteParticipantDoc,
  subscribeToAuditLogs,
  saveEventConfigToFirestore,
} from '../services/firestoreService.ts';
import { formatPhone } from '../utils/validation.ts';

interface AdminDrawerProps {
  participants: Participant[];
  config: EventConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  onViewParticipantTicket?: (p: Participant) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  participants,
  config,
  isOpen,
  onClose,
  onViewParticipantTicket,
}) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState(ADMIN_PRIMARY_EMAIL);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'athletes' | 'audit' | 'settings'>('athletes');

  // Filters & Search
  const [filterDistance, setFilterDistance] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Settings form within Admin
  const [settingsForm, setSettingsForm] = useState<EventConfig>(config);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setSettingsForm(config);
  }, [config]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to audit logs when logged in
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
      if (isRegisterMode) {
        await registerAdmin(authEmail, authPassword);
        showToast('Conta administrativa criada com sucesso!');
      } else {
        await loginAdmin(authEmail, authPassword);
        showToast('Login de administrador realizado!');
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Falha na autenticação';
      if (msg.includes('user-not-found') || msg.includes('invalid-credential')) {
        setAuthError('E-mail ou senha incorretos. Verifique e tente novamente.');
      } else if (msg.includes('weak-password')) {
        setAuthError('A senha deve conter no mínimo 6 caracteres.');
      } else if (msg.includes('email-already-in-use')) {
        setAuthError('Este e-mail já possui cadastro. Alterne para a opção "Entrar com Senha".');
      } else {
        setAuthError(`Erro ao autenticar: ${msg}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    showToast('Sessão administrativa encerrada.');
  };

  // Participant Actions
  const handleConfirmPayment = async (p: Participant) => {
    if (!currentUser?.email) return;
    try {
      await confirmParticipantPayment(
        p.id,
        currentUser.email,
        'Comprovante PIX validado e confirmado no WhatsApp'
      );
      showToast(`Pagamento do atleta ${p.fullName} confirmado com sucesso!`);
    } catch (err) {
      console.error(err);
      alert('Erro ao confirmar pagamento no banco de dados.');
    }
  };

  const handleCancelRegistration = async (p: Participant) => {
    if (!currentUser?.email) return;
    if (confirm(`Deseja realmente marcar a inscrição de ${p.fullName} como CANCELADA?`)) {
      try {
        await cancelParticipantRegistration(p.id, currentUser.email, 'Cancelado pelo painel');
        showToast(`Inscrição de ${p.fullName} cancelada.`);
      } catch (err) {
        console.error(err);
        alert('Erro ao cancelar inscrição.');
      }
    }
  };

  const handleDelete = async (p: Participant) => {
    if (!currentUser?.email) return;
    if (confirm(`ATENÇÃO: Deseja EXCLUIR definitivamente o cadastro de ${p.fullName}? Essa ação será registrada na auditoria.`)) {
      try {
        await deleteParticipantDoc(p.id, currentUser.email, p.fullName);
        showToast(`Atleta ${p.fullName} removido.`);
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir do Firestore.');
      }
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
      alert('Erro ao gravar configurações no banco de dados.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Helper to open WhatsApp for participant verification
  const openWhatsAppVerification = (p: Participant) => {
    const cleanPhone = p.phone.replace(/\D/g, '');
    const fullNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const message = encodeURIComponent(
      `Olá ${p.fullName}! Sou da organização da Corrida Arena (4 Anos de Eco Arena). ` +
      `Localizamos sua inscrição #${p.id} (${p.distance}) com status pendente de R$ ${p.feeAmount.toFixed(2).replace('.', ',')}. ` +
      `Poderia nos enviar o comprovante Pix por aqui para validarmos sua inscrição oficial?`
    );
    window.open(`https://wa.me/${fullNumber}?text=${message}`, '_blank');
  };

  // Metrics
  const pendingCount = participants.filter((p) => p.status === 'pending_payment').length;
  const confirmedCount = participants.filter((p) => p.status === 'confirmed').length;
  const cancelledCount = participants.filter((p) => p.status === 'cancelled').length;
  const totalRevenue = participants
    .filter((p) => p.status === 'confirmed')
    .reduce((acc, curr) => acc + (curr.feeAmount || 0), 0);
  const pendingRevenue = participants
    .filter((p) => p.status === 'pending_payment')
    .reduce((acc, curr) => acc + (curr.feeAmount || 0), 0);

  // Filtered participants
  const filtered = participants.filter((p) => {
    const matchesDistance = filterDistance === 'all' || p.distance === filterDistance;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.cpf.includes(q) ||
      p.id.toLowerCase().includes(q) ||
      String(p.bibNumber || '').includes(q);
    return matchesDistance && matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'ID',
      'Numero_Peito',
      'Nome_Completo',
      'CPF',
      'RG',
      'WhatsApp',
      'Distancia',
      'Tamanho_Camiseta',
      'Status_Pagamento',
      'Valor_R$',
      'Data_Inscricao',
      'Confirmado_Em',
      'Confirmado_Por',
      'Contato_Emergencia',
      'Telefone_Emergencia',
    ];

    const rows = participants.map((p) => [
      p.id,
      p.bibNumber || '',
      `"${p.fullName.replace(/"/g, '""')}"`,
      p.cpf,
      p.rg,
      p.phone,
      p.distance,
      p.shirtSize,
      p.status,
      p.feeAmount.toFixed(2),
      p.registeredAt,
      p.confirmedAt || '',
      p.confirmedBy || '',
      `"${(p.emergencyName || '').replace(/"/g, '""')}"`,
      p.emergencyPhone || '',
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `ecoarena_inscricoes_oficiais_${new Date().toISOString().slice(0, 10)}.csv`
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
      <div className="w-full max-w-5xl bg-white border-l border-slate-200 text-slate-900 flex flex-col h-full shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 block">
                  Firebase Cloud Database & Auth
                </span>
                {currentUser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    <UserCheck className="w-3 h-3" /> Conectado
                  </span>
                )}
              </div>
              <h2 id="admin-drawer-title" className="text-xl sm:text-2xl font-black font-heading uppercase text-white">
                PAINEL ADMINISTRATIVO & AUDITORIA
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={handleLogout}
                type="button"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                title="Encerrar sessão"
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

        {/* Success toast notification */}
        {actionSuccessMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-inner animate-in slide-in-from-top">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage('')}
              className="text-emerald-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* AUTH GUARD: If not authenticated, display login screen */}
        {!currentUser ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-center bg-slate-50">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900 uppercase">
                  {isRegisterMode ? 'Cadastrar Novo Administrador' : 'Acesso Restrito ao Painel'}
                </h3>
                <p className="text-xs text-slate-500">
                  Autenticação segura via Firebase Auth para validação de inscrições e auditoria financeira.
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    E-mail do Administrador
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="admin@ecoarena.com.br"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Admin oficial configurado: <strong className="text-emerald-700">{ADMIN_PRIMARY_EMAIL}</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Senha de Acesso
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Mínimo 6 dígitos"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? (
                    <span>Processando...</span>
                  ) : (
                    <>
                      <span>{isRegisterMode ? 'Cadastrar e Entrar' : 'Entrar no Painel'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setAuthError('');
                  }}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  {isRegisterMode
                    ? 'Já possui conta? Clique para entrar'
                    : 'Primeiro acesso? Criar conta de administrador'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED: Display Full Admin Dashboard */
          <>
            {/* Top Navigation Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 pt-3 flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('athletes')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-colors cursor-pointer ${
                    activeTab === 'athletes'
                      ? 'bg-white text-emerald-800 border-slate-200 border-b-white shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Inscrições & Atletas</span>
                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                      {pendingCount} pendentes
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('audit')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-colors cursor-pointer ${
                    activeTab === 'audit'
                      ? 'bg-white text-emerald-800 border-slate-200 border-b-white shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Auditoria Financeira</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                    {auditLogs.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-white text-emerald-800 border-slate-200 border-b-white shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-4 h-4 text-emerald-600" />
                  <span>Configurações & Lotes</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 pb-2">
                <span>Operador:</span>
                <strong className="text-slate-800 truncate max-w-[200px]">{currentUser.email}</strong>
              </div>
            </div>

            {/* TAB CONTENT: ATHLETES */}
            {activeTab === 'athletes' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100 border-b border-slate-200 text-xs">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-slate-500 block font-medium">Total de Cadastros</span>
                    <span className="text-xl font-black font-heading text-slate-900">{participants.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-emerald-700 block font-bold">Pagamentos Confirmados</span>
                    <span className="text-xl font-black font-heading text-emerald-600">{confirmedCount}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-amber-700 block font-bold">Aguardando WhatsApp / Pix</span>
                    <span className="text-xl font-black font-heading text-amber-600">{pendingCount}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-slate-500 block font-medium">Receita Confirmada</span>
                    <span className="text-xl font-black font-heading text-emerald-600">
                      R$ {totalRevenue.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome, CPF, número de peito ou código..."
                        className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={exportCSV}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-300 shadow-sm cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 font-semibold">
                      <Filter className="w-3.5 h-3.5" /> Distância:
                    </span>
                    {['all', '3km', '5km', '10km'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFilterDistance(d)}
                        className={`px-3 py-1 rounded-xl font-bold transition-colors cursor-pointer ${
                          filterDistance === d
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {d === 'all' ? 'Todas' : d}
                      </button>
                    ))}

                    <span className="text-slate-500 ml-2 font-semibold">Status:</span>
                    {[
                      { key: 'all', label: 'Todos' },
                      { key: 'pending_payment', label: `Aguardando Pix (${pendingCount})` },
                      { key: 'confirmed', label: `Confirmados (${confirmedCount})` },
                      { key: 'cancelled', label: `Cancelados (${cancelledCount})` },
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setFilterStatus(s.key)}
                        className={`px-3 py-1 rounded-xl font-bold transition-colors cursor-pointer ${
                          filterStatus === s.key
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Athlete List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 text-xs">
                      Nenhum atleta encontrado com os filtros selecionados.
                    </div>
                  ) : (
                    filtered.map((p) => (
                      <div
                        key={p.id}
                        className={`bg-white border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-sm transition-all ${
                          p.status === 'confirmed'
                            ? 'border-emerald-200 hover:border-emerald-300'
                            : p.status === 'pending_payment'
                            ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                            : 'border-slate-200 opacity-70'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg text-[11px] border border-emerald-200">
                              #{p.bibNumber || p.id}
                            </span>
                            <strong className="text-sm font-bold text-slate-900">{p.fullName}</strong>
                            {p.isEarlyBird && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-extrabold border border-amber-200">
                                <Flame className="w-3 h-3 fill-amber-600 text-amber-600" /> Lote R$ 5
                              </span>
                            )}
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              R$ {p.feeAmount.toFixed(2).replace('.', ',')}
                            </span>
                          </div>

                          <div className="text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1 font-medium">
                            <span>CPF: {p.cpf}</span>
                            <span>•</span>
                            <span>RG: {p.rg}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">{p.phone}</span>
                            <span>•</span>
                            <span>Camiseta: <strong>{p.shirtSize}</strong></span>
                            <span>•</span>
                            <span>Distância: <strong>{p.distance}</strong></span>
                          </div>

                          {p.confirmedBy && (
                            <div className="text-[11px] text-slate-500">
                              Confirmado por: <span className="font-medium text-slate-700">{p.confirmedBy}</span>
                              {p.confirmedAt && ` em ${new Date(p.confirmedAt).toLocaleString('pt-BR')}`}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                          {/* WhatsApp verification button */}
                          <button
                            type="button"
                            onClick={() => openWhatsAppVerification(p)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 border border-green-300 transition-colors cursor-pointer"
                            title="Abrir WhatsApp para conferir ou pedir comprovante"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Confirm Payment button */}
                          {p.status !== 'confirmed' ? (
                            <button
                              type="button"
                              onClick={() => handleConfirmPayment(p)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors cursor-pointer"
                              title="Confirmar pagamento e registrar na auditoria"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirmar Pix</span>
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Pago</span>
                            </span>
                          )}

                          {/* View Ticket / Kit Voucher */}
                          {onViewParticipantTicket && (
                            <button
                              type="button"
                              onClick={() => onViewParticipantTicket(p)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Visualizar Comprovante / Voucher de Retirada do Kit"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {/* Cancel button */}
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

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remover definitivamente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FINANCIAL AUDIT TRAIL */}
            {activeTab === 'audit' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                {/* Audit KPIs */}
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
                        Receita Prevista (Pendente)
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
                        Eventos Registrados
                      </span>
                      <span className="text-2xl font-black font-heading text-slate-900">
                        {auditLogs.length}
                      </span>
                    </div>
                    <History className="w-8 h-8 text-slate-500 opacity-80" />
                  </div>
                </div>

                {/* Audit Log Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Trilha de Auditoria em Tempo Real (Firestore `audit_logs`)
                  </div>

                  {auditLogs.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 text-xs bg-white rounded-2xl border border-slate-200 p-6">
                      Nenhum registro de auditoria gravado ainda. As confirmações e alterações serão registradas aqui automaticamente.
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                                log.action === 'CONFIRM_PAYMENT'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : log.action === 'UPDATE_SETTINGS'
                                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                                  : log.action === 'CANCEL_REGISTRATION'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-red-100 text-red-800 border-red-300'
                              }`}
                            >
                              {log.action}
                            </span>
                            <span className="font-mono text-slate-400 text-[11px]">#{log.id}</span>
                            {log.amount !== undefined && log.amount > 0 && (
                              <span className="font-bold text-emerald-700">
                                + R$ {log.amount.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                          </div>

                          <p className="text-slate-800 font-medium">{log.details}</p>

                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>Admin: <strong className="text-slate-700">{log.adminEmail}</strong></span>
                            <span>•</span>
                            <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
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
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-lg font-black font-heading text-slate-900 uppercase">
                      Parâmetros da Corrida & Lotes
                    </h3>
                    <p className="text-xs text-slate-500">
                      Alterações são sincronizadas em tempo real com todos os usuários via Firestore.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Chave Pix / WhatsApp da Equarena
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsAppNumber}
                        onChange={(e) => {
                          const val = formatPhone(e.target.value);
                          setSettingsForm({ ...settingsForm, whatsAppNumber: val, pixKey: val });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Nome do Titular do Pix
                        </label>
                        <input
                          type="text"
                          value={settingsForm.pixReceiverName}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, pixReceiverName: e.target.value })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Cidade do Favorecido
                        </label>
                        <input
                          type="text"
                          value={settingsForm.pixReceiverCity}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, pixReceiverCity: e.target.value })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Vagas do Lote Promocional
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
                          Valor Lote 1 (R$)
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          value={settingsForm.earlyBirdFee}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              earlyBirdFee: parseFloat(e.target.value) || 5,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Valor Padrão (R$)
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          value={settingsForm.standardFee}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              standardFee: parseFloat(e.target.value) || 25,
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
                    className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {savingSettings ? 'Gravando no Firestore...' : 'Salvar Alterações e Registrar Auditoria'}
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
