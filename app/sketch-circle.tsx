"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

const VIEW_HEIGHT = 60;
const DEFAULT_VIEW_WIDTH = 200;

/** Deterministic PRNG, so the server and the client draw the very same loop. */
function makeRandom(seed: number) {
  let state = seed * 2654435761 % 4294967296;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

type LoopOptions = { width: number; seed: number; laps: number; start: number; tilt: number; wobble: number };

/**
 * A lasso drawn round the text: a little over one lap of an ellipse, with every
 * sample nudged off the true curve and the second lap drifting outward, so the
 * stroke reads as a hand rather than as a perfect oval. Sampling the ellipse at
 * the element's own aspect ratio (rather than stretching one fixed path) is what
 * keeps the end caps round no matter how long the name inside is.
 */
function loopPath({ width, seed, laps, start, tilt, wobble }: LoopOptions) {
  const random = makeRandom(seed);
  const cx = width / 2;
  const cy = VIEW_HEIGHT / 2;
  const rx = cx - wobble * 2;
  const ry = cy - wobble * 2.5;
  const sweep = laps * 2 * Math.PI;
  const steps = Math.max(22, Math.round(sweep / (Math.PI / 11)));
  const points: Array<[number, number]> = [];

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const angle = start + sweep * progress;
    const drift = 1 + .045 * progress;
    const x = Math.cos(angle) * rx * drift + (random() - .5) * wobble;
    const y = Math.sin(angle) * ry * drift + (random() - .5) * wobble;

    points.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]);
  }

  // Catmull-Rom through the samples, emitted as cubics.
  let d = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(index - 1, 0)];
    const current = points[index];
    const next = points[index + 1];
    const after = points[Math.min(index + 2, points.length - 1)];
    const c1 = [current[0] + (next[0] - previous[0]) / 6, current[1] + (next[1] - previous[1]) / 6];
    const c2 = [next[0] - (after[0] - current[0]) / 6, next[1] - (after[1] - current[1]) / 6];

    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${next[0].toFixed(2)},${next[1].toFixed(2)}`;
  }

  return d;
}

const passes = [
  { seed: 11, laps: 1.13, start: -.42 * Math.PI, tilt: -.035, wobble: 1.35, weight: 1.7, opacity: 1, delay: "0s" },
  { seed: 29, laps: 1.04, start: -.34 * Math.PI, tilt: -.05, wobble: 1.7, weight: 1, opacity: .45, delay: ".16s" },
];

export function SketchCircle({ children }: { children: ReactNode }) {
  const id = useId();
  const ring = useRef<SVGSVGElement>(null);
  const [viewWidth, setViewWidth] = useState(DEFAULT_VIEW_WIDTH);
  // The loop draws itself once on load and then stays put; every later pass of the
  // cursor replays it. Bumping the counter re-keys the paths, which is what restarts
  // the CSS animation — and CSS :hover alone would rub the loop out again the moment
  // the cursor left.
  const [draws, setDraws] = useState(0);

  // Match the viewBox to the ring's rendered box so `preserveAspectRatio="none"`
  // has nothing left to distort; re-measure as the text reflows or the font lands.
  useEffect(() => {
    const element = ring.current;
    if (!element) return;

    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!height) return;

      setViewWidth(Math.round(Math.min(Math.max((width / height) * VIEW_HEIGHT, 120), 1400)));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDraws((count) => count || 1), 650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <span className={`sketchCircle${draws > 0 ? " isDrawn" : ""}`} onPointerEnter={() => setDraws((count) => count + 1)}>
      {children}
      <svg className="sketchCircleRing" ref={ring} viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`} preserveAspectRatio="none" fill="none" aria-hidden="true">
        {passes.map((pass) => (
          <filter key={pass.seed} id={`${id}-${pass.seed}`} x="-12%" y="-30%" width="124%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves={2} seed={pass.seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
        {passes.map((pass) => (
          <path
            key={`${pass.seed}-${draws}`}
            d={loopPath({ width: viewWidth, ...pass })}
            pathLength={1}
            stroke="currentColor"
            strokeLinecap="round"
            opacity={pass.opacity}
            filter={`url(#${id}-${pass.seed})`}
            vectorEffect="non-scaling-stroke"
            style={{ "--pass-weight": pass.weight, animationDelay: pass.delay } as CSSProperties}
          />
        ))}
      </svg>
    </span>
  );
}
