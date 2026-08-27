import React, { useRef, useEffect } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { prefersReducedMotion } from '../hooks/useLenis';

/*
  The winding road is an SVG (viewBox 0 0 100 1000, preserveAspectRatio="none")
  that spans the full height of the journey wrapper. Because the viewBox width is
  100 and height 1000, a point (x,y) on the path maps directly to
  left = x%  and  top = (y/1000)*100%  of the wrapper — fully responsive.

  The motorcycle position is driven by scroll progress through the wrapper.
*/

const PATH_D =
  'M50,0 C30,70 18,150 32,238 C46,326 82,362 70,458 C58,554 16,590 26,678 C36,766 80,792 62,886 C50,946 48,976 50,1000';

export default function RoadJourney({ motorcycle, children }) {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const motoRef = useRef(null);
  const drawRef = useRef(null);
  const reduced = prefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  // draw the road as scroll progresses
  useMotionValueEvent(smooth, 'change', (p) => {
    const path = pathRef.current;
    const moto = motoRef.current;
    const wrap = wrapRef.current;
    if (!path || !moto || !wrap) return;

    const total = path.getTotalLength();
    const len = Math.max(0, Math.min(1, p)) * total;
    const pt = path.getPointAtLength(len);
    const pt2 = path.getPointAtLength(Math.min(total, len + total * 0.012));

    const rect = wrap.getBoundingClientRect();
    // convert viewBox deltas to pixel deltas for a natural banking angle
    const dxPx = ((pt2.x - pt.x) / 100) * rect.width;
    const dyPx = ((pt2.y - pt.y) / 1000) * rect.height;
    let angle = (Math.atan2(dxPx, Math.max(1, dyPx)) * 180) / Math.PI;
    angle = Math.max(-24, Math.min(24, angle));

    moto.style.left = `${pt.x}%`;
    moto.style.top = `${(pt.y / 1000) * 100}%`;
    moto.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    if (drawRef.current) {
      drawRef.current.style.strokeDashoffset = `${1 - Math.min(1, p + 0.02)}`;
    }
  });

  // initialize position on mount
  useEffect(() => {
    const path = pathRef.current;
    const moto = motoRef.current;
    if (!path || !moto) return;
    const pt = path.getPointAtLength(0);
    moto.style.left = `${pt.x}%`;
    moto.style.top = `${(pt.y / 1000) * 100}%`;
    moto.style.transform = 'translate(-50%, -50%)';
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Road layer */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* soft road band */}
        <path
          d={PATH_D}
          fill="none"
          stroke="#a88151"
          strokeOpacity="0.16"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* main road line */}
        <path
          d={PATH_D}
          fill="none"
          stroke="#5C5C5C"
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* animated drawn centerline (dashes) */}
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="#a88151"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 5"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: 0.55 }}
        />
        {/* progress trace */}
        <path
          ref={drawRef}
          d={PATH_D}
          fill="none"
          stroke="#182A40"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: 0.5 }}
        />
      </svg>

      {/* Motorcycle marker */}
      {!reduced && motorcycle && (
        <div
          ref={motoRef}
          data-testid="scroll-motorcycle"
          className="absolute z-20 pointer-events-none will-change-transform"
          style={{ left: '50%', top: '0%' }}
        >
          <img
            src={motorcycle}
            alt="7HUES motorcycle travelling the route"
            className="w-16 md:w-20 lg:w-24 h-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
          />
        </div>
      )}

      {/* Content sits above the road */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
