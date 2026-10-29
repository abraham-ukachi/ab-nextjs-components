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
* @name: AbPlaygroundScene
* @file: ab-playground-scene/index.tsx
* @type: Server Component
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
// 〰️ the engine: AbFlowDiagram's v6 frame mode
import AbFlowDiagram from '../ab-flow-diagram';
// 🧱 John's scene data
import { AB_PLAYGROUND_SCENE_PACKAGES, buildAbPlaygroundCompactScene, buildAbPlaygroundFullScene } from './scenes';
// 🌍 labels
import { AB_PLAYGROUND_LOCALES, resolveAbPlaygroundSceneLabels, type AbPlaygroundSceneLabelsInput, type AbPlaygroundSceneName } from './labels';
// 🎨 content classes
import styles from './styles.module.css';

// 📦 re-exports
export * from './labels';
export { AB_PLAYGROUND_SCENE_PACKAGES, buildAbPlaygroundFullScene, buildAbPlaygroundCompactScene } from './scenes';

/** 🅰️ the Ab mark (same data URI as ab-logo's AB_LOGO_DEFAULT_SRC; copied, because ab-logo is a client module and
 *  a constant imported from one is a client reference in a Server Component) */
export const AB_PLAYGROUND_MARK_SRC = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xml%3Aspace%3D%22preserve%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23A67C52%22%20d%3D%22m1.8%2020.5%209.3-17v17zM22.2%207.7l-9.3-4.2v17l9.3-4.2-4.7-4.3z%22/%3E%3Cpath%20d%3D%22m12.9%2020.5%209.3-4.2-9.3-8.6z%22%20opacity%3D%22.1%22/%3E%3C/svg%3E';

/** 📐 v6 frames */
export const AB_PLAYGROUND_FRAMES = {
  full: { w: 760, h: 600, header: 56 }, // 🖥️ laptop / tablet aside
  compact: { w: 350, h: 276, header: 36 }, // 📱 mobile
} as const;

// ⚙️ props
export interface AbPlaygroundSceneProps {
  /** 🗂️ which package scene (John's v6 1–7, and illustration 8 `i18n`). */
  name: AbPlaygroundSceneName;
  /** 📐 `'full'` = 760×600 laptop scene, `'compact'` = 350×276 mobile scene. Default `'full'`. */
  variant?: 'full' | 'compact';
  /** ▶️ animate only while its slide is active (default true); reduced motion is always respected. */
  active?: boolean;
  /** 🌍 translated words (merged over English). */
  labels?: AbPlaygroundSceneLabelsInput;
  /** 🅰️ logo for the header and hubs (default: the shipped Ab mark). */
  logo?: ReactNode;
  /** ♿ `'always'` forces the still frame (like the OS reduced-motion setting); default `'auto'` follows the OS. */
  reducedMotion?: 'auto' | 'always';
  /** 🌍 i18n scene: the locale shown in the still frame (reduced motion / before CSS), e.g. the app's locale.
   *  One of en · fr · es · ru (anything else → en). */
  locale?: string;
  /** 🔁 pulse loops (default infinite; phones get 3 via the AbFlowDiagram token). */
  loops?: number | 'infinite';
  /** ⏱️ pulse loop ms (default 2400). */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * 🎨 AbPlaygroundScene — the Welcome "Live Playground" scenes from John's welcome-v6 mock, faithfully: same rects,
 * same auto-routed wires (route() + rounded()), dotted surface, anchors, travelling pulses, card + header.
 * Server-compatible (AbFlowDiagram's tiny scale island is the only client code). One accessible image (translated alt).
 */
export function AbPlaygroundScene(props: AbPlaygroundSceneProps): ReactElement {
  const { name, variant = 'full', active = true, labels, logo, loops, duration, className, style, reducedMotion = 'auto', locale } = props;
  const still = Math.max(0, AB_PLAYGROUND_LOCALES.indexOf((locale ?? 'en').slice(0, 2).toLowerCase() as never)); // 🖼️ the still locale
  const L = resolveAbPlaygroundSceneLabels(labels); // 🌍
  // eslint-disable-next-line @next/next/no-img-element -- 🖼️ inline data-URI SVG mark, nothing for next/image to optimize
  const mark = logo ?? <img src={AB_PLAYGROUND_MARK_SRC} alt="" />; // 🅰️
  const data = (variant === 'compact' ? buildAbPlaygroundCompactScene : buildAbPlaygroundFullScene)(name, L, mark, still); // 🧱
  return (
    <AbFlowDiagram
      nodes={data.nodes}
      wires={data.wires}
      frame={AB_PLAYGROUND_FRAMES[variant]} // 📐
      variant={variant}
      alt={L.alt[name]} // ♿
      title={L.title} // 🏷️
      caption={AB_PLAYGROUND_SCENE_PACKAGES[name]} // 📦 mono package name
      live={L.live} // 🟢
      logo={mark} // 🅰️
      active={active} // ▶️
      reducedMotion={reducedMotion} // ♿
      loops={loops}
      duration={duration}
      className={clsx('AbPlaygroundScene', styles.scene, className)}
      style={style}
    />
  );
}

export default AbPlaygroundScene;
