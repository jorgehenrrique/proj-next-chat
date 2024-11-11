import { Message } from '@/types/types';
import ChatMessage from '../ChatMessage';
import { Spinner } from '../Spinner';
import { User } from '@/contexts/UserContext';
import { CardContent } from '../ui/card';

interface ChatMessagesProps {
  messages: Message[];
  isSearching: boolean;
  user: User;
  autoNextPartner: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({
  messages,
  isSearching,
  user,
  autoNextPartner,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
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
          <div ref={messagesEndRef} />
        </>
      )}
    </CardContent>
  );
}
