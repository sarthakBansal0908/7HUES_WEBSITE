import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Check } from 'lucide-react';
import { api } from '../lib/api';

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'expedition', label: 'Interested Expedition', type: 'text' },
  { name: 'preferred_dates', label: 'Preferred Dates', type: 'text' },
  { name: 'motorcycle', label: 'Motorcycle', type: 'text' },
  { name: 'experience', label: 'Riding Experience', type: 'text' },
  { name: 'riders', label: 'Number of Riders', type: 'text' },
];

export default function Book({ content }) {
  const settings = content?.settings || {};
  const [form, setForm] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', {
        name: form.name || '',
        phone: form.phone || '',
        email: form.email || '',
        city: form.city || '',
        expedition: form.expedition || '',
        preferred_dates: form.preferred_dates || '',
        motorcycle: form.motorcycle || '',
        experience: form.experience || '',
        riders: form.riders || '',
        message: form.message || '',
      });
      setSent(true);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-sand grain">
      <Helmet><title>Book Your Ride — 7HUES Expeditions</title></Helmet>
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-12">
        <Link to="/" className="inline-flex items-center gap-2 overline text-white/60 hover:text-white mb-16">
          <ArrowLeft size={16} /> Back
        </Link>

        <p className="overline text-gold mb-5">Reserve Your Spot</p>
        <h1 className="headline text-6xl md:text-8xl mb-6">BOOK YOUR RIDE</h1>
        <p className="text-white/60 text-lg max-w-xl mb-14">
          Tell us where you want to go. Our team will craft the details and reach out personally — no checkout, just a conversation.
        </p>

        {sent ? (
          <div data-testid="booking-success" className="border border-gold/40 p-12 text-center max-w-xl">
            <span className="h-16 w-16 rounded-full bg-gold grid place-items-center mx-auto mb-6">
              <Check size={28} className="text-white" />
            </span>
            <h2 className="headline text-3xl mb-3">The road is waiting.</h2>
            <p className="text-white/60">Thank you — your enquiry has been received. We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} data-testid="booking-form" className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.name === 'message' ? 'md:col-span-2' : ''}>
                <label className="overline text-white/50 block mb-3">{f.label}{f.required && ' *'}</label>
                <input
                  data-testid={`field-${f.name}`}
                  type={f.type}
                  required={f.required}
                  value={form[f.name] || ''}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className="w-full bg-transparent border-b border-white/25 py-3 text-lg text-sand focus:border-gold outline-none transition-colors"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="overline text-white/50 block mb-3">Message</label>
              <textarea
                data-testid="field-message"
                rows={3}
                value={form.message || ''}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border-b border-white/25 py-3 text-lg text-sand focus:border-gold outline-none transition-colors resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                data-testid="booking-submit"
                disabled={loading}
                className="bg-gold text-white overline px-10 py-5 hover:bg-sand hover:text-charcoal transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send Enquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
