'use client';
import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RoomListData } from '@/types/types';
import Loader from './Loader/Loader';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6'>
      {roomData.publicRooms &&
        roomData.publicRooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className='hover:shadow-sm transition-colors duration-400 bg-gray-800 border-sky-700 hover:border-sky-500 hover:shadow-sky-500'>
              <CardHeader>
                <CardTitle className='text-sky-400'>{room.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant='outline'
                  className='w-full hover:bg-sky-500 hover:text-white transition-colors duration-300'
                  onClick={() => handleRoomClick(room.id)}
                >
                  Entrar na Sala
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
    </div>

    // <Card className='w-full max-w-md'>
    //   <CardHeader>
    //     <CardTitle>Salas de Chat Disponíveis</CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     <ul className='space-y-2'>
    //       {roomData.publicRooms &&
    //         roomData.publicRooms.map((room) => (
    //           <li key={room.id}>
    //             <Button
    //               variant='outline'
    //               className='w-full'
    //               onClick={() => handleRoomClick(room.id)}
    //             >
    //               {room.name}
    //             </Button>
    //           </li>
    //         ))}
    //     </ul>
    //   </CardContent>
    // </Card>
  );
}
