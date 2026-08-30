import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero({ content }) {
  const hero = content?.hero || {};
  const settings = content?.settings || {};

  return (
    <section data-testid="hero" className="relative h-[100svh] w-full overflow-hidden bg-charcoal">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={hero.video_url}
        poster={hero.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/50" />

      <div className="relative z-10 h-full mx-auto max-w-[1600px] px-6 md:px-10 flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="overline text-gold mb-6"
          data-testid="hero-eyebrow"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="headline text-white text-[13vw] leading-[0.9] sm:text-[10vw] md:text-[7.5vw] lg:text-[6vw] max-w-[15ch]">
          {[hero.line1, hero.line2, hero.line3].filter(Boolean).map((line, i) => (
            <span key={i} className="block overflow-hidden py-[0.05em]">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.55 + i * 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-12"
        >
          <Link
            to={hero.cta_href || '/book'}
            data-testid="hero-book-cta"
            className="inline-flex items-center bg-gold text-white overline px-8 py-5 hover:bg-white hover:text-charcoal transition-colors duration-300"
          >
            {hero.cta_label || settings.booking_cta_label || 'BOOK YOUR RIDE'}
          </Link>
        </motion.div>
      </div>

      {/* Scroll to explore */}
      <div className="absolute right-6 md:right-10 bottom-10 z-10 hidden md:flex flex-col items-center gap-4">
        <span className="overline text-white/60 [writing-mode:vertical-rl] rotate-180">Scroll to Explore</span>
        <motion.div
          className="w-px h-16 bg-white/40"
          animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
}
