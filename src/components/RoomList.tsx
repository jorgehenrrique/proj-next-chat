'use client';
import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Room, RoomListData } from '@/types/types';
import Loader from './Loader/Loader';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import { Trash2Icon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

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
  const { isAdmin } = useAdmin();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);

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

  const handleDeleteRoom = (roomId?: string) => {
    if (socket && isAdmin && roomId) {
      socket.emit('delete room', { roomId, userId: null, isAdmin });
      setIsDeleteDialogOpen(false);
      setRoom(null);
    }
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
                {isAdmin && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setRoom(room);
                      setIsDeleteDialogOpen(true);
                    }}
                    className='hover:bg-red-600/80 text-red-500 hover:text-white transition-colors duration-200 w-full'
                  >
                    <Trash2Icon className='w-4 h-4' />
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='border-b border-sky-900 rounded-xl bg-gray-900/50 backdrop-blur-md'>
          <DialogHeader>
            <DialogTitle>Remover Sala</DialogTitle>
            <DialogDescription>
              Você está removendo esta sala: <strong>{room?.name}</strong> como
              administrador.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleDeleteRoom(room?.id)}
          >
            Remover Sala
          </Button>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
