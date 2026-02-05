'use client';

/**
 * PageWrapper Component
 *
 * Apple-style page transitions with Framer Motion.
 * Uses initial={false} to prevent SSR rendering with opacity:0
 * which causes white screen before JS hydration.
 */

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const pageTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 25,
  mass: 0.8,
};

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      initial={isMounted ? 'initial' : false}
      animate="animate"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
