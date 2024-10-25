'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { useSocket } from '@/hooks/useSocket';
import UsernamePrompt from './UsernamePrompt';
import { useUser } from '@/contexts/UserContext';
import { Message } from '@/types/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SendIcon, Trash2Icon, Users2 } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRoom } from '@/contexts/RoomContext';
import { useAdmin } from '@/hooks/useAdmin';

interface ChatRoomProps {
  roomId: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { user, updateUser } = useUser();
  const socket = useSocket();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userCount, setUserCount] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { currentRoom } = useRoom();
  const { isAdmin } = useAdmin();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join room', roomId);

      socket.on('message', (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on('user count', (count: number) => {
        setUserCount(count);
      });

      socket.on('room deleted', (deletedRoomId: string) => {
        if (deletedRoomId === roomId) {
          toast({
            title: 'Sala removida',
            description:
              'Esta sala foi removida devido à inatividade ou ao criador.',
            variant: 'destructive',
          });
          router.push('/');
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave room', roomId);
        socket.off('message');
        socket.off('user count');
        socket.off('room deleted');
      }
    };
  }, [socket, user, roomId, router]);

  if (!socket) return <Spinner />;
  if (!user) return <UsernamePrompt onSubmit={updateUser} />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        userId: user.id,
        username: user.name,
        color: user.color,
        roomId: roomId,
      };
      socket.emit('message', newMessage);
      setInputMessage('');
    }
  };

  const handleDeleteRoom = () => {
    if (socket && (currentRoom?.creatorId === user.id || isAdmin)) {
      socket.emit('delete room', { roomId, userId: user.id, isAdmin });
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card className='flex flex-col h-full bg-gray-900/80 text-white rounded-xl border-sky-900 mt-0 relative overflow-hidden'>
      <div className='absolute top-0 left-0 right-0 z-10'>
        <CardHeader className='bg-gray-800/50 py-1 px-4 rounded-t-xl border-b border-sky-900 backdrop-blur-md'>
          <CardTitle className='flex justify-between items-center'>
            <span className='flex items-center gap-2 font-normal text-base py-1'>
              <Users2 className='w-4 h-4 text-sky-500' />
              <span className='text-gray-200'>{userCount}</span>
            </span>
            {(currentRoom?.creatorId === user.id || isAdmin) && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsDeleteDialogOpen(true)}
                className='hover:bg-red-600/80 text-red-500 hover:text-white transition-colors duration-200'
              >
                <Trash2Icon className='w-4 h-4' />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
      </div>
      <CardContent className='flex-grow overflow-y-auto p-2 pt-14 pb-24 space-y-1.5'>
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwnMessage={msg.userId === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className='absolute bottom-0 left-0 right-0 z-10'>
        <CardFooter className='bg-gray-900/50 backdrop-blur-md p-4 border-t border-sky-900'>
          <form onSubmit={handleSubmit} className='flex w-full gap-2'>
            <Input
              type='text'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder='Digite sua mensagem...'
              className='flex-grow mr-2 border-sky-900 focus:border-sky-500 focus-visible:ring-0 bg-gray-700 text-white hover:bg-gray-800 transition-colors duration-300'
            />
            <Button
              type='submit'
              className='bg-sky-600/90 hover:bg-sky-500 text-white transition-colors duration-200'
            >
              <SendIcon className='w-4 h-4' />
            </Button>
          </form>
        </CardFooter>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='border-b border-sky-900 rounded-xl bg-gray-900/50 backdrop-blur-md'>
          <DialogHeader>
            <DialogTitle>Remover Sala</DialogTitle>
            <DialogDescription>
              {isAdmin
                ? 'Você está removendo esta sala como administrador.'
                : 'Tem certeza que deseja remover esta sala?'}
            </DialogDescription>
          </DialogHeader>
          <Button variant='destructive' size='sm' onClick={handleDeleteRoom}>
            Remover Sala
          </Button>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
