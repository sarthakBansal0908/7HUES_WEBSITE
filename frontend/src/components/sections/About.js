import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage, SectionHeader } from '../Reveal';

// 01 — ABOUT US : who we are + the team
export default function About({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-about" className="py-24 md:py-32">
      <div className="shell">
        <SectionHeader index={data.index} title={data.title} />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <p className="text-stone text-xl md:text-2xl leading-relaxed whitespace-pre-line">{data.body}</p>
            {data.cta_label && (
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
            )}
          </Reveal>
          <MaskImage src={data.image} alt={data.title} className="aspect-[4/3] w-full rounded-xl" />
        </div>

        {(data.team || []).length > 0 && (
          <div className="mt-20 md:mt-28">
            <p className="overline text-gold mb-10 text-center">{data.team_title || 'THE TEAM'}</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {data.team.map((m, i) => (
                <Reveal key={i} delay={i * 0.06} className="w-[calc(50%-0.75rem)] md:w-[calc(25%-1.5rem)]">
                  <div data-testid={`team-member-${i}`} className="text-center">
                    <div className="aspect-[3/4] overflow-hidden rounded-xl mb-4">
                      <img src={m.image} alt={m.name} loading="lazy" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <h4 className="font-display uppercase tracking-[0.08em] text-lg text-ink">{m.name}</h4>
                    <p className="text-stone text-sm mt-1">{m.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
