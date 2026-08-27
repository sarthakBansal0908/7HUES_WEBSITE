import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

export default function Journal({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-journal" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-gold text-sm">{data.index}</span>
                <span className="h-px w-10 bg-gold/60" />
              </div>
              <h2 className="headline text-5xl md:text-6xl text-ink mb-6">{data.title}</h2>
              <p className="text-stone text-lg whitespace-pre-line">{data.body}</p>
              <Link
                to={data.cta_href || '/journal'}
                data-testid="journal-cta"
                className="group inline-flex items-center gap-3 mt-8 overline text-ink"
              >
                {data.cta_label}
                <span className="h-9 w-9 rounded-full border border-ink/30 grid place-items-center group-hover:bg-ink group-hover:text-sand transition-colors duration-300">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-3 gap-6">
            {(data.posts || []).map((post, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Link
                  to={`/journal/${post.slug}`}
                  data-testid={`journal-card-${i}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <MaskImage
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full"
                      imgClass="group-hover:scale-105 transition-transform duration-[1200ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5 text-white">
                      <span className="overline text-gold">{post.category}</span>
                      <h3 className="font-display uppercase tracking-[0.05em] text-lg mt-2 leading-tight">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
