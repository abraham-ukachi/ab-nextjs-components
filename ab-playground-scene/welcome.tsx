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
* @name: AbPlaygroundScene welcome + all
* @file: ab-playground-scene/welcome.tsx
* @type: Module
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ types
import type { ReactElement, ReactNode } from 'react';
// 〰️ flow types
import type { AbFlowNode, AbFlowPoint } from '../ab-flow-diagram/helpers';
// 🖼️ line icons (+ the 0.2.3 package marks)
import { Ms } from './icons';
// 🌍 labels
import type { AbPlaygroundSceneLabels } from './labels';
// 🎨 shared mock classes (.m, .br, .b1, .tog, .t13…)
import s from './styles.module.css';

// 🥉 John's bronze
const BRONZE = '#A67C52';
// 🎨 v6 palette (theme swatches)
const PALETTE = ['#6B4F35', '#A67C52', '#D9BE9C', '#FFF8F5', '#19120C'];
// 🔵 a node in frame px (same shape as scenes.tsx N())
type Mk = (x: number, y: number, w: number, h: number, content: ReactNode, caption?: string, hub?: boolean) => AbFlowNode;
/** 🧱 what a builder returns (extra wires, optional explicit edges / no anchors for the mobile chip ring) */
export interface AbPgWelcomeData { nodes: AbFlowNode[]; wires?: AbFlowPoint[][]; edges?: []; anchors?: boolean }

/** 📦 v6 `pnode(name, icon, preview)`: bronze mark + name, then a small live preview */
function Pnode({ name, icon, children }: { name: string; icon: string; children: ReactNode }): ReactElement {
  return (
    <div className={s.pnode}>
      <span className={s.t13} style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Ms n={icon} sz={16} col={BRONZE} />{name}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 34 }}>{children}</div>
    </div>
  );
}
/** 📈 v6 `mini_curve()` (static: the Welcome scene has no extra motion, spec §5 #0) */
const MiniCurve = (): ReactElement => (
  <svg width="120" height="34" viewBox="0 0 120 34" aria-hidden="true"><path d="M2 32 C 50 32, 60 2, 118 2" fill="none" stroke={BRONZE} strokeWidth="2.2" /><circle cx="62" cy="17" r="4" fill={BRONZE} /></svg>
);

/** 🖥️ v6 `welcome_nodes` (s01, 760×600): hub = the Ab mark + ab-elements, 7 package nodes, 3 extra links = 10 wires */
export function buildWelcomeFull(N: Mk, L: AbPlaygroundSceneLabels, logo: ReactNode): AbPgWelcomeData {
  const sw = <div style={{ display: 'flex', gap: 5 }}>{PALETTE.map((c) => <i key={c} className={s.swSm} style={{ background: c }} />)}</div>; // 🎨
  return {
    nodes: [
      N(24, 84, 200, 100, <Pnode name={L.pkgTheme} icon="pkgTheme">{sw}</Pnode>),
      N(280, 84, 200, 100, <Pnode name={L.pkgComponents} icon="pkgComponents"><span className={s.b1} style={{ width: 72, height: 28, fontSize: 12 }}>{L.button}</span><span className={s.tog} style={{ transform: 'scale(.85)' }} /></Pnode>),
      N(536, 84, 200, 100, <Pnode name={L.pkgIcons} icon="pkgIcons">{['home', 'search', 'heart', 'bolt', 'user'].map((n) => <Ms key={n} n={n} sz={20} />)}</Pnode>),
      N(24, 264, 180, 118, <Pnode name={L.pkgFonts} icon="pkgFonts"><span style={{ fontSize: 30, fontWeight: 650, letterSpacing: '-.03em' }}>Aa</span><span className={s.m} style={{ fontSize: 18 }}>Aa</span></Pnode>),
      N(556, 264, 180, 118, <Pnode name={L.pkgHooks} icon="pkgHooks"><span className={s.m}><span className={s.br}>useAb</span>Media()</span></Pnode>), // 🪝 real export
      N(120, 452, 210, 104, <Pnode name={L.pkgAnimations} icon="pkgAnimations"><MiniCurve /></Pnode>),
      N(430, 452, 210, 104, <Pnode name={L.pkgCore} icon="pkgCore"><span className={s.m}>&lt;<span className={s.br}>AbPageProvider</span>&gt;</span></Pnode>), // 🧱 real export
      N(300, 262, 160, 122, <div className={s.col}><span className={s.logo} style={{ height: 52 }}>{logo}</span><span className={`${s.m} ${s.mut}`} style={{ fontSize: 11 }}>ab‑elements</span></div>, '', true), // 🅰️ hub
    ],
    wires: [[[224, 134], [280, 134]], [[536, 134], [480, 134]], [[646, 382], [646, 504], [640, 504]]], // ➕ v6 extras
  };
}

