import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Turn a pasted URL into the right kind of background player.
function resolveVideo(url = '') {
  if (!url) return { type: 'none' };
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    const id = yt[1];
    const params = new URLSearchParams({
      autoplay: '1', mute: '1', controls: '0', loop: '1', playlist: id,
      playsinline: '1', modestbranding: '1', rel: '0', showinfo: '0',
      disablekb: '1', fs: '0', iv_load_policy: '3',
    });
    if (typeof window !== 'undefined') params.set('origin', window.location.origin);
    return { type: 'embed', src: `https://www.youtube.com/embed/${id}?${params.toString()}` };
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return { type: 'embed', src: `https://player.vimeo.com/video/${vimeo[1]}?background=1&autoplay=1&loop=1&muted=1` };
  }
  return { type: 'file', src: url };
}

export default function Hero({ content }) {
  const hero = content?.hero || {};
  const settings = content?.settings || {};
  const video = resolveVideo(hero.video_url);

  return (
    <section data-testid="hero" className="relative h-[100svh] w-full overflow-hidden bg-charcoal">
      {/* poster underlay so there is no black flash before the video loads */}
      {hero.poster && (
        <img src={hero.poster} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      )}

      {video.type === 'embed' ? (
        <iframe
          data-testid="hero-video-embed"
          title="Showreel"
          src={video.src}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full pointer-events-none"
        />
      ) : video.type === 'file' ? (
        <video
          data-testid="hero-video-file"
          className="absolute inset-0 h-full w-full object-cover"
          src={video.src}
          poster={hero.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/50" />

      <div className="relative z-10 h-full shell flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="overline text-gold mb-6"
          data-testid="hero-eyebrow"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="headline text-white text-[10vw] leading-[0.95] sm:text-[9vw] md:text-[7.5vw] lg:text-[6vw] max-w-[15ch]">
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
          className="mt-10 md:mt-12"
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
