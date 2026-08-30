import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogOut, Save, ExternalLink, Trash2, Upload, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { Text, Area, Select, ImageInput, VideoInput, ListEditor } from '../components/admin/AdminFields';

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const abs = (u) => (u && u.startsWith('/api/') ? `${BACKEND}${u}` : u);

/* ------------------------------ Login screen ----------------------------- */
function Login() {
  const signIn = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/admin';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  return (
    <div className="min-h-screen bg-charcoal text-sand grid place-items-center px-6">
      <div className="max-w-md w-full text-center">
        <p className="overline text-gold mb-4">7HUES · CONTROL ROOM</p>
        <h1 className="headline text-5xl mb-4">CMS DASHBOARD</h1>
        <p className="text-white/50 mb-10">Sign in to manage every heading, photo, video and link on your site.</p>
        <button
          data-testid="google-signin"
          onClick={signIn}
          className="w-full bg-gold text-white overline px-6 py-5 hover:bg-sand hover:text-charcoal transition-colors"
        >
          Continue with Google
        </button>
        <Link to="/" className="inline-block mt-8 overline text-white/40 hover:text-white">← Back to site</Link>
      </div>
    </div>
  );
}

/* ------------------------------ Section editors --------------------------- */
const patcher = (value, onChange) => (patch) => onChange({ ...value, ...patch });

function SettingsEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Text label="Brand name" value={value.brand_name} onChange={(v) => set({ brand_name: v })} />
      <Text label="Brand suffix" value={value.brand_suffix} onChange={(v) => set({ brand_suffix: v })} />
      <ImageInput label="Logo" value={value.logo} onChange={(v) => set({ logo: v })} />
      <ImageInput label="Motorcycle marker (transparent PNG)" value={value.motorcycle} onChange={(v) => set({ motorcycle: v })} />
      <Text label="Contact email" value={value.contact_email} onChange={(v) => set({ contact_email: v })} />
      <Text label="WhatsApp number" value={value.whatsapp} onChange={(v) => set({ whatsapp: v })} />
      <Text label="Phone" value={value.phone} onChange={(v) => set({ phone: v })} />
      <Text label="Booking CTA label" value={value.booking_cta_label} onChange={(v) => set({ booking_cta_label: v })} />
    </div>
  );
}

function SocialEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Text label="Instagram URL" value={value.instagram} onChange={(v) => set({ instagram: v })} />
      <Text label="YouTube URL" value={value.youtube} onChange={(v) => set({ youtube: v })} />
      <Text label="Facebook URL" value={value.facebook} onChange={(v) => set({ facebook: v })} />
    </div>
  );
}

function NavEditor({ value = [], onChange }) {
  return (
    <ListEditor
      label="Navigation links"
      items={value}
      onChange={onChange}
      blank={{ label: 'NEW LINK', href: '/' }}
      addLabel="Add nav link"
      renderItem={(it, up) => (
        <div className="grid md:grid-cols-2 gap-4">
          <Text label="Label" value={it.label} onChange={(v) => up({ ...it, label: v })} />
          <Text label="Href" value={it.href} onChange={(v) => up({ ...it, href: v })} />
        </div>
      )}
    />
  );
}

function HeroEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
        <Text label="Runtime" value={value.runtime} onChange={(v) => set({ runtime: v })} />
        <Text label="Headline line 1" value={value.line1} onChange={(v) => set({ line1: v })} />
        <Text label="Headline line 2" value={value.line2} onChange={(v) => set({ line2: v })} />
        <Text label="Headline line 3" value={value.line3} onChange={(v) => set({ line3: v })} />
        <Text label="CTA label" value={value.cta_label} onChange={(v) => set({ cta_label: v })} />
        <Text label="CTA link" value={value.cta_href} onChange={(v) => set({ cta_href: v })} />
      </div>
      <VideoInput label="Showreel video" value={value.video_url} onChange={(v) => set({ video_url: v })} />
      <ImageInput label="Video poster" value={value.poster} onChange={(v) => set({ poster: v })} />
    </div>
  );
}

function AboutEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Index" value={value.index} onChange={(v) => set({ index: v })} />
        <Text label="Title" value={value.title} onChange={(v) => set({ title: v })} />
        <Text label="CTA label" value={value.cta_label} onChange={(v) => set({ cta_label: v })} />
        <Text label="CTA link" value={value.cta_href} onChange={(v) => set({ cta_href: v })} />
      </div>
      <Area label="Body" value={value.body} onChange={(v) => set({ body: v })} />
      <ImageInput label="Image" value={value.image} onChange={(v) => set({ image: v })} />
      <Text label="Team heading" value={value.team_title} onChange={(v) => set({ team_title: v })} />
      <ListEditor
        label="Team members"
        items={value.team}
        onChange={(team) => set({ team })}
        blank={{ name: '', role: '', image: '' }}
        addLabel="Add team member"
        renderItem={(it, up) => (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Text label="Name" value={it.name} onChange={(v) => up({ ...it, name: v })} />
              <Text label="Role" value={it.role} onChange={(v) => up({ ...it, role: v })} />
            </div>
            <ImageInput label="Photo" value={it.image} onChange={(v) => up({ ...it, image: v })} />
          </div>
        )}
      />
    </div>
  );
}

function WhatWeDoEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Index" value={value.index} onChange={(v) => set({ index: v })} />
        <Text label="Title" value={value.title} onChange={(v) => set({ title: v })} />
        <Text label="CTA label" value={value.cta_label} onChange={(v) => set({ cta_label: v })} />
        <Text label="CTA link" value={value.cta_href} onChange={(v) => set({ cta_href: v })} />
      </div>
      <Area label="Body" value={value.body} onChange={(v) => set({ body: v })} />
      <ImageInput label="Image" value={value.image} onChange={(v) => set({ image: v })} />
      <ListEditor
        label="Differentiators"
        items={value.points}
        onChange={(points) => set({ points })}
        blank={{ title: '', body: '' }}
        addLabel="Add point"
        renderItem={(it, up) => (
          <div className="grid md:grid-cols-2 gap-4">
            <Text label="Title" value={it.title} onChange={(v) => up({ ...it, title: v })} />
            <Text label="Body" value={it.body} onChange={(v) => up({ ...it, body: v })} />
          </div>
        )}
      />
    </div>
  );
}

function DeliverEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Index" value={value.index} onChange={(v) => set({ index: v })} />
        <Text label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      </div>
      <ListEditor
        label="Attributes"
        items={value.items}
        onChange={(items) => set({ items })}
        blank={{ icon: 'route', title: 'NEW', body: '' }}
        addLabel="Add attribute"
        renderItem={(it, up) => (
          <div className="grid md:grid-cols-2 gap-4">
            <Select label="Icon" value={it.icon} onChange={(v) => up({ ...it, icon: v })} options={['route', 'shield', 'bed', 'film']} />
            <Text label="Title" value={it.title} onChange={(v) => up({ ...it, title: v })} />
            <div className="md:col-span-2"><Area label="Body" rows={2} value={it.body} onChange={(v) => up({ ...it, body: v })} /></div>
          </div>
        )}
      />
    </div>
  );
}

function ExperiencesEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Index" value={value.index} onChange={(v) => set({ index: v })} />
        <Text label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      </div>
      <Area label="Intro" value={value.intro} onChange={(v) => set({ intro: v })} />
      <ListEditor
        label="Catalogue cards"
        items={value.items}
        onChange={(items) => set({ items })}
        blank={{ title: '', tags: '', image: '' }}
        addLabel="Add card"
        renderItem={(it, up) => (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Text label="Title" value={it.title} onChange={(v) => up({ ...it, title: v })} />
              <Text label="Tags (• separated)" value={it.tags} onChange={(v) => up({ ...it, tags: v })} />
            </div>
            <ImageInput label="Image" value={it.image} onChange={(v) => up({ ...it, image: v })} />
          </div>
        )}
      />
    </div>
  );
}

function WhyEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Index" value={value.index} onChange={(v) => set({ index: v })} />
        <Text label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      </div>
      <ImageInput label="Section image" value={value.image} onChange={(v) => set({ image: v })} />
      <ListEditor
        label="Reasons"
        items={value.items}
        onChange={(items) => set({ items })}
        blank={{ title: 'NEW', body: '' }}
        addLabel="Add reason"
        renderItem={(it, up) => (
          <div className="grid md:grid-cols-2 gap-4">
            <Text label="Title" value={it.title} onChange={(v) => up({ ...it, title: v })} />
            <Text label="Body" value={it.body} onChange={(v) => up({ ...it, body: v })} />
          </div>
        )}
      />
    </div>
  );
}

function PeopleEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Index" value={value.index} onChange={(v) => set({ index: v })} />
        <Text label="Title" value={value.title} onChange={(v) => set({ title: v })} />
        <Text label="CTA label" value={value.cta_label} onChange={(v) => set({ cta_label: v })} />
        <Text label="CTA link" value={value.cta_href} onChange={(v) => set({ cta_href: v })} />
      </div>
      <Area label="Body" value={value.body} onChange={(v) => set({ body: v })} />
      <ImageInput label="Community image" value={value.image} onChange={(v) => set({ image: v })} />
      <ListEditor
        label="Rider avatars"
        items={value.avatars}
        onChange={(avatars) => set({ avatars })}
        blank={''}
        addLabel="Add avatar"
        renderItem={(it, up) => <ImageInput label="Avatar" value={it} onChange={(v) => up(v)} />}
      />
      <ListEditor
        label="Testimonials"
        items={value.testimonials}
        onChange={(testimonials) => set({ testimonials })}
        blank={{ quote: '', name: '', location: '' }}
        addLabel="Add testimonial"
        renderItem={(it, up) => (
          <div className="space-y-4">
            <Area label="Quote" rows={2} value={it.quote} onChange={(v) => up({ ...it, quote: v })} />
            <div className="grid md:grid-cols-2 gap-4">
              <Text label="Name" value={it.name} onChange={(v) => up({ ...it, name: v })} />
              <Text label="Location" value={it.location} onChange={(v) => up({ ...it, location: v })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}

function FromRoadEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <Text label="Title" value={value.title} onChange={(v) => set({ title: v })} />
      <ListEditor
        label="Curated social posts"
        items={value.posts}
        onChange={(posts) => set({ posts })}
        blank={{ platform: 'instagram', title: '', caption: '', thumbnail: '', url: '', location: '' }}
        addLabel="Add social post"
        renderItem={(it, up) => (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Select label="Platform" value={it.platform} onChange={(v) => up({ ...it, platform: v })} options={['instagram', 'youtube', 'facebook']} />
              <Text label="Title" value={it.title} onChange={(v) => up({ ...it, title: v })} />
              <Text label="Caption" value={it.caption} onChange={(v) => up({ ...it, caption: v })} />
              <Text label="Location" value={it.location} onChange={(v) => up({ ...it, location: v })} />
              <Text label="Post URL (opens original)" value={it.url} onChange={(v) => up({ ...it, url: v })} />
            </div>
            <ImageInput label="Cover / thumbnail" value={it.thumbnail} onChange={(v) => up({ ...it, thumbnail: v })} />
          </div>
        )}
      />
    </div>
  );
}

function JournalEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Index" value={value.index} onChange={(v) => set({ index: v })} />
        <Text label="Title" value={value.title} onChange={(v) => set({ title: v })} />
        <Text label="CTA label" value={value.cta_label} onChange={(v) => set({ cta_label: v })} />
        <Text label="CTA link" value={value.cta_href} onChange={(v) => set({ cta_href: v })} />
      </div>
      <Area label="Body" value={value.body} onChange={(v) => set({ body: v })} />
      <ListEditor
        label="Featured stories"
        items={value.posts}
        onChange={(posts) => set({ posts })}
        blank={{ category: '', title: '', image: '', slug: '' }}
        addLabel="Add story"
        renderItem={(it, up) => (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Text label="Category" value={it.category} onChange={(v) => up({ ...it, category: v })} />
              <Text label="Title" value={it.title} onChange={(v) => up({ ...it, title: v })} />
              <Text label="Slug" value={it.slug} onChange={(v) => up({ ...it, slug: v })} />
            </div>
            <ImageInput label="Hero image" value={it.image} onChange={(v) => up({ ...it, image: v })} />
          </div>
        )}
      />
    </div>
  );
}

