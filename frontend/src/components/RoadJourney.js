import React, { useRef, useEffect } from 'react';
import { prefersReducedMotion } from '../hooks/useLenis';

/*
  RoadJourney — a mountain-switchback road drawn behind the whole journey, with an
  ADV motorcycle that rides ALONG the path as you scroll.

  How it works
  - The road is an SVG path in viewBox space (0 0 100 1200), stretched over the full
    height of the content (preserveAspectRatio="none"). It weaves like a real hill
    road: diagonal traverses + hairpins, occasionally running near-horizontal so the
    bike visibly drifts off/back into the viewport (like switchbacks).
  - The bike position is driven by SCROLL PROGRESS mapped onto the path's arc length,
    so it truly follows the road (not a linear glide). Its heading is the path tangent,
    so the front wheel always points the way it's travelling.
  - A gold "trace" reveals the travelled portion of the road as you go.
*/

const VBH = 1200; // viewBox height
const PATH_D = [
  'M50,0',
  'C48,42 40,74 30,112',
  'C18,158 20,196 36,212',
  'C58,232 80,240 83,286',
  'C86,336 68,360 50,382',
  'C30,406 19,438 26,478',
  'C33,520 60,530 66,572',
  'C72,616 54,648 39,668',
  'C21,692 15,728 29,762',
  'C43,796 70,800 74,842',
  'C78,886 53,910 45,946',
  'C39,980 47,1002 50,1040',
  'C52,1092 50,1150 50,1200',
].join(' ');

export default function RoadJourney({ motorcycle, children }) {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const traceRef = useRef(null);
  const motoRef = useRef(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return undefined;

    const total = path.getTotalLength();
    let raf = 0;
    let smoothAngle = 180; // start heading downwards
    let lastP = 0;
    let dir = 1; // 1 = scrolling down (face forward/down), -1 = scrolling up (face back/up)

    const update = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight;
      const wrapTop = rect.top + scrollY;
      const wrapH = rect.height;

      // progress of the viewport centre through the section (0..1)
      const denom = Math.max(1, wrapH - vh * 0.4);
      let p = (scrollY + vh * 0.5 - wrapTop) / denom;
      p = Math.max(0, Math.min(1, p));

      // scroll direction (debounced against jitter)
      if (Math.abs(p - lastP) > 0.0004) {
        dir = p > lastP ? 1 : -1;
        lastP = p;
      }

      const pt = path.getPointAtLength(p * total);
      const ahead = path.getPointAtLength(Math.min(total, p * total + 2));

      const width = rect.width;
      const dxPx = ((ahead.x - pt.x) / 100) * width;
      const dyPx = ((ahead.y - pt.y) / VBH) * wrapH;

      // heading: bike art points UP by default, +90 makes it face along the path.
      // Flip 180 when riding UP the road so the front wheel leads the way it moves.
      let angle = (Math.atan2(dyPx, dxPx) * 180) / Math.PI + 90;
      if (dir < 0) angle += 180;
      // shortest-path angular smoothing to avoid jumps
      let diff = angle - smoothAngle;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      smoothAngle += diff * 0.25;

      const moto = motoRef.current;
      if (moto) {
        moto.style.top = `${(pt.y / VBH) * wrapH}px`;
        moto.style.left = `${pt.x}%`;
        moto.style.transform = `translate(-50%, -50%) rotate(${smoothAngle}deg)`;
      }
      if (traceRef.current) {
        traceRef.current.style.strokeDashoffset = `${1 - p}`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox={`0 0 100 ${VBH}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* asphalt band — soft and subtle */}
        <path
          d={PATH_D}
          fill="none"
          stroke="#1A1A1A"
          strokeOpacity="0.05"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* dashed centre lane marking — reads as a road, not a snake */}
        <path
          d={PATH_D}
          fill="none"
          stroke="#5C5C5C"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 9"
          vectorEffect="non-scaling-stroke"
        />
        {/* travelled trace — warm gold reveal */}
        <path
          ref={traceRef}
          d={PATH_D}
          fill="none"
          stroke="#A88151"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* hidden geometry driver (same path) */}
        <path ref={pathRef} d={PATH_D} fill="none" stroke="none" vectorEffect="non-scaling-stroke" />
      </svg>

      {!reduced && motorcycle && (
        <div
          ref={motoRef}
          data-testid="scroll-motorcycle"
          className="absolute pointer-events-none will-change-transform"
          style={{ left: '50%', top: '0px', zIndex: 5 }}
        >
          <img
            src={motorcycle}
            alt="7HUES ADV motorcycle and rider on the route"
            className="w-[40px] md:w-[52px] lg:w-[66px] h-auto drop-shadow-[0_12px_22px_rgba(0,0,0,0.28)]"
          />
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
