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
        <div className='flex flex-col min-h-screen bg-gray-900'>
          <aside className='bg-gray-800/95 backdrop-blur-sm px-4 py-1 border-b border-sky-900 sticky top-0 w-full z-20 shadow-lg shadow-sky-900/20'>
            <UserMenu onBack={handleBack} />
          </aside>
          <main className='flex-1 container mx-auto px-0 py-1.5'>
            {children}
          </main>
        </div>
      </SlideTransition>
    </RoomProvider>
  );
}