function FooterEditor({ value = {}, onChange }) {
  const set = patcher(value, onChange);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Text label="Statement line 1" value={value.statement_line1} onChange={(v) => set({ statement_line1: v })} />
        <Text label="Statement line 2" value={value.statement_line2} onChange={(v) => set({ statement_line2: v })} />
        <Text label="CTA label" value={value.cta_label} onChange={(v) => set({ cta_label: v })} />
        <Text label="CTA link" value={value.cta_href} onChange={(v) => set({ cta_href: v })} />
        <Text label="Copyright" value={value.copyright} onChange={(v) => set({ copyright: v })} />
      </div>
      <ImageInput label="Background image" value={value.image} onChange={(v) => set({ image: v })} />
    </div>
  );
}

/* ------------------------------ Media library ----------------------------- */
function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const load = () => api.get('/media').then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await api.post('/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await load();
    } finally { setBusy(false); }
  };
  const del = async (id) => { await api.delete(`/media/${id}`); load(); };
  return (
    <div>
      <label className="inline-flex items-center gap-2 overline px-4 py-3 border border-white/20 text-sand hover:bg-white hover:text-charcoal transition-colors cursor-pointer mb-8">
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload media
        <input type="file" accept="image/*,video/*" onChange={upload} className="hidden" />
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((m) => (
          <div key={m.id} className="group relative border border-white/10 aspect-square overflow-hidden bg-white/5">
            {m.kind === 'video' ? (
              <video src={abs(m.url)} className="h-full w-full object-cover" muted />
            ) : (
              <img src={abs(m.url)} alt={m.alt || ''} className="h-full w-full object-cover" />
            )}
            <button onClick={() => del(m.id)} className="absolute top-2 right-2 h-8 w-8 grid place-items-center bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity">
              <Trash2 size={14} />
            </button>
            <input
              readOnly
              value={abs(m.url)}
              onClick={(e) => { e.target.select(); navigator.clipboard?.writeText(abs(m.url)); }}
              className="absolute bottom-0 left-0 right-0 bg-black/60 text-white/70 text-[10px] px-2 py-1 outline-none"
            />
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-white/40 mt-6">No media yet. Upload images or videos to reuse across the site.</p>}
    </div>
  );
}

/* ------------------------------ Bookings ---------------------------------- */
function Bookings() {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get('/bookings').then((r) => setRows(r.data)).catch(() => {}); }, []);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white/40 overline">
            <th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Contact</th><th className="py-3 pr-4">Expedition</th><th className="py-3 pr-4">Dates</th><th className="py-3 pr-4">Message</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="border-t border-white/10 align-top">
              <td className="py-3 pr-4 text-sand">{b.name}</td>
              <td className="py-3 pr-4 text-white/60">{b.email}<br />{b.phone}</td>
              <td className="py-3 pr-4 text-white/60">{b.expedition}</td>
              <td className="py-3 pr-4 text-white/60">{b.preferred_dates}</td>
              <td className="py-3 pr-4 text-white/60 max-w-xs">{b.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="text-white/40 mt-6">No enquiries yet.</p>}
    </div>
  );
}

/* ------------------------------ Dashboard shell --------------------------- */
const SECTIONS = [
  { id: 'settings', label: 'Site Settings', key: 'settings', C: SettingsEditor },
  { id: 'social', label: 'Social Links', key: 'social', C: SocialEditor },
  { id: 'nav', label: 'Navigation', key: 'nav', C: NavEditor },
  { id: 'hero', label: 'Hero / Showreel', key: 'hero', C: HeroEditor },
  { id: 'about', label: 'About Us', key: 'about', C: AboutEditor },
  { id: 'what', label: 'What We Do', key: 'what_we_do', C: WhatWeDoEditor },
  { id: 'deliver', label: 'How We Deliver', key: 'how_we_deliver', C: DeliverEditor },
  { id: 'exp', label: 'Experiences', key: 'experiences', C: ExperiencesEditor },
  { id: 'why', label: 'Why 7HUES', key: 'why', C: WhyEditor },
  { id: 'people', label: 'Our People', key: 'people', C: PeopleEditor },
  { id: 'road', label: 'From The Road', key: 'from_the_road', C: FromRoadEditor },
  { id: 'journal', label: 'Journal', key: 'journal', C: JournalEditor },
  { id: 'footer', label: 'Footer', key: 'footer', C: FooterEditor },
];

