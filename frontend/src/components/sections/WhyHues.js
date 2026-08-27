import React from 'react';
import Reveal from '../Reveal';

export default function WhyHues({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-why" className="py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="lg:max-w-xl">
          <Reveal>
            <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
            <h2 className="headline text-5xl md:text-7xl text-ink mb-16">{data.title}</h2>
          </Reveal>
          <div className="space-y-12">
            {(data.items || []).map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div data-testid={`why-item-${i}`}>
                  <h3 className="font-display uppercase tracking-[0.06em] text-2xl md:text-3xl text-ink mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone text-lg">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
