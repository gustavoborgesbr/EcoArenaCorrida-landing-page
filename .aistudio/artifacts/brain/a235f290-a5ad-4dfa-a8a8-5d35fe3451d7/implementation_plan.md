# Plano de Implementação: Separação de Elementos da Barra de Navegação (Navbar) por Perfil Firebase

Este plano detalha a reestruturação da barra de navegação (`Header.tsx`/`Navbar`) e do rodapé (`Footer.tsx`) para segmentar os elementos visíveis de acordo com as regras de autenticação do **Firebase Auth**, distinguindo a visão do **atleta/visitante** da visão do **administrador autenticado**.

---

## 1. Regras de Exibição por Perfil

### 1.1 Visitantes e Atletas (Não Autenticados)
- **Marca**: Logo da Ecoarena Mansão Verde com navegação para o topo.
- **Consultar Inscrição**: Botão com ícone de lupa para localizar inscrição pelo CPF e emitir comprovante/QR Code.
- **Inscrever-se**: Botão de destaque com badge de valor (R$ 5,00) com rolagem suave até o formulário oficial.
- **Acesso Admin Discreto**: Botão discreto e elegante com ícone de chave/escudo (ex: "Área Admin" ou ícone discreto) na barra e no rodapé para abrir o modal de login do Firebase Auth.
- **Ocultos**: Painel de Inscritos, Configurações de Pix/WhatsApp e métricas administrativas.

### 1.2 Administrador Autenticado (Firebase Auth: `user != null`)
- **Marca**: Logo com selo discreto de modo administrativo ativo.
- **Painel de Inscritos**: Botão rápido para abrir a gestão de inscritos com badge numérico em tempo real.
- **Configurações**: Botão de engrenagem para ajustes de chaves Pix, número de WhatsApp e regras do evento.
- **Badge do Admin**: Identificação visual elegante (ex: `Admin • email@...` ou badge verde esmeralda).
- **Botão Sair (Logout)**: Ação direta de encerramento de sessão via Firebase Auth (`signOut`), retornando imediatamente a barra para a visão de visitante.

---

## 2. Arquitetura e Fluxo de Estado

1. **Estado Centralizado no `App.tsx`**:
   - Escuta em tempo real do estado de autenticação via `subscribeToAuthState` do Firebase Auth.
   - Fornece `currentUser: User | null` e função `handleLogout()` para os componentes filhos.
   - Estado de modal de login dedicado para administradores caso tentem acessar enquanto não autenticados.

2. **Componente `Header.tsx`**:
   - Recebe propriedades: `currentUser`, `onLoginClick`, `onLogoutClick`, `onOpenLookup`, `onOpenAdmin`, `onOpenSettings`, `onScrollToForm`, `participantsCount`.
   - Renderização condicional limpa e responsiva:
     - No mobile: menu compacto sem sobrecarregar a barra.
     - No desktop: disposição harmoniosa dos botões com transições suaves.

3. **Componente `Footer.tsx`**:
   - Ponto de entrada discreto de autenticação na seção "Área do Organizador".
   - Exibição de status atual: "Conectado como Administrador" com atalho rápido ou "Acesso Administrativo (Login)".

4. **Modal de Login Administrativo**:
   - Modal com interface amigável para login com e-mail e senha, mensagem de erro amigável e opção de recuperação de senha.

---

## 3. Etapas de Execução

1. **Ajustar `App.tsx`**:
   - Conectar `currentUser` do Firebase Auth e criar manipuladores de login e logout com feedback visual.
   - Integrar modal de login administrativo (`AdminLoginModal`).
2. **Atualizar `src/components/Header.tsx`**:
   - Implementar renderização condicional baseada em `currentUser != null`.
   - Aplicar badges, tooltips e botões conforme as respostas fornecidas.
3. **Atualizar `src/components/Footer.tsx`**:
   - Sincronizar o botão discreto de login com a sessão ativa.
4. **Validação & Compilação**:
   - Executar `compile_applet` para assegurar integridade tipográfica e de tipos TypeScript sem quebra de build.
