'use client';

import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { useRoom } from '@/contexts/RoomContext';

export default function UserMenu({ onBack }: { onBack: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const { user, updateUser } = useUser();
  const { currentRoom } = useRoom();

  const handleChangeUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newUsername.trim() && user?.name !== newUsername.trim()) {
      updateUser(newUsername.trim());
      setIsOpen(false);
      setNewUsername('');
    }
  };

  return (
    <div className='flex items-center justify-between w-full'>
      <span className='text-lg font-bold'>ChatVortex</span>
      <span className='text-lg font-semibold'>
        {currentRoom ? `Sala: ${currentRoom.name}` : ''}
      </span>
      <div className='flex items-center'>
        <span className='mr-2'>{user?.name || 'Usuário'}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='hover:bg-sky-500 transition-colors duration-200'
            >
              <User className='h-5 w-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              <User className='mr-2 h-4 w-4' />
              <span>Alterar Nome</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onBack}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className='border-b border-sky-900 rounded-xl'>
            <DialogHeader>
              <DialogTitle>Alterar Apelido no Chat</DialogTitle>
              <DialogDescription>
                Por favor, digite seu apelido para usar no chat.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleChangeUsername}
              className='flex flex-col gap-4 w-full'
            >
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder='Novo apelido no Chat'
              />
              <Button
                type='submit'
                disabled={
                  !newUsername.trim() || user?.name === newUsername.trim()
                }
              >
                Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
