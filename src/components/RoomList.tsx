'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RoomListData } from '@/types/types';

export default function RoomList() {
  const [roomData, setRoomData] = useState<RoomListData>({
    publicRooms: [],
    privateRooms: [],
    publicLimit: 0,
    privateLimit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

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

  if (isLoading) return <div>Carregando...</div>;

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
                <Link href={`/chat/${room.id}`}>
                  <Button variant='outline' className='w-full'>
                    {room.name}
                  </Button>
                </Link>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
