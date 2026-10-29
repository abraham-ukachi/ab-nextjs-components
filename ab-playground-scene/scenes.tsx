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
import type { ReactNode } from 'react';
// 〰️ flow types
import type { AbFlowNode, AbFlowPoint } from '../ab-flow-diagram/helpers';
// 🌍 labels
import type { AbPlaygroundSceneLabels, AbPlaygroundSceneName } from './labels';
// 🌍 illustration 8
import { buildI18nCompact, buildI18nFull } from './i18n';
// 🎠 0.2.3: v6 s01 (welcome) + s09 (all)
import { buildAllCompact, buildAllFull, buildWelcomeCompact, buildWelcomeFull } from './welcome';
// 🎨 0.2.3 (God 03:02): John's upgraded package scenes
import { buildAnimationsUp, buildComponentsUp, buildCoreUp, buildFontsUp, buildHooksUp, buildIconsUp, buildThemeUp } from './upgraded';

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

/** 🖥️ the 760×600 scenes (scenes.py `scene_nodes` k = 1…7) */
export function buildAbPlaygroundFullScene(name: AbPlaygroundSceneName, L: AbPlaygroundSceneLabels, logo: ReactNode, still = 0): AbPlaygroundSceneData {
  seq = 0;
  switch (name) {
    // 🎨 0.2.3 (God 03:02): John's Welcome v6 UPGRADED scenes (playground-spec.md rev 2): real export captions,
    //    4 states × 0.6s, reduced-motion still = state 0. Motion = ab-nextjs-animations' state cycle (upgraded.tsx)
    case 'core': return { nodes: buildCoreUp(N, false) };
    case 'components': return { nodes: buildComponentsUp(N, false, logo) };
    case 'theme': return { nodes: buildThemeUp(N, false) };
    case 'icons': return { nodes: buildIconsUp(N, false) };
    case 'fonts': return { nodes: buildFontsUp(N, false) };
    case 'animations': return { nodes: buildAnimationsUp(N, false) };
    case 'hooks': return { nodes: buildHooksUp(N, false, logo) };
    case 'welcome': return buildWelcomeFull(N, L, logo); // 🎠 v6 s01
    case 'all': return buildAllFull(N, L, logo); // 🎠 v6 s09
    default: return { nodes: buildI18nFull(N, L, still) }; // 🌍 John's illustration 8 (`still` = the reduced-motion locale)
  }
}

/** 📱 the 350×276 scenes (scenes.py `mscene_nodes` k = 1…7) */
export function buildAbPlaygroundCompactScene(name: AbPlaygroundSceneName, L: AbPlaygroundSceneLabels, logo: ReactNode, still = 0): AbPlaygroundSceneData {
  seq = 0;
  const sc = (...n: AbFlowNode[]): AbPlaygroundSceneData => ({ nodes: n });
  switch (name) {
    // 🎨 0.2.3 (God 03:02): upgraded mobile scenes (3 nodes + hub at y 122 / h 58; bottom caption right of the wire)
    case 'core': return sc(...buildCoreUp(N, true));
    case 'components': return sc(...buildComponentsUp(N, true, logo));
    case 'theme': return sc(...buildThemeUp(N, true));
    case 'icons': return sc(...buildIconsUp(N, true));
    case 'fonts': return sc(...buildFontsUp(N, true));
    case 'animations': return sc(...buildAnimationsUp(N, true));
    case 'hooks': return sc(...buildHooksUp(N, true, logo));
    case 'welcome': return buildWelcomeCompact(N, L, logo); // 🎠 v6 s01, mobile
    case 'all': return buildAllCompact(N, L, logo); // 🎠 v6 s09, mobile
    default: return sc(...buildI18nCompact(N, L, still)); // 🌍 illustration 8, mobile
  }
}
