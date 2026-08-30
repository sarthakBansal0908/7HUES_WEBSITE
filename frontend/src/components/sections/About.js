import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

// 01 — ABOUT US : road bends left past a large photograph (left); concise story on the right
export default function About({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-about" className="pt-24 md:pt-36 pb-10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <MaskImage src={data.image} alt={data.title} className="aspect-[4/5] w-full" imgClass="feather" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2">
          <Reveal>
            <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
            <h2 className="headline text-6xl md:text-7xl xl:text-8xl text-ink mb-8">{data.title}</h2>
            <p className="text-stone text-xl md:text-2xl leading-snug max-w-md whitespace-pre-line">{data.body}</p>
            <Link
              to={data.cta_href || '/book'}
              data-testid="about-cta"
              className="group inline-flex items-center gap-3 mt-10 overline text-ink"
            >
              {data.cta_label}
              <span className="h-9 w-9 rounded-full border border-ink/25 grid place-items-center group-hover:bg-ink group-hover:text-sand transition-colors duration-300">
                <ArrowRight size={16} />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
