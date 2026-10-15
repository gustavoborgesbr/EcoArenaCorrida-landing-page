# Modal de Pagamento Pix com QR Code Dinâmico e Link Direto

Modal aprimorado acionado automaticamente ao finalizar o formulário de inscrição, exibindo o QR Code oficial do Pix com valor exato pré-configurado (R$ 5,00), botões de ação imediata (Copia e Cola e link de app bancário) logo abaixo da imagem, e direcionamento prioritário para envio do comprovante no WhatsApp.

## Decisões Confirmadas com o Usuário

- **Link direto abaixo do QR Code**: Botão "Pix Copia e Cola" com feedback tátil de cópia e atalho para aplicativo bancário/pagamento.
- **Destaque do Valor**: Bloco em destaque com o valor exato de **R$ 5,00**, status do Lote Promocional (100 primeiros atletas) e identificador do atleta.
- **Ação Principal Subsequente**: Botão de alta visibilidade para envio do comprovante pré-formatado diretamente no WhatsApp oficial da Eco Arena.

---

### 1. Visão Geral & Experiência do Usuário

O atleta preenche o formulário com dados pessoais (Nome, CPF, RG, telefone, modalidade de 3km/5km/10km e tamanho da camiseta). Ao clicar no botão de submissão:
1. Os dados são salvos localmente e sincronizados no **Firestore**.
2. O **Modal de Pagamento Pix** surge instantaneamente na tela sobreposta com efeito backdrop blur.
3. No topo do modal, o atleta vê o valor exato (**R$ 5,00**) e o status promocional.
4. No centro, o **QR Code Pix dinâmico** é gerado com o padrão EMV oficial do Banco Central, contendo chave, favorecido e valor exato.
5. Logo abaixo do QR Code, situam-se os botões de ação:
   - **Copiar Código Pix (Copia e Cola)**: cópia de um clique com confirmação visual.
   - **Pagar no App do Banco**: link/acionamento compatível com dispositivos móveis.
   - **Copiar Chave Pix Alternativa**: cópia direta da chave Pix (telefone/WhatsApp).
6. Na base do modal, o botão de chamada prioritária (**CTA Principal**): *"Enviar Comprovante no WhatsApp da Eco Arena"*, com texto pronto contendo Nome, CPF, ID e modalidade.

---

### 2. Design Visual & Hierarquia de Elementos

```
┌────────────────────────────────────────────────────────┐
│  PAGAMENTO PIX & CONFIRMAÇÃO DA VAGA          [X]      │
│  Parabéns, [Nome do Atleta]! Sua vaga está pré-reservada│
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌─────────────────────────┐ │
│  │ Valor da Inscrição   │  │ Cód. Inscrição          │ │
│  │ R$ 5,00              │  │ #EQ-001 • 5km Corrida   │ │
│  │ Lote Promocional 100 │  │ Porta da Eco Arena      │ │
│  └──────────────────────┘  └─────────────────────────┘ │
│                                                        │
│             ┌────────────────────────┐                 │
│             │   [ IMAGEM QR CODE ]   │                 │
│             │     PIX COM R$ 5,00    │                 │
│             │       EMV OFICIAL      │                 │
│             └────────────────────────┘                 │
│             Aponte a câmera do seu banco               │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [📋] Copiar Código Pix Copia e Cola              │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [⚡] Abrir App Bancário / Pagar via Pix          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [💬] ENVIAR COMPROVANTE NO WHATSAPP DA ECO ARENA │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  [Ver Comprovante Digital]                  [Concluir] │
└────────────────────────────────────────────────────────┘
```

- **Paleta de Cores**:
  - Destaques esportivos em verde esmeralda (`emerald-600` / `emerald-500`) e tons escuros elegantes (`slate-950` / `slate-900`).
  - Avisos pontuais em âmbar para urgência do lote promocional.
- **Tipografia e Contraste**:
  - Sem tags estáticas desnecessárias; foco em tipografia limpa, números tabulares monoespaçados para chave e código Pix, e botões de toque com tamanho mínimo de 48px.
- **Acessibilidade**:
  - Diálogo acessível com `role="dialog"`, `aria-modal="true"`, foco gerenciado e fechamento via tecla `Escape`.

---

### 3. Arquitetura Técnica & Fluxo de Dados

```
[Formulário de Inscrição (RegistrationForm.tsx)]
       │
       ▼ (onSubmit)
[handleRegisterSubmit (App.tsx)]
       │
       ├──► Sincroniza participante no Firestore (status: pending_payment)
       │
       ▼ (setPaymentParticipant)
[Modal de Pagamento (PaymentModal.tsx)]
       ├──► Gera payload EMV Pix com valor exato (R$ 5,00) via generatePixPayload()
       ├──► Renderiza QR Code de alta precisão
       ├──► Oferece Copia e Cola + Link direto de pagamento
       └──► Gera link do WhatsApp com mensagem oficial pronta para validação
```

- **Componentes Envolvidos**:
  - `src/components/PaymentModal.tsx`: reestruturação do layout interno, exibição aberta do QR Code, novo link direto de pagamento, botões de ação ergonômicos e suporte a feedback de cópia.
  - `src/components/RegistrationForm.tsx`: garantia de transição instantânea ao clicar no botão final de confirmação.
  - `src/utils/validation.ts`: validação e geração íntegra do payload Pix (EMV BR Code) incluindo chave, valor formatado em duas casas decimais e identificador da transação (TXID).

---

### 4. Plano de Verificação

1. **Testes do Formulário**:
   - Preencher o formulário na página inicial e clicar no botão de submissão.
   - Verificar abertura imediata do modal sem atrasos ou etapas intermediárias desnecessárias.
2. **Testes do QR Code e Copia e Cola**:
   - Validar que o QR Code é exibido de imediato com o valor exato de R$ 5,00.
   - Testar o botão "Copiar Código Pix Copia e Cola" e certificar-se de que o código copiado contém o payload Pix completo.
   - Testar o botão de abertura do app bancário/link direto.
3. **Testes de Integração com WhatsApp**:
   - Clicar no botão principal de envio de comprovante e verificar se o link do WhatsApp abre com o texto pré-configurado contendo os dados do atleta.
4. **Verificação de Compilação**:
   - Executar `compile_applet` e `lint_applet` para assegurar integridade de build.
