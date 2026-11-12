import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  limit,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { AnalyticsStats, AuditLog, EventConfig, Participant } from '../types/index.ts';
import { DEFAULT_ANALYTICS } from '../data/initialData.ts';

const PARTICIPANTS_COLLECTION = 'participants';
const CONFIG_COLLECTION = 'event_config';
const CONFIG_DOC_ID = 'general';
const AUDIT_COLLECTION = 'audit_logs';
const ANALYTICS_COLLECTION = 'analytics_stats';
const ANALYTICS_DOC_ID = 'funnel_metrics';

/**
 * Real-time listener for all participants ordered by registration date
 */
export function subscribeToParticipants(
  callback: (participants: Participant[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, PARTICIPANTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Participant[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as Participant), id: docSnap.id });
      });
      list.sort((a, b) => {
        const tA = new Date(a.registeredAt || 0).getTime();
        const tB = new Date(b.registeredAt || 0).getTime();
        return tB - tA;
      });
      callback(list);
    },
    (err) => {
      console.warn('Erro ao escutar participantes no Firestore:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for global event configuration
 */
export function subscribeToEventConfig(
  callback: (config: EventConfig | null) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as EventConfig);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn('Erro ao escutar configuração do evento:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for funnel analytics (page views, CTA clicks, registrations, WhatsApp redirects)
 */
export function subscribeToAnalyticsStats(
  callback: (stats: AnalyticsStats) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as AnalyticsStats);
      } else {
        callback(DEFAULT_ANALYTICS);
      }
    },
    (err) => {
      console.warn('Erro ao escutar métricas de acesso:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Increment a specific analytics counter in Firestore
 */
export async function trackAnalyticsEvent(
  metric: 'pageViews' | 'ctaClicks' | 'formStarts' | 'registrationsCount' | 'whatsappRedirects'
): Promise<void> {
  try {
    const docRef = doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID);
    await setDoc(
      docRef,
      {
        [metric]: increment(1),
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn(`Não foi possível registrar métrica (${metric}):`, err);
  }
}

/**
 * Real-time listener for audit logs (most recent first)
 */
export function subscribeToAuditLogs(
  callback: (logs: AuditLog[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, AUDIT_COLLECTION);
  const q = query(colRef, limit(100));
  return onSnapshot(
    q,
    (snapshot) => {
      const logs: AuditLog[] = [];
      snapshot.forEach((docSnap) => {
        logs.push({ ...(docSnap.data() as AuditLog), id: docSnap.id });
      });
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(logs);
    },
    (err) => {
      console.warn('Erro ao escutar logs de auditoria:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save new or existing participant registration
 */
export async function saveParticipant(participant: Participant): Promise<void> {
  const docRef = doc(db, PARTICIPANTS_COLLECTION, participant.id);
  const cleanData: Record<string, unknown> = {
    ...participant,
    status: participant.status || 'confirmed',
    registeredAt: participant.registeredAt || new Date().toISOString(),
  };
  await setDoc(docRef, cleanData, { merge: true });
}

/**
 * Create an audit log record
 */
export async function recordAuditLog(log: Omit<AuditLog, 'id'>): Promise<void> {
  try {
    const logId = `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, AUDIT_COLLECTION, logId);
    await setDoc(docRef, {
      ...log,
      id: logId,
    });
  } catch (err) {
    console.error('Falha ao gravar registro de auditoria:', err);
  }
}

/**
 * Business Rule: Confirm payment and create audit trail
 */
export async function confirmParticipantPayment(
  participantId: string,
  adminEmail: string,
  note: string = 'Comprovante PIX verificado via WhatsApp'
): Promise<void> {
  const docRef = doc(db, PARTICIPANTS_COLLECTION, participantId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Participante não encontrado no banco de dados.');
  }

  const p = docSnap.data() as Participant;
  const now = new Date().toISOString();

  await updateDoc(docRef, {
    status: 'confirmed',
    confirmedAt: now,
    confirmedBy: adminEmail,
    notes: note,
  });

  await recordAuditLog({
    action: 'CONFIRM_PAYMENT',
    participantId: p.id,
    participantName: p.fullName,
    amount: p.feeAmount,
    adminEmail,
    details: `Inscrição #${p.id} confirmada (${note}).`,
    timestamp: now,
  });
}

/**
 * Business Rule: Cancel registration and record audit log
 */
export async function cancelParticipantRegistration(
  participantId: string,
  adminEmail: string,
  reason: string = 'Cancelado pela administração'
): Promise<void> {
  const docRef = doc(db, PARTICIPANTS_COLLECTION, participantId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Participante não encontrado.');
  }

  const p = docSnap.data() as Participant;
  const now = new Date().toISOString();

  await updateDoc(docRef, {
    status: 'cancelled',
    notes: reason,
  });

  await recordAuditLog({
    action: 'CANCEL_REGISTRATION',
    participantId: p.id,
    participantName: p.fullName,
    amount: p.feeAmount,
    adminEmail,
    details: `Inscrição #${p.id} cancelada (${reason}).`,
    timestamp: now,
  });
}

/**
 * Delete a participant document and log audit
 */
export async function deleteParticipantDoc(
  participantId: string,
  adminEmail: string,
  participantName: string
): Promise<void> {
  const docRef = doc(db, PARTICIPANTS_COLLECTION, participantId);
  await deleteDoc(docRef);

  await recordAuditLog({
    action: 'DELETE_REGISTRATION',
    participantId,
    participantName,
    adminEmail,
    details: `Cadastro do atleta ${participantName} removido da base de dados.`,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Save event configuration and log change
 */
export async function saveEventConfigToFirestore(
  config: EventConfig,
  adminEmail: string
): Promise<void> {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  await setDoc(docRef, config, { merge: true });

  await recordAuditLog({
    action: 'UPDATE_SETTINGS',
    adminEmail,
    details: `Configurações do evento atualizadas (PIX: ${config.pixKey}, WhatsApp: ${config.whatsAppNumber}, Lote 1: R$ ${config.earlyBirdFee}, Padrão: R$ ${config.standardFee}).`,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Seed initial data if Firestore collections are empty
 */
export async function seedInitialDataIfEmpty(
  defaultConfig: EventConfig,
  initialParticipants: Participant[]
): Promise<void> {
  try {
    // 1. Seed Config if missing
    const configDocRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    const configSnap = await getDoc(configDocRef);
    if (!configSnap.exists()) {
      await setDoc(configDocRef, defaultConfig);
    }

    // 2. Seed Analytics if missing
    const analyticsDocRef = doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID);
    const analyticsSnap = await getDoc(analyticsDocRef);
    if (!analyticsSnap.exists()) {
      await setDoc(analyticsDocRef, DEFAULT_ANALYTICS);
    }

    // 3. Seed initial participants if empty
    const participantsCol = collection(db, PARTICIPANTS_COLLECTION);
    const snap = await getDocs(query(participantsCol, limit(1)));
    if (snap.empty && initialParticipants.length > 0) {
      const batch = writeBatch(db);
      for (const p of initialParticipants) {
        const pRef = doc(db, PARTICIPANTS_COLLECTION, p.id);
        batch.set(pRef, p);
      }
      await batch.commit();
    }
  } catch (err) {
    console.warn('Seed inicial do Firestore:', err);
  }
}
