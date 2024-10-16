'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { RoomListData } from '@/types/types';

export default function CreateRoomModal() {
  const [roomName, setRoomName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [roomData, setRoomData] = useState<RoomListData>({
    rooms: [],
    limit: 0,
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
      socket.on('room created', (room: string) => {
        setIsOpen(false);
        router.push(`/chat/${room}`);
      });
      socket.on('room exists', (room: string) => {
        toast({
          title: 'Sala já existe',
          description: `A sala "${room}" já existe. Por favor, escolha outro nome.`,
          variant: 'destructive',
        });
      });
      socket.on('room limit reached', () => {
        toast({
          title: 'Limite de salas atingido',
          description: 'Não é possível criar mais salas no momento.',
          variant: 'destructive',
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('room list');
        socket.off('room created');
        socket.off('room exists');
        socket.off('room limit reached');
      }
    };
  }, [socket, router]);

  const handleCreateRoom = () => {
    if (roomName.trim() && socket) {
      socket.emit('create room', roomName.trim());
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={roomData.rooms?.length >= roomData.limit}>
          Criar Nova Sala
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Sala de Chat</DialogTitle>
          <DialogDescription>
            Crie uma nova sala de chat para começar a conversar com seus amigos.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder='Nome da sala'
        />
        <Button
          onClick={handleCreateRoom}
          disabled={
            !roomName.trim() ||
            roomData?.rooms?.includes(roomName.trim()) ||
            roomData?.rooms?.length >= roomData?.limit
          }
        >
          Criar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
