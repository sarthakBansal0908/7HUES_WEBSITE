import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

export default function WhatWeDo({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-what-we-do" className="py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-gold text-sm">{data.index}</span>
              <span className="h-px w-10 bg-gold/60" />
            </div>
            <h2 className="headline text-5xl md:text-6xl text-ink mb-8">{data.title}</h2>
            <p className="text-stone text-lg leading-relaxed max-w-md">{data.body}</p>
            <Link
              to={data.cta_href || '/expeditions'}
              data-testid="what-we-do-cta"
              className="group inline-flex items-center gap-3 mt-10 overline text-ink"
            >
              {data.cta_label}
              <span className="h-9 w-9 rounded-full border border-ink/30 grid place-items-center group-hover:bg-ink group-hover:text-sand transition-colors duration-300">
                <ArrowRight size={16} />
              </span>
            </Link>
          </Reveal>
        </div>
        <div className="lg:col-span-8 lg:pl-10">
          <MaskImage
            src={data.image}
            alt={data.title}
            className="aspect-[16/10] w-full"
          />
        </div>
      </div>
    </section>
  );
}
