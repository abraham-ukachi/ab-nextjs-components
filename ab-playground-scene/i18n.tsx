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
* @name: AbPlaygroundScene i18n (illustration 8)
* @file: ab-playground-scene/i18n.tsx
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
// 🖼️ the globe
import { Ms } from './icons';
// 🌍 labels + the 4 demo locales
import { AB_PLAYGROUND_LOCALES, type AbPlaygroundSceneLabels } from './labels';
// 🎨 shared mock classes (.m, .br, .sg, .seg…)
import s from './styles.module.css';
// 🎬 0.2.3: the locale cycle now ships from ab-nextjs-animations ≥ 0.2.5 (keyframes, still frame, ♿, pause)
import { AB_LOCALE_CYCLE_CHIP_CLASS, AB_LOCALE_CYCLE_WORD_CLASS } from 'ab-nextjs-animations/locale-cycle';
import 'ab-nextjs-animations/locale-cycle/styles.css'; // 🌍 .ab-locale-cycle-word / .ab-locale-cycle-chip
// 🎨 layout only (stacking, fonts, chip padding): no motion lives here any more
import x from './i18n.module.css';

// 🥉
const BRONZE = '#A67C52';
// ⏱️ each locale's slot in the 2.4s loop: index i is active during [i·0.6s, (i+1)·0.6s)
const slot = (i: number): CSSProperties => ({ '--ab-locale-cycle-index': String(i) }) as CSSProperties;

/** 👋 v6 `greet(sz)`: the 4 greetings stacked in one box; only the active one shows (cycle, or the still) */
export function AbPgGreeting({ L, sz, still }: { L: AbPlaygroundSceneLabels; sz: number; still: number }): ReactElement {
  return (
    <span className={x.greet} style={{ height: Math.trunc(sz * 1.25), width: Math.trunc(sz * 3.9) }}>
      {AB_PLAYGROUND_LOCALES.map((loc, i) => (
        <span key={loc} lang={loc} className={clsx(x.word, AB_LOCALE_CYCLE_WORD_CLASS)} data-ab-still={i === still ? '' : undefined} style={{ ...slot(i), fontSize: sz }}>{L.greetings[loc]}</span>
      ))}
    </span>
  );
}

/** 🎚️ v6 `seg()`: EN FR ES RU; the bronze chip jumps at every 0.6s boundary (instant, no slide) */
export function AbPgLocaleSeg({ fs, still, compact }: { fs: number; still: number; compact?: boolean }): ReactElement {
  return (
    <span className={clsx(s.seg, x.lseg, compact && x.ms)} style={{ fontSize: fs }}>
      {AB_PLAYGROUND_LOCALES.map((loc, i) => (
        <span key={loc} className={clsx(x.chip, AB_LOCALE_CYCLE_CHIP_CLASS)} data-ab-still={i === still ? '' : undefined} style={slot(i)}>{loc.toUpperCase()}</span>
      ))}
    </span>
  );
}

/** 🏷️ v6 `val()`: the `t("hello")` value, cycling with the greeting */
export function AbPgValue({ L, still }: { L: AbPlaygroundSceneLabels; still: number }): ReactElement {
  return (
    <span className={x.tv}>
      {AB_PLAYGROUND_LOCALES.map((loc, i) => (
        <span key={loc} lang={loc} className={clsx(x.word, x.valueWord, s.sg, s.m, AB_LOCALE_CYCLE_WORD_CLASS)} data-ab-still={i === still ? '' : undefined} style={slot(i)}>&quot;{L.greetings[loc]}&quot;</span>
      ))}
    </span>
  );
}

// 🔵 a node in frame px (same shape as scenes.tsx N())
type Mk = (x: number, y: number, w: number, h: number, content: ReactNode, caption?: string, hub?: boolean) => import('../ab-flow-diagram/helpers').AbFlowNode;
const M = ({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }): ReactElement => <span className={clsx(s.m, className)} style={style}>{children}</span>;
const Br = ({ children }: { children: ReactNode }): ReactElement => <span className={s.br}>{children}</span>;
const Sg = ({ children }: { children: ReactNode }): ReactElement => <span className={s.sg}>{children}</span>;
const Globe = ({ sz }: { sz: number }): ReactElement => <span style={{ display: 'flex', color: BRONZE }}><Ms n="globe" sz={sz} /></span>;

