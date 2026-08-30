import React from 'react';
import Reveal, { MaskImage } from '../Reveal';

// 04 — WHY 7HUES : image-heavy composition (road enters the image on the left);
// concise points sit in the negative space on the right. No cards.
export default function WhyHues({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-why" className="py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          {data.image && <MaskImage src={data.image} alt={data.title} className="aspect-[4/3] w-full" imgClass="feather" />}
        </div>
        <div className="lg:col-span-4 lg:col-start-9 order-1 lg:order-2">
          <Reveal>
            <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
            <h2 className="headline text-5xl md:text-6xl text-ink mb-12">{data.title}</h2>
          </Reveal>
          <div className="space-y-10">
            {(data.items || []).map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div data-testid={`why-item-${i}`}>
                  <h3 className="font-display uppercase tracking-[0.06em] text-2xl text-ink mb-1">{item.title}</h3>
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
