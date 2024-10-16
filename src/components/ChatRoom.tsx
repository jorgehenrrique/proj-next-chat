'use client';
import { useState, useEffect, FormEvent } from 'react';
import ChatMessage from './ChatMessage';
import { useSocket } from '@/hooks/useSocket';

interface Message {
  id: string;
  text: string;
  user: string;
  roomId: string;
}
interface ChatRoomProps {
  roomId: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (!username) {
      const name = prompt('Por favor, digite seu nome:');
      setUsername(name || 'Anônimo');
    }

    // socket.on('message', (msg: Message) => {
    //   setMessages((prevMessages) => [...prevMessages, msg]);
    // });

    if (socket) {
      socket.emit('join room', roomId);

      socket.on('message', (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }

    return () => {
      // socket.off('message');
      if (socket) {
        socket.emit('leave room', roomId);
        socket.off('message');
      }
    };
  }, [socket, username, roomId]);

  if (!socket) return <div>Conectando...</div>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        user: username,
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
            isOwnMessage={msg.user === username}
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
