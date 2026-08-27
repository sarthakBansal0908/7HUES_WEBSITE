import React from 'react';
import Reveal from '../Reveal';

export default function WhyHues({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-why" className="py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="lg:max-w-lg">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-gold text-sm">{data.index}</span>
              <span className="h-px w-10 bg-gold/60" />
            </div>
            <h2 className="headline text-5xl md:text-6xl text-ink mb-16">{data.title}</h2>
          </Reveal>
          <div className="space-y-10">
            {(data.items || []).map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="border-t border-ink/15 pt-6" data-testid={`why-item-${i}`}>
                  <h3 className="font-display uppercase tracking-[0.1em] text-xl md:text-2xl text-ink mb-2">
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
