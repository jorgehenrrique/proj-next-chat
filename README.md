# ChatVortex

ChatVortex é uma plataforma de chat interativa desenvolvida com Next.js e Socket.IO, que permite a criação de salas de chat públicas e privadas. O projeto foi criado para oferecer uma experiência de comunicação fluida e segura para todos os usuários. A comunicação em tempo real é estabelecida através de WebSockets usando o Socket.IO, que mantém uma conexão bidirecional persistente entre cliente e servidor, permitindo troca instantânea de mensagens e atualizações de estado das salas.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org): Framework React para desenvolvimento de aplicações web
- [Socket.IO](https://socket.io): Biblioteca para comunicação em tempo real entre cliente e servidor
- [React](https://reactjs.org): Biblioteca JavaScript para construção de interfaces de usuário
- [Tailwind CSS](https://tailwindcss.com): Framework CSS para estilização
- [bcrypt](https://www.npmjs.com/package/bcrypt): Biblioteca para hashing de senhas
- [UUID](https://www.npmjs.com/package/uuid): Biblioteca para geração de identificadores únicos
- [Zustand](https://zustand-demo.pmnd.rs/): Biblioteca para gerenciamento de estado
- [shadcn/ui](https://ui.shadcn.com/): Componentes reutilizáveis construídos com Radix UI e Tailwind CSS
- [Framer Motion](https://www.framer.com/motion/): Biblioteca para animações

## Características Técnicas

- **Estado Global:** Gerenciamento de estado com Zustand e Context API
- **Roteamento:** Sistema de rotas dinâmicas do Next.js
- **API:** Rotas API para autenticação administrativa
- **WebSocket:**
  - Conexão bidirecional em tempo real
  - Sistema de fallback automático para compatibilidade máxima
  - Suporte a Long-polling, HTTP streaming e JSONP polling
- **TypeScript:** Tipagem estática para maior segurança e manutenibilidade

## Funcionalidades

### Principais

- **Salas de Chat:** Criação de salas públicas e privadas
- **Autenticação:** Proteção de salas privadas com senha
- **Listagem:** Visualização de salas públicas disponíveis
- **Comunicação:** Troca de mensagens em tempo real
- **Automação:** Limpeza automática de salas inativas

### Detalhadas

- **Sistema de Cores:** Identificação única por usuário com cores aleatórias
- **Identificação:** ID único por usuário (visível ao passar o mouse sobre o nome)
- **Limite de Salas:** Controle configurável para salas públicas e privadas
- **Compartilhamento:** Links únicos para salas privadas
- **Gerenciamento de Sala:**
  - Contador de usuários em tempo real
  - Criador da sala pode removê-la
- **Administração:**

  - Acesso administrativo na rota `/chat` via menu de usuário
  - Permissão para deletar qualquer sala (exeto globais)
  - Logout pelo menu com redirecionamento para a página inicial

  ## Interface do Usuário

- **Notificações:** Sistema de toast para feedback de ações
- **Modais:** Criação de sala e prompt de senha
- **Responsividade:** Layout adaptável para diferentes dispositivos
- **Temas:** Interface escura com elementos em destaque
- **Animações:** Transições suaves e feedback visual
- **Tooltips:** Dicas de interface para melhor usabilidade

  ## Estrutura do Projeto

- **Servidor:** Implementação customizada em `server.js` com Socket.IO
- **Hooks:**
  - `useSocket`: Gerenciamento de conexões WebSocket
  - `useAdmin`: Controle de acesso administrativo
  - `useToast`: Sistema de notificações
- **Contextos:**
  - `UserContext`: Gerenciamento de estado do usuário
  - `RoomContext`: Gerenciamento de estado das salas
- **API Routes:** Implementadas em `app/api` para administração
- **Componentes:** `ChatRoom`, `CreateRoomModal`, `RoomList`, etc.

## Segurança

- **Proteção de Salas:**
  - Salas privadas protegidas com bcrypt
  - Validação de senhas no servidor
- **Administração:**
  - Autenticação para acesso ao painel Socket.IO
  - Interface administrativa restrita
  - Token de autenticação para ações administrativas
- **Manutenção:**
  - Limpeza automática de recursos inativos
  - Monitoramento de atividade das salas
  - Limite configurável de salas

### Eventos do Socket.IO

- **Criação:** `create room`, `room created`, `room exists`, `room limit reached`
- **Entrada/Saída:** `join room`, `join private room`, `leave room`, `message`
- **Informações:** `get room`, `get rooms`, `room info`, `room list`, `join result`
- **Usuários:** `user count`, `room deleted`, `delete room`

## Recursos Adicionais

### Painel de Administração Socket.IO

- **URL:** [https://admin.socket.io](https://admin.socket.io)
- **Autenticação:** Básica (configurada via variáveis de ambiente)
- **Recursos:** Monitoramento de conexões e métricas em tempo real

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis do `.env.example`:

## Como Executar

1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Inicie o servidor de desenvolvimento com `npm run dev`.
4. Para produção, execute `npm run build` seguido de `npm start`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.
