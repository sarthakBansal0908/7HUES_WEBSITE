import React from 'react';
import { Route, Shield, BedDouble, Film } from 'lucide-react';
import Reveal from '../Reveal';

const ICONS = { route: Route, shield: Shield, bed: BedDouble, film: Film };

// 03 — HOW WE DELIVER : the road runs through the middle; the four attributes
// sit in the negative space to the left and right of it.
export default function HowWeDeliver({ data }) {
  if (!data) return null;
  const items = data.items || [];
  const left = items.slice(0, 2);
  const right = items.slice(2, 4);

  const Item = ({ item, i }) => {
    const Icon = ICONS[item.icon] || Route;
    return (
      <Reveal delay={i * 0.08}>
        <div className="flex flex-col gap-3" data-testid={`deliver-item-${i}`}>
          <Icon size={30} strokeWidth={1.2} className="text-gold" />
          <h3 className="font-display uppercase tracking-[0.1em] text-xl text-ink">{item.title}</h3>
          <p className="text-stone leading-relaxed max-w-[15rem]">{item.body}</p>
        </div>
      </Reveal>
    );
  };

  return (
    <section data-testid="section-how-we-deliver" className="py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal className="mb-16 md:mb-24 text-center">
          <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
          <h2 className="headline text-5xl md:text-7xl text-ink">{data.title}</h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-y-16">
          <div className="lg:col-span-4 lg:col-start-1 flex flex-col gap-16">
            {left.map((item, i) => <Item key={item.title} item={item} i={i} />)}
          </div>
          {/* centre column left open for the road */}
          <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-16 lg:text-right lg:items-end">
            {right.map((item, i) => (
              <div key={item.title} className="lg:flex lg:flex-col lg:items-end">
                <Item item={item} i={i + 2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
