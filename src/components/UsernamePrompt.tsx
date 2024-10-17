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

  const handleSubmit = () => {
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bem-vindo ao Chat</DialogTitle>
          <DialogDescription>
            Por favor, digite seu nome para entrar no chat.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Digite seu nome'
        />
        <Button onClick={handleSubmit} disabled={!username.trim()}>
          Entrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
