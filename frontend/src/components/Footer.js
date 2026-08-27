import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, ArrowRight } from 'lucide-react';

export default function Footer({ content }) {
  const footer = content?.footer || {};
  const settings = content?.settings || {};
  const social = content?.social || {};
  const nav = content?.nav || [];

  return (
    <footer data-testid="site-footer" className="relative text-sand overflow-hidden">
      <img
        src={footer.image}
        alt="The road ahead"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/70" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-48 pb-12">
        <h2 className="headline text-[13vw] md:text-[7vw] leading-[0.9]">
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

        <div className="mt-24 grid md:grid-cols-4 gap-10 border-t border-white/15 pt-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={settings.logo} alt="logo" className="h-11 w-11 rounded-full" />
              <span className="font-display tracking-[0.25em]">{settings.brand_name}</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Curated motorcycle expeditions across extraordinary landscapes.
            </p>
          </div>

          <div>
            <p className="overline text-white/40 mb-5">Explore</p>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-white/70 hover:text-gold transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="overline text-white/40 mb-5">Contact</p>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href={`mailto:${settings.contact_email}`} className="hover:text-gold">{settings.contact_email}</a></li>
              <li><a href={`tel:${settings.phone}`} className="hover:text-gold">{settings.phone}</a></li>
              <li><a href={`https://wa.me/${(settings.whatsapp || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-gold">WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <p className="overline text-white/40 mb-5">Follow the journey</p>
            <div className="flex gap-4">
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
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between gap-4 text-white/40 text-xs">
          <span>{footer.copyright}</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white/70">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/70">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
