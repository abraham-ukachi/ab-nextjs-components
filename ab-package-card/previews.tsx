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
* @name: AbPackageCard Home previews (0.2.1, God 02:44, mock .pv-*)
* @file: ab-package-card/previews.tsx
* @type: React Component (no hooks: client + server)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage (pass one as AbPackageCard `preview`):
*   <AbPackageCard preview={<AbPackagePreviewCurve />} … />                       // 〰️ Animations: ease-out curve
*   <AbPackageCard preview={<AbPackagePreviewCode lines={['*use*Theme()', '*use*Media()']} />} … />   // 🪝 Hooks
*   <AbPackageCard preview={<AbPackagePreviewCode lines={['<*AbProvider*>', '~  {children}']} />} … /> // 🧱 Core
*   <AbPackageCard preview={<AbPackagePreviewComponents />} … />                  // 🧩 Components: button · switch · chip
*   <AbPackagePreviewComponents labels={{ button: 'Bouton', chip: 'Puce', switch: 'Interrupteur' }} />   // 🌍 0.2.2
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ReactElement, ReactNode } from 'react';
// 🎨 styles (the card's module: the previews sit in its 56px tile)
import styles from './styles.module.css';

/** 〰️ Animations tile: two axes, the accent ease-out curve with its end dots, and the easing name bottom right. */
export function AbPackagePreviewCurve({ label = 'ease-out', path = 'M6 38 C 50 38, 58 6, 114 6' }: { label?: string; path?: string }): ReactElement {
  return (
    <span className={styles.pvAnim} data-ab-part="preview-curve">
      <svg viewBox="0 0 120 44" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <line x1="6" y1="38" x2="114" y2="38" className={styles.pvAx} /> {/* ➖ x axis */}
        <line x1="6" y1="6" x2="6" y2="38" className={styles.pvAx} /> {/* ➖ y axis */}
        <path d={path} className={styles.pvCrv} /> {/* 〰️ the curve (mock: cubic 50,38 · 58,6) */}
        <circle cx="114" cy="6" r="3.2" className={styles.pvDot} /> {/* 🔴 end */}
        <circle cx="6" cy="38" r="2.4" className={styles.pvDot2} /> {/* ⚪ start */}
      </svg>
      <span className={styles.pvEase}>{label}</span> {/* 🏷️ ease-out */}
    </span>
  );
}

/** 🎨 one code line: `*kw*` = a keyword (accent, 600), a leading `~` = a dim line (faint). */
function codeLine(src: string): ReactNode {
  const parts = src.split(/(\*[^*]+\*)/g).filter(Boolean); // ✂️ keywords vs text
  return parts.map((p, i) => (p.startsWith('*') && p.endsWith('*') ? <b key={i}>{p.slice(1, -1)}</b> : p)); // 🖍️
}

/** 🪝🧱 Hooks / Core tile: left-aligned, slightly bold mono lines with the keywords syntax-coloured. */
export function AbPackagePreviewCode({ lines }: { lines: readonly string[] }): ReactElement {
  return (
    <span className={styles.pvCode} data-ab-part="preview-code">
      {lines.map((l, i) => {
        const dim = l.startsWith('~'); // 🌫️
        const text = dim ? l.slice(1).replace(/^ +/, (m) => '\u00a0'.repeat(m.length)) : l; // ␣ keep the indent
        return <span key={i} className={dim ? styles.pvDim : undefined}>{codeLine(text)}</span>;
      })}
    </span>
  );
}

/** 🌍 0.2.2: the Components tile's strings (English defaults) */
export interface AbPackagePreviewComponentsLabels {
  button?: string; // 🔘 default "Button"
  chip?: string; // 💊 default "Chip"
  switch?: string; // 🎚️ default "Switch" (the switch's name when the tile is used outside an aria-hidden card preview)
}

/** ⚙️ props: `labels` (0.2.2) wins over the 0.2.1 `button` / `chip` props (kept for back-compat) */
export interface AbPackagePreviewComponentsProps {
  labels?: AbPackagePreviewComponentsLabels; // 🌍
  button?: string; // 🕰️ 0.2.1: prefer `labels.button`
  chip?: string; // 🕰️ 0.2.1: prefer `labels.chip`
}

/** 🧩 Components tile: a mini button, an on switch and a pill chip, intrinsic size (no stretch), centred both ways. */
export function AbPackagePreviewComponents({ labels = {}, button, chip }: AbPackagePreviewComponentsProps): ReactElement {
  const L = { button: button ?? 'Button', chip: chip ?? 'Chip', switch: 'Switch', ...labels }; // 🌍 defaults < legacy props < labels
  return (
    <span className={styles.pvComp} data-ab-part="preview-components">
      <span className={styles.pvBtn}>{L.button}</span> {/* 🔘 6px radius (kept) */}
      <span className={styles.pvSw} role="img" aria-label={L.switch}><i /></span> {/* 🎚️ on */}
      <span className={styles.pvChip}>{L.chip}</span> {/* 💊 pill */}
    </span>
  );
}
