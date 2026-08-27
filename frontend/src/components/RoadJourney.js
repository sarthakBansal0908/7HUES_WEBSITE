import React, { useRef, useEffect } from 'react';
import { prefersReducedMotion } from '../hooks/useLenis';

/*
  Winding road (SVG viewBox 0 0 100 1000, preserveAspectRatio="none") spanning the
  full journey height. The road drifts far across the page horizontally.

  The motorcycle stays near the VERTICAL CENTRE of the viewport while scrolling and
  glides horizontally, always sitting exactly on the road, banking subtly with the
  road direction. Because a point (x,y) in the viewBox maps to left=x% / top=(y/1000)%
  of the wrapper, and the bike's wrapper-top equals the viewport-centre offset, the
  bike is guaranteed to sit on the road line.
*/

const PATH_D =
  'M50,0 C26,55 10,120 34,200 C58,280 92,325 76,420 C60,515 10,560 22,655 C34,750 90,795 64,890 C50,955 50,980 50,1000';

export default function RoadJourney({ motorcycle, children }) {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const motoRef = useRef(null);
  const traceRef = useRef(null);
  const samplesRef = useRef([]);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const total = path.getTotalLength();
    const N = 300;
    const samples = [];
    for (let i = 0; i <= N; i++) {
      const p = path.getPointAtLength((i / N) * total);
      samples.push({ x: p.x, y: p.y });
    }
    samplesRef.current = samples;

    let raf = 0;
    const update = () => {
      const wrap = wrapRef.current;
      const moto = motoRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;

      // wrapper-space y that currently sits at the viewport centre
      let yc = vh / 2 - rect.top;
      yc = Math.max(0, Math.min(rect.height, yc));
      const frac = rect.height ? yc / rect.height : 0;
      const targetY = frac * 1000;

      const arr = samplesRef.current;
      let idx = 0;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].y <= targetY && arr[i + 1].y >= targetY) {
          idx = i;
          break;
        }
        if (i === arr.length - 2) idx = i;
      }
      const a = arr[idx];
      const b = arr[Math.min(arr.length - 1, idx + 1)];
      const t = b.y - a.y ? (targetY - a.y) / (b.y - a.y) : 0;
      const x = a.x + (b.x - a.x) * t;

      const dxPx = ((b.x - a.x) / 100) * rect.width;
      const dyPx = ((b.y - a.y) / 1000) * rect.height;
      let angle = (Math.atan2(dxPx, Math.max(1, dyPx)) * 180) / Math.PI;
      angle = Math.max(-26, Math.min(26, angle));

      if (moto) {
        moto.style.top = `${yc}px`;
        moto.style.left = `${x}%`;
        moto.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      }
      if (traceRef.current) {
        traceRef.current.style.strokeDashoffset = `${1 - Math.min(1, frac)}`;
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
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={PATH_D}
          fill="none"
          stroke="#a88151"
          strokeOpacity="0.14"
          strokeWidth="9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="#7a6a4f"
          strokeOpacity="0.3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1 6"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={traceRef}
          d={PATH_D}
          fill="none"
          stroke="#a88151"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {!reduced && motorcycle && (
        <div
          ref={motoRef}
          data-testid="scroll-motorcycle"
          className="absolute z-20 pointer-events-none will-change-transform"
          style={{ left: '50%', top: '0px' }}
        >
          <img
            src={motorcycle}
            alt="7HUES motorcycle travelling the route"
            className="w-6 sm:w-6 md:w-7 lg:w-8 h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
          />
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
