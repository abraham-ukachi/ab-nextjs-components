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
* @name: AbPlaygroundScene (0.2.3)
* @file: __tests__/ab-playground-scene-0.2.3.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbPlaygroundScene, { AB_PLAYGROUND_FRAMES, buildAbPlaygroundCompactScene, buildAbPlaygroundFullScene, resolveAbPlaygroundSceneLabels, type AbPlaygroundSceneName } from '../ab-playground-scene'

const root = join(__dirname, '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const L = resolveAbPlaygroundSceneLabels()
const names: AbPlaygroundSceneName[] = ['core', 'components', 'theme', 'icons', 'fonts', 'animations', 'hooks', 'i18n']
const render = (p: Parameters<typeof AbPlaygroundScene>[0]) => renderToStaticMarkup(createElement(AbPlaygroundScene, p))

describe('🎨 AbPlaygroundScene: John’s v6 scenes', () => {
  it('every scene: one hub + 6 nodes (full), one hub + 3 nodes (compact)', () => {
    for (const n of names) {
      const f = buildAbPlaygroundFullScene(n, L, null).nodes
      const c = buildAbPlaygroundCompactScene(n, L, null).nodes
      expect(f.filter((x) => x.tone === 'hub'), n).toHaveLength(1); expect(f, n).toHaveLength(7) // 🖥️
      expect(c.filter((x) => x.tone === 'hub'), n).toHaveLength(1); expect(c, n).toHaveLength(4) // 📱
    }
  })
  it('rects are the mock’s (Core hub 250,282 260×76; compact top 14,62 150×52; compact hub centred at 175)', () => {
    expect(buildAbPlaygroundFullScene('core', L, null).nodes[0]).toMatchObject({ x: 250, y: 282, w: 260, h: 76, tone: 'hub', caption: 'provider hub' }) // 🎯
    const c = buildAbPlaygroundCompactScene('icons', L, null).nodes
    expect(c[0]).toMatchObject({ x: 80, y: 136, w: 190, h: 56 }); expect(c[1]).toMatchObject({ x: 14, y: 62, w: 150, h: 52 }) // 📱
  })
  it('frames: 760×600 / 56 and 350×276 / 36', () => {
    expect(AB_PLAYGROUND_FRAMES).toEqual({ full: { w: 760, h: 600, header: 56 }, compact: { w: 350, h: 276, header: 36 } }) // 📐
  })
  it('renders the header (title, mono package, live), 6 auto wires, translated alt', () => {
    const html = render({ name: 'theme' })
    expect(html).toMatch(/aria-label="Live playground: the AbThemeModeProvider/) // ♿
    expect(html).toMatch(/>Live Playground</); expect(html).toMatch(/>ab-nextjs-theme</); expect(html).toMatch(/>live</) // 🏷️
    expect(html.match(/class="frameWire ab-wire-draw"/g)).toHaveLength(6) // 〰️
  })
  it('labels are translatable through props (missing keys stay English)', () => {
    const html = render({ name: 'hooks', labels: { title: 'Terrain de jeu', live: 'en direct', storage: 'stockage', alt: { hooks: 'Les hooks' } } })
    expect(html).toMatch(/aria-label="Les hooks"/); expect(html).toMatch(/>Terrain de jeu</); expect(html).toMatch(/>en direct</); expect(html).toMatch(/>stockage</) // 🇫🇷
    expect(html).toMatch(/>copy</) // 🇬🇧 fallback
  })
  it('active=false pauses; compact uses the mobile frame; animations scene has the ease dot on the wire pulse', () => {
    expect(render({ name: 'core', active: false })).toMatch(/data-ab-paused="true"/) // ⏸️
    expect(render({ name: 'core', variant: 'compact' })).toMatch(/--ab-flow-w:350px;--ab-flow-h:276px;--ab-flow-header:36px/) // 📱
    expect(render({ name: 'animations' })).toMatch(/class="easeDot ab-wire-pulse"/) // 🎬 reduced motion handled by ab-nextjs-animations
  })
  it('ships: files, exports, server-compatible (no use client)', () => {
    expect(pkg.files).toContain('ab-playground-scene'); expect(pkg.exports['./ab-playground-scene']).toBe('./ab-playground-scene/index.tsx') // 📦
    for (const f of ['index.tsx', 'scenes.tsx', 'icons.tsx', 'labels.ts']) expect(readFileSync(join(root, 'ab-playground-scene', f), 'utf8'), f).not.toMatch(/^['"]use client['"];?$/m) // 🖥️
  })
})

// 🎠 God 02:26: the Welcome card is v6's original surface (theme ≥ 0.3.7 --ab-color-welcome-card), never the gapped white
describe('🎠 Welcome card surface', () => {
  const flow = readFileSync(join(root, 'ab-flow-diagram/styles.module.css'), 'utf8') // 〰️
  const scene = readFileSync(join(root, 'ab-playground-scene/styles.module.css'), 'utf8') // 🎨
  it('AbFlowDiagram reads --ab-flow-card first for the card, the nodes and the anchor rings', () => {
    expect(flow.match(/var\(--ab-flow-card, var\(--ab-color-card/g)).toHaveLength(3) // 🃏 🔵 ⚪
  })
  it('AbPlaygroundScene points it at --ab-color-welcome-card (v6 #fff / #241a12 fallbacks)', () => {
    expect(scene).toContain('.scene { --ab-flow-card: var(--ab-color-welcome-card, #fff); }') // 🌞
    expect(scene).toMatch(/\.scene \{ --ab-flow-card: var\(--ab-color-welcome-card, #241a12\); \}/) // 🌙
  })
})

// 🏷️ God 02:24: code captions are REAL Ab export names (checked against core / components / hooks / animations /
//    fonts / i18n exports on Oct 29), never v6's short names (useTheme, <Button/>, <AbProvider>…)
describe('🏷️ captions use real Ab export names', () => {
  const REAL = new Set([
    'AbPageProvider', 'AbAppLayout', 'AbMainLayout', 'useAbAsideToggle', 'AbDottedSurface', 'AbAsideLayout', 'AbLinearProgress', // 🧱 core
    'AbButton', 'AbThemeToggle', 'AbTabs', 'AbBottomDrawer', 'AbAvatar', 'AbNavbar', 'AbThemeModeProvider', 'AbIcon', 'AbLocaleSwitcher', // 🧩 components
    'AB_WIRE_PULSE_CLASS', // 🎬 animations
    'useAbTheme', 'useAbMedia', 'useAbReducedMotion', 'useAbLocalStorage', 'useAbScrollSpy', 'useAbClipboard', // 🪝 hooks
    'AbI18nProvider', 'useAbTranslations', 'localizeAbPathname', 'getAbAlternates', // 🌍 i18n
  ])
  const code = (c?: string) => c?.match(/^<(\w+)\/>$|^(\w+)\(\)$|^([A-Z_]+)$/)?.slice(1).find(Boolean) // 🔍 <X/> · x() · X_Y
  it.each(names)('%s: every code caption (full + compact) is a real export', (name) => {
    for (const b of [buildAbPlaygroundFullScene, buildAbPlaygroundCompactScene])
      for (const n of b(name, L, null).nodes) { const c = code(n.caption); if (c) expect(REAL.has(c), `${name}: ${n.caption}`).toBe(true) } // ✅
  })
  it('no v6 short names are left in any scene', () => {
    const h = names.map((name) => render({ name }) + render({ name, variant: 'compact' })).join('') // 🖨️
    expect(h).not.toMatch(/&lt;(AbProvider|Slot|Portal|Button|Switch|Tabs|Sheet|Avatar|BottomNav|ThemeProvider|Icon|Animate)\/?&gt;|>use(Theme|Media|Hotkey|LocalStorage|Mounted|Clipboard)</) // 🚫
  })
})
