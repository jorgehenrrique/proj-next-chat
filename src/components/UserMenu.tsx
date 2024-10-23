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
    <div className='flex items-center justify-between w-full max-w-[1400px] mx-auto'>
      <div className='flex items-center gap-2'>
        <span
          className='text-xl font-bold text-sky-500 hover:text-sky-400 cursor-pointer transition-colors duration-200'
          onClick={onBack}
        >
          ChatVortex
        </span>
        {currentRoom && (
          <>
            <span className='text-gray-400'>/</span>
            <span className='text-lg text-gray-200'>{currentRoom.name}</span>
          </>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-gray-200'>{user?.name || 'Usuário'}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='hover:bg-sky-500 text-sky-500 hover:text-white transition-colors duration-200'
            >
              <User className='h-5 w-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              <User className='mr-2 h-4 w-4' />
              <span>Alterar Apelido</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onBack}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className='border-b border-sky-900 rounded-xl bg-gray-900/50 backdrop-blur-md'>
            <DialogHeader>
              <DialogTitle>Alterar Apelido</DialogTitle>
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
                placeholder='Novo apelido'
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
