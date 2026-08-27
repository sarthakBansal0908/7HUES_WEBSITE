import React from 'react';
import { Route, Shield, BedDouble, Film } from 'lucide-react';
import Reveal from '../Reveal';

const ICONS = { route: Route, shield: Shield, bed: BedDouble, film: Film };

export default function HowWeDeliver({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-how-we-deliver" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="lg:w-[46%] lg:ml-auto">
          <Reveal>
            <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
            <h2 className="headline text-5xl md:text-7xl text-ink mb-16">{data.title}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-14">
            {(data.items || []).map((item, i) => {
              const Icon = ICONS[item.icon] || Route;
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="flex flex-col gap-4" data-testid={`deliver-item-${i}`}>
                    <Icon size={30} strokeWidth={1.2} className="text-gold" />
                    <h3 className="font-display uppercase tracking-[0.1em] text-xl text-ink">
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
