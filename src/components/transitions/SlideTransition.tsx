import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideTransitionProps {
  children: ReactNode;
  isVisible: boolean;
  direction: 'up' | 'down';
}

const SlideTransition = ({
  children,
  isVisible,
  direction,
}: SlideTransitionProps) => {
  const variants = {
    hidden: { y: direction === 'up' ? '100%' : '-100%' },
    visible: { y: '0%' },
  };

  return (
    <motion.div
      initial='hidden'
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.6 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',
      }}
    >
      {children}
    </motion.div>
  );
};

export default SlideTransition;
