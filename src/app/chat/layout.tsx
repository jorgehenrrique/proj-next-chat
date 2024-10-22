'use client';

import { ReactNode, useEffect, useState } from 'react';
import UserMenu from '@/components/UserMenu';
import { useRouter } from 'next/navigation';
import SlideTransition from '@/components/transitions/SlideTransition';
import { RoomProvider } from '@/contexts/RoomContext';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(() => router.push('/'), 500);
  };

  return (
    <RoomProvider>
      <SlideTransition isVisible={isVisible} direction='up'>
        <div className='flex flex-col h-screen'>
          <aside className='bg-gray-800 px-2 py-1 flex justify-between items-center border-b border-sky-900 fixed top-0 w-full z-10'>
            <UserMenu onBack={handleBack} />
          </aside>
          <main className='flex-1 overflow-hidden'>{children}</main>
        </div>
      </SlideTransition>
    </RoomProvider>
  );
}
