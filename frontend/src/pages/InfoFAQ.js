import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, ArrowUpRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import Footer from '../components/Footer';

const EASE = [0.22, 1, 0.36, 1];

/* inline **bold** support */
function inline(text = '') {
  return text.split(/\*\*(.+?)\*\*/g).map((seg, i) => (i % 2 ? <strong key={i} className="text-ink font-semibold">{seg}</strong> : seg));
}

/* render an answer block: paragraphs + "- " bullet lists */
function RichText({ text = '' }) {
  const blocks = [];
  let para = [];
  let bullets = [];
  const flushPara = () => { if (para.length) { blocks.push({ t: 'p', v: para.join(' ') }); para = []; } };
  const flushBul = () => { if (bullets.length) { blocks.push({ t: 'ul', v: [...bullets] }); bullets = []; } };
  text.split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) { flushPara(); flushBul(); return; }
    if (line.startsWith('- ')) { flushPara(); bullets.push(line.slice(2)); }
    else { flushBul(); para.push(line); }
  });
  flushPara(); flushBul();
  return (
    <div className="space-y-4">
      {blocks.map((b, i) =>
        b.t === 'ul' ? (
          <ul key={i} className="space-y-2">
            {b.v.map((li, j) => (
              <li key={j} className="flex gap-3 text-stone">
                <span className="text-gold mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                <span>{inline(li)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="text-stone leading-relaxed">{inline(b.v)}</p>
        )
      )}
    </div>
  );
}

function Collapse({ open, children }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function InfoFAQ({ content }) {
  const info = content?.info_faq || {};
  const settings = content?.settings || {};
  const social = content?.social || {};
  const contact = info.contact || {};

  const categories = useMemo(
    () => (info.categories || [])
      .filter((c) => c.enabled !== false)
      .map((c) => ({ ...c, questions: (c.questions || []).filter((q) => q.enabled !== false && (q.q || '').trim()) }))
      .filter((c) => c.questions.length > 0),
    [info.categories]
  );

  const [openCats, setOpenCats] = useState(() => new Set([0]));
  const [openQs, setOpenQs] = useState(() => new Set());

  const toggleCat = (i) => setOpenCats((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleQ = (key) => setOpenQs((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const openAll = () => {
    setOpenCats(new Set(categories.map((_, i) => i)));
    const all = new Set();
    categories.forEach((c, ci) => c.questions.forEach((_, qi) => all.add(`${ci}-${qi}`)));
    setOpenQs(all);
  };
  const closeAll = () => { setOpenCats(new Set()); setOpenQs(new Set()); };

  const waDigits = (settings.whatsapp || '').replace(/[^\d]/g, '');
  const links = [
    waDigits && { label: contact.whatsapp_label || 'WHATSAPP', href: `https://wa.me/${waDigits}` },
    settings.contact_email && { label: contact.email_label || 'EMAIL', href: `mailto:${settings.contact_email}` },
    social.instagram && { label: contact.instagram_label || 'INSTAGRAM', href: social.instagram },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-sand text-ink grain">
      <Helmet><title>Info & FAQ — 7HUES Expeditions</title></Helmet>

      {/* slim top bar */}
      <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 py-8 flex items-center justify-between">
        <Link to="/" data-testid="faq-back" className="inline-flex items-center gap-2 overline text-stone hover:text-ink transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <Link to="/" className="flex items-center gap-3">
          {settings.brand_image
            ? <img src={settings.brand_image} alt={settings.brand_name || '7HUES'} className="h-7 w-auto object-contain" />
            : <img src={settings.logo} alt="7HUES" className="h-9 w-9 rounded-full object-cover" />}
        </Link>
      </div>

      {/* intro */}
      <header className="mx-auto max-w-[1400px] w-full px-6 md:px-10 pt-16 md:pt-28 pb-14 md:pb-24">
        <Reveal><p className="overline text-gold mb-6" data-testid="faq-eyebrow">{info.eyebrow}</p></Reveal>
        <Reveal delay={0.05}>
          <h1 className="headline text-5xl sm:text-6xl md:text-8xl text-ink max-w-[16ch] leading-[0.95]">{info.heading}</h1>
        </Reveal>
        {info.intro && (
          <Reveal delay={0.12}>
            <div className="mt-10 max-w-2xl text-stone text-lg md:text-xl leading-relaxed space-y-5">
              {info.intro.split('\n').filter((l) => l.trim()).map((l, i) => <p key={i}>{l.trim()}</p>)}
            </div>
          </Reveal>
        )}
      </header>

      {/* open / close all */}
      <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 flex items-center gap-8 border-t border-ink/15 pt-6">
        <button data-testid="faq-open-all" onClick={openAll} className="group inline-flex items-center gap-2 overline text-stone hover:text-ink transition-colors">
          Open all <Plus size={14} className="text-gold" />
        </button>
        <button data-testid="faq-close-all" onClick={closeAll} className="group inline-flex items-center gap-2 overline text-stone hover:text-ink transition-colors">
          Close all <Minus size={14} className="text-gold" />
        </button>
      </div>

      {/* category accordions */}
      <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 pb-24 md:pb-36">
        {categories.map((cat, ci) => {
          const catOpen = openCats.has(ci);
          return (
            <section key={ci} data-testid={`faq-category-${ci}`} className="border-b border-ink/15">
              <button
                onClick={() => toggleCat(ci)}
                aria-expanded={catOpen}
                className="w-full flex items-baseline justify-between gap-6 py-8 md:py-10 text-left group"
              >
                <div className="flex items-baseline gap-5 md:gap-8">
                  <span className="font-mono text-gold text-xs md:text-sm shrink-0">{String(ci + 1).padStart(2, '0')}</span>
                  <h2 className={`font-display uppercase tracking-[0.04em] text-2xl md:text-4xl transition-colors ${catOpen ? 'text-ink' : 'text-ink/70 group-hover:text-ink'}`}>
                    {cat.title}
                  </h2>
                </div>
                <span className={`shrink-0 mt-1 h-9 w-9 md:h-11 md:w-11 grid place-items-center border border-ink/25 rounded-full transition-all duration-300 ${catOpen ? 'bg-ink text-sand border-ink' : 'text-ink group-hover:border-ink'}`}>
                  {catOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              <Collapse open={catOpen}>
                <div className="pb-4 md:pb-8 md:pl-[3.75rem]">
                  {cat.questions.map((q, qi) => {
                    const key = `${ci}-${qi}`;
                    const qOpen = openQs.has(key);
                    return (
                      <div key={qi} data-testid={`faq-question-${ci}-${qi}`} className="border-t border-ink/10">
                        <button
                          onClick={() => toggleQ(key)}
                          aria-expanded={qOpen}
                          className="w-full flex items-start justify-between gap-6 py-5 md:py-6 text-left group"
                        >
                          <h3 className={`text-lg md:text-2xl font-medium transition-colors ${qOpen ? 'text-ink' : 'text-ink/80 group-hover:text-ink'}`}>
                            {q.q}
                          </h3>
                          <span className="shrink-0 mt-1 text-gold">
                            {qOpen ? <Minus size={18} /> : <Plus size={18} />}
                          </span>
                        </button>
                        <Collapse open={qOpen}>
                          <div className="pb-7 md:pb-9 md:pr-24 text-base md:text-lg">
                            <RichText text={q.a} />
                          </div>
                        </Collapse>
                      </div>
                    );
                  })}
                </div>
              </Collapse>
            </section>
          );
        })}
      </div>

      {/* contact ending */}
      <section data-testid="faq-contact" className="mx-auto max-w-[1400px] w-full px-6 md:px-10 pb-28 md:pb-40">
        <div className="border-t border-ink/15 pt-16 md:pt-24">
          <Reveal><p className="overline text-gold mb-6">{contact.eyebrow || 'STILL WONDERING?'}</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="headline text-5xl md:text-7xl text-ink">{contact.heading || 'Talk to us.'}</h2>
          </Reveal>
          {contact.body && (
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl text-stone text-lg md:text-xl leading-relaxed space-y-5">
                {contact.body.split('\n').filter((l) => l.trim()).map((l, i) => <p key={i}>{l.trim()}</p>)}
              </div>
            </Reveal>
          )}

          <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-x-14 gap-y-6">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                data-testid={`faq-contact-${l.label.toLowerCase()}`}
                className="group inline-flex items-center gap-3 font-display uppercase tracking-[0.06em] text-xl md:text-3xl text-ink hover:text-gold transition-colors"
              >
                {l.label}
                <ArrowUpRight size={22} className="text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            ))}
          </div>

          {contact.footer_line && (
            <p className="mt-16 text-stone/80 text-base md:text-lg italic max-w-2xl">{contact.footer_line}</p>
          )}
        </div>
      </section>

      <Footer content={content} />
    </div>
  );
}
