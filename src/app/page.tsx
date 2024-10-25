'use client';

import RoomList from '@/components/RoomList';
import CreateRoomModal from '@/components/CreateRoomModal';
import { useEffect, useRef, useState } from 'react';
import SlideTransition from '@/components/transitions/SlideTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleExploreRooms = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        left: window.innerWidth,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleBack = () => {
    containerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  return (
    <SlideTransition isVisible={isVisible} direction='down'>
      <div
        ref={containerRef}
        className='flex overflow-x-auto overflow-y-hidden h-screen snap-x snap-mandatory'
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <motion.div
          className='flex-shrink-0 w-screen h-full flex flex-col items-center justify-center p-8 snap-start relative'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className='absolute inset-0 z-0'>
            <Image
              src='/triangle.svg'
              alt='Background'
              className='w-full h-full object-cover'
              fill
            />
          </div>
          <div className='relative z-10 flex flex-col items-center justify-center'>
            <h1 className='text-6xl font-bold mb-4 text-sky-500'>ChatVortex</h1>
            <div className='text-xl mb-8 text-center max-w-2xl'>
              <p className='text-lg mb-4'>
                Mergulhe em conversas dinâmicas com o ChatVortex! Oferecemos
                salas públicas e privadas para todos os tipos de interações,
                garantindo segurança e fluidez. Ao criar salas privadas, não se
                esqueça de compartilhar o link com seus amigos e familiares para
                que possam se juntar às conversas.
              </p>
              <p className='text-lg mb-4'>
                Apenas salas públicas são listadas e encontradas, assegurando
                que todos possam participar e interagir livremente.
              </p>
            </div>
            <Button
              onClick={handleExploreRooms}
              className='text-lg px-6 py-3 bg-sky-500 hover:bg-sky-600 transition-colors duration-300'
            >
              Explorar Salas <ArrowRight className='ml-2' />
            </Button>
          </div>
        </motion.div>

        <motion.div
          className='flex-shrink-0 w-screen h-full flex flex-col items-center p-4 snap-start overflow-y-auto bg-gradient-to-l from-sky-500/20 via-sky-900/10 to-transparent'
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: '0%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className='w-full max-w-4xl'>
            <h2 className='text-3xl font-bold mb-4 text-sky-400'>
              Salas Disponíveis
            </h2>
            <p className='text-lg mb-6'>
              Explore nossas salas públicas ou crie sua própria sala privada.
              Salas inativas são automaticamente removidas para manter a
              comunidade ativa.
            </p>
            <div className='flex justify-between items-center mb-8'>
              <CreateRoomModal />
              <Button
                variant='outline'
                onClick={handleBack}
                className='hover:bg-sky-500 hover:text-white transition-colors duration-300'
              >
                <ArrowLeft className='mr-2' /> Voltar
              </Button>
            </div>
            <RoomList onRoomClick={() => setIsVisible(false)} />
          </div>
        </motion.div>
      </div>
    </SlideTransition>
  );
}
