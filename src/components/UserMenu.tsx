'use client';

import { useState } from 'react';
import { User, LogOut, ShieldCheck } from 'lucide-react';
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
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';

export default function UserMenu({ onBack }: { onBack: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const { user, updateUser } = useUser();
  const { currentRoom } = useRoom();
  const { setAdmin, clearAdmin } = useAdmin();
  const pathname = usePathname();

  const handleChangeUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newUsername.trim() && user?.name !== newUsername.trim()) {
      updateUser(newUsername.trim());
      setIsOpen(false);
      setNewUsername('');
    }
  };

  const handleAdminAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await setAdmin(adminPassword);
      setIsAdminOpen(false);
      setAdminPassword('');
      toast({
        title: 'Autenticado',
        description: 'Você agora tem acesso administrativo.',
      });
    } catch (error) {
      setAdminPassword('');
      toast({
        title: 'Erro',
        description: `${error}`,
        variant: 'destructive',
      });
      onBack();
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
              title='Menu de usuário'
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
            {pathname === '/chat' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsAdminOpen(true)}>
                  <ShieldCheck className='mr-2 h-4 w-4' />
                  <span>Admin</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                clearAdmin();
                onBack();
              }}
            >
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
                maxLength={20}
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

        <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
          <DialogContent className='border-b border-sky-900 rounded-xl bg-gray-900/50 backdrop-blur-md'>
            <DialogHeader>
              <DialogTitle>Autenticação Admin</DialogTitle>
              <DialogDescription>
                Digite a senha de administrador
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleAdminAuth}
              className='flex flex-col gap-4 w-full'
            >
              <Input
                type='password'
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder='Senha de Admin'
              />
              <Button type='submit' disabled={!adminPassword.trim()}>
                Autenticar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
