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

export function SectionHeader({ index, title, subtitle, align = 'left', light = false }) {
  const center = align === 'center';
  return (
    <Reveal className={`mb-12 md:mb-16 ${center ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'}`}>
      {index && <span className="font-mono text-gold text-sm block mb-4">{index}</span>}
      <h2 className={`headline text-5xl md:text-6xl lg:text-7xl ${light ? 'text-sand' : 'text-ink'}`}>{title}</h2>
      {subtitle && (
        <p className={`text-lg md:text-xl mt-6 max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-sand/70' : 'text-stone'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
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
