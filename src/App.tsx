import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { EventDetails } from './components/EventDetails.tsx';
import { RaceMap } from './components/RaceMap.tsx';
import { RegistrationForm } from './components/RegistrationForm.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { TicketModal } from './components/TicketModal.tsx';
import { LookupModal } from './components/LookupModal.tsx';
import { AdminDrawer } from './components/AdminDrawer.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { Footer } from './components/Footer.tsx';
import { DEFAULT_ANALYTICS, DEFAULT_CONFIG, INITIAL_PARTICIPANTS } from './data/initialData.ts';
import { User } from 'firebase/auth';
import { AnalyticsStats, EventConfig, ModalityDistance, Participant } from './types/index.ts';
import {
  subscribeToParticipants,
  subscribeToEventConfig,
  subscribeToAnalyticsStats,
  trackAnalyticsEvent,
  seedInitialDataIfEmpty,
  saveParticipant,
  saveEventConfigToFirestore,
} from './services/firestoreService.ts';
import { subscribeToAuthState, logoutAdmin } from './services/authService.ts';
import { calculateRegistrationFee } from './utils/validation.ts';
import { MessageCircle } from 'lucide-react';

const STORAGE_KEY_CONFIG = 'equarena_race_config_v5';
const STORAGE_KEY_PARTICIPANTS = 'equarena_race_participants_v3';
const SESSION_PAGEVIEW_KEY = 'equarena_pageview_tracked_v1';

