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
* @name: AbPlaygroundScene upgraded scenes
* @file: ab-playground-scene/upgraded.tsx
* @type: Module
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🎨 0.2.3 (God 03:02, John's Welcome v6 "upgraded" designs): the 7 package scenes, 1:1 with
//    ai-mocks/welcome-v6/upgraded/_src/build_upgraded.py + playground-spec.md rev 2 (real export names as captions,
//    4 states × 0.6s = one 2.4s loop, reduced-motion still = state 0). ALL motion = ab-nextjs-animations' state cycle.

// ⚛️ types
import type { CSSProperties, ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 〰️ flow types
import type { AbFlowNode } from '../ab-flow-diagram/helpers';
// 🎬 the 4-state cycle ships from ab-nextjs-animations ≥ 0.2.5 (keyframes, still frame, ♿, pause)
import { AB_STATE_CYCLE_CLASSES as C } from 'ab-nextjs-animations/state-cycle';
import 'ab-nextjs-animations/state-cycle/styles.css'; // 🔁 .ab-state-cycle-*
// 🔣 the REAL ab-nextjs-icons outlined SVGs (one module per icon, tree-shaken)
import home from 'ab-nextjs-icons/ab-icons/icons/home';
import search from 'ab-nextjs-icons/ab-icons/icons/search';
import favorite from 'ab-nextjs-icons/ab-icons/icons/favorite';
import bolt from 'ab-nextjs-icons/ab-icons/icons/bolt';
import person from 'ab-nextjs-icons/ab-icons/icons/person';
import settings from 'ab-nextjs-icons/ab-icons/icons/settings';
import language from 'ab-nextjs-icons/ab-icons/icons/language';
import palette from 'ab-nextjs-icons/ab-icons/icons/palette';
import code from 'ab-nextjs-icons/ab-icons/icons/code';
import star from 'ab-nextjs-icons/ab-icons/icons/star';
import anchor from 'ab-nextjs-icons/ab-icons/icons/anchor';
import article from 'ab-nextjs-icons/ab-icons/icons/article';
// 🎨 mock content classes
import s from './styles.module.css';

// 🥉 John's bronze
const BRONZE = '#A67C52';
// 🌍 the 4 locale chips
const LOC = ['EN', 'FR', 'ES', 'RU'];
/** 🔵 v6 N(x, y, w, h, html, lb, cls) (same shape as scenes.tsx) */
export type AbPgMk = (x: number, y: number, w: number, h: number, content: ReactNode, caption?: string, hub?: boolean) => AbFlowNode;

// ⏱️ the state an element owns (0…3)
const slot = (i: number, extra?: CSSProperties): CSSProperties => ({ '--ab-state-cycle-index': String(i), ...extra }) as CSSProperties;
const still = (i: number): '' | undefined => (i === 0 ? '' : undefined); // 🖼️ still frame = state 0

// 🔣 a real ab-nextjs-icons SVG at a size / stroke / colour (decorative)
const ICONS = { home, search, favorite, bolt, person, settings, language, palette, code, star, anchor, article };
type IconName = keyof typeof ICONS;
function Ic({ n, sz = 22, sw, col }: { n: IconName; sz?: number; sw?: number; col?: string }): ReactElement {
  let svg = ICONS[n].outlined.replace('width="24" height="24"', `width="${sz}" height="${sz}"`); // 📏
  if (sw) svg = svg.replace(/stroke-width="[0-9.]+"/g, `stroke-width="${sw}"`); // 🎚️ weight
  return <span className={s.ic} style={col ? { color: col } : undefined} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

// 🧩 small pieces
const M = ({ children, className, fs, style }: { children: ReactNode; className?: string; fs?: number; style?: CSSProperties }): ReactElement => (
  <span className={clsx(s.m, className)} style={fs ? { fontSize: fs, ...style } : style}>{children}</span>
);
const Br = ({ children }: { children: ReactNode }): ReactElement => <span className={s.br}>{children}</span>;
const Sg = ({ children }: { children: ReactNode }): ReactElement => <span className={s.sg}>{children}</span>;
const Mark = ({ logo, h }: { logo: ReactNode; h: number }): ReactElement => <span className={s.logo} style={{ height: h }}>{logo}</span>;

/** 🔁 v6 `cyc()`: 4 stacked states, the cycle shows state k (fade + 8px rise in 0.24s); still = state 0 */
export function AbPgCycle({ states, w, h = 18, align = 'center' }: { states: ReactNode[]; w?: number; h?: number; align?: 'center' | 'left' }): ReactElement {
  return (
    <span className={s.cy} style={{ width: w, height: h }}>
      {states.map((st, i) => <span key={i} className={clsx(s.cyItem, align === 'center' && s.cyCentre, C.word)} data-ab-still={still(i)} style={slot(i)}>{st}</span>)}
    </span>
  );
}

/** 🎚️ v6 `seg()`: chip k mod n is on (4 → one slot each, 2 → every other, 3 → the first also owns slot 3) */
export function AbPgSeg({ items, fs = 11, className }: { items: ReactNode[]; fs?: number; className?: string }): ReactElement {
  const n = items.length;
  const mode = (i: number): string | undefined => (n === 2 ? 'every-2' : n === 3 && i === 0 ? 'first-last' : undefined); // 🔢
  return (
    <span className={clsx(s.seg, s.segCycle, className)} style={{ fontSize: fs }}>
      {items.map((it, i) => <span key={i} className={C.chip} data-ab-cycle={mode(i)} data-ab-still={still(i)} style={slot(i)}>{it}</span>)}
    </span>
  );
}

/** 🔦 v6 `[data-hl]`: bronze border + 12% tint during state i (idle border / background are the element's own) */
const hl = (i: number, cls?: string, idleBorder = 'var(--ab-flow-line)', idleBg = 'transparent', extra?: CSSProperties): { className: string; style: CSSProperties; 'data-ab-still'?: '' } => ({
  className: clsx(cls, C.hl), 'data-ab-still': still(i),
  style: slot(i, { '--ab-state-cycle-idle-border': idleBorder, '--ab-state-cycle-idle-bg': idleBg, borderColor: idleBorder, background: idleBg, ...extra } as CSSProperties),
});

/** 🔀 `useAbAsideToggle()` switch: on for states 0–1, off for 2–3 */
const Switch = (): ReactElement => <span className={clsx(s.tog2, C.switch)}><i className={clsx(s.knob, C.knob)} /></span>;
/** 📏 `AbLinearProgress`: sweeps 0 → 100% per loop (still 40%) */
const Progress = ({ w }: { w: number }): ReactElement => <span className={s.lpTrack} style={{ width: w }}><i className={clsx(s.lpFill, C.fill)} /></span>;
/** 🎈 pop-in dot (0.6 → 1.06 → 1 each state) */
const Pop = ({ sz }: { sz: number }): ReactElement => <span className={clsx(s.popDot, C.pop)} style={{ width: sz, height: sz }} />;
/** 🎢 the dot riding the emphasized curve (0–75%, then holds; still = the end) */
function Curve({ w, h, d, r, axes }: { w: number; h: number; d: string; r: number; axes?: boolean }): ReactElement {
  return (
    <span className={s.curveBox} style={{ width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        {axes ? <><path d={`M10 ${h - 10} H${w - 10}`} className={s.axis} /><path d={`M10 ${h - 10} V10`} className={s.axis} /></> : null}
        <path d={d} fill="none" stroke={BRONZE} strokeWidth={axes ? 2.5 : 2.2} />
      </svg>
      <i className={clsx(s.rideDot, C.ride)} style={{ offsetPath: `path('${d}')`, width: r * 2, height: r * 2, borderWidth: axes ? 2 : 1.5 }} />
    </span>
  );
}

// 📱 the compact hub (spec rev 2: y = 122, h = 58) + the bottom caption right of the centre wire
const mobHub = (N: AbPgMk, x: number, w: number, c: ReactNode): AbFlowNode => N(x, 122, w, 58, c, '', true);
const bottom = (n: AbFlowNode): AbFlowNode => ({ ...n, captionAt: 'beside-centre' });

/* ===================================================================== 🖥️ 760×600 + 📱 350×276 per scene */

/** 🧱 3.1 core: nested AbAppLayout ⊃ AbScreenLayout ⊃ AbMainLayout + AbAsideLayout, App → Screen → Main → Aside */
export function buildCoreUp(N: AbPgMk, compact: boolean): AbFlowNode[] {
  if (compact) return [
    mobHub(N, 85, 180, <span className={s.mobLayers}><span {...hl(2, s.layMob)}>Main</span><span {...hl(3, s.layMob)}>Aside</span></span>),
    N(14, 62, 150, 52, <M>&lt;<Br>AbPageProvider</Br>&gt;</M>, 'provider'),
    N(186, 62, 150, 52, <Switch />, 'useAbAsideToggle'),
    bottom(N(100, 212, 150, 50, <Progress w={110} />, 'AbLinearProgress')),
  ];
  return [
    N(225, 262, 310, 120, (
      <div {...hl(0, s.layApp)}>
        <span className={s.layLb} style={{ left: 8, top: 5 }}>AbAppLayout</span>
        <div {...hl(1, s.layScreen)}>
          <span className={s.layLb} style={{ left: 6, top: 3 }}>AbScreenLayout</span>
          <div {...hl(2, s.layMain)}>AbMainLayout</div>
          <span className={clsx(s.layAsideWrap, C.dim)} style={slot(2)}><span {...hl(3, s.layAside)}>AbAsideLayout</span></span>
        </div>
      </div>
    ), 'ab-nextjs-core/ab-app-layout', true),
    N(40, 104, 210, 84, <span className={s.col} style={{ gap: 4 }}><M>&lt;<Br>AbPageProvider</Br>&gt;</M><M className={s.mut} fs={11}>useAbPage()</M></span>, 'AbPageProvider'),
    N(290, 112, 180, 64, <Progress w={140} />, 'AbLinearProgress'),
    N(510, 104, 210, 84, <><M>aside</M><Switch /></>, 'useAbAsideToggle()'),
    N(40, 456, 210, 74, <M><Br>240</Br><span className={s.mut}>ms</span></M>, 'AB_ASIDE_DURATION'),
    N(290, 456, 180, 74, <M><Sg>&quot;Done&quot;</Sg> ×4</M>, 'supportedCore'),
    N(510, 456, 210, 74, <M>(max-width: 1179px)</M>, 'AB_ASIDE_SHEET_QUERY'),
  ];
}

/** 🧩 3.2 components: 54 Ab* exports; press, tabs, typing search, rising sheet, locale */
export function buildComponentsUp(N: AbPgMk, compact: boolean, logo: ReactNode): AbFlowNode[] {
  const btn = (w: number): ReactElement => <span className={clsx(s.b1, C.press)} style={{ width: w }}>Get started</span>;
  if (compact) return [
    mobHub(N, 90, 170, <><Mark logo={logo} h={18} />Components</>),
    N(14, 62, 150, 52, btn(100), 'AbButton'),
    N(186, 62, 150, 52, <AbPgSeg items={['Code', 'Props']} fs={10.5} />, 'AbTabs'),
    bottom(N(100, 212, 150, 50, <M>v0.2.2 ▾</M>, 'AbVersionSwitcher')),
  ];
  return [
    N(250, 282, 260, 76, <><Mark logo={logo} h={24} /><M className={s.t13}>54 Ab* exports</M></>, 'supportedComponents', true),
    N(40, 104, 200, 84, btn(110), 'AbButton'),
    N(280, 112, 200, 64, <AbPgSeg items={['Preview', 'Code', 'Props']} />, 'AbTabs'),
    N(520, 104, 200, 84, <span className={s.searchMock}><Ic n="search" sz={16} /><AbPgCycle states={['Search', 'Bu', 'Butto', 'Button']} w={90} h={16} align="left" /></span>, 'AbSearchbar'),
    N(40, 440, 210, 106, <span className={s.sheetMock2}><span className={clsx(s.sheetPanel2, C.rise)}><i className={s.sheetHandle} /><span className={s.t13} style={{ fontSize: 11 }}>Language</span></span></span>, 'AbBottomDrawer'),
    N(290, 456, 180, 74, <span className={s.chip0}><Ic n="language" sz={16} col={BRONZE} /> <AbPgCycle states={LOC} w={22} h={16} /></span>, 'AbLocaleSwitcher'),
    N(510, 456, 210, 74, <M>v0.2.2 ▾</M>, 'AbVersionSwitcher'),
  ];
}

/** 🎨 3.3 theme: abTheme.colors; light → dark → light-hc → dark-hc */
export function buildThemeUp(N: AbPgMk, compact: boolean): AbFlowNode[] {
  const SW = ['#6B4F35', '#A67C52', '#D9BE9C', '#FFF8F5', '#19120C'];
  const sw = (w: number, h: number, gap: number): ReactElement => (
    <span className={s.sw} style={{ gap }}>{SW.map((c) => <i key={c} style={{ width: w, height: h, borderRadius: 8, background: c }} />)}</span>
  );
  const modes = ['light', 'dark', 'light-hc', 'dark-hc'].map((x) => <M key={x}>{x}</M>);
  if (compact) return [
    mobHub(N, 80, 190, sw(20, 26, 6)),
    N(14, 62, 150, 52, <AbPgSeg items={['light', 'dark']} fs={10.5} />, '[data-theme]'),
    N(186, 62, 150, 52, <M><Br>--ab-color-primary</Br></M>, 'tokens'),
    bottom(N(100, 212, 150, 50, <AbPgCycle states={modes} w={90} h={16} />, 'theme file')),
  ];
  const card = (bg: string, fg: string, bd: string, lab: string, hi?: number): ReactElement => {
    const own = { width: 62, height: 48, color: fg, border: `${hi === undefined ? 1 : 2}px solid ${bd}` };
    const p = hi === undefined ? { className: s.aaCard, style: { ...own, background: bg } } : hl(hi, s.aaCard, bd, bg, own);
    return <span {...p}>Aa<span className={s.aaLab}>{lab}</span></span>;
  };
  return [
    N(230, 272, 300, 100, sw(28, 36, 8), 'abTheme.colors', true),
    N(40, 100, 210, 96, <div className={s.m} style={{ lineHeight: 1.75 }}><Br>--ab-color-primary</Br><br /><Br>--ab-radius-card</Br>: 14px<br /><Br>--ab-font-title</Br></div>, 'css/ab-tokens.css'),
    N(290, 112, 180, 64, <AbPgSeg items={['light', 'dark']} />, '[data-theme]'),
    N(510, 96, 210, 110, <span style={{ display: 'flex', gap: 8 }}>{card('#FFF8F5', '#19120C', 'rgba(107,79,53,.25)', 'light')}{card('#19120C', '#FFF8F5', BRONZE, 'dark-hc', 3)}</span>, 'css/{light,dark}{,-mc,-hc}.css'),
    N(40, 456, 210, 74, <span style={{ display: 'flex', gap: 9, alignItems: 'flex-end' }}>{[6, 10, 14, 999].map((r, i) => <i key={r} {...hl(i, s.radiusTile, BRONZE, 'transparent', { borderRadius: r })} />)}</span>, '--ab-radius-{chip,button,card,pill}'),
    N(290, 456, 180, 74, <AbPgCycle states={modes} w={90} h={16} />, 'theme file'),
    N(510, 456, 210, 74, <M>import <Br>abTheme</Br></M>, 'default export'),
  ];
}

/** 🔣 3.4 icons: abIconNames grid (highlight steps i mod 4) + the weight picker 100 → 700 */
export function buildIconsUp(N: AbPgMk, compact: boolean): AbFlowNode[] {
  const cell = (n: IconName, i: number, sz: number, box: number): ReactElement => {
    return <span key={n} {...hl(i % 4, s.icCell, 'transparent', 'transparent', { width: box, height: box })}><Ic n={n} sz={sz} /></span>;
  };
  if (compact) return [
    mobHub(N, 70, 210, <span style={{ display: 'flex', gap: 8 }}>{(['home', 'search', 'favorite', 'bolt'] as IconName[]).map((n, i) => cell(n, i, 20, 28))}</span>),
    N(14, 62, 150, 52, <M><Br>abIconWeights</Br></M>, '100–700'),
    N(186, 62, 150, 52, <M>&lt;<Br>AbIcon</Br>/&gt;</M>, 'components'),
    bottom(N(100, 212, 150, 50, <M><Br>getAbIconSvg</Br>()</M>, 'svg string')),
  ];
  const names: IconName[] = ['home', 'search', 'favorite', 'bolt', 'person', 'settings', 'language', 'palette', 'code', 'star', 'anchor', 'article'];
  const wts: Array<[number, number]> = [[100, 0.7], [200, 1.25], [400, 1.9], [700, 2.8]];
  return [
    N(220, 262, 320, 124, <span className={s.icGrid}>{names.map((n, i) => cell(n, i, 22, 38))}</span>, 'abIconNames', true),
    N(40, 100, 210, 96, <span className={clsx(s.seg, s.segCycle, s.wts)}>{wts.map(([w, sw], i) => <span key={w} className={C.chip} data-ab-still={still(i)} style={slot(i)}><Ic n="star" sz={22} sw={sw} /><span className={s.m} style={{ fontSize: 9.5 }}>{w}</span></span>)}</span>, 'abIconWeights'),
    N(290, 112, 180, 64, <M><Br>200</Br></M>, 'abIconDefaultWeight'),
    N(510, 104, 210, 84, <M><Br>getAbIconSvg</Br>(<Sg>&quot;anchor&quot;</Sg>)</M>, 'getAbIconSvg()'),
    N(40, 456, 210, 74, <M>&lt;<Br>AbIcon</Br> name=<Sg>&quot;bolt&quot;</Sg>/&gt;</M>, 'AbIcon (ab-nextjs-components)'),
    N(290, 456, 180, 74, <><Ic n="anchor" sz={28} col={BRONZE} /><M>24×24</M></>, 'viewBox'),
    N(510, 456, 210, 74, <M>type <Br>AbIconName</Br></M>, 'typed names'),
  ];
}

/** 🔤 3.5 fonts: Mulish "Aa" 300 → 400 → 600 → 700 (fixed box, no shift) */
export function buildFontsUp(N: AbPgMk, compact: boolean): AbFlowNode[] {
  const W8: Array<[string, number]> = [['light', 300], ['regular', 400], ['semibold', 600], ['bold', 700]];
  const MUL = "'Mulish', var(--ab-font-sans, sans-serif)", INT = "'Inter', var(--ab-font-sans, sans-serif)", RM = "'Roboto Mono', var(--ab-font-mono, monospace)";
  const sp = (fam: string, txt: string, w: number, sz: number): ReactElement => <span style={{ fontFamily: fam, fontWeight: w, fontSize: sz }}>{txt}</span>;
  if (compact) return [
    { ...N(90, 130, 170, 66, <AbPgCycle states={W8.map(([, w]) => <span key={w} style={{ font: `${w} 34px/1 ${MUL}` }}>Aa</span>)} w={60} h={36} />, '', true), y: 122, h: 58 },
    N(14, 62, 150, 52, sp(MUL, 'Mulish', 700, 16), 'titles'),
    N(186, 62, 150, 52, sp(INT, 'Inter', 500, 15), 'body'),
    bottom(N(100, 212, 150, 50, sp(RM, 'Roboto Mono', 500, 13), 'code')),
  ];
  return [
    N(240, 262, 280, 120, (
      <span className={s.col} style={{ gap: 4 }}>
        <AbPgCycle states={W8.map(([, w]) => <span key={w} style={{ font: `${w} 60px/1 ${MUL}`, letterSpacing: '-0.02em' }}>Aa</span>)} w={120} h={62} />
        <AbPgCycle states={W8.map(([n]) => <M key={n} className={s.mut}>font-mulish-{n}</M>)} w={180} h={16} />
      </span>
    ), 'mulishStyles', true),
    N(40, 100, 210, 96, <span className={s.col} style={{ gap: 2, alignItems: 'flex-start' }}>{sp(MUL, 'Mulish', 700, 24)}<M className={s.mut}>titles</M></span>, 'mulishStyles'),
    N(290, 112, 180, 64, sp(INT, 'Inter', 500, 22), 'interStyles'),
    N(510, 100, 210, 96, <span className={s.col} style={{ gap: 2, alignItems: 'flex-start' }}>{sp(RM, 'Roboto Mono', 500, 20)}<M className={s.mut}>code</M></span>, 'robotoMonoStyles'),
    N(40, 456, 210, 74, <M>.<Br>font-mulish-bold</Br></M>, 'utility'),
    N(290, 456, 180, 74, <M>.<Br>font-inter-regular</Br></M>, 'utility'),
    N(510, 456, 210, 74, <M>.<Br>font-robotomono-medium</Br></M>, 'utility'),
  ];
}

/** 🎬 3.6 animations: the dot rides --ab-motion-ease-emphasized; presets step; pop-in pops */
export function buildAnimationsUp(N: AbPgMk, compact: boolean): AbFlowNode[] {
  if (compact) return [
    mobHub(N, 85, 180, <Curve w={150} h={44} d="M4 40 C 34 40, 34 4, 146 4" r={5} />),
    N(14, 62, 150, 52, <M>200ms</M>, 'duration-medium'),
    N(186, 62, 150, 52, <Pop sz={16} />, 'pop-in'),
    bottom(N(100, 212, 150, 50, <M><Sg>&apos;ab-wire-pulse&apos;</Sg></M>, 'AB_WIRE_PULSE_CLASS')),
  ];
  return [
    N(220, 262, 320, 128, <Curve w={280} h={100} d="M10 90 C 66 90, 66 10, 270 10" r={7} axes />, '--ab-motion-ease-emphasized', true),
    N(40, 100, 210, 96, <div className={s.m} style={{ lineHeight: 1.7 }}>duration-<Br>short</Br> 160ms<br />duration-<Br>medium</Br> 200ms<br />duration-<Br>long</Br> 280ms</div>, 'AB_MOTION_TOKENS'),
    N(290, 112, 180, 64, <M fs={11}>cubic-bezier(.2,.8,.2,1)</M>, 'ease-emphasized'),
    N(510, 104, 210, 84, <AbPgSeg items={['pop-in', 'fade', 'slide-up']} />, 'supportedAnimations · 19'),
    N(40, 456, 210, 74, <><M>reduce</M><span className={s.tog} style={{ opacity: 0.55 }} /></>, 'AB_REDUCED_MOTION_QUERY'),
    N(290, 456, 180, 74, <Pop sz={18} />, 'pop-in'),
    N(510, 456, 210, 74, <><M><Sg>&apos;ab-wire-pulse&apos;</Sg></M><M className={s.mut}>2400ms</M></>, 'AB_WIRE_PULSE_CLASS'),
  ];
}

/** 🪝 3.7 hooks: each hook's live return value steps through 4 states */
export function buildHooksUp(N: AbPgMk, compact: boolean, logo: ReactNode): AbFlowNode[] {
  if (compact) return [
    mobHub(N, 90, 170, <><Mark logo={logo} h={18} />Hooks</>),
    N(14, 62, 150, 52, <M><Br>useAbThemeMode</Br></M>, 'theme'),
    N(186, 62, 150, 52, <M><Br>useAbMedia</Br></M>, 'media'),
    bottom(N(100, 212, 150, 50, <M><Br>useAbSwipe</Br></M>, 'gestures')),
  ];
  const r = (v: ReactNode): ReactElement => <><M className={s.mut} fs={11}>→</M>{v}</>;
  const q = (xs: string[], w: number): ReactElement => <AbPgCycle states={xs.map((x) => <M key={x} fs={11}><Sg>&quot;{x}&quot;</Sg></M>)} w={w} h={16} align="left" />;
  const p = (xs: string[], w: number): ReactElement => <AbPgCycle states={xs.map((x, i) => <M key={i} fs={11}>{x}</M>)} w={w} h={16} align="left" />;
  return [
    N(260, 286, 240, 72, <><Mark logo={logo} h={24} /><M className={s.t13}>ab-nextjs-hooks</M></>, 'supportedHooks · 47', true),
    N(40, 104, 210, 84, <><M fs={11}><Br>useAbThemeMode</Br>()</M>{r(q(['light', 'dark', 'system', 'light'], 64))}</>, 'AbThemeMode'),
    N(290, 104, 180, 84, <><M fs={11}><Br>useAbMedia</Br>(q)</M>{r(p(['true', 'true', 'false', 'false'], 40))}</>, '(min-width:768px)'),
    N(510, 104, 210, 84, <><M fs={11}><Br>useAbSwipe</Br>(ref)</M>{r(q(['left', 'right', 'up', 'down'], 56))}</>, 'AbSwipeDirection'),
    N(40, 456, 210, 74, <M fs={11}><Br>useAbLocalStorage</Br>(k)</M>, 'read / write'),
    N(290, 456, 180, 74, <><M fs={11}><Br>useAbClipboard</Br>()</M>{r(p(['copy', '✓', '✓', 'copy'], 30))}</>, 'AB_CLIPBOARD_RESET_MS 2000'),
    N(510, 456, 210, 74, <><M fs={11}><Br>useAbReducedMotion</Br>()</M>{r(<M fs={11}>false</M>)}</>, 'boolean'),
  ];
}
