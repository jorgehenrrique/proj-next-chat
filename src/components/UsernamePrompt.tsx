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

interface UsernamePromptProps {
  onSubmit: (username: string) => void;
}

export default function UsernamePrompt({ onSubmit }: UsernamePromptProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className='shadow-sky-900 shadow-md'>
        <DialogHeader>
          <DialogTitle>Bem-vindo ao Chat</DialogTitle>
          <DialogDescription>
            Por favor, digite seu nome para entrar no chat.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Digite seu nome'
          />
          <Button type='submit' disabled={!username.trim()}>
            Entrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
