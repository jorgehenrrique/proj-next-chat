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

  const handleSubmit = () => {
    onSubmit(password);
  };

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sala Privada</DialogTitle>
          <DialogDescription>
            Esta sala é privada. Digite a senha para entrar.
          </DialogDescription>
        </DialogHeader>
        <Input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Digite a senha da sala'
        />
        <Button onClick={handleSubmit}>Entrar</Button>
      </DialogContent>
    </Dialog>
  );
}
