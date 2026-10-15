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
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { AuditLog, EventConfig, Participant } from '../types/index.ts';

const PARTICIPANTS_COLLECTION = 'participants';
const CONFIG_COLLECTION = 'event_config';
const CONFIG_DOC_ID = 'general';
const AUDIT_COLLECTION = 'audit_logs';

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
      // Sort newest first
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
 * Real-time listener for event configuration
 */
export function subscribeToEventConfig(
  callback: (config: EventConfig) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as EventConfig);
      }
    },
    (err) => {
      console.warn('Erro ao escutar configurações do evento:', err);
      if (onError) onError(err);
    }
  );
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
  // Ensure required fields
  const cleanData: Record<string, unknown> = {
    ...participant,
    status: participant.status || 'pending_payment',
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
  const participantData = docSnap.exists() ? (docSnap.data() as Participant) : null;

  const now = new Date().toISOString();
  await updateDoc(docRef, {
    status: 'confirmed',
    confirmedPresence: true,
    confirmedAt: now,
    confirmedBy: adminEmail,
    notes: note,
  });

  await recordAuditLog({
    action: 'CONFIRM_PAYMENT',
    participantId,
    participantName: participantData?.fullName || 'Atleta',
    amount: participantData?.feeAmount || 0,
    adminEmail,
    details: `Pagamento PIX confirmado para inscrição #${participantId}. ${note}`,
    timestamp: now,
  });
}

/**
 * Business Rule: Cancel registration and log event
 */
export async function cancelParticipantRegistration(
  participantId: string,
  adminEmail: string,
  reason: string = 'Inscrição cancelada pela administração'
): Promise<void> {
  const docRef = doc(db, PARTICIPANTS_COLLECTION, participantId);
  const docSnap = await getDoc(docRef);
  const participantData = docSnap.exists() ? (docSnap.data() as Participant) : null;

  const now = new Date().toISOString();
  await updateDoc(docRef, {
    status: 'cancelled',
    confirmedPresence: false,
    notes: reason,
  });

  await recordAuditLog({
    action: 'CANCEL_REGISTRATION',
    participantId,
    participantName: participantData?.fullName || 'Atleta',
    amount: participantData?.feeAmount || 0,
    adminEmail,
    details: `Inscrição cancelada: ${reason}`,
    timestamp: now,
  });
}

/**
 * Delete a participant with audit logging
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
      await recordAuditLog({
        action: 'UPDATE_SETTINGS',
        adminEmail: 'sistema@ecoarena.com.br',
        details: 'Configurações padrão da Ecoarena inicializadas no Firestore.',
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Seed initial participants if empty
    const participantsCol = collection(db, PARTICIPANTS_COLLECTION);
    const snap = await getDocs(query(participantsCol, limit(1)));
    if (snap.empty && initialParticipants.length > 0) {
      const batch = writeBatch(db);
      for (const p of initialParticipants) {
        const pRef = doc(db, PARTICIPANTS_COLLECTION, p.id);
        batch.set(pRef, p);
      }
      await batch.commit();

      await recordAuditLog({
        action: 'MANUAL_REGISTRATION',
        adminEmail: 'sistema@ecoarena.com.br',
        details: `Carga inicial de ${initialParticipants.length} atletas cadastrada no banco de dados.`,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Seed inicial do Firestore:', err);
  }
}
