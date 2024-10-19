import { MessageProps } from '@/types/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ChatMessage({ message, isOwnMessage }: MessageProps) {
  const userId = message.userId.split('-').pop();

  return (
    <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <span
        className={`inline-block p-2 rounded-3xl text-left text-sm ${
          isOwnMessage ? 'bg-sky-500 text-black' : 'bg-lime-500 text-black'
        }`}
      >
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <strong style={{ color: message.color }}>
                {message.username}:
              </strong>
            </TooltipTrigger>
            <TooltipContent>{`ID: ${userId}`}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className='ml-1'>{` ${message.text}`}</span>
      </span>
    </div>
  );
}
