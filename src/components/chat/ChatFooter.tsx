import { FormEvent } from 'react';
import { Shuffle, SendIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CardFooter } from '../ui/card';

interface ChatFooterProps {
  onSubmit: (e: FormEvent) => void;
  onNextPartner: () => void;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isSearching: boolean;
}

export function ChatFooter({
  onSubmit,
  onNextPartner,
  inputMessage,
  setInputMessage,
  isSearching,
}: ChatFooterProps) {
  return (
    <div className='absolute bottom-0 left-0 right-0 z-10'>
      <CardFooter className='bg-gray-900/50 backdrop-blur-md p-4 border-t border-purple-900'>
        <form onSubmit={onSubmit} className='flex w-full gap-2'>
          <Button
            type='button'
            onClick={onNextPartner}
            className='bg-purple-600 hover:bg-purple-500'
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
  );
}
