import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage, SectionHeader } from '../Reveal';

// 07 — JOURNAL : editorial stories, the final stop before the footer
export default function Journal({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-journal" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <SectionHeader index={data.index} title={data.title} subtitle={data.body} />
          {data.cta_label && (
            <Reveal>
              <Link
                to={data.cta_href || '/journal'}
                data-testid="journal-cta"
                className="group inline-flex items-center gap-3 overline text-ink whitespace-nowrap"
              >
                {data.cta_label}
                <span className="h-9 w-9 rounded-full border border-ink/25 grid place-items-center group-hover:bg-ink group-hover:text-sand transition-colors duration-300">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </Reveal>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(data.posts || []).map((post, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Link to={`/journal/${post.slug}`} data-testid={`journal-card-${i}`} className="group block">
                <div className="overflow-hidden rounded-2xl aspect-[4/5]">
                  <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                </div>
                <span className="overline text-gold block mt-5">{post.category}</span>
                <h3 className="font-display uppercase tracking-[0.03em] text-xl md:text-2xl mt-2 leading-tight text-ink">{post.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
