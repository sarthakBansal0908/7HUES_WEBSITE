import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

// asymmetric editorial layout — each item gets a bespoke placement
const LAYOUT = [
  'lg:col-span-7 lg:col-start-1 aspect-[16/11]',
  'lg:col-span-4 lg:col-start-9 lg:mt-24 aspect-[3/4]',
  'lg:col-span-5 lg:col-start-2 lg:mt-8 aspect-[4/5]',
  'lg:col-span-6 lg:col-start-7 aspect-[16/12]',
  'lg:col-span-6 lg:col-start-1 aspect-[16/10]',
  'lg:col-span-4 lg:col-start-8 lg:-mt-20 aspect-[3/4]',
];

export default function Experiences({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-experiences" className="py-24 md:py-36 bg-charcoal text-sand relative">
      <div className="grain" />
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-gold text-sm">{data.index}</span>
            <span className="h-px w-10 bg-gold/60" />
          </div>
          <h2 className="headline text-6xl md:text-8xl">{data.title}</h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {(data.items || []).map((item, i) => (
            <div key={item.label} className={`col-span-12 ${LAYOUT[i % LAYOUT.length]}`}>
              <div className="group relative h-full overflow-hidden" data-testid={`experience-${item.label.toLowerCase()}`}>
                <MaskImage
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full"
                  imgClass="group-hover:scale-105 transition-transform duration-[1200ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 flex items-end justify-between w-full">
                  <span className="headline text-3xl md:text-4xl">{item.label}</span>
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Reveal className="mt-20">
          <Link
            to={data.cta_href || '/experiences'}
            data-testid="experiences-cta"
            className="inline-flex items-center gap-3 border border-sand/40 overline px-7 py-4 hover:bg-sand hover:text-charcoal transition-colors duration-300"
          >
            {data.cta_label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
