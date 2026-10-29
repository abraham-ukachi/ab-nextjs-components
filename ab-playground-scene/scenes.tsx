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
* @name: AbPlaygroundScene scenes
* @file: ab-playground-scene/scenes.tsx
* @type: Module
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
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
// 〰️ flow types
import type { AbFlowNode, AbFlowPoint } from '../ab-flow-diagram/helpers';
// 🎬 the motion dot rides ab-nextjs-animations' wire pulse (no local keyframes)
import { AB_WIRE_PULSE_CLASS } from 'ab-nextjs-animations/wire';
// 🖼️ icons
import { AB_PLAYGROUND_ICON_NAMES, Avatar, Moon, Ms, Sun } from './icons';
// 🌍 labels
import type { AbPlaygroundSceneLabels, AbPlaygroundSceneName } from './labels';
// 🌍 illustration 8
import { buildI18nCompact, buildI18nFull } from './i18n';
// 🎠 0.2.3: v6 s01 (welcome) + s09 (all)
import { buildAllCompact, buildAllFull, buildWelcomeCompact, buildWelcomeFull } from './welcome';
// 🎨 mock content classes (.m, .seg, .tog…)
import s from './styles.module.css';

// 🥉 John's constants
const BRONZE = '#A67C52';
// 📦 v6 PKG
export const AB_PLAYGROUND_SCENE_PACKAGES: Record<AbPlaygroundSceneName, string> = {
  core: 'ab-nextjs-core', components: 'ab-nextjs-components', theme: 'ab-nextjs-theme', icons: 'ab-nextjs-icons',
  fonts: 'ab-nextjs-fonts', animations: 'ab-nextjs-animations', hooks: 'ab-nextjs-hooks', i18n: 'ab-nextjs-i18n',
  welcome: 'ab-elements', all: 'ab-elements', // 🎠 0.2.3 v6 PKG[0] / PKG[8]
};

/** 🧱 a built scene: nodes (hub included) + optional extra wires */
export interface AbPlaygroundSceneData { nodes: AbFlowNode[]; wires?: AbFlowPoint[][]; /** 🎠 0.2.3: `[]` = no auto routing */ edges?: []; /** ⚓ 0.2.3: false = no anchor dots */ anchors?: boolean }

// 🔵 v6 N(x, y, w, h, html, lb, cls)
let seq = 0;
const N = (x: number, y: number, w: number, h: number, content: ReactNode, caption = '', hub = false): AbFlowNode =>
  ({ id: hub ? 'hub' : `n${seq++}`, x, y, w, h, content, caption: caption || undefined, tone: hub ? 'hub' : 'node' });

// 🧩 small pieces
const M = ({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }): ReactElement => <span className={clsx(s.m, className)} style={style}>{children}</span>;
const Br = ({ children }: { children: ReactNode }): ReactElement => <span className={s.br}>{children}</span>;
const Sg = ({ children }: { children: ReactNode }): ReactElement => <span className={s.sg}>{children}</span>;
const Seg = ({ items, on = 0, style }: { items: ReactNode[]; on?: number; style?: CSSProperties }): ReactElement => (
  <span className={s.seg} style={style}>{items.map((it, i) => <span key={i} className={i === on ? s.on : undefined}>{it}</span>)}</span>
);
const Tog = ({ style }: { style?: CSSProperties }): ReactElement => <span className={s.tog} style={style} />;
const Logo = ({ logo, h }: { logo: ReactNode; h: number }): ReactElement => <span className={s.logo} style={{ height: h }}>{logo}</span>;
const Sw = ({ w, h, r, colors }: { w: number; h: number; r: number; colors: string[] }): ReactElement => (
  <span className={s.sw}>{colors.map((c) => <i key={c} style={{ width: w, height: h, borderRadius: r, background: c }} />)}</span>
);
const PALETTE = ['#6B4F35', '#A67C52', '#D9BE9C', '#FFF8F5', '#19120C']; // 🎨

