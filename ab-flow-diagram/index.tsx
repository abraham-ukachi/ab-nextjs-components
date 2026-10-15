/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-components
* @name: AbFlowDiagram - Server (G38, Welcome illustrations)
* @file: ab-flow-diagram/index.tsx
* @type: Server component — animated node/wire scene, zero JS
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbFlowDiagram title="Live Playground" caption="ab-nextjs-core" alt={t('s02.illustrationAlt')} active={index === 1}
*    -|>   nodes={[{ id: 'hub', label: 'AbProvider', x: 50, y: 50, tone: 'hub' }, { id: 'cfg', label: 'config', x: 20, y: 25 }]} edges={[{ from: 'cfg', to: 'hub' }]} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ types
import type { CSSProperties, ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🧮 pure geometry
import { getAbFlowEdgePath, type AbFlowEdge, type AbFlowNode } from './helpers';
// 🎨 styles (all motion is CSS: draw-on, pulses, reduced motion, pause)
import styles from './styles.module.css';
// 🎬 wire draw-on + pulse come from ab-nextjs-animations (>= 0.2.4); this component only sets its tokens
import { AB_WIRE_DRAW_CLASS, AB_WIRE_PULSE_CLASS } from 'ab-nextjs-animations/wire';
import 'ab-nextjs-animations/wire/styles.css'; // 〰️ .ab-wire-draw / .ab-wire-pulse

// 📦 re-export helpers + types
export * from './helpers';

// ⚙️ props
export interface AbFlowDiagramProps {
  nodes: readonly AbFlowNode[]; // 🔵 nodes in 0–100 coordinates
  edges: readonly AbFlowEdge[]; // 〰️ wires between node ids
  alt: string; // ♿ one-sentence description (Welcome.sNN.illustrationAlt)
  title?: string; // 🏷️ card title, e.g. "Live Playground" (visual)
  caption?: string; // 🏷️ PKG label, e.g. "ab-nextjs-core" (visual, mono)
  live?: boolean | string; // 🟢 sage "live" dot; a string sets its visible text
  active?: boolean; // ▶️ animate only while its slide is active (default true)
  loops?: number | 'infinite'; // 🔁 pulse loops (default infinite; mobile CSS caps at 3)
  variant?: 'full' | 'compact'; // 📐 compact = mobile 276px scene
  posterAt?: number; // 🖼️ 0–1, frozen pulse position for reduced motion (mock MID = 0.45)
  duration?: number; // ⏱️ pulse loop ms (default 2400)
  className?: string; // 🏷️
  style?: CSSProperties; // 🎨
  children?: ReactNode; // 🧩 optional extra overlay (decorative)
}

/** 🎨 Live Playground scene: SVG wires + HTML nodes, CSS-only motion, one accessible image. */
export function AbFlowDiagram(props: AbFlowDiagramProps): ReactElement {
  // 🧩 props
  const { nodes, edges, alt, title, caption, live = false, active = true, loops = 'infinite', variant = 'full', posterAt = 0.45, duration = 2400, className, style, children } = props;
  // 🗺️ id → node
  const byId = new Map(nodes.map((n) => [n.id, n]));
  // 🎛️ ab-nextjs-animations wire tokens drive all timing
  const vars = {
    ...style, // 🎨
    '--ab-wire-pulse-duration': `${duration}ms`, // ⏱️
    // 🔁 explicit loops win; default = infinite on laptop, 3 on phones (set in styles.module.css)
    ...(loops === 'infinite' ? {} : { '--ab-wire-pulse-iterations': String(loops) }),
    '--ab-wire-poster': String(100 - Math.min(1, Math.max(0, posterAt)) * 100), // 🖼️ dashoffset at the poster frame
  } as CSSProperties;

  // 🏷️ is there a header row? (drives the header-safe stage inset in CSS)
  const hasHeader = Boolean(title || live || caption);

  return (
    <figure
      role="img" // ♿ the whole scene is ONE image
      aria-label={alt} // 🗣️
      className={clsx('AbFlowDiagram', styles.root, className)} // 🏷️
      style={vars} // 🎛️
      data-ab-part="flow-diagram" // 🗂️
      data-active={String(active)} // ▶️ / ⏸️
      data-ab-paused={String(!active)} // ⏸️ ab-nextjs-animations pauses wires on inactive slides
      data-variant={variant} // 📐
      data-ab-header={String(hasHeader)} // 🏷️ header-safe stage: nodes + wires start below the header
    >
      {/* 🏷️ card header (decorative: alt already describes it) */}
      {hasHeader ? (
        <div className={styles.header} aria-hidden="true">
          {title ? <span className={styles.title}>{title}</span> : null}
          {live ? <span className={styles.live}><span className={styles.liveDot} />{typeof live === 'string' ? live : null}</span> : null}
          {caption ? <span className={styles.caption}>{caption}</span> : null}
        </div>
      ) : null}
      {/* 〰️ wires layer */}
      <svg className={styles.wires} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {edges.map((e, i) => {
          const a = byId.get(e.from); // 🔵
          const b = byId.get(e.to); // 🔵
          if (!a || !b) return null; // 🧯 unknown id: skip, don't crash the slide
          const d = getAbFlowEdgePath(a, b, e.curve); // 〰️
          const delay = { '--ab-wire-index': String(i) } as CSSProperties; // ⏱️ stagger (ab-nextjs-animations)
          return (
            <g key={`${e.from}-${e.to}-${i}`} style={delay}>
              <path className={clsx(styles.wire, AB_WIRE_DRAW_CLASS)} d={d} pathLength={100} />{/* 🖊️ draws on */}
              <path className={clsx(styles.pulse, AB_WIRE_PULSE_CLASS)} d={d} pathLength={100} />{/* ✨ travelling pulse */}
            </g>
          );
        })}
      </svg>
      {/* 🔵 nodes layer (HTML: crisp text, real fonts) */}
      <div className={styles.nodes} aria-hidden="true">
        {nodes.map((n) => (
          <span key={n.id} className={styles.node} data-tone={n.tone ?? 'node'} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            {n.icon ? <span className={styles.nodeIcon}>{n.icon}</span> : null}
            <span>{n.label}</span>
          </span>
        ))}
      </div>
      {children ? <div className={styles.overlay} aria-hidden="true">{children}</div> : null}
    </figure>
  );
}

// 📦 default export
export default AbFlowDiagram;