export default function App() {
  const [config, setConfig] = useState<EventConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_CONFIG;
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_PARTICIPANTS;
  });

  const [analytics, setAnalytics] = useState<AnalyticsStats>(DEFAULT_ANALYTICS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [paymentParticipant, setPaymentParticipant] = useState<Participant | null>(null);
  const [ticketParticipant, setTicketParticipant] = useState<Participant | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<ModalityDistance>('5km');

  const pageViewTrackedRef = useRef(false);

  useEffect(() => {
    const unsubAuth = subscribeToAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    seedInitialDataIfEmpty(DEFAULT_CONFIG, INITIAL_PARTICIPANTS);

    if (!pageViewTrackedRef.current) {
      pageViewTrackedRef.current = true;
      try {
        if (!sessionStorage.getItem(SESSION_PAGEVIEW_KEY)) {
          sessionStorage.setItem(SESSION_PAGEVIEW_KEY, '1');
          trackAnalyticsEvent('pageViews');
        }
      } catch {
        trackAnalyticsEvent('pageViews');
      }
    }

    const unsubParticipants = subscribeToParticipants((liveList) => {
      if (liveList && liveList.length > 0) {
        setParticipants(liveList);
        try {
          localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(liveList));
        } catch {
          // ignore
        }
      }
    });

    const unsubConfig = subscribeToEventConfig((liveConfig) => {
      if (liveConfig) {
        const normalizedFee =
          liveConfig.earlyBirdFee === 0 || liveConfig.earlyBirdFee === 5 || liveConfig.earlyBirdFee === 15
            ? 10.0
            : liveConfig.earlyBirdFee;
        const normalizedWhatsApp =
          !liveConfig.whatsAppNumber ||
          liveConfig.whatsAppNumber === '(82) 99999-0000' ||
          liveConfig.whatsAppNumber === '(71) 99999-8888'
            ? DEFAULT_CONFIG.whatsAppNumber
            : liveConfig.whatsAppNumber;
        const normalizedConfig: EventConfig = {
          ...liveConfig,
          eventName: DEFAULT_CONFIG.eventName,
          eventDate:
            liveConfig.eventDate === '2025-10-16' || liveConfig.eventDate === '2025-05-18'
              ? DEFAULT_CONFIG.eventDate
              : liveConfig.eventDate,
          whatsAppNumber: normalizedWhatsApp,
          earlyBirdFee: normalizedFee,
          standardFee:
            liveConfig.standardFee === 0 || liveConfig.standardFee === 25 || liveConfig.standardFee === 15
              ? 10.0
              : liveConfig.standardFee,
        };
        setConfig(normalizedConfig);
        try {
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(normalizedConfig));
        } catch {
          // ignore
        }
      }
    });

    const unsubAnalytics = subscribeToAnalyticsStats((liveStats) => {
      if (liveStats) {
        setAnalytics(liveStats);
      }
    });

    return () => {
      unsubParticipants();
      unsubConfig();
      unsubAnalytics();
    };
  }, []);

  const openRegistrationModal = () => {
    trackAnalyticsEvent('ctaClicks');
    setIsRegistrationOpen(true);
  };

  const scrollToDetails = () => {
    const el = document.getElementById('detalhes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormStart = () => {
    trackAnalyticsEvent('formStarts');
  };

  const handleRegistered = async (newParticipant: Participant, whatsAppUrl: string) => {
    setIsRegistrationOpen(false);
    setParticipants((prev) => [newParticipant, ...prev]);
    setPaymentParticipant(newParticipant);

    trackAnalyticsEvent('registrationsCount');
    trackAnalyticsEvent('whatsappRedirects');

    try {
      const a = document.createElement('a');
      a.href = whatsAppUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Fallback handled by PaymentModal button
    }

    try {
      await saveParticipant(newParticipant);
    } catch (err) {
      console.warn('Erro ao salvar participante no Firestore:', err);
    }
  };

  const handleSelectDistance = (dist: ModalityDistance) => {
    setSelectedDistance(dist);
    openRegistrationModal();
  };

  const handleSaveSettings = async (newConfig: EventConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
      await saveEventConfigToFirestore(newConfig, currentUser?.email || 'admin@ecoarena.com.br');
    } catch (err) {
      console.warn('Erro ao salvar configurações no Firestore:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setIsAdminOpen(false);
      setIsSettingsOpen(false);
    } catch (err) {
      console.warn('Erro ao deslogar do Firebase Auth:', err);
    }
  };

  const activeCount = participants.filter((p) => p.status !== 'cancelled').length;
  const feeInfo = calculateRegistrationFee(
    activeCount,
    config.earlyBirdLimit,
    config.earlyBirdFee || 10,
    config.standardFee || 10
  );

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white pb-16 sm:pb-0">
      <Header
        config={config}
        participants={participants}
        currentUser={currentUser}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToForm={openRegistrationModal}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden bg-slate-50">
        {/* 1. Clean Hero */}
        <Hero
          config={config}
          participants={participants}
          onScrollToForm={openRegistrationModal}
          onScrollToDetails={scrollToDetails}
        />

        {/* 2. Benefits & 5 Sorteios */}
        <EventDetails
          config={config}
          onSelectDistance={handleSelectDistance}
        />

        {/* 3. Official Race Map */}
        <RaceMap onSelectDistance={handleSelectDistance} />
      </main>

      <Footer
        config={config}
        currentUser={currentUser}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToForm={openRegistrationModal}
        onLogout={handleLogout}
      />

      {/* Mobile Sticky Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-50/95 backdrop-blur-md border-t border-slate-200/80 px-3.5 py-2 shadow-lg flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-slate-500 truncate">
            20/11 às 19h • Benefícios e Sorteios
          </div>
          <div className="text-xs font-bold text-slate-900 truncate">
            Inscrição Antecipada: <span className="text-emerald-600">R$ {(feeInfo.fee || 10).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={openRegistrationModal}
          className="px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Inscrever-se</span>
        </button>
      </div>

      {/* Registration Form Modal (Only closes via X button) */}
      <RegistrationForm
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        config={config}
        participants={participants}
        selectedDistance={selectedDistance}
        onRegistered={handleRegistered}
        onFormStart={handleFormStart}
      />

      {paymentParticipant && (
        <PaymentModal
          participant={paymentParticipant}
          config={config}
          onClose={() => setPaymentParticipant(null)}
          onWhatsAppClick={() => trackAnalyticsEvent('whatsappRedirects')}
          onViewTicket={() => {
            const current = paymentParticipant;
            setPaymentParticipant(null);
            setTicketParticipant(current);
          }}
        />
      )}

      {ticketParticipant && (
        <TicketModal
          participant={ticketParticipant}
          config={config}
          onClose={() => setTicketParticipant(null)}
        />
      )}

      {isLookupOpen && (
        <LookupModal
          participants={participants}
          onClose={() => setIsLookupOpen(false)}
          onSelectParticipant={(p) => {
            setIsLookupOpen(false);
            setTicketParticipant(p);
          }}
        />
      )}

      <AdminDrawer
        participants={participants}
        config={config}
        analytics={analytics}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenSettings={() => {
          setIsAdminOpen(false);
          setIsSettingsOpen(true);
        }}
        onViewParticipantTicket={(p) => {
          setIsAdminOpen(false);
          setTicketParticipant(p);
        }}
      />

      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