/** ♿ the ease dot's still: spec t = 0.45 → 0.45 / 0.75 = 60% along the curve (dashoffset 40) */
const EASE_STILL = (w: number): CSSProperties => ({ strokeWidth: w, '--ab-wire-poster': '40', '--ab-wire-index': '0' }) as CSSProperties;

/** 🎬 v6 ease curve + the dot that runs along it (the dot = an ab-wire-pulse zero-length dash) */
function Ease({ w, h, d, small }: { w: number; h: number; d: string; small?: boolean }): ReactElement {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ overflow: 'visible' }}>
      {!small ? <><path d={`M10 ${h - 10} H${w - 10}`} className={s.axis} /><path d={`M10 ${h - 10} V10`} className={s.axis} /></> : null}
      <path d={d} fill="none" stroke={BRONZE} strokeWidth={small ? 2.2 : 2.5} />
      <path d={d} pathLength={100} className={clsx(s.easeRing, AB_WIRE_PULSE_CLASS)} style={EASE_STILL(small ? 13 : 18)} />
      <path d={d} pathLength={100} className={clsx(s.easeDot, AB_WIRE_PULSE_CLASS)} style={EASE_STILL(small ? 10 : 14)} />
    </svg>
  );
}

/** 🖥️ the 760×600 scenes (scenes.py `scene_nodes` k = 1…7) */
export function buildAbPlaygroundFullScene(name: AbPlaygroundSceneName, L: AbPlaygroundSceneLabels, logo: ReactNode, still = 0): AbPlaygroundSceneData {
  seq = 0;
  switch (name) {
    // 🧱 0.2.3 (God 02:24): every caption is a REAL ab-nextjs-core export (v6's AbProvider / Slot / Portal never existed)
    case 'core': return { nodes: [
      N(250, 282, 260, 76, <><Logo logo={logo} h={26} /><M className={s.t13}>&lt;AbPageProvider&gt;</M></>, L.providerHub, true),
      N(40, 104, 190, 92, <div className={s.m} style={{ lineHeight: 1.7 }}>variant=<Sg>&quot;panes&quot;</Sg><br />mainHeaderAt=<Sg>&quot;all&quot;</Sg><br />asideBelow=<Sg>&quot;hidden&quot;</Sg></div>, '<AbAppLayout/>'),
      N(300, 112, 160, 60, <div className={s.paneMock}><i className={s.paneHead} /><i className={s.paneBody} /></div>, '<AbMainLayout/>'),
      N(530, 104, 190, 92, <div className={s.col}><Seg items={[L.open, L.closed]} /><M className={s.mut}>{L.drawerBelow}</M></div>, 'useAbAsideToggle()'),
      N(40, 450, 200, 70, <span className={s.dotSwatch} />, '<AbDottedSurface/>'),
      N(290, 460, 180, 56, <div className={s.col} style={{ gap: 2 }}><M style={{ whiteSpace: 'nowrap' }}><Br>aria-label</Br></M><M className={s.mut} style={{ whiteSpace: 'nowrap' }}>{L.aside}</M></div>, '<AbAsideLayout/>'), // 🪟 stacked: 180px node
      N(530, 450, 190, 70, <span className={s.progress}><i /></span>, '<AbLinearProgress/>'),
    ] };
    case 'components': return { nodes: [
      N(250, 288, 260, 70, <><Logo logo={logo} h={24} /><M className={s.t13}>ab‑nextjs‑components</M></>, '', true),
      N(40, 96, 150, 104, <div className={s.col}><span className={s.b1}>{L.primary}</span><span className={s.b2}>{L.outline}</span></div>, '<AbButton/>'),
      N(240, 118, 140, 58, <><Seg items={[<Sun key="s" />, <Moon key="m" />]} on={1} /><span className={s.t13}>{L.dark}</span></>, '<AbThemeToggle/>'),
      N(430, 116, 290, 62, <Seg items={[L.preview, L.code, L.props]} style={{ background: 'transparent' }} />, '<AbTabs/>'),
      N(40, 430, 220, 130, <div className={s.sheetMock}><div className={s.sheetPanel}><i className={s.sheetHandle} /><div className={s.t13} style={{ fontSize: 12 }}>{L.shareSheet}</div></div></div>, '<AbBottomDrawer/>'),
      N(310, 450, 140, 90, <span style={{ width: 52, height: 52, display: 'block' }}><Avatar /></span>, '<AbAvatar/>'),
      N(500, 440, 220, 110, <div className={s.navMock}><Ms n="home" col={BRONZE} /><Ms n="search" /><Ms n="heart" /><Ms n="user" /></div>, '<AbNavbar/>'),
    ] };
    case 'theme': return { nodes: [
      N(230, 280, 300, 84, <Sw w={28} h={36} r={8} colors={PALETTE} />, '<AbThemeModeProvider/>', true),
      N(40, 100, 210, 104, <div className={s.m} style={{ lineHeight: 1.75 }}><Br>--ab-color-bronze</Br><br />#A67C52<br /><Br>--ab-color-welcome-pane</Br></div>, 'ab-tokens.css'),
      N(300, 120, 160, 62, <Seg items={[<Sun key="s" />, <Moon key="m" />]} on={1} />, 'color-scheme'),
      N(510, 96, 210, 110, <div style={{ display: 'flex', gap: 10 }}><span className={clsx(s.aa, s.aaLight)}>Aa</span><span className={clsx(s.aa, s.aaDark)}>Aa</span></div>, L.lightDark),
      N(40, 450, 210, 80, <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>{[4, 10, 16].map((r) => <i key={r} className={s.radius} style={{ borderRadius: r }} />)}</div>, '--ab-radius-*'),
      N(300, 456, 160, 64, <M><Sg>AAA</Sg> 7.2 : 1</M>, L.contrast),
      N(510, 450, 210, 80, <><M>@theme {'{'} <Br>…</Br> {'}'}</M><M className={s.mut}>v4</M></>, 'tailwind'),
    ] };
    case 'icons': return { nodes: [
      N(220, 260, 320, 128, <div className={s.iconGrid}>{AB_PLAYGROUND_ICON_NAMES.map((n, i) => <span key={n} className={i === 5 ? s.iconOn : undefined}><Ms n={n} /></span>)}</div>, L.iconSet, true),
      N(40, 104, 200, 84, <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}><Ms n="star" sz={16} /><Ms n="star" sz={20} /><Ms n="star" sz={24} /><Ms n="star" sz={32} col={BRONZE} /></div>, L.size),
      N(290, 112, 180, 64, <Seg items={[L.outlined, L.rounded]} />, L.variant),
      N(520, 104, 200, 84, <M>&lt;<Br>AbIcon</Br> name=<Sg>&quot;bolt&quot;</Sg>/&gt;</M>, '<AbIcon/>'),
      N(40, 456, 200, 70, <><M>{L.treeShaken}</M><M className={s.br}>1.2 kB</M></>, L.bundle),
      N(290, 456, 180, 70, <><Ms n="heart" sz={26} col={BRONZE} /><M>fill=1</M></>, L.fillAxis),
      N(520, 456, 200, 70, <><M className={s.mut}>{L.import}</M><M>…/icons/<Br>home</Br></M></>, L.typed),
    ] };
    case 'fonts': {
      const sp = (fam: string, nm: string, w: number): ReactElement => (
        <div className={s.col} style={{ gap: 2, alignItems: 'flex-start' }}><span style={{ fontFamily: fam, fontSize: 22, fontWeight: w }}>{nm}</span><M className={s.mut}>{`${nm[0].toLowerCase()}${nm.slice(1)}Styles`}</M></div>
      );
      return { nodes: [
        N(250, 262, 260, 120, <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}><span className={s.zs} style={{ fontSize: 64, lineHeight: 1 }}>Aa</span><span style={{ fontSize: 40, fontWeight: 600 }}>Aa</span></div>, 'ab-nextjs-fonts', true),
        N(40, 100, 210, 96, <div className={s.col} style={{ gap: 2, alignItems: 'flex-start' }}><span className={s.zs} style={{ fontSize: 24 }}>Zilla Slab</span><M className={s.mut}>zillaSlabStyles</M></div>, L.display),
        N(300, 112, 160, 64, <>{[400, 600, 700].map((w) => <span key={w} style={{ fontWeight: w, fontSize: 22 }}>a</span>)}</>, L.interWeights),
        N(510, 100, 210, 96, <div className={s.col} style={{ gap: 2, alignItems: 'flex-start' }}><span style={{ fontSize: 22, fontWeight: 600 }}>Inter</span><M className={s.mut}>interStyles</M></div>, L.sans),
        N(40, 456, 210, 74, sp("'Mulish', var(--ab-font-sans, sans-serif)", 'Mulish', 600), L.altSans),
        N(300, 456, 160, 74, sp("'Quicksand', var(--ab-font-sans, sans-serif)", 'Quicksand', 600), L.roundedFont),
        N(510, 456, 210, 74, sp("'Roboto', var(--ab-font-sans, sans-serif)", 'Roboto', 500), L.neutral),
      ] };
    }
    case 'animations': return { nodes: [
      N(220, 262, 320, 128, <Ease w={280} h={100} d="M10 90 C 110 90, 130 10, 270 10" />, L.easeOut, true),
      N(40, 100, 210, 96, <div className={s.m} style={{ lineHeight: 1.75 }}>{L.spring} {'{'}<br />&nbsp;stiffness: <Br>380</Br>,<br />&nbsp;damping: <Br>30</Br> {'}'}</div>, L.spring),
      N(300, 112, 160, 64, <M>240<span className={s.mut}>ms</span></M>, L.duration),
      N(510, 104, 210, 84, <Seg items={[L.fade, L.slide, L.scale]} />, L.preset),
      N(40, 456, 230, 74, <><M>{L.reduceAnimations}</M><Tog /></>, L.a11y),
      N(320, 456, 140, 74, <span className={s.bigDot} />, 'AB_WIRE_PULSE_CLASS'),
      N(510, 456, 210, 74, <M>{L.stagger} <Br>40ms</Br></M>, L.list),
    ] };
    case 'hooks': {
      const hk = (a: string, b: ReactNode = ''): ReactElement => <M><Br>{a}</Br>({b})</M>;
      return { nodes: [
        N(260, 286, 240, 72, <><Logo logo={logo} h={24} /><M className={s.t13}>ab‑nextjs‑hooks</M></>, '', true),
        // 🪝 0.2.3 (God 02:24): real ab-nextjs-hooks exports (v6's useTheme / useHotkey / useMounted are not Ab names)
        N(40, 110, 200, 64, hk('useAbTheme'), '→ "dark"'),
        N(280, 110, 200, 64, hk('useAbMedia', <Sg>&quot;md&quot;</Sg>), '→ true'),
        N(520, 110, 200, 64, hk('useAbReducedMotion'), L.a11y),
        N(40, 460, 200, 64, hk('useAbLocalStorage', 'k'), L.storage),
        N(280, 460, 200, 64, hk('useAbScrollSpy'), L.scrollSpy),
        N(520, 460, 200, 64, hk('useAbClipboard'), L.copy),
      ] };
    }
    case 'welcome': return buildWelcomeFull(N, L, logo); // 🎠 v6 s01
    case 'all': return buildAllFull(N, L, logo); // 🎠 v6 s09
    default: return { nodes: buildI18nFull(N, L, still) }; // 🌍 John's illustration 8 (`still` = the reduced-motion locale)
  }
}

