'use client';

import { useEffect, useState, FormEvent, useRef, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useUser } from '@/contexts/UserContext';
import { Message } from '@/types/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter } from './ui/card';
import { Shuffle, SendIcon, CheckIcon, XIcon, RefreshCw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { toast } from '@/hooks/use-toast';
import { Spinner } from './Spinner';
import { useRoom } from '@/contexts/RoomContext';
import { CardHeader, CardTitle } from '@/components/ui/card';

export default function RandomChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const { user } = useUser();
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setCurrentRoom } = useRoom();
  const [autoNextPartner, setAutoNextPartner] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNextPartner = useCallback(() => {
    if (socket) {
      setIsSearching(true);
      setPartnerId(null);
      setMessages([]);
      socket.emit('next partner');
    }
  }, [socket]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join random chat');

      socket.on('chat matched', (partnerId: string) => {
        setIsSearching(false);
        setPartnerId(partnerId);
        setMessages([]);
        setCurrentRoom({
          id: partnerId,
          name: 'Chat aleatório',
          isPrivate: false,
          creatorId: user.id,
        });
        toast({
          title: 'Usuário encontrado!',
          description: 'Você foi conectado a um parceiro de chat.',
        });
      });

      socket.on('random message', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave random chat');
        socket.off('chat matched');
        socket.off('random message');
      }
    };
  }, [socket, user, setCurrentRoom]);

  useEffect(() => {
    if (socket) {
      socket.on('partner left', () => {
        setPartnerId(null);
        toast({
          title: 'Parceiro saiu',
          description: 'O outro usuário deixou o chat.',
          variant: 'destructive',
        });

        if (autoNextPartner) {
          handleNextPartner();
        } else {
          setIsSearching(true);
          setMessages([]);
        }
      });

      return () => {
        socket.off('partner left');
      };
    }
  }, [socket, autoNextPartner, handleNextPartner]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && user && partnerId) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        userId: user.id,
        username: user.name,
        color: user.color,
        roomId: partnerId,
      };
      socket.emit('random message', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <Card className='flex flex-col h-full bg-gray-900/80 text-white rounded-xl border-purple-900 mt-0 relative overflow-hidden'>
      <div className='absolute top-0 left-0 right-0 z-10'>
        <CardHeader className='bg-gray-800/50 py-1 px-4 rounded-t-xl border-b border-purple-900 backdrop-blur-md'>
          <CardTitle className='flex justify-between items-center'>
            <span className='flex items-center gap-2 font-normal text-base py-1'>
              <RefreshCw
                className={`w-4 h-4 text-purple-500 ${
                  isSearching ? 'animate-spin' : ''
                }`}
              />
              <span className='text-gray-200'>
                Auto-procura: {autoNextPartner ? 'ativada' : 'desativada'}
              </span>
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setAutoNextPartner(!autoNextPartner)}
              className={
                'transition-colors duration-200 ' +
                (autoNextPartner
                  ? 'hover:bg-green-600/80 text-green-500 hover:text-white'
                  : 'hover:bg-red-600/80 text-red-500 hover:text-white')
              }
              title={
                autoNextPartner
                  ? 'Desativar busca automática'
                  : 'Ativar busca automática'
              }
            >
              {autoNextPartner ? (
                <CheckIcon className='w-4 h-4' />
              ) : (
                <XIcon className='w-4 h-4' />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
      </div>
      <CardContent className='flex-grow overflow-y-auto p-2 pt-14 pb-24 space-y-1.5'>
        {isSearching ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <Spinner />
            <p className='mt-4'>
              {autoNextPartner
                ? 'Procurando um parceiro de chat...'
                : 'Clique no botão para procurar um parceiro de chat'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isOwnMessage={msg.userId === user?.id}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className='absolute bottom-0 left-0 right-0 z-10'>
        <CardFooter className='bg-gray-900/50 backdrop-blur-md p-4 border-t border-purple-900'>
          <form onSubmit={handleSubmit} className='flex w-full gap-2'>
            <Button
              type='button'
              onClick={handleNextPartner}
              className='bg-purple-600 hover:bg-purple-500'
              // disabled={isSearching}
              title='Procurar novo parceiro'
            >
              <Shuffle className='w-4 h-4' />
            </Button>
            <Input
              type='text'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder='Digite sua mensagem...'
              disabled={isSearching}
              className='flex-grow border-purple-900 focus:border-purple-500 focus-visible:ring-0 bg-gray-700 text-white'
            />
            <Button
              type='submit'
              disabled={isSearching}
              className='bg-purple-600 hover:bg-purple-500'
              title='Enviar mensagem'
            >
              <SendIcon className='w-4 h-4' />
            </Button>
          </form>
        </CardFooter>
      </div>
    </Card>
  );
}
