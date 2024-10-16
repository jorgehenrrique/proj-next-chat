'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatRoom from '@/components/ChatRoom';
import { useSocket } from '@/hooks/useSocket';
import { RoomListData } from '@/types/types';

export default function DynamicChatRoom() {
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();
  const socket = useSocket();
  const [roomExists, setRoomExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket) {
      socket.emit('get rooms');
      socket.on('room list', (data: RoomListData) => {
        if (data.rooms.includes(roomId)) {
          setRoomExists(true);
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!roomExists) {
    return null;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Chat {roomId}</h1>
      <ChatRoom roomId={roomId} />
    </div>
  );
}
