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
import { Room, RoomListData } from '@/types/types';
import { Checkbox } from './ui/checkbox';
import Loader from './Loader/Loader';
import UsernamePrompt from './UsernamePrompt';
import { useUser } from '@/contexts/UserContext';
import { useContentFilter } from '@/hooks/useContentFilter';

export default function CreateRoomModal() {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [roomData, setRoomData] = useState<RoomListData>({
    publicRooms: [],
    privateRooms: [],
    publicLimit: 0,
    privateLimit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();
  const router = useRouter();
  const { user, updateUser } = useUser();
  const { checkContent } = useContentFilter();

  useEffect(() => {
    if (socket) {
      setIsLoading(true);
      socket.emit('get rooms');
      socket.on('room list', (data: RoomListData) => {
        setRoomData(data);
        setIsLoading(false);
      });
      socket.on('room created', (room: Room) => {
        setIsOpen(false);
        setRoomName('');
        setIsPrivate(false);
        setPassword('');
        if (room.isPrivate) {
          const link = `${window.location.origin}/chat/${room.id}`;
          toast({
            title: 'Sala privada criada',
            description: `Clique em copiar para compartilhar o link da sala com seus amigos.\nA sala será aberta em uma nova janela.`,
            action: (
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast({
                    title: 'Link copiado para a área de transferência',
                  });
                }}
              >
                Copiar
              </Button>
            ),
          });

          setTimeout(() => {
            window.open(`/chat/${room.id}`, '_blank');
          }, 1000);
        } else {
          router.push(`/chat/${room.id}`);
        }
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
    const trimmedName = roomName.trim();
    if (trimmedName && socket && user) {
      const { isClean, message } = checkContent(trimmedName);
      if (!isClean) {
        toast({
          title: 'Nome não permitido',
          description: message,
          variant: 'destructive',
        });
        setRoomName('');
        return;
      }

      socket.emit('create room', {
        name: trimmedName,
        isPrivate,
        password: isPrivate ? password : null,
        creatorId: user.id,
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className='hover:bg-sky-500 hover:text-white transition-colors duration-300'
          disabled={
            roomData.privateRooms?.length >= roomData.privateLimit &&
            roomData.publicRooms?.length >= roomData.publicLimit
          }
        >
          Criar Nova Sala
        </Button>
      </DialogTrigger>
      <DialogContent className='border-b border-sky-900 rounded-xl bg-gray-900/50 backdrop-blur-md'>
        <DialogHeader>
          <DialogTitle>Criar Nova Sala de Chat</DialogTitle>
          <DialogDescription>
            Crie uma nova sala de chat para começar a conversar com seus amigos.
          </DialogDescription>
        </DialogHeader>
        {!user && <UsernamePrompt onSubmit={updateUser} />}
        <Input
          value={roomName}
          maxLength={30}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder='Nome da sala'
        />
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='isPrivate'
            checked={isPrivate}
            onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
          />
          <label htmlFor='isPrivate'>Sala Privada</label>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isPrivate
              ? 'opacity-100 max-h-20 overflow-visible'
              : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <Input
            type='password'
            value={password}
            maxLength={30}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Senha da sala (opcional)'
          />
        </div>
        <Button
          className={`transition-all duration-300 ease-in-out ${
            isPrivate ? '' : '-mt-4'
          }`}
          onClick={handleCreateRoom}
          disabled={
            !roomName.trim() ||
            roomData.publicRooms?.some(
              (room) => room.name === roomName.trim()
            ) ||
            (isPrivate
              ? roomData.privateRooms?.length >= roomData.privateLimit
              : roomData.publicRooms?.length >= roomData.publicLimit)
          }
        >
          Criar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
