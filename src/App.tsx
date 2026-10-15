import React, { useState, useEffect } from 'react';
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
import { FAQ } from './components/FAQ.tsx';
import { Footer } from './components/Footer.tsx';
import { DEFAULT_CONFIG, INITIAL_PARTICIPANTS } from './data/initialData.ts';
import { User } from 'firebase/auth';
import { EventConfig, ModalityDistance, Participant } from './types/index.ts';
import {
  subscribeToParticipants,
  subscribeToEventConfig,
  seedInitialDataIfEmpty,
  saveParticipant,
  saveEventConfigToFirestore,
} from './services/firestoreService.ts';
import { subscribeToAuthState, logoutAdmin } from './services/authService.ts';

const STORAGE_KEY_CONFIG = 'equarena_race_config_v1';
const STORAGE_KEY_PARTICIPANTS = 'equarena_race_participants_v1';

export default function App() {
  // Configuration state with local fallback
  const [config, setConfig] = useState<EventConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_CONFIG;
  });

  // Participants state with local fallback
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_PARTICIPANTS;
  });

  // Firebase Auth state for Admin
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals state
  const [paymentParticipant, setPaymentParticipant] = useState<Participant | null>(null);
  const [ticketParticipant, setTicketParticipant] = useState<Participant | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<ModalityDistance>('5km');

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubAuth = subscribeToAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // Initialize and sync with Firestore
  useEffect(() => {
    // 1. Seed initial data to Firestore if database is empty
    seedInitialDataIfEmpty(DEFAULT_CONFIG, INITIAL_PARTICIPANTS);

    // 2. Real-time subscription to participants
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

    // 3. Real-time subscription to config
    const unsubConfig = subscribeToEventConfig((liveConfig) => {
      if (liveConfig) {
        setConfig(liveConfig);
        try {
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(liveConfig));
        } catch {
          // ignore
        }
      }
    });

    return () => {
      unsubParticipants();
      unsubConfig();
    };
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('inscricao');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDetails = () => {
    const el = document.getElementById('detalhes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegistered = async (newParticipant: Participant) => {
    // Optimistic UI update
    setParticipants((prev) => [newParticipant, ...prev]);
    setPaymentParticipant(newParticipant);

    // Persist to Firebase Firestore
    try {
      await saveParticipant(newParticipant);
    } catch (err) {
      console.warn('Erro ao salvar participante no Firestore:', err);
    }
  };

  const handleSelectDistance = (dist: ModalityDistance) => {
    setSelectedDistance(dist);
    scrollToForm();
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Header with dynamic role-based actions */}
      <Header
        config={config}
        participants={participants}
        currentUser={currentUser}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToForm={scrollToForm}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Live Spots Counter */}
        <Hero
          config={config}
          participants={participants}
          onScrollToForm={scrollToForm}
          onScrollToDetails={scrollToDetails}
        />

        {/* Modalities, Kits & Schedule */}
        <EventDetails
          config={config}
          onSelectDistance={handleSelectDistance}
        />

        {/* Official Race Map (Massagueira / Orla da Lagoa) */}
        <RaceMap onSelectDistance={handleSelectDistance} />

        {/* Official Registration Form */}
        <RegistrationForm
          config={config}
          participants={participants}
          selectedDistance={selectedDistance}
          onRegistered={handleRegistered}
        />

        {/* Frequently Asked Questions */}
        <FAQ config={config} />
      </main>

      {/* Footer */}
      <Footer
        config={config}
        currentUser={currentUser}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToForm={scrollToForm}
        onLogout={handleLogout}
      />

      {/* Payment & WhatsApp Proof Modal */}
      {paymentParticipant && (
        <PaymentModal
          participant={paymentParticipant}
          config={config}
          onClose={() => setPaymentParticipant(null)}
          onViewTicket={() => {
            const current = paymentParticipant;
            setPaymentParticipant(null);
            setTicketParticipant(current);
          }}
        />
      )}

      {/* Printable Digital Voucher / Ticket Modal */}
      {ticketParticipant && (
        <TicketModal
          participant={ticketParticipant}
          config={config}
          onClose={() => setTicketParticipant(null)}
        />
      )}

      {/* Search / Lookup Modal */}
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

      {/* Admin Drawer with Firebase Auth, Athletes & Audit Trail */}
      <AdminDrawer
        participants={participants}
        config={config}
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

      {/* Settings Modal to customize WhatsApp / Pix numbers */}
      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
