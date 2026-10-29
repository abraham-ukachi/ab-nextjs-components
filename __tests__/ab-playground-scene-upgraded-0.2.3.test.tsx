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
* @file: __tests__/ab-playground-scene-upgraded-0.2.3.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 God 03:02: John's Welcome v6 UPGRADED scenes (upgraded/_src/build_upgraded.py + playground-spec.md rev 2)
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbPlaygroundScene, { buildAbPlaygroundCompactScene, buildAbPlaygroundFullScene, resolveAbPlaygroundSceneLabels, type AbPlaygroundSceneName } from '../ab-playground-scene'

const root = join(__dirname, '..') // 📁
const L = resolveAbPlaygroundSceneLabels() // 🌍
const render = (p: Parameters<typeof AbPlaygroundScene>[0]) => renderToStaticMarkup(createElement(AbPlaygroundScene, p)) // 🖨️
const caps = (name: AbPlaygroundSceneName, compact = false) => (compact ? buildAbPlaygroundCompactScene : buildAbPlaygroundFullScene)(name, L, null).nodes.map((n) => n.caption ?? '') // 🏷️

// 📋 spec rev 2 §3 captions (hub first), full + compact
const SPEC: Record<string, [string[], string[]]> = {
  core: [['ab-nextjs-core/ab-app-layout', 'AbPageProvider', 'AbLinearProgress', 'useAbAsideToggle()', 'AB_ASIDE_DURATION', 'supportedCore', 'AB_ASIDE_SHEET_QUERY'], ['', 'provider', 'useAbAsideToggle', 'AbLinearProgress']],
  components: [['supportedComponents', 'AbButton', 'AbTabs', 'AbSearchbar', 'AbBottomDrawer', 'AbLocaleSwitcher', 'AbVersionSwitcher'], ['', 'AbButton', 'AbTabs', 'AbVersionSwitcher']],
  theme: [['abTheme.colors', 'css/ab-tokens.css', '[data-theme]', 'css/{light,dark}{,-mc,-hc}.css', '--ab-radius-{chip,button,card,pill}', 'theme file', 'default export'], ['', '[data-theme]', 'tokens', 'theme file']],
  icons: [['abIconNames', 'abIconWeights', 'abIconDefaultWeight', 'getAbIconSvg()', 'AbIcon (ab-nextjs-components)', 'viewBox', 'typed names'], ['', '100–700', 'components', 'svg string']],
  fonts: [['mulishStyles', 'mulishStyles', 'interStyles', 'robotoMonoStyles', 'utility', 'utility', 'utility'], ['', 'titles', 'body', 'code']],
  animations: [['--ab-motion-ease-emphasized', 'AB_MOTION_TOKENS', 'ease-emphasized', 'supportedAnimations · 19', 'AB_REDUCED_MOTION_QUERY', 'pop-in', 'AB_WIRE_PULSE_CLASS'], ['', 'duration-medium', 'pop-in', 'AB_WIRE_PULSE_CLASS']],
  hooks: [['supportedHooks · 47', 'AbThemeMode', '(min-width:768px)', 'AbSwipeDirection', 'read / write', 'AB_CLIPBOARD_RESET_MS 2000', 'boolean'], ['', 'theme', 'media', 'gestures']],
}

describe('🎨 upgraded scenes: captions + rects as specced', () => {
  it.each(Object.keys(SPEC))('%s: full + compact captions (rev 2)', (name) => {
    expect(caps(name as AbPlaygroundSceneName)).toEqual(SPEC[name][0]) // 🖥️
    expect(caps(name as AbPlaygroundSceneName, true)).toEqual(SPEC[name][1]) // 📱
  })
  it.each(Object.keys(SPEC))('%s: mobile hub at y 122 / h 58, bottom caption right of the centre wire', (name) => {
    const c = buildAbPlaygroundCompactScene(name as AbPlaygroundSceneName, L, null).nodes
    expect(c[0]).toMatchObject({ y: 122, h: 58, tone: 'hub' }); expect(c[3]).toMatchObject({ x: 100, y: 212, captionAt: 'beside-centre' }) // 📱
  })
})

