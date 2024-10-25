import { MessageProps } from '@/types/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

export default function ChatMessage({ message, isOwnMessage }: MessageProps) {
  const userId = message.userId.split('-').pop();

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}
      initial='hidden'
      animate='visible'
      variants={messageVariants}
    >
      <span
        className={`inline-block p-2 rounded-3xl text-left text-sm font-semibold break-words max-w-[85%] ${
          isOwnMessage
            ? 'bg-sky-500 text-gray-100'
            : 'bg-teal-600 text-orange-100'
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
        <span className='ml-1'>
          {message.text.split(' ').map((word, index) => {
            if (word.match(/^(https?:\/\/|www\.)/i)) {
              const href = word.startsWith('www.') ? `http://${word}` : word;
              return (
                <a
                  key={index}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sky-900 hover:underline'
                >
                  {word}
                </a>
              );
            }
            return ` ${word}`;
          })}
        </span>
      </span>
    </motion.div>
  );
}