/** 🔁 a locale-following value (path, Intl output…): stacked, the cycle shows the active locale (still = `still`) */
function AbPgLocaleValue({ values, still, w }: { values: ReactNode[]; still: number; w: number }): ReactElement {
  return (
    <span className={x.tv} style={{ width: w, height: 16, display: 'inline-block', position: 'relative' }}>
      {values.map((v, i) => (
        <span key={i} lang={AB_PLAYGROUND_LOCALES[i]} className={clsx(x.word, AB_LOCALE_CYCLE_WORD_CLASS)} data-ab-still={i === still ? '' : undefined} style={{ ...slot(i), left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>{v}</span>
      ))}
    </span>
  );
}
// 🛣️ /en|fr|es|ru/docs and 💶 the REAL Intl.NumberFormat EUR output per locale (spec rev 2 §3.8; fixed strings, so
//    the server and every browser ICU render the same text: no hydration mismatch)
const PATHS = AB_PLAYGROUND_LOCALES.map((l) => <M key={l}>/<Br>{l}</Br>/docs</M>);
const EUR = ['€1,234.50', '1 234,50 €', '1234,50 €', '1 234,50 €'].map((v, i) => <M key={i}>{v}</M>);

/** 🖥️ illustration 8, rev 2 (build_upgraded.py `i18n`): 760×600, real ab-nextjs-i18n exports */
export function buildI18nFull(N: Mk, L: AbPlaygroundSceneLabels, still: number) {
  return [
    N(230, 270, 300, 104, (
      <div className={s.col} style={{ gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Globe sz={30} /><AbPgGreeting L={L} sz={34} still={still} /></div>
        <M className={s.mut}>&lt;AbI18nProvider&gt;</M>
      </div>
    ), 'AbI18nProvider', true),
    N(40, 100, 210, 96, <div className={s.m} style={{ lineHeight: 1.7 }}><Br>defineAbI18n</Br>({'{'}<br />&nbsp;locales: [<Sg>&apos;en&apos;</Sg>,<br />&nbsp;<Sg>&apos;fr&apos;,&apos;es&apos;,&apos;ru&apos;</Sg>] {'}'})</div>, 'ab-nextjs-i18n/config'),
    N(290, 116, 180, 60, <AbPgLocaleSeg fs={11} still={still} />, 'useAbLocaleSwitch()'),
    N(510, 104, 210, 84, <><M><Br>t</Br>(&quot;hello&quot;) →</M><AbPgValue L={L} still={still} /></>, 'useAbTranslations()'),
    N(40, 456, 210, 74, <AbPgLocaleValue values={PATHS} still={still} w={90} />, 'localizeAbPathname()'),
    N(290, 456, 180, 74, <AbPgLocaleValue values={EUR} still={still} w={110} />, 'useAbFormatter()'),
    N(510, 456, 210, 74, <M>hreflang <Br>×4</Br></M>, 'getAbAlternates()'),
  ];
}

/** 📱 illustration 8, rev 2: 350×276 (hub y 122 / h 58, bottom caption right of the centre wire) */
export function buildI18nCompact(N: Mk, L: AbPlaygroundSceneLabels, still: number) {
  return [
    N(80, 122, 190, 58, <><Globe sz={20} /><AbPgGreeting L={L} sz={20} still={still} /></>, '', true),
    N(14, 62, 150, 52, <AbPgLocaleSeg fs={10} still={still} compact />, 'useAbLocaleSwitch'),
    N(186, 62, 150, 52, <AbPgLocaleValue values={PATHS} still={still} w={90} />, 'localizeAbPathname'),
    { ...N(100, 212, 150, 50, <M><Br>t</Br>(&quot;hello&quot;)</M>, 'useAbTranslations'), captionAt: 'beside-centre' as const },
  ];
}
