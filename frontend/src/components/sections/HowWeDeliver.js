import React from 'react';
import { Route, Shield, BedDouble, Film } from 'lucide-react';
import Reveal, { SectionHeader } from '../Reveal';

const ICONS = { route: Route, shield: Shield, bed: BedDouble, film: Film };

// 03 — HOW WE DELIVER? : our SOPs, in a clean uniform grid
export default function HowWeDeliver({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-how-we-deliver" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader index={data.index} title={data.title} subtitle={data.intro} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {(data.items || []).map((item, i) => {
            const Icon = ICONS[item.icon] || Route;
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="flex flex-col gap-4" data-testid={`deliver-item-${i}`}>
                  <Icon size={30} strokeWidth={1.2} className="text-gold" />
                  <h3 className="font-display uppercase tracking-[0.08em] text-lg text-ink">{item.title}</h3>
                  <p className="text-stone leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
