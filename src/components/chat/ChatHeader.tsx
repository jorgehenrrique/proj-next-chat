import { RefreshCw, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { CardHeader, CardTitle } from '../ui/card';

interface ChatHeaderProps {
  isSearching: boolean;
  autoNextPartner: boolean;
  videoEnabled: boolean;
  onToggleAutoNext: () => void;
  onToggleVideo: () => void;
}

export function ChatHeader({
  isSearching,
  autoNextPartner,
  videoEnabled,
  onToggleAutoNext,
  onToggleVideo,
}: ChatHeaderProps) {
  return (
    <div className='absolute top-0 left-0 right-0 z-10'>
      <CardHeader className='bg-gray-800/50 py-1 px-4 rounded-t-xl border-b border-purple-900 backdrop-blur-md'>
        <CardTitle className='flex justify-start items-center gap-4'>
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
            onClick={onToggleAutoNext}
            className={`transition-colors duration-200 hover:bg-purple-600/80 hover:text-white ${
              autoNextPartner ? 'text-green-500' : 'text-red-500'
            }`}
            title={
              autoNextPartner
                ? 'Desativar busca automática'
                : 'Ativar busca automática'
            }
          >
            <RefreshCw className='w-4 h-4' />
          </Button>
          <span className='flex items-center gap-2 font-normal text-base py-1'>
            <Camera
              className={`w-4 h-4 text-purple-500 ${
                videoEnabled ? 'animate-pulse' : ''
              }`}
            />
            <span className='text-gray-200'>
              Vídeo: {videoEnabled ? 'ativado' : 'desativado'}
            </span>
          </span>
          <Button
            type='button'
            size='sm'
            onClick={onToggleVideo}
            className={`transition-colors duration-200 bg-transparent hover:bg-purple-600/80 hover:text-white ${
              videoEnabled ? 'text-green-500' : 'text-red-500'
            }`}
            title={videoEnabled ? 'Desativar vídeo' : 'Ativar vídeo'}
          >
            <Camera className='w-4 h-4' />
          </Button>
        </CardTitle>
      </CardHeader>
    </div>
  );
}
