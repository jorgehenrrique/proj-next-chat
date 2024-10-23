# ChatVortex

ChatVortex é uma plataforma de chat interativa desenvolvida com Next.js e Socket.IO, que permite a criação de salas de chat públicas e privadas. O projeto foi criado para oferecer uma experiência de comunicação fluida e segura para todos os usuários. A comunicação em tempo real é estabelecida através de WebSockets usando o Socket.IO, que mantém uma conexão bidirecional persistente entre cliente e servidor, permitindo troca instantânea de mensagens e atualizações de estado das salas. O Socket.IO também oferece fallback automático para outras tecnologias de transporte quando WebSocket não está disponível, garantindo compatibilidade máxima.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org): Framework React para desenvolvimento de aplicações web.
- [Socket.IO](https://socket.io): Biblioteca para comunicação em tempo real entre cliente e servidor.
- [React](https://reactjs.org): Biblioteca JavaScript para construção de interfaces de usuário.
- [Tailwind CSS](https://tailwindcss.com): Framework CSS para estilização.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Biblioteca para hashing de senhas.
- [UUID](https://www.npmjs.com/package/uuid): Biblioteca para geração de identificadores únicos.

## Funcionalidades

- **Criação de Salas de Chat:** Os usuários podem criar salas de chat públicas e privadas.
- **Autenticação de Salas Privadas:** Salas privadas podem ser protegidas por senha.
- **Listagem de Salas:** Apenas salas públicas são listadas para todos os usuários.
- **Comunicação em Tempo Real:** Mensagens são enviadas e recebidas em tempo real.
- **Limpeza Automática de Salas Inativas:** Salas inativas são removidas automaticamente para manter a comunidade ativa.

## Estrutura do Projeto

- **Servidor Customizado:** O servidor é implementado em `server.js` e utiliza o Socket.IO para gerenciar conexões em tempo real.
- **Hooks Personalizados:** O hook `useSocket` é utilizado para gerenciar a conexão com o servidor Socket.IO.
- **Componentes React:** Componentes como `ChatRoom`, `CreateRoomModal`, e `RoomList` são utilizados para gerenciar a interface do usuário.

## Métodos do Servidor

- **Criação de Salas:** Os usuários podem criar salas através do evento `create room`.
- **Entrada em Salas:** Os usuários podem entrar em salas públicas e privadas através dos eventos `join room` e `join private room`.
- **Listagem de Salas:** O servidor emite a lista de salas disponíveis através do evento `get rooms`.
- **Limpeza de Salas Inativas:** O servidor verifica periodicamente a atividade das salas e remove aquelas que estão inativas.

## Como Executar

1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Inicie o servidor de desenvolvimento com `npm run dev`.
4. Para produção, execute `npm run build` seguido de `npm start`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.
