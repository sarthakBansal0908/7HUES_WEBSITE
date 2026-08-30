import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import About from '../components/sections/About';
import WhatWeDo from '../components/sections/WhatWeDo';
import HowWeDeliver from '../components/sections/HowWeDeliver';
import WhyHues from '../components/sections/WhyHues';
import Experiences from '../components/sections/Experiences';
import FromTheRoad from '../components/sections/FromTheRoad';
import Journal from '../components/sections/Journal';

export default function Home({ content }) {
  if (!content) return null;

  return (
    <div className="grain">
      <Helmet>
        <title>7HUES Expeditions — Not Just a Ride</title>
        <meta name="description" content={[content?.hero?.line1, content?.hero?.line2, content?.hero?.line3].filter(Boolean).join(' ')} />
      </Helmet>

      <Navbar content={content} />
      <Hero content={content} />

      {/* One continuous warm canvas with uniform vertical rhythm */}
      <main className="bg-sand">
        <About data={content.about} />
        <WhatWeDo data={content.what_we_do} />
        <HowWeDeliver data={content.how_we_deliver} />
        <WhyHues data={content.why} />
        <Experiences data={content.experiences} />
        <FromTheRoad data={content.from_the_road} />
        <Journal data={content.journal} />
      </main>

      <Footer content={content} />
    </div>
  );
}
