import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Check, AlertCircle, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api';

const EXPERIENCE_OPTS = ['First long ride', 'Occasional rider', 'Experienced tourer', 'Hardcore ADV rider'];
const RIDER_OPTS = ['Just me', '2 riders', '3–4 riders', '5+ riders'];

const STEPS = [
  { n: '01', t: 'We read every word', d: 'A real person on our team reviews your enquiry — not a bot, not a queue.' },
  { n: '02', t: 'We shape the details', d: 'Route, machine, stays and pace, built around how you want to ride.' },
  { n: '03', t: 'We reach out personally', d: 'Usually within 48 hours, by call or WhatsApp — whatever suits you.' },
];

export default function Book({ content }) {
  const settings = content?.settings || {};
  const social = content?.social || {};
  const [form, setForm] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const waDigits = (settings.whatsapp || '').replace(/[^\d]/g, '');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.email) {
      setError('Please add your name, phone and email so we can reach you.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('That email doesn’t look right — please double-check it.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/bookings', {
        name: form.name || '', phone: form.phone || '', email: form.email || '',
        city: form.city || '', expedition: form.expedition || '', preferred_dates: form.preferred_dates || '',
        motorcycle: form.motorcycle || '', experience: form.experience || '', riders: form.riders || '',
        message: form.message || '',
      });
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Something went wrong sending your enquiry. Please try again, or reach us directly below.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-transparent border-b border-white/25 py-3 text-lg text-sand placeholder-white/25 focus:border-gold outline-none transition-colors';

  const textField = (name, label, { type = 'text', required = false, full = false, placeholder = '' } = {}) => (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="overline text-white/50 block mb-3">{label}{required && <span className="text-gold"> *</span>}</label>
      <input
        data-testid={`field-${name}`}
        type={type}
        required={required}
        placeholder={placeholder}
        value={form[name] || ''}
        onChange={(e) => setField(name, e.target.value)}
        className={inputCls}
      />
    </div>
  );

  const selectField = (name, label, opts) => (
    <div>
      <label className="overline text-white/50 block mb-3">{label}</label>
      <select
        data-testid={`field-${name}`}
        value={form[name] || ''}
        onChange={(e) => setField(name, e.target.value)}
        className={`${inputCls} appearance-none cursor-pointer`}
      >
        <option value="" className="bg-charcoal text-white/50">Select…</option>
        {opts.map((o) => <option key={o} value={o} className="bg-charcoal text-sand">{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal text-sand grain">
      <Helmet><title>Book Your Ride — 7HUES Expeditions</title></Helmet>

      <div className="mx-auto max-w-[1300px] px-6 md:px-10 py-10 md:py-14">
        <Link to="/" data-testid="book-back" className="inline-flex items-center gap-2 overline text-white/60 hover:text-white transition-colors mb-12 md:mb-16">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {sent ? (
          <div data-testid="booking-success" className="max-w-2xl">
            <span className="h-16 w-16 rounded-full bg-gold grid place-items-center mb-8">
              <Check size={28} className="text-white" />
            </span>
            <p className="overline text-gold mb-5">Enquiry received</p>
            <h1 className="headline text-5xl md:text-7xl mb-6">The road is waiting.</h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              Thank you{form.name ? `, ${form.name.split(' ')[0]}` : ''}. Your enquiry is with our team and we’ll be in
              touch personally — usually within 48 hours. If you’d rather talk now, reach us directly below.
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {waDigits && (
                <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noreferrer" data-testid="success-whatsapp"
                  className="group inline-flex items-center gap-2 font-display uppercase tracking-[0.06em] text-lg hover:text-gold transition-colors">
                  WhatsApp us <ArrowUpRight size={18} className="text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
              <Link to="/" className="group inline-flex items-center gap-2 font-display uppercase tracking-[0.06em] text-lg text-white/70 hover:text-white transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-x-16 gap-y-14">
            {/* left editorial panel */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-14">
                <p className="overline text-gold mb-5">Reserve your spot</p>
                <h1 className="headline text-5xl md:text-7xl mb-6">BOOK YOUR RIDE</h1>
                <p className="text-white/60 text-lg leading-relaxed max-w-md mb-12">
                  Tell us where you want to go. There’s no checkout and no obligation — just the start of a conversation
                  with the people who’ll build your expedition.
                </p>

                <div className="space-y-8 border-t border-white/10 pt-10">
                  {STEPS.map((s) => (
                    <div key={s.n} className="flex gap-5">
                      <span className="font-mono text-gold text-sm shrink-0 pt-1">{s.n}</span>
                      <div>
                        <h3 className="font-display uppercase tracking-[0.05em] text-base mb-1">{s.t}</h3>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {(waDigits || settings.contact_email) && (
                  <div className="mt-12 border-t border-white/10 pt-8 flex flex-wrap gap-x-8 gap-y-3">
                    {waDigits && (
                      <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noreferrer" className="overline text-white/60 hover:text-gold transition-colors">WhatsApp →</a>
                    )}
                    {settings.contact_email && (
                      <a href={`mailto:${settings.contact_email}`} className="overline text-white/60 hover:text-gold transition-colors">Email →</a>
                    )}
                    {social.instagram && (
                      <a href={social.instagram} target="_blank" rel="noreferrer" className="overline text-white/60 hover:text-gold transition-colors">Instagram →</a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* right form */}
            <div className="lg:col-span-3">
              <form onSubmit={submit} data-testid="booking-form" noValidate className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
                <p className="overline text-white/40 sm:col-span-2 -mb-1">About you</p>
                {textField('name', 'Name', { required: true })}
                {textField('phone', 'Phone', { type: 'tel', required: true })}
                {textField('email', 'Email', { type: 'email', required: true })}
                {textField('city', 'City')}

                <p className="overline text-white/40 sm:col-span-2 mt-6 -mb-1">Your ride</p>
                {textField('expedition', 'Which expedition or region interests you?', { full: true, placeholder: 'e.g. Spiti, Ladakh, or “not sure yet”' })}
                {textField('preferred_dates', 'Preferred dates')}
                {textField('motorcycle', 'Your motorcycle', { placeholder: 'Own bike or rent from us' })}
                {selectField('experience', 'Riding experience', EXPERIENCE_OPTS)}
                {selectField('riders', 'Number of riders', RIDER_OPTS)}

                <div className="sm:col-span-2">
                  <label className="overline text-white/50 block mb-3">Anything else?</label>
                  <textarea
                    data-testid="field-message"
                    rows={3}
                    value={form.message || ''}
                    onChange={(e) => setField('message', e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Tell us anything that helps us plan your ride."
                  />
                </div>

                {error && (
                  <div data-testid="booking-error" className="sm:col-span-2 flex items-start gap-3 border border-red-400/40 bg-red-400/10 text-red-200 px-4 py-3 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    data-testid="booking-submit"
                    disabled={loading}
                    className="bg-gold text-white overline px-10 py-5 hover:bg-sand hover:text-charcoal transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Sending…' : 'Send Enquiry'}
                  </button>
                  <p className="text-white/30 text-xs mt-4">We’ll only use your details to plan your expedition. No spam, ever.</p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
