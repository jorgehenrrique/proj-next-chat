# ChatVortex

ChatVortex é uma plataforma de chat interativa desenvolvida com Next.js e Socket.IO, que permite a criação de salas de chat públicas e privadas, além de um sistema de chat aleatório com suporte a videochamadas. O projeto foi criado para oferecer uma experiência de comunicação fluida e segura para todos os usuários. A comunicação em tempo real é estabelecida através de WebSockets usando o Socket.IO e WebRTC para videochamadas, permitindo troca instantânea de mensagens, vídeo e atualizações de estado.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org): Framework React para desenvolvimento de aplicações web
- [Socket.IO](https://socket.io): Biblioteca para comunicação em tempo real entre cliente e servidor
- [WebRTC](https://webrtc.org/): Tecnologia para comunicação em tempo real de vídeo e áudio
- [simple-peer](https://www.npmjs.com/package/simple-peer): Biblioteca para simplificar a implementação do WebRTC
- [React](https://reactjs.org): Biblioteca JavaScript para construção de interfaces de usuário
- [Tailwind CSS](https://tailwindcss.com): Framework CSS para estilização
- [bcrypt](https://www.npmjs.com/package/bcrypt): Biblioteca para hashing de senhas
- [UUID](https://www.npmjs.com/package/uuid): Biblioteca para geração de identificadores únicos
- [Zustand](https://zustand-demo.pmnd.rs/): Biblioteca para gerenciamento de estado
- [shadcn/ui](https://ui.shadcn.com/): Componentes reutilizáveis construídos com Radix UI e Tailwind CSS
- [Framer Motion](https://www.framer.com/motion/): Biblioteca para animações
- [bad-words](https://www.npmjs.com/package/bad-words): Filtro de palavras impróprias
- [@2toad/profanity](https://www.npmjs.com/package/@2toad/profanity): Filtro adicional de conteúdo impróprio

## Características Técnicas

- **Estado Global:** Gerenciamento de estado com Zustand e Context API
- **Roteamento:** Sistema de rotas dinâmicas do Next.js
- **API:** Rotas API para autenticação administrativa
- **WebSocket:**
  - Conexão bidirecional em tempo real
  - Sistema de fallback automático para compatibilidade máxima
  - Suporte a Long-polling, HTTP streaming e JSONP polling
- **WebRTC:**
  - Videochamadas P2P com WebRTC
  - Compartilhamento de tela
  - Controle de qualidade de vídeo
- **TypeScript:** Tipagem estática para maior segurança e manutenibilidade
- **Moderação de Conteúdo:** Sistema de filtro de palavras impróprias em português e inglês

## Funcionalidades

### Principais

- **Salas de Chat:** Criação de salas públicas e privadas
- **Chat Aleatório:** Sistema de matchmaking para conversas anônimas com texto e vídeo
- **Videochamadas:**
  - Suporte a vídeo em tempo real
  - Compartilhamento de tela
  - Troca de câmeras (frontal/traseira)
  - Controle de qualidade de vídeo (240p até 1080p)
  - Controles independentes de áudio
  - Modo Picture-in-Picture
- **Autenticação:** Proteção de salas privadas com senha
- **Listagem:** Visualização de salas públicas disponíveis
- **Comunicação:** Troca de mensagens em tempo real
- **Automação:** Limpeza automática de salas inativas
- **Moderação:** Filtro automático de nomes impróprios para usuários e salas

### Detalhadas

- **Sistema de Cores:** Identificação única por usuário com cores aleatórias
- **Identificação:** ID único por usuário (visível ao passar o mouse sobre o nome)
- **Limite de Salas:** Controle configurável para salas públicas e privadas
- **Compartilhamento:** Links únicos para salas privadas
- **Chat Aleatório:**
  - Matchmaking automático entre usuários
  - Sistema de auto-procura configurável
  - Botão para pular para próximo usuário
  - Indicador visual de status da procura
    - Suporte a videochamadas com controles avançados
- **Gerenciamento de Sala:**
  - Contador de usuários em tempo real
  - Criador da sala pode removê-la
- **Administração:**

  - Acesso administrativo na rota `/chat` via menu de usuário
  - Permissão para deletar qualquer sala (exeto globais)
  - Logout pelo menu com redirecionamento para a página inicial
  - **Segurança:**
  - Filtro de conteúdo impróprio
  - Validação de nomes de usuários e salas
  - Proteção contra palavras ofensivas
    - Conexões seguras para vídeo e áudio

  ## Interface do Usuário

- **Layout Horizontal:** Navegação intuitiva entre chat aleatório, página inicial e salas
- **Notificações:** Sistema de toast para feedback de ações
- **Modais:** Criação de sala e prompt de senha
- **Responsividade:** Layout adaptável para diferentes dispositivos
- **Temas:** Interface escura com elementos em destaque
- **Animações:** Transições suaves e feedback visual
- **Tooltips:** Dicas de interface para melhor usabilidade
- **Controles de Vídeo:** Interface intuitiva para gerenciamento de videochamadas

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

- **Chat Aleatório:** `join random chat`, `chat matched`, `partner left`, `next partner`, `random message`
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
