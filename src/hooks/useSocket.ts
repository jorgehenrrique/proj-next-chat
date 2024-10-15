import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io();

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
};

// usar
// const socket = useSocket();

// O return neste hook personalizado (useSocket) tem várias funções importantes:

// 1. Retorna o objeto 'socket':
//    - Este objeto é o resultado da conexão estabelecida com o servidor Socket.IO.
//    - Ele permite que os componentes que usam este hook interajam com o servidor em tempo real.

// 2. Uso em componentes:
//    - O socket retornado pode ser usado em qualquer componente que precise de comunicação em tempo real.
//    - Por exemplo, em um componente de chat, lista de usuários online, ou atualizações em tempo real.

// 3. Quando será usado:
//    - O socket será usado quando o componente que chama este hook for montado.
//    - Inicialmente, o valor retornado será 'null' até que a conexão seja estabelecida.

// 4. Quando não será usado:
//    - Se o componente for desmontado, o socket será desconectado (graças à função de limpeza no useEffect).
//    - Se ocorrer um erro na conexão, o socket pode permanecer como 'null'.

// 5. Página de uso:
//    - Este hook pode ser usado em qualquer página ou componente que necessite de comunicação em tempo real.
//    - Por exemplo, poderia ser usado na página 'ChatPage' ou em um componente 'ChatRoom'.

// 6. Detalhes sobre o socket:
//    - O socket é inicializado no useEffect, garantindo que a conexão seja estabelecida apenas uma vez.
//    - A conexão é mantida enquanto o componente que usa este hook estiver montado.
//    - O socket permite enviar e receber eventos, possibilitando comunicação bidirecional com o servidor.

// Exemplo de uso em um componente:
// const ChatComponent = () => {
//   const socket = useSocket();
//
//   useEffect(() => {
//     if (socket) {
//       socket.on('newMessage', handleNewMessage);
//     }
//   }, [socket]);
//
//   // ... resto do código do componente
// }
