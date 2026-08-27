import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

// large, asymmetric editorial placement — no uniform grid
const LAYOUT = [
  { col: 'lg:col-span-7 lg:col-start-1', aspect: 'aspect-[16/11]', mt: '', feather: '' },
  { col: 'lg:col-span-4 lg:col-start-9', aspect: 'aspect-[3/4]', mt: 'lg:mt-32', feather: 'feather' },
  { col: 'lg:col-span-5 lg:col-start-2', aspect: 'aspect-[4/5]', mt: 'lg:mt-4', feather: 'feather' },
  { col: 'lg:col-span-6 lg:col-start-7', aspect: 'aspect-[16/12]', mt: 'lg:-mt-8', feather: '' },
  { col: 'lg:col-span-7 lg:col-start-1', aspect: 'aspect-[16/10]', mt: 'lg:mt-4', feather: '' },
  { col: 'lg:col-span-4 lg:col-start-9', aspect: 'aspect-[3/4]', mt: 'lg:-mt-24', feather: 'feather' },
];

export default function Experiences({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-experiences" className="py-24 md:py-36 bg-charcoal text-sand relative">
      <div className="grain" />
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal className="mb-16 md:mb-24 lg:w-1/2">
          <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
          <h2 className="headline text-7xl md:text-[9vw] leading-[0.85]">{data.title}</h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-10">
          {(data.items || []).map((item, i) => {
            const l = LAYOUT[i % LAYOUT.length];
            return (
              <div key={item.label} className={`col-span-12 ${l.col} ${l.mt}`}>
                <div className="group relative" data-testid={`experience-${item.label.toLowerCase()}`}>
                  <MaskImage
                    src={item.image}
                    alt={item.label}
                    className={`w-full ${l.aspect}`}
                    imgClass={`group-hover:scale-105 transition-transform duration-[1400ms] ${l.feather}`}
                  />
                  {!l.feather && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  )}
                  <div className="absolute bottom-0 left-0 p-6 flex items-end gap-3">
                    <span className="headline text-4xl md:text-5xl">{item.label}</span>
                    <ArrowUpRight className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Reveal className="mt-24">
          <Link
            to={data.cta_href || '/experiences'}
            data-testid="experiences-cta"
            className="group inline-flex items-center gap-3 overline hover:text-gold transition-colors duration-300"
          >
            {data.cta_label}
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
