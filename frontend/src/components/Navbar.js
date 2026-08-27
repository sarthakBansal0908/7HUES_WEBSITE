import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar({ content }) {
  const settings = content?.settings || {};
  const nav = content?.nav || [];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        data-testid="site-header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled
            ? 'bg-charcoal/40 backdrop-blur-lg border-b border-white/10'
            : 'bg-gradient-to-b from-black/35 to-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 h-20 flex items-center justify-between">
          <Link to="/" data-testid="logo-link" className="flex items-center gap-3 group">
            <img
              src={settings.logo}
              alt={`${settings.brand_name || '7HUES'} logo`}
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="hidden sm:flex flex-col leading-none text-white">
              <span className="font-display font-700 text-lg tracking-[0.25em]">
                {settings.brand_name || '7HUES'}
              </span>
              <span className="font-display text-[0.6rem] tracking-[0.42em] text-white/70">
                {settings.brand_suffix || 'EXPEDITIONS'}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                data-testid={`nav-${item.label.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`}
                className="overline text-white/80 hover:text-white transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to={settings.booking_cta_href || '/book'}
              data-testid="nav-book-cta"
              className="hidden md:inline-flex items-center border border-white/40 text-white overline px-5 py-3 hover:bg-white hover:text-charcoal transition-colors duration-300"
            >
              {settings.booking_cta_label || 'BOOK YOUR RIDE'}
            </Link>
            <button
              data-testid="menu-toggle"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="text-white p-2 lg:hidden"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[70] bg-charcoal text-white flex flex-col"
          >
            <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
              <span className="font-display tracking-[0.3em]">{settings.brand_name || '7HUES'}</span>
              <button data-testid="menu-close" aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
                <X size={26} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-6">
              {nav.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="headline text-4xl text-white/90 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to={settings.booking_cta_href || '/book'}
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex w-fit border border-gold text-gold overline px-6 py-4"
              >
                {settings.booking_cta_label || 'BOOK YOUR RIDE'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