describe('🔁 4 states × 0.6s from ab-nextjs-animations (no keyframes in components)', () => {
  it('every package scene cycles with .ab-state-cycle-* (state 0 = the still) and imports its stylesheet', () => {
    for (const name of Object.keys(SPEC) as AbPlaygroundSceneName[]) expect(render({ name }), name).toMatch(/ab-state-cycle-(word|chip|hl|switch|fill|press|pop|ride)/) // 🎬
    const src = readFileSync(join(root, 'ab-playground-scene/upgraded.tsx'), 'utf8') // 📄
    expect(src).toContain("import 'ab-nextjs-animations/state-cycle/styles.css'") // 🎨
    for (const f of ['upgraded.tsx', 'styles.module.css', 'i18n.module.css']) expect(readFileSync(join(root, 'ab-playground-scene', f), 'utf8'), f).not.toMatch(/@keyframes|animation:/) // 🚫 local motion
  })
  it('core: App → Screen → Main → Aside highlights own slots 0–3, the aside dims in slot 2, toggle + progress', () => {
    const h = render({ name: 'core' })
    for (const i of [0, 1, 2, 3]) expect(h).toMatch(new RegExp(`ab-state-cycle-hl"(?: data-ab-still="")? style="--ab-state-cycle-index:${i}`)) // 🔦
    expect(h).toMatch(/layAsideWrap ab-state-cycle-dim" style="--ab-state-cycle-index:2"/) // 🌫️
    expect(h).toMatch(/ab-state-cycle-switch/); expect(h).toMatch(/ab-state-cycle-fill/) // 🔀 📏
  })
  it('chips: 3 tabs = the first owns slots 0 + 3, 2 chips = every other, 4 = one each', () => {
    const tabs = render({ name: 'components' })
    expect(tabs).toMatch(/class="ab-state-cycle-chip" data-ab-cycle="first-last" data-ab-still="" style="--ab-state-cycle-index:0">Preview</) // 3️⃣
    expect(render({ name: 'theme' })).toMatch(/data-ab-cycle="every-2" style="--ab-state-cycle-index:1">dark</) // 2️⃣
  })
  it('components: press, typing search, rising sheet; animations: pop + ride; icons: the real ab-nextjs-icons SVGs', () => {
    const c = render({ name: 'components' })
    expect(c).toMatch(/b1 ab-state-cycle-press/); expect(c).toMatch(/sheetPanel2 ab-state-cycle-rise/); expect(c).toContain('>Butto<') // 👆 ⬆️ ⌨️
    const a = render({ name: 'animations' }); expect(a).toMatch(/ab-state-cycle-pop/); expect(a).toMatch(/ab-state-cycle-ride/) // 🎈 🎢
    const i = render({ name: 'icons' }); expect((i.match(/<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="0 0 24 24"/g) ?? []).length).toBeGreaterThanOrEqual(12) // 🔣
    expect(i).toMatch(/stroke-width="2.8"/) // ⭐ weight 700
  })
  it('reduced motion: the still is state 0 (one still per cycle) and the forced switch is set', () => {
    const h = render({ name: 'hooks', reducedMotion: 'always' })
    expect(h).toMatch(/data-ab-reduced-motion="true"/) // ♿
    expect((h.match(/ab-state-cycle-word" data-ab-still=""/g) ?? []).length).toBe(4) // 🖼️ 4 cycles, one still each
  })
})

describe('🎨 colours (spec rev 2 §0 + God 03:05)', () => {
  const flow = readFileSync(join(root, 'ab-flow-diagram/styles.module.css'), 'utf8') // 🎨
  it('nodes read --ab-color-welcome-node (theme 0.3.7: #fff / #2a1f17); captions sit on a card chip', () => {
    expect(flow).toContain('--ab-flow-node: var(--ab-color-welcome-node, var(--ab-flow-card') // 🌞
    expect(flow).toContain('--ab-flow-node: var(--ab-color-welcome-node, #2a1f17)') // 🌙
    expect(flow).toMatch(/\.nodeCaption \{[^}]*background: var\(--ab-flow-card/) // 🏷️
  })
  it('the card edge reads on any aside (#fffcfa, #fff8f5 or #fff): 1px --line border + the v6 shadow', () => {
    expect(flow).toMatch(/\.framed \{[^}]*border-color: var\(--ab-flow-line[^}]*box-shadow: 0 30px 80px -30px/) // 🖊️ 🌫️
  })
})
