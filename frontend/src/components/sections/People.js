import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

export default function People({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-people" className="py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <MaskImage src={data.image} alt={data.title} className="aspect-[16/12] w-full" imgClass="feather" />
        </div>
        <div className="lg:col-span-5 lg:pl-8 order-1 lg:order-2">
          <Reveal>
            <span className="font-mono text-gold text-sm block mb-6">{data.index}</span>
            <h2 className="headline text-6xl md:text-7xl text-ink mb-8">{data.title}</h2>
            <p className="text-stone text-2xl leading-snug whitespace-pre-line mb-10">{data.body}</p>

            <div className="flex items-center gap-3 mb-12">
              <div className="flex -space-x-3">
                {(data.avatars || []).map((a, i) => (
                  <img
                    key={i}
                    src={a}
                    alt="Rider"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-sand grayscale"
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-stone ml-2">+ many more</span>
            </div>

            {(data.testimonials || []).length > 0 && (
              <div className="space-y-8">
                {data.testimonials.map((t, i) => (
                  <div key={i} data-testid={`testimonial-${i}`}>
                    <p className="text-ink text-xl italic leading-relaxed">“{t.quote}”</p>
                    <p className="overline text-stone mt-3">
                      {t.name} — {t.location}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Link
              to={data.cta_href || '/community'}
              data-testid="people-cta"
              className="group inline-flex items-center gap-3 mt-12 overline text-ink"
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
