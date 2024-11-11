'use client';

import { useEffect, useState, FormEvent, useRef, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { User, useUser } from '@/contexts/UserContext';
import { Message } from '@/types/types';
import { Card } from './ui/card';
import { toast } from '@/hooks/use-toast';
import { useRoom } from '@/contexts/RoomContext';
import VideoChat from './VideoChat';
import { useVideoChat } from '@/hooks/useVideoChat';
import { useVideoConnection } from '@/hooks/useVideoConnection';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatFooter } from './chat/ChatFooter';

export default function RandomChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [autoNextPartner, setAutoNextPartner] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Hooks
  const { user } = useUser();
  const socket = useSocket();
  const { setCurrentRoom } = useRoom();
  // Hook de vídeo
  const {
    localStream,
    remoteStream,
    peer,
    videoEnabled,
    isVideoMinimized,
    isLocalAudioEnabled,
    isRemoteAudioEnabled,
    setRemoteStream,
    setPeer,
    setIsVideoMinimized,
    startVideo,
    stopVideo,
    toggleLocalAudio,
    toggleRemoteAudio,
    setVideoQuality,
    switchCamera,
    shareScreen,
  } = useVideoChat(socket);
  // Hook de conexão de vídeo
  const { initializePeer, handleVideoSignal } = useVideoConnection({
    socket,
    localStream,
    partnerId,
    peer,
    setRemoteStream,
    setPeer,
  });

  // Scroll para o último mensagem
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

      // Limpar peer atual
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
      setRemoteStream(null);

      // Pequeno delay antes de emitir next partner
      setTimeout(() => {
        socket.emit('next partner');
      }, 200);
    }
  }, [socket, peer, setPeer, setRemoteStream]);

  // useEffect para conexão inicial do socket e chat
  useEffect(() => {
    if (socket && user) {
      socket.emit('join random chat');

      socket.on('chat matched', ({ partnerId, withVideo }) => {
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
          description: `Você foi conectado a ${
            withVideo ? 'um parceiro de chat com vídeo' : 'um parceiro de chat'
          }.`,
        });

        if (withVideo) {
          setTimeout(() => {
            socket.emit('request video connection');
          }, 500);
        }
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

  // useEffect para gerenciar desconexão do parceiro
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
          setRemoteStream(null);
          if (peer) {
            peer.destroy();
            setPeer(null);
          }
        }
      });

      return () => {
        socket.off('partner left');
      };
    }
  }, [
    socket,
    autoNextPartner,
    handleNextPartner,
    peer,
    setPeer,
    setRemoteStream,
  ]);

  // useEffect para gerenciar vídeo
  useEffect(() => {
    if (!socket) return;

    socket.on('video signal', handleVideoSignal);

    return () => {
      socket.off('video signal');
    };
  }, [socket, handleVideoSignal]);

  // useEffect para iniciar vídeo após match
  // useEffect(() => {
  //   if (videoEnabled && localStream && partnerId && !peer) {
  //     // Pequeno delay para garantir que o peer anterior foi limpo
  //     setTimeout(() => {
  //       initializePeer(localStream, true);
  //     }, 1000);
  //   }
  // }, [partnerId, videoEnabled, localStream, peer, initializePeer]);

  // useEffect para iniciar conexão de vídeo
  useEffect(() => {
    if (!socket) return;

    socket.on('video connection requested', (requesterId) => {
      socket.emit('accept video connection', requesterId);
    });

    socket.on('video connection accepted', () => {
      if (localStream && partnerId && !peer) {
        initializePeer(localStream, true);
      }
    });

    return () => {
      socket.off('video connection requested');
      socket.off('video connection accepted');
    };
  }, [socket, localStream, partnerId, peer, initializePeer]);

  // Handler para envio de mensagem
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage && socket && user && partnerId) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: trimmedMessage,
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
      <ChatHeader
        isSearching={isSearching}
        autoNextPartner={autoNextPartner}
        videoEnabled={videoEnabled}
        onToggleAutoNext={() => setAutoNextPartner(!autoNextPartner)}
        onToggleVideo={videoEnabled ? stopVideo : startVideo}
      />

      <ChatMessages
        messages={messages}
        isSearching={isSearching}
        user={user as User}
        autoNextPartner={autoNextPartner}
      />
      <div ref={messagesEndRef} />

      {/* VideoChat */}
      {(localStream || remoteStream) && (
        <VideoChat
          stream={localStream}
          remoteStream={remoteStream}
          isMinimized={isVideoMinimized}
          onMinimize={() => setIsVideoMinimized(!isVideoMinimized)}
          onClose={() => {
            if (videoEnabled) stopVideo();
            setIsVideoMinimized(true);
          }}
          isLocalAudioEnabled={isLocalAudioEnabled}
          isRemoteAudioEnabled={isRemoteAudioEnabled}
          onToggleLocalAudio={toggleLocalAudio}
          onToggleRemoteAudio={toggleRemoteAudio}
          setVideoQuality={setVideoQuality}
          switchCamera={switchCamera}
          shareScreen={shareScreen}
        />
      )}

      <ChatFooter
        onSubmit={handleSubmit}
        onNextPartner={handleNextPartner}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isSearching={isSearching}
      />
    </Card>
  );
}
