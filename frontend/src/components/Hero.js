import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

export default function Hero({ content }) {
  const hero = content?.hero || {};
  const settings = content?.settings || {};
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState('00:00');

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (!v.duration) return;
      setProgress((v.currentTime / v.duration) * 100);
      const m = Math.floor(v.currentTime / 60).toString().padStart(2, '0');
      const s = Math.floor(v.currentTime % 60).toString().padStart(2, '0');
      setElapsed(`${m}:${s}`);
    };
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      data-testid="hero"
      className="relative h-[100svh] w-full overflow-hidden bg-charcoal"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={hero.video_url}
        poster={hero.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* cinematic overlays */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/10 to-black/60" />

      <div className="relative z-10 h-full mx-auto max-w-[1600px] px-6 md:px-10 flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
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
                transition={{ delay: 0.6 + i * 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <button
            data-testid="play-showreel"
            onClick={toggle}
            className="group flex items-center gap-4 text-white"
          >
            <span className="h-14 w-14 rounded-full border border-white/50 grid place-items-center group-hover:bg-white group-hover:text-charcoal transition-colors duration-300">
              {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </span>
            <span className="overline">Play Showreel</span>
          </button>
          <span className="font-mono text-white/70 text-sm">{hero.runtime}</span>

          <Link
            to={hero.cta_href || '/book'}
            data-testid="hero-book-cta"
            className="ml-auto sm:ml-4 inline-flex items-center bg-gold text-white overline px-7 py-4 hover:bg-white hover:text-charcoal transition-colors duration-300"
          >
            {hero.cta_label || settings.booking_cta_label || 'BOOK YOUR RIDE'}
          </Link>
        </motion.div>
      </div>

      {/* Scroll to explore */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center gap-4">
        <span className="overline text-white/60 [writing-mode:vertical-rl] rotate-180">
          Scroll to Explore
        </span>
        <motion.div
          className="w-px h-16 bg-white/40"
          animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 pb-5 flex items-center gap-4 text-white/70">
          <span className="font-mono text-xs">{elapsed}</span>
          <div className="flex-1 h-px bg-white/20 relative">
            <div
              className="absolute left-0 top-0 h-px bg-gold transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs">{hero.runtime}</span>
        </div>
      </div>
    </section>
  );
}
