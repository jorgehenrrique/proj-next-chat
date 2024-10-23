'use client';
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

interface PasswordPromptProps {
  onSubmit: (password: string) => void;
}

export default function PasswordPrompt({ onSubmit }: PasswordPromptProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <Dialog open={true}>
      <DialogContent className='border-b border-sky-900 bg-gray-900/50 backdrop-blur-md'>
        <DialogHeader>
          <DialogTitle>Sala Privada</DialogTitle>
          <DialogDescription>
            Esta sala é privada. Digite a senha para entrar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Digite a senha da sala (se houver)'
          />
          <Button type='submit'>Entrar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