/** 📱 the 350×276 scenes (scenes.py `mscene_nodes` k = 1…7) */
export function buildAbPlaygroundCompactScene(name: AbPlaygroundSceneName, L: AbPlaygroundSceneLabels, logo: ReactNode, still = 0): AbPlaygroundSceneData {
  seq = 0;
  const top = (c: ReactNode, lb = ''): AbFlowNode => N(14, 62, 150, 52, c, lb);
  const top2 = (c: ReactNode, lb = ''): AbFlowNode => N(186, 62, 150, 52, c, lb);
  const bot = (c: ReactNode, lb = ''): AbFlowNode => N(100, 212, 150, 50, c, lb);
  const hubn = (c: ReactNode, w = 170, h = 56): AbFlowNode => N(175 - w / 2, 136, w, h, c, '', true);
  const sc = (...n: AbFlowNode[]): AbPlaygroundSceneData => ({ nodes: n });
  switch (name) {
    case 'core': return sc(hubn(<><Logo logo={logo} h={18} /><M>&lt;AbPageProvider&gt;</M></>, 200), top(<M>variant=<Sg>&quot;panes&quot;</Sg></M>, '<AbAppLayout/>'), top2(<Seg items={[L.open, L.closed]} style={{ fontSize: 11 }} />, 'useAbAsideToggle()'), bot(<span className={s.dotSwatch} style={{ width: 110, height: 30 }} />, '<AbDottedSurface/>')); // 🧱 real core exports
    case 'components': return sc(hubn(<><Logo logo={logo} h={18} />{L.components}</>), top(<span className={s.b1} style={{ width: 96, height: 30 }}>{L.button}</span>, '<AbButton/>'), top2(<Seg items={[<Sun key="s" />, <Moon key="m" />]} on={1} />, '<AbThemeToggle/>'), bot(<Seg items={[L.tabs, L.code]} style={{ fontSize: 11 }} />, '<AbTabs/>'));
    case 'theme': return sc(hubn(<Sw w={20} h={26} r={6} colors={PALETTE} />), top(<span className={clsx(s.chipScheme, s.aaLight)}>{L.light}</span>, L.scheme), top2(<span className={clsx(s.chipScheme, s.aaDark)}>{L.darkChip}</span>, L.scheme), bot(<M>--ab-radius-card</M>, 'ab-tokens.css'));
    case 'icons': return sc(hubn(<div style={{ display: 'flex', gap: 9 }}>{['home', 'search', 'heart', 'bolt', 'user'].map((n) => <Ms key={n} n={n} sz={20} />)}</div>, 190), top(<M>&lt;<Br>AbIcon</Br>/&gt;</M>, L.typed), top2(<><Ms n="star" sz={14} /><Ms n="star" sz={20} /><Ms n="star" sz={26} col={BRONZE} /></>, L.size), bot(<M>1.2 kB</M>, L.treeShaken));
    case 'fonts': return sc(hubn(<><span className={s.zs} style={{ fontSize: 30 }}>Aa</span><span style={{ fontSize: 22, fontWeight: 600 }}>Aa</span></>), top(<span className={s.zs} style={{ fontSize: 16 }}>Zilla Slab</span>, L.headings), top2(<span style={{ fontSize: 15 }}>Inter</span>, L.uiBody), bot(<span style={{ fontFamily: "'Mulish', var(--ab-font-sans, sans-serif)", fontSize: 15 }}>Mulish</span>, L.altSans));
    case 'animations': return sc(hubn(<Ease w={150} h={44} d="M4 40 C 60 40, 70 4, 146 4" small />, 180), top(<M>{L.spring}</M>, L.preset), top2(<M>240<span className={s.mut}>ms</span></M>, L.duration), bot(<M>{L.fadeSlide}</M>, L.transition));
    case 'hooks': return sc(hubn(<><Logo logo={logo} h={18} />{L.hooks}</>), top(<M><Br>useAbTheme</Br>()</M>), top2(<M><Br>useAbMedia</Br>()</M>), bot(<M><Br>useAbClipboard</Br>()</M>)); // 🪝 real exports
    case 'welcome': return buildWelcomeCompact(N, L, logo); // 🎠 v6 s01, mobile
    case 'all': return buildAllCompact(N, L, logo); // 🎠 v6 s09, mobile
    default: return sc(...buildI18nCompact(N, L, still)); // 🌍 illustration 8, mobile
  }
}
