import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage, SectionHeader } from '../Reveal';

// 02 — WHAT WE DO? : what we deliver + what makes us different
export default function WhatWeDo({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-what-we-do" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader index={data.index} title={data.title} />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <MaskImage src={data.image} alt={data.title} className="aspect-[4/3] w-full rounded-xl order-2 lg:order-1" />

          <Reveal className="order-1 lg:order-2">
            <p className="text-stone text-xl leading-relaxed">{data.body}</p>

            <div className="mt-10 space-y-8">
              {(data.points || []).map((p, i) => (
                <div key={i} className="flex gap-5" data-testid={`whatwedo-point-${i}`}>
                  <span className="font-mono text-gold text-sm mt-1 shrink-0">0{i + 1}</span>
                  <div>
                    <h4 className="font-display uppercase tracking-[0.08em] text-lg text-ink">{p.title}</h4>
                    <p className="text-stone mt-1">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {data.cta_label && (
              <Link
                to={data.cta_href || '/expeditions'}
                data-testid="what-we-do-cta"
                className="group inline-flex items-center gap-3 mt-10 overline text-ink"
              >
                {data.cta_label}
                <span className="h-9 w-9 rounded-full border border-ink/25 grid place-items-center group-hover:bg-ink group-hover:text-sand transition-colors duration-300">
                  <ArrowRight size={16} />
                </span>
              </Link>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
