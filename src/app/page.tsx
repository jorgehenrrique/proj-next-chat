'use client';

import RoomList from '@/components/RoomList';
import CreateRoomModal from '@/components/CreateRoomModal';
import { useEffect, useRef, useState } from 'react';
import SlideTransition from '@/components/transitions/SlideTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    // Centraliza o scroll inicialmente
    containerRef.current?.scrollTo({
      left: window.innerWidth,
      behavior: 'instant',
    });
  }, []);

  const handleExploreRooms = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        left: window.innerWidth * 2,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleRandomChat = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleBack = () => {
    containerRef.current?.scrollTo({
      left: window.innerWidth,
      behavior: 'smooth',
    });
  };

  return (
    <SlideTransition isVisible={isVisible} direction='down'>
      <div
        ref={containerRef}
        className='flex overflow-x-auto overflow-y-hidden h-screen snap-x snap-mandatory'
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* Seção do Chat Aleatório - Lado Esquerdo */}
        <motion.div
          className='flex-shrink-0 w-screen h-full flex flex-col items-center p-4 snap-start overflow-y-auto bg-gradient-to-r from-purple-500/20 via-purple-900/10 to-transparent'
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: '0%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className='w-full max-w-4xl'>
            <h2 className='text-3xl font-bold mb-4 text-purple-400'>
              Chat Aleatório
            </h2>
            <p className='text-lg mb-6'>
              Converse com pessoas aleatórias de forma anônima e divertida.
              Encontre novos amigos, troque experiências e conheça pessoas de
              diferentes lugares. A qualquer momento você pode pular para o
              próximo usuário e iniciar uma nova conversa.
            </p>
            <div className='flex justify-between items-center mb-8'>
              <Button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => router.push('/random-chat'), 500);
                }}
                className='bg-purple-500 hover:bg-purple-600 hover:text-white transition-colors duration-300'
              >
                Entrar no Chat Aleatório <Shuffle className='ml-2' />
              </Button>
              <Button
                variant='outline'
                onClick={handleBack}
                className='hover:bg-purple-500 hover:text-white transition-colors duration-300'
              >
                Voltar <ArrowRight className='ml-2' />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Seção Central - Home */}
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
                Bem-vindo ao ChatVortex! Uma plataforma versátil de chat que
                oferece três experiências únicas de comunicação: salas
                personalizadas, chat global e conversas aleatórias.
              </p>
              <p className='text-lg mb-4'>
                Crie salas públicas para interagir com a comunidade ou salas
                privadas para conversas exclusivas com amigos e familiares. Em
                salas privadas, compartilhe o link de acesso apenas com quem
                você desejar.
              </p>
              <p className='text-lg mb-4'>
                Explore nossa seção de chat aleatório para conhecer novas
                pessoas de forma anônima e segura, ou navegue pelas salas
                públicas para encontrar comunidades com interesses em comum.
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <Button
                onClick={handleRandomChat}
                className='text-lg px-6 py-3 bg-purple-500 hover:bg-purple-600 hover:text-white transition-colors duration-300'
              >
                <ArrowLeft className='mr-2' /> Chat Aleatório
              </Button>

              <Button
                onClick={handleExploreRooms}
                className='text-lg px-6 py-3 bg-sky-500 hover:bg-sky-600 hover:text-white transition-colors duration-300'
              >
                Explorar Salas <ArrowRight className='ml-2' />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Seção da Lista de Salas - Lado Direito */}
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
            <div className='space-y-1 mb-6'>
              <p className='text-lg'>
                Explore e participe de diversas salas públicas ou crie sua
                própria sala personalizada. Você pode optar por criar:
              </p>
              <ul className='text-lg list-disc list-inside ml-4 space-y-2'>
                <li>
                  <span className='text-sky-400 font-semibold'>
                    Salas Públicas:
                  </span>{' '}
                  Visíveis para todos e abertas à participação da comunidade
                </li>
                <li>
                  <span className='text-sky-400 font-semibold'>
                    Salas Privadas:
                  </span>{' '}
                  Protegidas por senha e acessíveis apenas através de link
                  direto
                </li>
              </ul>
              <p className='text-lg'>
                Para manter a comunidade ativa e relevante, salas inativas são
                automaticamente removidas após um período sem atividade.
              </p>
            </div>
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