function Dashboard({ user, onLogout }) {
  const [doc, setDoc] = useState(null);
  const [active, setActive] = useState('settings');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/content').then((r) => setDoc(r.data)).catch(() => {}); }, []);

  const save = async () => {
    setSaving(true);
    setStatus('');
    try {
      await api.put('/content', doc);
      setStatus('Saved to database');
      setTimeout(() => setStatus(''), 2500);
    } catch (e) {
      setStatus('Save failed');
    } finally { setSaving(false); }
  };

  const activeDef = useMemo(() => SECTIONS.find((s) => s.id === active), [active]);

  if (!doc) {
    return <div className="min-h-screen bg-charcoal grid place-items-center text-sand/60 font-display tracking-[0.4em]">LOADING…</div>;
  }

  return (
    <div className="min-h-screen bg-charcoal text-sand flex">
      <aside className="w-64 shrink-0 border-r border-white/10 h-screen sticky top-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <span className="font-display tracking-[0.3em] text-lg">7HUES CMS</span>
          <p className="text-white/40 text-xs mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              data-testid={`admin-tab-${s.id}`}
              onClick={() => setActive(s.id)}
              className={`w-full text-left px-6 py-3 overline transition-colors ${active === s.id ? 'text-gold bg-white/5' : 'text-white/50 hover:text-sand'}`}
            >
              {s.label}
            </button>
          ))}
          <div className="h-px bg-white/10 my-3 mx-6" />
          {[{ id: 'media', label: 'Media Library' }, { id: 'bookings', label: 'Bookings' }].map((s) => (
            <button
              key={s.id}
              data-testid={`admin-tab-${s.id}`}
              onClick={() => setActive(s.id)}
              className={`w-full text-left px-6 py-3 overline transition-colors ${active === s.id ? 'text-gold bg-white/5' : 'text-white/50 hover:text-sand'}`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 overline text-white/50 hover:text-sand px-2 py-2">
            <ExternalLink size={14} /> View site
          </a>
          <button onClick={onLogout} data-testid="admin-logout" className="flex items-center gap-2 overline text-white/50 hover:text-red-400 px-2 py-2 w-full">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-charcoal/90 backdrop-blur border-b border-white/10 px-8 py-5 flex items-center justify-between">
          <h1 className="font-display uppercase tracking-[0.1em] text-xl">
            {activeDef?.label || (active === 'media' ? 'Media Library' : 'Bookings')}
          </h1>
          <div className="flex items-center gap-4">
            {status && <span className="overline text-gold">{status}</span>}
            {active !== 'media' && active !== 'bookings' && (
              <button
                onClick={save}
                data-testid="admin-save"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gold text-white overline px-6 py-3 hover:bg-sand hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save changes
              </button>
            )}
          </div>
        </header>

        <div className="p-8 max-w-4xl">
          {active === 'media' ? (
            <MediaLibrary />
          ) : active === 'bookings' ? (
            <Bookings />
          ) : (
            activeDef && (
              <activeDef.C
                value={doc[activeDef.key]}
                onChange={(v) => setDoc({ ...doc, [activeDef.key]: v })}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}

/* ------------------------------ Auth gate --------------------------------- */
export default function Admin() {
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const [checking, setChecking] = useState(!location.state?.user);

  useEffect(() => {
    if (location.state?.user) return;
    api.get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, [location.state]);

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    setUser(null);
  };

  if (checking) {
    return <div className="min-h-screen bg-charcoal grid place-items-center text-sand/60 font-display tracking-[0.4em]">CHECKING…</div>;
  }
  if (!user) return <Login />;
  if (!user.is_admin) {
    return (
      <div className="min-h-screen bg-charcoal text-sand grid place-items-center text-center px-6">
        <div>
          <h1 className="headline text-4xl mb-4">NOT AUTHORISED</h1>
          <p className="text-white/50 mb-8">{user.email} does not have admin access.</p>
          <button onClick={logout} className="overline border border-white/20 px-6 py-3">Sign out</button>
        </div>
      </div>
    );
  }
  return (
    <>
      <Helmet><title>7HUES CMS</title></Helmet>
      <Dashboard user={user} onLogout={logout} />
    </>
  );
}
