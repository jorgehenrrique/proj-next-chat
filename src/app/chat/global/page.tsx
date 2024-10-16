// import { useEffect, useState } from 'react';
import ChatRoom from '@/components/ChatRoom';
// import { initSocket } from '@/lib/socket';
// import { Socket } from 'socket.io-client';

export default function ChatPage() {
  // const [socket, setSocket] = useState<Socket | null>(null);

  // useEffect(() => {
  //   // let socketInstance: Socket;
  //   // (async () => {
  //   const socketInstance = initSocket();
  //   setSocket(socketInstance);
  //   // })();

  //   return () => {
  //     socketInstance.disconnect();
  //   };
  // }, []);

  // if (!socket) return <div>Conectando...</div>;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Chat Global</h1>
      <ChatRoom roomId='global' />
    </div>
  );
}
