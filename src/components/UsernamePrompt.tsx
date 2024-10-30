import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useContentFilter } from '@/hooks/useContentFilter';
import { toast } from '@/hooks/use-toast';

interface UsernamePromptProps {
  onSubmit: (username: string) => void;
}

export default function UsernamePrompt({ onSubmit }: UsernamePromptProps) {
  const [username, setUsername] = useState('');
  const { checkContent } = useContentFilter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (trimmedUsername) {
      const { isClean, message } = checkContent(trimmedUsername);

      if (!isClean) {
        toast({
          title: 'Nome não permitido',
          description: message,
          variant: 'destructive',
        });
        setUsername('');
        return;
      }

      onSubmit(trimmedUsername);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className='border-b border-sky-900 rounded-xl bg-gray-900/50 backdrop-blur-md'>
        <DialogHeader>
          <DialogTitle>Bem-vindo ao Chat</DialogTitle>
          <DialogDescription>
            Por favor, digite seu apelido para o chat.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          <Input
            value={username}
            maxLength={20}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Digite seu apelido'
          />
          <Button type='submit' disabled={!username.trim()}>
            Entrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
