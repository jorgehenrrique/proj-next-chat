import { ReactNode } from 'react';
import UserMenu from '@/components/UserMenu';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className='flex flex-col h-screen'>
      <aside className='bg-gray-800 p-2 flex justify-between items-center shadow-md'>
        <h1 className='text-2xl font-bold'>Chat App</h1>
        <UserMenu />
      </aside>
      <main className='flex-1 overflow-auto'>{children}</main>
    </div>
  );
}
