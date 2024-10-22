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
    if (socket) {
      socket.emit('delete room', { roomId, userId: user.id });
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card className='w-full h-[88vh] mt-4 flex flex-col bg-gray-900 text-white rounded-xl overflow-hidden'>
      <CardHeader className='bg-gray-800 py-2 px-4 rounded-t-xl'>
        <CardTitle className='flex justify-between items-center'>
          <span className='flex items-center'>
            <Users2 className='w-4 h-4 mr-2' />
            {userCount}
          </span>
          {currentRoom?.creatorId === user.id && (
            <Button
              variant='destructive'
              size='sm'
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2Icon className='w-4 h-4' />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-grow overflow-y-auto mb-2 border-b border-sky-900 rounded-b-xl shadow-sky-900 shadow-[inset_0_10px_10px_-10px_rgba(0,0,0,0.3)]'>
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwnMessage={msg.userId === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className='flex w-full'>
          <Input
            type='text'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder='Digite sua mensagem...'
            className='flex-grow mr-2 focus:outline-none outline-none focus-visible:ring-0 focus-visible:bg-sky-900 bg-gray-700 text-white hover:bg-gray-800 transition-colors duration-300'
          />
          <Button
            type='submit'
            className='bg-sky-500 hover:bg-sky-800 text-white'
          >
            <SendIcon className='w-4 h-4' />
          </Button>
        </form>
      </CardFooter>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='border-b border-sky-900 rounded-xl'>
          <DialogHeader>
            <DialogTitle>Remover Sala</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover esta sala?
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
