import React from 'react';
import { motion } from 'framer-motion';

export default function Reveal({ children, delay = 0, y = 40, className = '', ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function MaskImage({ src, alt = '', className = '', imgClass = '', delay = 0 }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${imgClass}`}
        initial={{ scale: 1.25, opacity: 0.4 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
  );
}
