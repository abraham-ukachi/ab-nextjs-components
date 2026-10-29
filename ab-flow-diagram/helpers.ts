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
* @name: AbFlowDiagram - Helpers (G38)
* @file: ab-flow-diagram/helpers.ts
* @type: TypeScript (pure, server-safe)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ ReactNode for node icons
import type { ReactNode } from 'react';

// 🔵 a node (x/y in 0–100 scene units)
export interface AbFlowNode {
  id: string; // 🆔
  label?: string; // 🏷️ visible text (package/component names are not translated); optional when `content` is set
  x: number; // ↔️ 0–100, or px inside `frame` (left edge)
  y: number; // ↕️ 0–100, or px inside `frame` (top edge)
  icon?: ReactNode; // 🖼️ e.g. <AbIcon name="widgets" />
  tone?: 'hub' | 'node' | 'accent'; // 🎨 hub = centre logo
  /** 🧩 0.2.3 (Welcome v6): rich node body (any markup); replaces icon + label. */
  content?: ReactNode;
  /** 📏 0.2.3: node width / height in frame px (v6 rects map 1:1). */
  w?: number;
  h?: number;
  /** 🏷️ 0.2.3: the small mono label ABOVE the node (v6 `.lb`, e.g. "ab.config.ts"). */
  caption?: string;
}

// 🖼️ 0.2.3: a fixed design frame (John's v6 scene = 760×600 with a 56px header); scales to the card width
export interface AbFlowFrame {
  w: number; // ↔️ px
  h: number; // ↕️ px
  header?: number; // 🏷️ header band px (dots start below it)
}

// 📍 a point in frame px
export type AbFlowPoint = readonly [number, number];

// 〰️ a wire
export interface AbFlowEdge {
  from: string; // 🔵 node id
  to: string; // 🔵 node id
  curve?: number; // 🌙 -1…1 bend (0 = straight)
}

// ✂️ clamp into the scene
const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * @name getAbFlowEdgePath
 * @description 〰️ SVG path between two nodes: straight, or a quadratic curve bent sideways.
 */
export function getAbFlowEdgePath(a: Pick<AbFlowNode, 'x' | 'y'>, b: Pick<AbFlowNode, 'x' | 'y'>, curve = 0): string {
  const [x1, y1, x2, y2] = [clamp(a.x), clamp(a.y), clamp(b.x), clamp(b.y)]; // 📍
  if (!curve) return `M ${x1} ${y1} L ${x2} ${y2}`; // ➖ straight
  const mx = (x1 + x2) / 2; // 🎯 midpoint
  const my = (y1 + y2) / 2; // 🎯
  const dx = x2 - x1; // ↔️
  const dy = y2 - y1; // ↕️
  const k = Math.max(-1, Math.min(1, curve)) * 0.5; // 🌙 bend strength
  const cx = mx - dy * k; // ⤴️ perpendicular offset
  const cy = my + dx * k; // ⤵️
  return `M ${x1} ${y1} Q ${+cx.toFixed(2)} ${+cy.toFixed(2)} ${x2} ${y2}`; // 〰️
}

// 📦 a node rect in frame px (w/h default to 0 = a point)
type Rect = Pick<AbFlowNode, 'x' | 'y' | 'w' | 'h'>;
const W = (n: Rect): number => n.w ?? 0; // ↔️
const H = (n: Rect): number => n.h ?? 0; // ↕️

/**
 * @name routeAbFlowWires
 * @description 〰️ 0.2.3: John's v6 `route(nodes, hub)` (scenes.py), ported 1:1. Nodes above the hub wire down into
 * its top edge, nodes below wire up into its bottom edge (anchors spread evenly along the edge, sorted by x), side
 * nodes wire into the left / right edge. Orthogonal elbows (one horizontal run at mid-height / mid-width).
 * Every wire starts at the node and ends at the hub, so pulses travel node → hub.
 */
export function routeAbFlowWires(nodes: readonly Rect[], hub: Rect): AbFlowPoint[][] {
  const [hx, hy, hw, hh] = [hub.x, hub.y, W(hub), H(hub)]; // 🎯 hub rect
  const top: Rect[] = []; const bot: Rect[] = []; const side: Rect[] = []; // 🗂️ groups
  for (const n of nodes) {
    if (n.y + H(n) <= hy - 8) top.push(n); // ⬆️
    else if (n.y >= hy + hh + 8) bot.push(n); // ⬇️
    else side.push(n); // ↔️
  }
  const wires: AbFlowPoint[][] = []; // 〰️
  for (const [grp, isTop] of [[top, true], [bot, false]] as const) {
    const sorted = [...grp].sort((a, b) => a.x + W(a) / 2 - (b.x + W(b) / 2)); // ↔️ left → right
    sorted.forEach((n, j) => {
      const ax = hx + (hw * (j + 1)) / (sorted.length + 1); // 📍 spread along the hub edge
      const cx = n.x + W(n) / 2; // 🎯 node centre
      const s: AbFlowPoint = isTop ? [cx, n.y + H(n)] : [cx, n.y]; // 🔵 node edge
      const e: AbFlowPoint = isTop ? [ax, hy] : [ax, hy + hh]; // 🎯 hub edge
      const ym = (s[1] + e[1]) / 2; // ↕️ elbow height
      wires.push(Math.abs(s[0] - e[0]) < 2 ? [s, e] : [s, [s[0], ym], [e[0], ym], e]); // ➖ or ⤵️
    });
  }
  for (const n of side) {
    const cy = hy + hh / 2; const ny = n.y + H(n) / 2; // ↕️ centres
    const right = n.x > hx + hw; // ➡️ right of the hub?
    const s: AbFlowPoint = right ? [n.x, ny] : [n.x + W(n), ny]; // 🔵
    const e: AbFlowPoint = right ? [hx + hw, cy] : [hx, cy]; // 🎯
    const xm = (s[0] + e[0]) / 2; // ↔️ elbow
    wires.push(Math.abs(ny - cy) < 2 ? [s, e] : [s, [xm, s[1]], [xm, e[1]], e]); // ➖ or ⤵️
  }
  return wires;
}

// 🔢 one decimal, like the mock
const f1 = (v: number): string => (Math.round(v * 10) / 10).toFixed(1);

/**
 * @name getAbFlowRoundedPath
 * @description 〰️ 0.2.3: v6 `rounded(pts, r=12)`: a polyline with each corner rounded by a quadratic (radius capped
 * at half the shorter segment).
 */
export function getAbFlowRoundedPath(pts: readonly AbFlowPoint[], r = 12): string {
  if (pts.length === 0) return ''; // 🫥
  const toward = (a: AbFlowPoint, b: AbFlowPoint, rr: number): AbFlowPoint => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; const k = Math.min(rr, L / 2) / L; // 📏
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; // 📍
  };
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`; // 🖊️ start
  for (let i = 1; i < pts.length - 1; i++) {
    const p1 = toward(pts[i], pts[i - 1], r); const p2 = toward(pts[i], pts[i + 1], r); // ↩️ corner ends
    d += ` L${f1(p1[0])} ${f1(p1[1])} Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(p2[0])} ${f1(p2[1])}`; // 〰️
  }
  const last = pts[pts.length - 1]; // 🏁
  return `${d} L${f1(last[0])} ${f1(last[1])}`;
}
