import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  PictureInPicture2,
  ScreenShare,
  Settings,
  SwitchCamera,
  Video,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader/Loader';
import { VideoChatProps } from '@/types/video';

export default function VideoChat({
  stream,
  remoteStream,
  isMinimized,
  onMinimize,
  onClose,
  isLocalAudioEnabled,
  isRemoteAudioEnabled,
  onToggleLocalAudio,
  onToggleRemoteAudio,
  setVideoQuality,
  switchCamera,
  shareScreen,
}: VideoChatProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Função para ativar Picture-in-Picture
  const togglePiP = async () => {
    const remoteVideo = remoteVideoRef.current;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else if (document.pictureInPictureEnabled && remoteVideo) {
        await remoteVideo.requestPictureInPicture();
        setIsPiPActive(true);
      }
    } catch (err) {
      console.error('Erro ao alternar PiP:', err);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      className={`fixed rounded-lg overflow-hidden shadow-lg z-50 ${
        isMinimized ? 'w-56' : 'w-auto'
      } bg-gray-900/90 backdrop-blur-md border border-purple-900 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      initial={{ right: 20, bottom: 90 }}
    >
      <div className='relative'>
        <div className='absolute top-2 right-2 flex flex-col gap-1 z-40'>
          <Button
            size='sm'
            variant='ghost'
            onClick={togglePiP}
            className={`hover:bg-purple-500/20 ${
              isPiPActive ? 'text-purple-500' : ''
            }`}
            title={isPiPActive ? 'Sair do PiP' : 'Entrar em PiP'}
          >
            <PictureInPicture2 size={12} />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={onMinimize}
            className='hover:bg-purple-500/20'
          >
            {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={onClose}
            className='hover:bg-red-500/20'
          >
            <X size={12} />
          </Button>
        </div>
        <div
          className={`absolute top-2 left-2 z-40 flex gap-2 ${
            isMouseOver ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size='sm'
                variant='ghost'
                className='hover:bg-purple-500/20'
                title='Qualidade do vídeo'
              >
                <Settings size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-purple-500/20'>
              <DropdownMenuItem onClick={() => setVideoQuality('ultra')}>
                <Video size={8} /> Ultra
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVideoQuality('high')}>
                <Video size={8} /> Alta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVideoQuality('medium')}>
                <Video size={8} /> Média
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVideoQuality('low')}>
                <Video size={8} /> Baixa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size='sm'
            variant='ghost'
            onClick={switchCamera}
            className='hover:bg-purple-500/20'
            title='Trocar câmera'
          >
            <SwitchCamera size={12} />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={shareScreen}
            className='hover:bg-purple-500/20'
            title='Compartilhar tela'
          >
            <ScreenShare size={12} />
          </Button>
        </div>

        {/* Controles de áudio local */}
        <div className='absolute bottom-2 left-2 z-40'>
          <Button
            size='sm'
            variant='ghost'
            onClick={onToggleLocalAudio}
            className={`hover:bg-purple-500/20 ${
              !isLocalAudioEnabled && 'bg-red-500/20'
            }`}
            title={
              isLocalAudioEnabled ? 'Desativar microfone' : 'Ativar microfone'
            }
          >
            {isLocalAudioEnabled ? <Mic size={12} /> : <MicOff size={12} />}
          </Button>
        </div>

        {/* Controles de áudio remoto */}
        {remoteStream && (
          <div className='absolute bottom-2 right-2 z-40'>
            <Button
              size='sm'
              variant='ghost'
              onClick={onToggleRemoteAudio}
              className={`hover:bg-purple-500/20 ${
                !isRemoteAudioEnabled && 'bg-red-500/20'
              }`}
              title={
                isRemoteAudioEnabled
                  ? 'Silenciar parceiro'
                  : 'Ativar áudio do parceiro'
              }
            >
              {isRemoteAudioEnabled ? (
                <Volume2 size={12} />
              ) : (
                <VolumeX size={12} />
              )}
            </Button>
          </div>
        )}

        <div
          className={`grid ${
            isMinimized ? 'grid-cols-1' : 'grid-cols-2'
          } gap-2 p-2`}
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full rounded-lg ${
              isMinimized ? 'h-38' : 'h-auto'
            } object-cover`}
          />
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full rounded-lg ${
                isMinimized ? 'hidden' : 'h-auto'
              } object-cover`}
            />
          ) : (
            <div className='w-full h-auto bg-gray-800/50 rounded flex justify-center items-center'>
              <Loader />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
