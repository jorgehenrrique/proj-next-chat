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
import { SendIcon } from 'lucide-react';
import { Spinner } from '@/components/Spinner';

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

      socket.on('room deleted', (deletedRoomId: string) => {
        if (deletedRoomId === roomId) {
          toast({
            title: 'Sala removida',
            description: 'Esta sala foi removida devido à inatividade.',
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

  return (
    <Card className='w-full h-[80vh] flex flex-col bg-gray-900 text-white'>
      {/* <CardHeader> */}
      {/* <CardTitle>Chat Room: {roomId}</CardTitle> */}
      {/* </CardHeader> */}
      {/* <CardContent className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"> */}
      <CardContent className='flex-grow overflow-y-auto my-1 shadow-sky-800 shadow-lg rounded-lg'>
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
            className='flex-grow mr-2 focus:outline-none outline-none ring-0 bg-gray-700 text-white hover:bg-gray-800 transition-colors duration-300'
          />
          <Button
            type='submit'
            className='bg-sky-500 hover:bg-sky-800 text-white'
          >
            <SendIcon className='w-4 h-4' />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
