import React from 'react';
import { Instagram, Youtube, Play } from 'lucide-react';
import Reveal, { MaskImage, SectionHeader } from '../Reveal';

// 06 — FROM THE ROAD : curated links to posted content
export default function FromTheRoad({ data }) {
  if (!data) return null;
  return (
    <section data-testid="section-from-the-road" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader index={data.index} title={data.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(data.posts || []).map((post, i) => {
            const Icon = post.platform === 'youtube' ? Youtube : Instagram;
            return (
              <Reveal key={i} delay={i * 0.08}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`social-post-${i}`}
                  className="group block relative overflow-hidden rounded-2xl aspect-[4/5]"
                >
                  <MaskImage
                    src={post.thumbnail}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full"
                    imgClass="group-hover:scale-105 transition-transform duration-[1200ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
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
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="font-display uppercase tracking-[0.06em] text-xl">{post.title}</h3>
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
