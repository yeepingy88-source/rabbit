import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function HintBubble({ hint }) {
  const [shown, setShown] = useState(null);

  useEffect(() => {
    if (!hint) return;
    setShown(hint);
    const t = setTimeout(() => setShown(null), 1600);
    return () => clearTimeout(t);
  }, [hint]);

  return (
    <div className="absolute inset-x-0 top-40 flex justify-center pointer-events-none px-6">
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-4 py-2 rounded-full bg-[#fff4e0] text-[#5a331b] text-sm font-semibold shadow-lg"
          >
            {shown.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}