/** 📱 v6 `mscene_nodes(0)` (350×276): the Ab mark ringed by 7 package chips, straight spokes, no anchors */
export function buildWelcomeCompact(N: Mk, L: AbPlaygroundSceneLabels, logo: ReactNode): AbPgWelcomeData {
  const names: [string, string][] = [[L.pkgCore, 'pkgCore'], [L.pkgComponents, 'pkgComponents'], [L.pkgTheme, 'pkgTheme'], [L.pkgIcons, 'pkgIcons'], [L.pkgFonts, 'pkgFonts'], [L.pkgAnimations, 'pkgAnimations'], [L.pkgHooks, 'pkgHooks']];
  const nodes = names.map(([nm, ico], i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; const w = Math.round(nm.length * 7 + 38); // 📐 v6 ring (rx 104, ry 80)
    return N(Math.round(175 + 104 * Math.cos(a) - w / 2), Math.round(160 + 80 * Math.sin(a) - 15), w, 30, <span className={s.mchip}><Ms n={ico} sz={13} col={BRONZE} />{nm}</span>);
  });
  const wires = nodes.map((n): AbFlowPoint[] => [[n.x + n.w / 2, n.y + n.h / 2], [175, 156]]); // 〰️ spokes to the hub
  return { nodes: [...nodes, N(141, 126, 68, 68, <span className={s.logo} style={{ height: 34 }}>{logo}</span>, '', true)], wires, edges: [], anchors: false };
}

/** 🖥️ v6 scene 8 (s09, 760×600): AbElements hub, all 7 packages */
export function buildAllFull(N: Mk, L: AbPlaygroundSceneLabels, logo: ReactNode): AbPgWelcomeData {
  const pk: [string, string, number, number][] = [[L.pkgCore, 'pkgCore', 40, 104], [L.pkgComponents, 'pkgComponents', 290, 104], [L.pkgTheme, 'pkgTheme', 540, 104], [L.pkgIcons, 'pkgIcons', 40, 470], [L.pkgFonts, 'pkgFonts', 290, 470], [L.pkgAnimations, 'pkgAnimations', 540, 470]];
  const row = (nm: string, ico: string): ReactElement => <><Ms n={ico} sz={20} col={BRONZE} /><span className={s.t13}>{nm}</span></>;
  return { nodes: [
    ...pk.map(([nm, ico, x, y]) => N(x, y, 180, 62, row(nm, ico))),
    N(560, 292, 160, 62, row(L.pkgHooks, 'pkgHooks')),
    N(300, 262, 160, 124, <span className={s.logo} style={{ height: 64 }}>{logo}</span>, L.abElements, true), // 🅰️ hub
  ] };
}

/** 📱 v6 mobile final (s09, 350×276): hub + 7 packages · MIT · free · Live docs · One PWA */
export function buildAllCompact(N: Mk, L: AbPlaygroundSceneLabels, logo: ReactNode): AbPgWelcomeData {
  const t = (x: string): ReactElement => <span className={s.t13}>{x}</span>;
  return { nodes: [
    N(14, 58, 140, 48, t(L.sevenPackages)), N(196, 58, 140, 48, t(L.mitFree)), N(14, 214, 140, 48, t(L.liveDocs)), N(196, 214, 140, 48, t(L.onePwa)),
    N(135, 124, 80, 72, <span className={s.logo} style={{ height: 36 }}>{logo}</span>, '', true), // 🅰️ hub
  ] };
}
