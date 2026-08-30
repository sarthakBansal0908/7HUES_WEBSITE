import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

/*
  05 — EXPERIENCE : the most immersive stop. Not five equal cards.
  A large lead image + two supporting frames, with the five themes set as
  editorial labels in the negative space around the photography. Warm bg.
*/
export default function Experiences({ data }) {
  if (!data) return null;
  const items = data.items || [];
  const themes = items.map((i) => i.label);

  return (
    <section data-testid="section-experiences" className="py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal className="mb-16 md:mb-24 lg:w-2/3 lg:ml-auto lg:text-right">
          <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
          <h2 className="headline text-7xl md:text-[8vw] leading-[0.85] text-ink">{data.title}</h2>
          {data.intro && <p className="text-stone text-xl mt-8 max-w-lg lg:ml-auto">{data.intro}</p>}
        </Reveal>

        {/* Lead composition — THE RIDE */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-10 md:mb-20">
          <div className="lg:col-span-8">
            {items[0] && (
              <MaskImage src={items[0].image} alt={items[0].label} className="aspect-[16/10] w-full" />
            )}
          </div>
          <div className="lg:col-span-3 lg:col-start-10 pb-6">
            {themes.slice(0, 1).map((t) => (
              <h3 key={t} className="headline text-4xl md:text-5xl text-ink leading-none">{t}</h3>
            ))}
            <p className="text-stone mt-4 max-w-xs">Every kilometre earned. The road is the reason.</p>
          </div>
        </div>

        {/* Two supporting frames with themes woven into the space */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 lg:pt-16">
            <div className="space-y-6">
              {themes.slice(1, 3).map((t) => (
                <h3 key={t} className="headline text-3xl md:text-4xl text-ink border-b border-ink/10 pb-4">{t}</h3>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            {items[1] && <MaskImage src={items[1].image} alt={items[1].label} className="aspect-[3/4] w-full" imgClass="feather" />}
          </div>
          <div className="lg:col-span-4 lg:pt-24">
            {items[2] && <MaskImage src={items[2].image} alt={items[2].label} className="aspect-[4/5] w-full" />}
            <div className="mt-6 space-y-4">
              {themes.slice(3).map((t) => (
                <h3 key={t} className="headline text-3xl md:text-4xl text-ink">{t}</h3>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-20">
          <Link
            to={data.cta_href || '/experiences'}
            data-testid="experiences-cta"
            className="group inline-flex items-center gap-3 overline text-ink hover:text-gold transition-colors duration-300"
          >
            {data.cta_label}
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
