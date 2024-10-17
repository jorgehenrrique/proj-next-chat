'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatRoom from '@/components/ChatRoom';
import { useSocket } from '@/hooks/useSocket';
import { Room } from '@/types/types';
import PasswordPrompt from '@/components/PasswordPrompt';
import { toast } from '@/hooks/use-toast';

export default function DynamicChatRoom() {
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();
  const socket = useSocket();
  // const [roomExists, setRoomExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [needPassword, setNeedPassword] = useState(false);

  useEffect(() => {
    // if (socket) {
    //   socket.emit('get rooms');
    //   socket.on('room list', (data: RoomListData) => {
    //     if (data.rooms.some((room) => room.id === roomId)) {
    //       setRoomExists(true);
    //     } else {
    //       router.push('/');
    //     }
    //     setLoading(false);
    //   });
    // }
    if (socket) {
      socket.emit('get room', roomId);
      socket.on('room info', (roomInfo: Room | null) => {
        if (roomInfo) {
          setRoom(roomInfo);
          setNeedPassword(roomInfo.isPrivate);
        } else {
          router.push('/');
        }
        setLoading(false);
      });
    }

    return () => {
      if (socket) {
        socket.off('room list');
      }
    };
  }, [socket, roomId, router]);

  const handlePasswordSubmit = (password: string) => {
    socket?.emit('join private room', { roomId, password });
    socket?.on('join result', (success: boolean) => {
      if (success) {
        setNeedPassword(false);
      } else {
        // Mostrar mensagem de erro
        toast({
          title: 'Senha incorreta',
          description: 'A senha da sala está incorreta.',
          variant: 'destructive',
        });
      }
    });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  // if (!roomExists) {
  //   return null;
  // }
  if (!room) {
    return null;
  }

  if (needPassword) {
    return <PasswordPrompt onSubmit={handlePasswordSubmit} />;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Chat {room.name}</h1>
      <ChatRoom roomId={roomId} />
    </div>
  );
}
