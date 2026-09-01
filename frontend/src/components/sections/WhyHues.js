import React from 'react';
import Reveal, { MaskImage, Heading } from '../Reveal';

// 04 — WHY 7HUES? : balanced image + pitch points (no empty space)
export default function WhyHues({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-why" className="py-24 md:py-32">
      <div className="shell grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <MaskImage src={data.image} alt={data.title} className="aspect-[4/5] w-full rounded-xl order-2 lg:order-1" imgClass="feather" />

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="font-mono text-gold text-sm block mb-4">{data.index}</span>
          </Reveal>
          <Heading as="h2" className="headline text-5xl md:text-6xl lg:text-7xl text-ink mb-10">{data.title}</Heading>
          <div className="divide-y divide-ink/10 border-t border-ink/10">
            {(data.items || []).map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="py-6" data-testid={`why-item-${i}`}>
                  <h3 className="font-display uppercase tracking-[0.06em] text-xl md:text-2xl text-ink mb-1">{item.title}</h3>
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
