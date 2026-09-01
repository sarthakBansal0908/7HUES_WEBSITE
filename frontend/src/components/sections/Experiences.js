import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../Reveal';

// 05 — EXPERIENCES : catalogue grid (Lusion-style), 2 columns, staggered
export default function Experiences({ data }) {
  if (!data) return null;
  const items = data.items || [];
  return (
    <section data-testid="section-experiences" className="py-24 md:py-32">
      <div className="shell">
        <SectionHeader index={data.index} title={data.title} subtitle={data.intro} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14 md:gap-y-20">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className={i % 2 === 1 ? 'md:mt-20' : ''}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group" data-testid={`experience-${i}`}>
                <div className="overflow-hidden rounded-2xl aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                  />
                </div>
                {item.tags && <p className="overline text-stone mt-6">{item.tags}</p>}
                <h3 className="headline text-4xl md:text-5xl lg:text-6xl text-ink mt-3">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
