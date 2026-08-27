import React from 'react';
import { Instagram, Youtube, Play } from 'lucide-react';
import Reveal, { MaskImage } from '../Reveal';

export default function FromTheRoad({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-from-the-road" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal className="flex items-end justify-between mb-14">
          <h2 className="headline text-5xl md:text-7xl text-ink">{data.title}</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {(data.posts || []).map((post, i) => {
            const Icon = post.platform === 'youtube' ? Youtube : Instagram;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`social-post-${i}`}
                  className="group block relative overflow-hidden"
                >
                  <MaskImage
                    src={post.thumbnail}
                    alt={post.title}
                    className={`w-full ${i === 1 ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}
                    imgClass="group-hover:scale-105 transition-transform duration-[1200ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {post.platform === 'youtube' && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="h-16 w-16 rounded-full bg-white/15 backdrop-blur-md border border-white/40 grid place-items-center text-white">
                        <Play size={22} className="ml-1" />
                      </span>
                    </span>
                  )}
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-white/90">
                    <Icon size={18} />
                    {post.location && <span className="overline">{post.location}</span>}
                  </div>
                  <div className="absolute bottom-0 left-0 p-5 text-white">
                    <h3 className="font-display uppercase tracking-[0.08em] text-xl">{post.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{post.caption}</p>
                    <span className="overline text-gold mt-3 inline-block">
                      {post.platform === 'youtube' ? 'Watch the film →' : 'View post →'}
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
