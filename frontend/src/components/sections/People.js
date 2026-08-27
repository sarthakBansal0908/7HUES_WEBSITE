import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

export default function People({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-people" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <MaskImage src={data.image} alt={data.title} className="aspect-[16/11] w-full" />
        </div>
        <div className="lg:col-span-5 lg:pl-6 order-1 lg:order-2">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-gold text-sm">{data.index}</span>
              <span className="h-px w-10 bg-gold/60" />
            </div>
            <h2 className="headline text-5xl md:text-6xl text-ink mb-8">{data.title}</h2>
            <p className="text-stone text-xl leading-relaxed whitespace-pre-line mb-10">{data.body}</p>

            <div className="flex items-center gap-3 mb-10">
              <div className="flex -space-x-3">
                {(data.avatars || []).map((a, i) => (
                  <img
                    key={i}
                    src={a}
                    alt="Rider"
                    className="h-12 w-12 rounded-full object-cover border-2 border-sand grayscale"
                  />
                ))}
              </div>
              <span className="h-12 w-12 rounded-full border border-ink/30 grid place-items-center text-ink text-sm">
                +
              </span>
            </div>

            {(data.testimonials || []).length > 0 && (
              <div className="space-y-6 border-l border-gold/50 pl-6">
                {data.testimonials.map((t, i) => (
                  <div key={i} data-testid={`testimonial-${i}`}>
                    <p className="text-ink text-lg italic leading-relaxed">“{t.quote}”</p>
                    <p className="overline text-stone mt-2">
                      {t.name} — {t.location}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Link
              to={data.cta_href || '/community'}
              data-testid="people-cta"
              className="group inline-flex items-center gap-3 mt-10 overline text-ink"
            >
              {data.cta_label}
              <span className="h-9 w-9 rounded-full border border-ink/30 grid place-items-center group-hover:bg-ink group-hover:text-sand transition-colors duration-300">
                <ArrowRight size={16} />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
