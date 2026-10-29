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
import { getAbFlowEdgePath, getAbFlowRoundedPath, routeAbFlowWires, type AbFlowEdge, type AbFlowFrame, type AbFlowNode, type AbFlowPoint } from './helpers';
// 📐 0.2.3: the one client island (frame scaling)
import AbFlowFrameScale from './frame-scale';
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
  edges?: readonly AbFlowEdge[] | 'auto'; // 〰️ wires between node ids; `'auto'` (default with `frame`) = v6 route() every node → the hub
  /** 🖼️ 0.2.3 (Welcome v6): a fixed design frame, e.g. `{ w: 760, h: 600, header: 56 }`. Node x/y/w/h are then frame px
   *  (John's rects 1:1) and the whole stage scales with the card width. */
  frame?: AbFlowFrame;
  /** 〰️ 0.2.3: extra wires as frame-px polylines (v6 `extras`), drawn with rounded corners. */
  wires?: readonly (readonly AbFlowPoint[])[];
  /** 🟤 0.2.3: dotted surface below the header band (theme ≥ 0.3.7 `--ab-dot-*`, v6 fallbacks). Default true. */
  dotted?: boolean;
  /** 🅰️ 0.2.3: a logo before the title (v6 header mark). */
  logo?: ReactNode;
  /** ⚓ 0.2.3: anchor dots at both ends of every frame wire (v6 `.anc`). Default true. */
  anchors?: boolean;
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

// ✂️ 0–100 (same clamp as the wires, so a node and its wire end always agree)
const pct = (v: number): number => Math.min(100, Math.max(0, v));

/** 📍 node position + proportional anchor (CSS keeps every node inside the stage, see styles.module.css) */
const nodeStyle = (n: AbFlowNode): CSSProperties =>
  ({ left: `${pct(n.x)}%`, top: `${pct(n.y)}%`, '--ab-flow-node-x': String(pct(n.x)), '--ab-flow-node-y': String(pct(n.y)) }) as CSSProperties;

/** 🎨 Live Playground scene: SVG wires + HTML nodes, CSS-only motion, one accessible image. */
export function AbFlowDiagram(props: AbFlowDiagramProps): ReactElement {
  // 🖼️ 0.2.3: pixel frame mode (Welcome v6)
  if (props.frame) return <AbFlowFrameDiagram {...props} frame={props.frame} />;
  // 🧩 props
  const { nodes, edges: edgesProp, alt, title, caption, live = false, active = true, loops = 'infinite', variant = 'full', posterAt = 0.45, duration = 2400, className, style, children } = props;
  // 🗺️ id → node
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edges = Array.isArray(edgesProp) ? edgesProp : []; // 〰️ 'auto' needs a frame
  const dotted = props.dotted ?? true; // 🟤
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
      data-ab-dotted={String(dotted)} // 🟤 0.2.3
    >
      {/* 🏷️ card header (decorative: alt already describes it) */}
      {hasHeader ? (
        <div className={styles.header} aria-hidden="true">
          {props.logo ? <span className={styles.logo}>{props.logo}</span> : null}
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
          <span key={n.id} className={styles.node} data-tone={n.tone ?? 'node'} style={nodeStyle(n)}>
            {n.icon ? <span className={styles.nodeIcon}>{n.icon}</span> : null}
            <span>{n.label}</span>
          </span>
        ))}
      </div>
      {children ? <div className={styles.overlay} aria-hidden="true">{children}</div> : null}
    </figure>
  );
}

// ⚙️ frame props (frame required)
type FrameProps = AbFlowDiagramProps & { frame: AbFlowFrame };

/** 🖼️ 0.2.3 (Welcome v6): the pixel-frame scene. A fixed w×h stage (v6 px), scaled to the card width by CSS
 *  (`100cqw / w`) and the AbFlowFrameScale island; wires auto-route node → hub like John's route(). */
