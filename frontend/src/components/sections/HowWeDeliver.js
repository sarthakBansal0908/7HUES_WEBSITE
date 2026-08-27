import React from 'react';
import { Route, Shield, BedDouble, Film } from 'lucide-react';
import Reveal from '../Reveal';

const ICONS = { route: Route, shield: Shield, bed: BedDouble, film: Film };

export default function HowWeDeliver({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-how-we-deliver" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="lg:w-1/2 lg:ml-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-gold text-sm">{data.index}</span>
              <span className="h-px w-10 bg-gold/60" />
            </div>
            <h2 className="headline text-5xl md:text-6xl text-ink mb-14">{data.title}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
            {(data.items || []).map((item, i) => {
              const Icon = ICONS[item.icon] || Route;
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="flex flex-col gap-4" data-testid={`deliver-item-${i}`}>
                    <Icon size={28} strokeWidth={1.3} className="text-gold" />
                    <h3 className="font-display uppercase tracking-[0.12em] text-lg text-ink">
                      {item.title}
                    </h3>
                    <p className="text-stone leading-relaxed">{item.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
