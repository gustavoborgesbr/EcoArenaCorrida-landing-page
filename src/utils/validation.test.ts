import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCPF,
  formatCPF,
  formatPhone,
  validatePhone,
  calculateRegistrationFee,
  cleanWhatsAppNumber,
  buildWhatsAppMessage,
  generatePixPayload,
} from './validation.ts';

test('CPF validation correctly handles valid and invalid CPFs', () => {
  // Common test CPFs
  assert.equal(validateCPF('11144477735'), true);
  assert.equal(validateCPF('111.444.777-35'), true);
  
  // Rejects invalid repeated digits
  assert.equal(validateCPF('11111111111'), false);
  assert.equal(validateCPF('00000000000'), false);
  
  // Rejects wrong check digits
  assert.equal(validateCPF('11144477736'), false);
  assert.equal(validateCPF('123'), false);
  assert.equal(validateCPF(''), false);
});

test('formatCPF correctly masks numbers', () => {
  assert.equal(formatCPF('11144477735'), '111.444.777-35');
  assert.equal(formatCPF('12345'), '123.45');
});

test('formatPhone correctly masks Brazilian numbers', () => {
  assert.equal(formatPhone('11987654321'), '(11) 98765-4321');
  assert.equal(formatPhone('1133334444'), '(11) 3333-4444');
});

test('validatePhone checks valid length', () => {
  assert.equal(validatePhone('(11) 98765-4321'), true);
  assert.equal(validatePhone('1133334444'), true);
  assert.equal(validatePhone('12345'), false);
});

test('calculateRegistrationFee respects early bird 100 spots limit', () => {
  // First 100 registered should get R$ 5,00
  const early1 = calculateRegistrationFee(0);
  assert.equal(early1.fee, 5);
  assert.equal(early1.isEarlyBird, true);
  assert.equal(early1.remainingEarlyBirdSpots, 100);

  const early99 = calculateRegistrationFee(99);
  assert.equal(early99.fee, 5);
  assert.equal(early99.isEarlyBird, true);
  assert.equal(early99.remainingEarlyBirdSpots, 1);

  // Spot 100 and after should be regular fee (e.g. 25)
  const regular100 = calculateRegistrationFee(100);
  assert.equal(regular100.fee, 25);
  assert.equal(regular100.isEarlyBird, false);
  assert.equal(regular100.remainingEarlyBirdSpots, 0);

  const regular150 = calculateRegistrationFee(150);
  assert.equal(regular150.fee, 25);
  assert.equal(regular150.isEarlyBird, false);
});

test('cleanWhatsAppNumber adds Brazilian country code 55 if missing', () => {
  assert.equal(cleanWhatsAppNumber('(71) 99999-8888'), '5571999998888');
  assert.equal(cleanWhatsAppNumber('5571999998888'), '5571999998888');
});

test('buildWhatsAppMessage produces comprehensive confirmation text', () => {
  const msg = buildWhatsAppMessage({
    fullName: 'Carlos Silva',
    cpf: '111.444.777-35',
    rg: '12.345.678-9',
    distance: '5 km',
    fee: 5,
    registrationId: 'EQ-042',
    isEarlyBird: true,
  });

  assert.ok(msg.includes('Carlos Silva'));
  assert.ok(msg.includes('111.444.777-35'));
  assert.ok(msg.includes('R$ 5,00'));
  assert.ok(msg.includes('Lote Promocional'));
  assert.ok(msg.includes('#EQ-042'));
});

test('generatePixPayload generates EMV standard string', () => {
  const payload = generatePixPayload({
    pixKey: '71999998888',
    merchantName: 'EQUARENA',
    merchantCity: 'SALVADOR',
    amount: 5.0,
    txid: 'EQ001',
  });

  assert.ok(payload.startsWith('000201'));
  assert.ok(payload.includes('br.gov.bcb.pix'));
  assert.ok(payload.includes('EQUARENA'));
  assert.ok(payload.includes('5.00'));
});
