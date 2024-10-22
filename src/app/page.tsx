'use client';

import RoomList from '@/components/RoomList';
import CreateRoomModal from '@/components/CreateRoomModal';
import { useEffect, useState } from 'react';
import SlideTransition from '@/components/transitions/SlideTransition';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SlideTransition isVisible={isVisible} direction='down'>
      <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <h1 className='text-4xl font-bold mb-8'>ChatVortex</h1>
        <CreateRoomModal />

        <div className='mt-8'>
          <RoomList onRoomClick={() => setIsVisible(false)} />
        </div>
      </div>
    </SlideTransition>
  );
}
