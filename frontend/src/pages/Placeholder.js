import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

export default function Placeholder({ title, content }) {
  const settings = content?.settings || {};
  return (
    <div className="min-h-screen bg-sand text-ink grain flex flex-col">
      <Helmet><title>{title} — 7HUES Expeditions</title></Helmet>
      <div className="mx-auto max-w-[1600px] w-full px-6 md:px-10 py-12">
        <Link to="/" className="inline-flex items-center gap-2 overline text-stone hover:text-ink">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      <div className="flex-1 grid place-items-center px-6">
        <div className="text-center max-w-2xl">
          <p className="overline text-gold mb-6">7HUES Expeditions</p>
          <h1 className="headline text-6xl md:text-8xl text-ink mb-6">{title}</h1>
          <p className="text-stone text-lg">
            This chapter of the journey is being crafted. Check back soon — or begin your ride now.
          </p>
          <Link to="/book" className="inline-flex mt-10 bg-gold text-white overline px-8 py-4 hover:bg-charcoal transition-colors">
            {settings.booking_cta_label || 'BOOK YOUR RIDE'}
          </Link>
        </div>
      </div>
    </div>
  );
}
