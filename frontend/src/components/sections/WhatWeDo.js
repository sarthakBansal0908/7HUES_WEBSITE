import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

export default function WhatWeDo({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-what-we-do" className="pt-24 md:pt-36 pb-8">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 lg:pr-6">
          <Reveal>
            <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
            <h2 className="headline text-6xl md:text-7xl xl:text-8xl text-ink mb-8">{data.title}</h2>
            <p className="text-stone text-lg leading-relaxed max-w-sm">{data.body}</p>
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
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <MaskImage
            src={data.image}
            alt={data.title}
            className="aspect-[16/11] w-full"
            imgClass="feather"
          />
        </div>
      </div>
    </section>
  );
}
