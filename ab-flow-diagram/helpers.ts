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
  label: string; // 🏷️ visible text (package/component names are not translated)
  x: number; // ↔️ 0–100
  y: number; // ↕️ 0–100
  icon?: ReactNode; // 🖼️ e.g. <AbIcon name="widgets" />
  tone?: 'hub' | 'node' | 'accent'; // 🎨 hub = centre logo
}

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