function AbFlowFrameDiagram(props: FrameProps): ReactElement {
  // 🧩 props
  const { nodes, edges = 'auto', frame, wires = [], alt, title, caption, live = false, active = true, loops = 'infinite', variant = 'full', posterAt = 0.45, duration = 2400, className, style, children, dotted = true, logo, anchors = true } = props;
  const header = frame.header ?? 0; // 🏷️ header band px
  const hub = nodes.find((n) => n.tone === 'hub'); // 🎯
  const byId = new Map(nodes.map((n) => [n.id, n])); // 🗺️
  // 〰️ auto: every non-hub node → the hub (v6 route); explicit edges: route each pair; + extra polylines
  const routed: AbFlowPoint[][] = edges === 'auto'
    ? (hub ? routeAbFlowWires(nodes.filter((n) => n !== hub), hub) : [])
    : edges.flatMap((e) => { const a = byId.get(e.from); const b = byId.get(e.to); return a && b ? routeAbFlowWires([a], b) : []; }); // 🧯 unknown ids skipped
  const all = [...routed, ...wires.map((w) => [...w])]; // ➕ extras
  const radius = variant === 'compact' ? 9 : 12; // 🔄 v6: 12 laptop, 9 mobile
  const n = Math.max(1, all.length); // 🔢
  // 🎛️ tokens: frame geometry + ab-nextjs-animations wire timing (pulses spread evenly over one loop, like v6 t + i/n)
  const vars = {
    ...style,
    '--ab-flow-w': `${frame.w}px`, '--ab-flow-h': `${frame.h}px`, '--ab-flow-header': `${header}px`, // 📐
    '--ab-flow-ratio': `${frame.w} / ${frame.h}`, // 📐
    '--ab-wire-pulse-duration': `${duration}ms`, // ⏱️
    '--ab-wire-pulse-stagger': `${Math.round(duration / n)}ms`, // ⏱️ v6: phase i/n
    ...(loops === 'infinite' ? {} : { '--ab-wire-pulse-iterations': String(loops) }), // 🔁
    '--ab-wire-poster': String(100 - Math.min(1, Math.max(0, posterAt)) * 100), // 🖼️
  } as CSSProperties;
  const hasHeader = Boolean(title || live || caption || logo); // 🏷️
  return (
    <figure
      role="img" // ♿ ONE image
      aria-label={alt} // 🗣️
      className={clsx('AbFlowDiagram', styles.root, styles.framed, className)}
      style={vars}
      data-ab-part="flow-diagram"
      data-active={String(active)} // ▶️
      data-ab-paused={String(!active)} // ⏸️ ab-nextjs-animations
      data-variant={variant} // 📐
      data-ab-frame="true" // 🖼️
      data-ab-header={String(hasHeader)} // 🏷️
      data-ab-dotted={String(dotted)} // 🟤
    >
      <AbFlowFrameScale width={frame.w} />{/* 📐 the only client bit */}
      <div className={styles.stage} aria-hidden="true">
        {dotted ? <div className={styles.dots} data-ab-part="flow-dots" /> : null}{/* 🟤 below the header band */}
        {hasHeader ? (
          <div className={styles.frameHeader}>
            {logo ? <span className={styles.logo}>{logo}</span> : null}
            {title ? <span className={styles.title}>{title}</span> : null}
            {caption ? <span className={styles.pkg}>{caption}</span> : null}
            {live ? <span className={styles.frameLive}>{typeof live === 'string' ? live : null}</span> : null}
          </div>
        ) : null}
        <svg className={styles.frameWires} viewBox={`0 0 ${frame.w} ${frame.h}`} width={frame.w} height={frame.h} focusable="false">
          {all.map((pts, i) => {
            const d = getAbFlowRoundedPath(pts, radius); // 〰️ v6 rounded()
            const idx = { '--ab-wire-index': String(i) } as CSSProperties; // ⏱️
            return (
              <g key={i} style={idx}>
                <path className={clsx(styles.wireGlow, AB_WIRE_DRAW_CLASS)} d={d} pathLength={100} />{/* 🌫️ 7px halo */}
                <path className={clsx(styles.frameWire, AB_WIRE_DRAW_CLASS)} d={d} pathLength={100} />{/* 🖊️ 1.8px wire */}
                <path className={clsx(styles.dotHalo, AB_WIRE_PULSE_CLASS)} d={d} pathLength={100} />{/* ✨ pulse glow */}
                <path className={clsx(styles.dotCore, AB_WIRE_PULSE_CLASS)} d={d} pathLength={100} />{/* ⚪ pulse dot */}
              </g>
            );
          })}
        </svg>
        {nodes.filter((nd) => nd !== hub).concat(hub ? [hub] : []).map((nd) => (
          <div
            key={nd.id}
            className={styles.richNode}
            data-tone={nd.tone ?? 'node'}
            style={{ left: nd.x, top: nd.y, width: nd.w, height: nd.h }} // 📍 v6 rect, px
          >
            {nd.caption ? <span className={styles.nodeCaption}>{nd.caption}</span> : null}{/* 🏷️ v6 .lb */}
            {nd.content ?? (<>{nd.icon ? <span className={styles.nodeIcon}>{nd.icon}</span> : null}{nd.label ? <span>{nd.label}</span> : null}</>)}
          </div>
        ))}
        {anchors ? all.flatMap((pts, i) => [pts[0], pts[pts.length - 1]].map((p, j) => (
          <i key={`${i}-${j}`} className={styles.anchor} style={{ left: p[0], top: p[1] }} />
        ))) : null}{/* ⚓ v6 .anc */}
        {children ? <div className={styles.overlay}>{children}</div> : null}
      </div>
    </figure>
  );
}

// 📦 default export
export default AbFlowDiagram;
