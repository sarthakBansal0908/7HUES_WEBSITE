import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, ArrowRight } from 'lucide-react';

export default function Footer({ content }) {
  const footer = content?.footer || {};
  const settings = content?.settings || {};
  const social = content?.social || {};
  const nav = content?.nav || [];

  return (
    <footer data-testid="site-footer" className="relative text-sand overflow-hidden min-h-[80vh] flex flex-col justify-between">
      {/* cinematic road photograph */}
      <img
        src={footer.image}
        alt="The road ahead"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* light, cinematic treatment — image stays visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/35 to-charcoal/45" />

      <div className="relative z-10 shell w-full pt-40 md:pt-56">
        <h2 className="headline text-[14vw] md:text-[8vw] leading-[0.88]">
          {footer.statement_line1}
          <br />
          <span className="text-gold">{footer.statement_line2}</span>
        </h2>
        <Link
          to={footer.cta_href || '/book'}
          data-testid="footer-book-cta"
          className="group inline-flex items-center gap-4 mt-10 bg-gold text-white overline px-8 py-5 hover:bg-sand hover:text-charcoal transition-colors duration-300"
        >
          {footer.cta_label}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* slim closing bar */}
      <div className="relative z-10 shell w-full pb-10 pt-24">
        <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 order-2 md:order-1">
            {nav.map((item) => (
              <Link key={item.label} to={item.href} className="overline text-white/60 hover:text-gold transition-colors hidden sm:inline">
                {item.label}
              </Link>
            ))}
          </div>

          <Link to="/" className="flex items-center gap-3 order-1 md:order-2">
            <img src={settings.logo} alt="7HUES" className="h-12 w-12 rounded-full" />
            <span className="font-display tracking-[0.25em] text-lg">{settings.brand_name}</span>
          </Link>

          <div className="flex gap-4 order-3">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noreferrer" data-testid="social-instagram" className="h-11 w-11 rounded-full border border-white/25 grid place-items-center hover:bg-gold hover:border-gold transition-colors">
                <Instagram size={18} />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noreferrer" data-testid="social-youtube" className="h-11 w-11 rounded-full border border-white/25 grid place-items-center hover:bg-gold hover:border-gold transition-colors">
                <Youtube size={18} />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer" data-testid="social-facebook" className="h-11 w-11 rounded-full border border-white/25 grid place-items-center hover:bg-gold hover:border-gold transition-colors">
                <Facebook size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between gap-3 text-white/40 text-xs">
          <span>{footer.copyright}</span>
          <div className="flex gap-6">
            <a href={`mailto:${settings.contact_email}`} className="hover:text-white/70">{settings.contact_email}</a>
            <Link to="/privacy" className="hover:text-white/70">Privacy</Link>
            <Link to="/terms" className="hover:text-white/70">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
