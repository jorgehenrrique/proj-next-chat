'use client';

import RandomChat from '@/components/RandomChat';
import { useUser } from '@/contexts/UserContext';
import UsernamePrompt from '@/components/UsernamePrompt';
import UserMenu from '@/components/UserMenu';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SlideTransition from '@/components/transitions/SlideTransition';

export default function RandomChatPage() {
  const { user, updateUser } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(() => router.push('/'), 500);
  };

  if (!user) return <UsernamePrompt onSubmit={updateUser} />;

  return (
    <SlideTransition isVisible={isVisible} direction='up'>
      <div className='h-screen flex flex-col'>
        <aside className='bg-purple-900/40 backdrop-blur-sm px-4 py-1 border-b border-purple-900 sticky top-0 w-full z-20 shadow-lg shadow-purple-900/20'>
          <UserMenu onBack={handleBack} />
        </aside>
        <main className='flex-1 container mx-auto px-0 py-2 overflow-hidden'>
          <RandomChat />
        </main>
      </div>
    </SlideTransition>
  );
}
