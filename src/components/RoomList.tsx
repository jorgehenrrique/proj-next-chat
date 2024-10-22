'use client';
import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RoomListData } from '@/types/types';
import Loader from './Loader/Loader';
import { useRouter } from 'next/navigation';

export default function RoomList({ onRoomClick }: { onRoomClick: () => void }) {
  const [roomData, setRoomData] = useState<RoomListData>({
    publicRooms: [],
    privateRooms: [],
    publicLimit: 0,
    privateLimit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (socket) {
      setIsLoading(true);
      socket.emit('get rooms');
      socket.on('room list', (data: RoomListData) => {
        setRoomData(data);
        setIsLoading(false);
      });
    }

    return () => {
      if (socket) {
        socket.off('room list');
      }
    };
  }, [socket]);

  if (isLoading) return <Loader />;

  const handleRoomClick = (roomId: string) => {
    onRoomClick();
    setTimeout(() => router.push(`/chat/${roomId}`), 500);
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Salas de Chat Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {roomData.publicRooms &&
            roomData.publicRooms.map((room) => (
              <li key={room.id}>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => handleRoomClick(room.id)}
                >
                  {room.name}
                </Button>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
