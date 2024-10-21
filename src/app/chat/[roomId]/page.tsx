'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatRoom from '@/components/ChatRoom';
import { useSocket } from '@/hooks/useSocket';
import { Room } from '@/types/types';
import PasswordPrompt from '@/components/PasswordPrompt';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/Spinner';

export default function DynamicChatRoom() {
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [needPassword, setNeedPassword] = useState(false);

  useEffect(() => {
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
        toast({
          title: 'Senha incorreta',
          description: 'A senha da sala está incorreta.',
          variant: 'destructive',
        });
      }
    });
  };

  if (loading) return <Spinner />;

  if (!room) return null;

  if (needPassword) return <PasswordPrompt onSubmit={handlePasswordSubmit} />;

  return (
    <div className='container mx-auto p-2 flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-2'>Chat {room.name}</h1>
      <ChatRoom roomId={roomId} creatorId={room.creatorId} />
    </div>
  );
}
