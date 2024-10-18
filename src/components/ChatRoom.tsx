'use client';

import { useState, useEffect, FormEvent } from 'react';
import ChatMessage from './ChatMessage';
import { useSocket } from '@/hooks/useSocket';
import UsernamePrompt from './UsernamePrompt';
import { useUser } from '@/contexts/UserContext';
import { Message } from '@/types/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface ChatRoomProps {
  roomId: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { user, updateUser } = useUser();
  const socket = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (socket && user) {
      console.log('--user--', user);
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

  if (!socket) return <div>Conectando...</div>;
  if (!user) return <UsernamePrompt onSubmit={updateUser} />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        userId: user.id,
        username: user.name,
        roomId: roomId,
      };
      socket.emit('message', newMessage);
      setInputMessage('');
    }
  };

  return (
    <div className='flex flex-col h-[80vh]'>
      <div className='flex-1 overflow-y-auto mb-4 p-4 bg-white text-black rounded shadow'>
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwnMessage={msg.userId === user.id}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className='flex'>
        <input
          type='text'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className='flex-1 p-2 border rounded-l text-black focus:outline-none'
          placeholder='Digite sua mensagem...'
        />
        <button type='submit' className='bg-blue-500 text-black p-2 rounded-r'>
          Enviar
        </button>
      </form>
    </div>
  );
}
