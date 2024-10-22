// import { motion } from 'framer-motion';
// import { ReactNode } from 'react';

// interface PageTransitionProps {
//   children: ReactNode;
//   isVisible: boolean;
// }

// const PageTransition = ({ children, isVisible }: PageTransitionProps) => {
//   return (
//     <motion.div
//       initial={{ y: '100%' }}
//       animate={{ y: isVisible ? 0 : '100%' }}
//       exit={{ y: '100%' }}
//       transition={{ type: 'tween', ease: 'anticipate', duration: 0.8 }}
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         overflow: 'auto',
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// export default PageTransition;
