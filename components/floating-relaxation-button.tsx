'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wind } from 'lucide-react';
import { RelaxationMode } from './relaxation-mode';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingRelaxationButton() {
  const [showRelaxationMode, setShowRelaxationMode] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setShowRelaxationMode(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          title="Open Relaxation Mode"
        >
          <Wind className="h-6 w-6" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {showRelaxationMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RelaxationMode onClose={() => setShowRelaxationMode(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}