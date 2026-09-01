import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../hooks/useLenis';

const EASE = [0.22, 1, 0.36, 1];

/*
  Reliable scroll-reveal: instead of framer's whileInView (which can stall under
  Lenis smooth-scroll), we track the element's position on mount + scroll and flip
  `shown` once it enters the viewport. Once shown, listeners detach. Reduced-motion
  users start already shown (no motion).
*/
function useShown(threshold = 0.86) {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (shown) return undefined;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * threshold && r.bottom > 0) setShown(true);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    // safety: guarantee reveal even if scroll events are throttled
    const t = setTimeout(check, 600);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      clearTimeout(t);
    };
  }, [shown, threshold]);

  return [ref, shown];
}

/* BODY text / generic blocks — soft fade + gentle rise */
export default function Reveal({ children, delay = 0, y = 28, className = '', ...rest }) {
  const [ref, shown] = useShown();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* HEADINGS — clip/mask rise: the line sweeps up from behind a mask */
export function Heading({ children, as = 'h2', className = '', delay = 0 }) {
  const MTag = motion[as] || motion.h2;
  const [ref, shown] = useShown();
  return (
    <span ref={ref} className="block overflow-hidden pb-[0.08em]">
      <MTag
        className={className}
        style={{ display: 'block' }}
        initial={{ y: '115%' }}
        animate={shown ? { y: '0%' } : { y: '115%' }}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {children}
      </MTag>
    </span>
  );
}

/* BUTTONS / LINKS — a confident pop: rise + slight scale settle */
export function CTA({ children, className = '', delay = 0 }) {
  const [ref, shown] = useShown();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={shown ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* IMAGES — slide-in reveal: a mask wipes upward while the image settles from a zoom */
export function MaskImage({ src, alt = '', className = '', imgClass = '', delay = 0 }) {
  const [ref, shown] = useShown(0.92);
  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={shown ? { clipPath: 'inset(0 0 0% 0)' } : { clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${imgClass}`}
        initial={{ scale: 1.28 }}
        animate={shown ? { scale: 1 } : { scale: 1.28 }}
        transition={{ duration: 1.5, ease: EASE, delay }}
      />
    </motion.div>
  );
}

export function SectionHeader({ index, title, subtitle, align = 'left', light = false }) {
  const center = align === 'center';
  return (
    <div className={`mb-12 md:mb-16 ${center ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'}`}>
      {index && (
        <Reveal>
          <span className="font-mono text-gold text-sm block mb-4">{index}</span>
        </Reveal>
      )}
      <Heading as="h2" className={`headline text-5xl md:text-6xl lg:text-7xl ${light ? 'text-sand' : 'text-ink'}`}>
        {title}
      </Heading>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className={`text-lg md:text-xl mt-6 max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-sand/70' : 'text-stone'}`}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
