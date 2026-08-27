import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RoadJourney from '../components/RoadJourney';
import Footer from '../components/Footer';
import WhatWeDo from '../components/sections/WhatWeDo';
import HowWeDeliver from '../components/sections/HowWeDeliver';
import Experiences from '../components/sections/Experiences';
import WhyHues from '../components/sections/WhyHues';
import People from '../components/sections/People';
import FromTheRoad from '../components/sections/FromTheRoad';
import Journal from '../components/sections/Journal';

export default function Home({ content }) {
  if (!content) return null;
  const settings = content.settings || {};

  return (
    <div className="grain">
      <Helmet>
        <title>7HUES Expeditions — Not Just a Ride</title>
        <meta name="description" content={content?.hero?.line1 + ' ' + content?.hero?.line2 + ' ' + content?.hero?.line3} />
      </Helmet>

      <Navbar content={content} />
      <Hero content={content} />

      {/* Seamless transition from hero into the journey */}
      <div className="relative bg-sand">
        <RoadJourney motorcycle={settings.motorcycle}>
          <WhatWeDo data={content.what_we_do} />
          <HowWeDeliver data={content.how_we_deliver} />
          <WhyHues data={content.why} />
          <Experiences data={content.experiences} />
          <People data={content.people} />
          <FromTheRoad data={content.from_the_road} />
          <Journal data={content.journal} />
        </RoadJourney>
      </div>

      <Footer content={content} />
    </div>
  );
}
