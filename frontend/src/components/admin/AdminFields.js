import React, { useRef, useState } from 'react';
import { Upload, Trash2, ArrowUp, ArrowDown, Plus, ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export function Text({ label, value = '', onChange, placeholder = '' }) {
  return (
    <label className="block">
      {label && <span className="overline text-white/40 block mb-2">{label}</span>}
      <input
        data-testid={`field-${(label || 'text').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-sand focus:border-gold outline-none transition-colors"
      />
    </label>
  );
}

export function Area({ label, value = '', onChange, rows = 3 }) {
  return (
    <label className="block">
      {label && <span className="overline text-white/40 block mb-2">{label}</span>}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-sand focus:border-gold outline-none transition-colors resize-y"
      />
    </label>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      {label && <span className="overline text-white/40 block mb-2">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-sand focus:border-gold outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-charcoal">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, value = true, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="inline-flex items-center gap-3 shrink-0">
      <span className={`relative h-5 w-9 rounded-full transition-colors ${value ? 'bg-gold' : 'bg-white/15'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${value ? 'left-[1.125rem]' : 'left-0.5'}`} />
      </span>
      <span className="overline text-white/50">{label}</span>
    </button>
  );
}


async function uploadFile(file, alt = '') {
  const fd = new FormData();
  fd.append('file', file);
  const res = await api.post(`/media/upload?alt=${encodeURIComponent(alt)}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // res.data.url is like "/api/files/<path>"
  return `${BACKEND}${res.data.url}`;
}

export function ImageInput({ label, value = '', onChange }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      alert('Upload failed. Make sure you are signed in.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      {label && <span className="overline text-white/40 block mb-2">{label}</span>}
      <div className="flex gap-4 items-start">
        <div className="h-24 w-24 shrink-0 bg-white/5 border border-white/10 overflow-hidden grid place-items-center">
          {value ? (
            <img src={value} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={22} className="text-white/25" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL or upload"
            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sand text-sm focus:border-gold outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 overline px-4 py-2 border border-white/20 text-sand hover:bg-white hover:text-charcoal transition-colors disabled:opacity-50"
            >
              <Upload size={14} /> {busy ? 'Uploading…' : 'Upload / Replace'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-2 overline px-4 py-2 text-white/50 hover:text-red-400">
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>
          <input ref={ref} type="file" accept="image/*" onChange={onFile} className="hidden" />
        </div>
      </div>
    </div>
  );
}

export function VideoInput({ label, value = '', onChange }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadFile(file));
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      {label && <span className="overline text-white/40 block mb-2">{label}</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste hosted/streaming video URL (recommended) or upload"
        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sand text-sm focus:border-gold outline-none mb-2"
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 overline px-4 py-2 border border-white/20 text-sand hover:bg-white hover:text-charcoal transition-colors disabled:opacity-50"
      >
        <Upload size={14} /> {busy ? 'Uploading…' : 'Upload video'}
      </button>
      <input ref={ref} type="file" accept="video/*" onChange={onFile} className="hidden" />
      <p className="text-white/30 text-xs mt-2">
        For large showreels, host on YouTube/Vimeo/CDN and paste the URL to keep the site fast.
      </p>
    </div>
  );
}

export function ListEditor({ label, items = [], onChange, blank, renderItem, addLabel = 'Add item' }) {
  const setAt = (i, v) => {
    const n = [...items];
    n[i] = v;
    onChange(n);
  };
  const add = () => onChange([...(items || []), JSON.parse(JSON.stringify(blank))]);
  const del = (i) => onChange(items.filter((_, x) => x !== i));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div>
      {label && <span className="overline text-gold block mb-4">{label}</span>}
      <div className="space-y-5">
        {(items || []).map((item, i) => (
          <div key={i} className="border border-white/10 p-5 relative">
            <div className="absolute top-3 right-3 flex gap-1">
              <button onClick={() => move(i, -1)} className="p-1.5 text-white/40 hover:text-sand"><ArrowUp size={14} /></button>
              <button onClick={() => move(i, 1)} className="p-1.5 text-white/40 hover:text-sand"><ArrowDown size={14} /></button>
              <button onClick={() => del(i)} className="p-1.5 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
            <div className="space-y-4 pr-16">{renderItem(item, (v) => setAt(i, v), i)}</div>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="mt-5 inline-flex items-center gap-2 overline px-4 py-3 border border-dashed border-white/25 text-sand hover:border-gold hover:text-gold transition-colors"
      >
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  );
}
