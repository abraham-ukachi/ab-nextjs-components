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
* @name: AbPlaygroundScene i18n + reduced-motion stills (0.2.3)
* @file: __tests__/ab-playground-scene-i18n-0.2.3.test.tsx
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
import AbPlaygroundScene, { buildAbPlaygroundCompactScene, buildAbPlaygroundFullScene, resolveAbPlaygroundSceneLabels, type AbPlaygroundSceneName } from '../ab-playground-scene'

const root = join(__dirname, '..')
const css = readFileSync(join(root, 'ab-playground-scene/i18n.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹
const L = resolveAbPlaygroundSceneLabels()
const render = (p: Parameters<typeof AbPlaygroundScene>[0]) => renderToStaticMarkup(createElement(AbPlaygroundScene, p))
const words = (h: string) => [...h.matchAll(/class="word[^"]*"(?: data-ab-still="")?[^>]*>([^<]+)</g)].map((m) => (m[0].includes('data-ab-still') ? `*${m[1]}` : m[1]).replace(/&quot;/g, '"')) // 🔍 * = still

describe('🌍 i18n scene (John’s illustration 8, build_i18n.py)', () => {
  it('full: John’s rects (hub 230,270 300×104 + 6 nodes) and captions', () => {
    const n = buildAbPlaygroundFullScene('i18n', L, null).nodes
    expect(n.map((x) => [x.x, x.y, x.w, x.h])).toEqual([[230, 270, 300, 104], [40, 100, 210, 96], [290, 116, 180, 60], [510, 104, 210, 84], [40, 456, 210, 74], [290, 456, 180, 74], [510, 456, 210, 74]]) // 🎯
    expect(n.map((x) => x.caption)).toEqual(['provider', 'messages', '<AbLocaleSwitcher/>', 'useAbTranslations()', '<AbLocalePrefix/>', 'Intl format', 'getAbAlternates()']) // 🏷️
  })
  it('compact: hub 80,136 190×56 + switcher / prefix / translations', () => {
    const n = buildAbPlaygroundCompactScene('i18n', L, null).nodes
    expect(n.map((x) => [x.x, x.y, x.w, x.h])).toEqual([[80, 136, 190, 56], [14, 62, 150, 52], [186, 62, 150, 52], [100, 212, 150, 50]]) // 📱
    expect(n.map((x) => x.caption)).toEqual([undefined, 'switcher', 'prefix', 'translations']) // 🏷️
  })
  it('the greeting + t("hello") value cycle EN FR ES RU; the still frame is EN by default', () => {
    const h = render({ name: 'i18n' })
    expect(words(h)).toEqual(['*"Hello"', '"Bonjour"', '"Hola"', '"Привет"', '*Hello', 'Bonjour', 'Hola', 'Привет']) // 👋 the value node first, the hub renders last
    expect(h).toMatch(/lang="ru"/); expect(h).toMatch(/>EN<.*>FR<.*>ES<.*>RU</) // 🌍 🎚️
    expect(h).toMatch(/--ab-locale-cycle-index:3/) // ⏱️ slot 3 = 1.8s
  })
  it('locale= picks the still locale (spec: show the active locale only)', () => {
    const h = render({ name: 'i18n', locale: 'fr-FR' })
    expect(words(h).filter((w) => w.startsWith('*'))).toEqual(['*"Bonjour"', '*Bonjour']) // 🇫🇷
    expect(h).toMatch(/class="chip[^"]*ab-locale-cycle-chip" data-ab-still="" style="--ab-locale-cycle-index:1">FR</) // 🥉
  })
  it('every word is translatable: alt, captions, prefix, Intl format, greetings', () => {
    const h = render({ name: 'i18n', labels: { alt: { i18n: 'Scène i18n' }, provider: 'fournisseur', prefix: 'préfixe', intlFormat: 'format Intl', greetings: { en: 'Hi' } } })
    expect(h).toMatch(/aria-label="Scène i18n"/); expect(h).toMatch(/>fournisseur</); expect(h).toMatch(/>préfixe</); expect(h).toMatch(/>format Intl</); expect(h).toMatch(/>Hi</) // 🇫🇷
    expect(h).not.toMatch(/placeholder|>de\.json</) // 🧹 the old placeholder is gone
  })
  it('reducedMotion="always" sets the forced-still switch; Mulish + Roboto Mono via the theme tokens', () => {
    expect(render({ name: 'i18n', reducedMotion: 'always' })).toMatch(/data-ab-reduced-motion="true"/) // ♿
    expect(css).toMatch(/font-family: var\(--ab-font-title, 'Mulish', sans-serif\); font-weight: 700/) // 🔤
    expect(css).toMatch(/var\(--ab-font-code, 'Roboto Mono'/) // 💻
  })
  it('motion comes from ab-nextjs-animations/locale-cycle (God 02:26): classes + slot index, no local keyframes', () => {
    const h = render({ name: 'i18n' })
    expect(h).toMatch(/class="word[^"]*ab-locale-cycle-word"/); expect(h).toMatch(/class="chip[^"]*ab-locale-cycle-chip"/) // 🎬
    const tsx = readFileSync(join(root, 'ab-playground-scene/i18n.tsx'), 'utf8') // 📄
    expect(tsx).toContain("import 'ab-nextjs-animations/locale-cycle/styles.css'") // 🎨
    expect(css).not.toMatch(/@keyframes|animation/) // 🚫 no motion left in the module
    expect(css).toMatch(/--ab-locale-cycle-duration: var\(--ab-wire-pulse-duration, 2400ms\)/) // ⏱️ follows `duration`
  })
})

describe('♿ every scene’s reduced-motion still = spec t = 0.45 (wire i at 0.45 + i/n)', () => {
  const names: AbPlaygroundSceneName[] = ['core', 'components', 'theme', 'icons', 'fonts', 'animations', 'hooks', 'i18n']
  it.each(names)('%s: each wire gets its own poster (6 laptop wires: 55, 38.33, 21.67, 5, 88.33, 71.67)', (name) => {
    const h = render({ name })
    const posters = [...h.matchAll(/<g style="--ab-wire-index:(\d+);--ab-wire-poster:([\d.]+)"/g)].map((m) => +m[2])
    expect(posters).toEqual([55, 38.33, 21.67, 5, 88.33, 71.67]) // 📍 100 − ((0.45 + i/6) mod 1)·100
  })
  it('compact (3 wires): 55, 21.67, 88.33', () => {
    expect([...render({ name: 'hooks', variant: 'compact' }).matchAll(/<g style="--ab-wire-index:\d+;--ab-wire-poster:([\d.]+)"/g)].map((m) => +m[1])).toEqual([55, 21.67, 88.33]) // 📱
  })
  it('animations: the ease dot stills at 60% of the curve (t 0.45 / 0.75), wires still drawn by ab-nextjs-animations', () => {
    expect(render({ name: 'animations' })).toMatch(/class="easeDot ab-wire-pulse" style="stroke-width:14;--ab-wire-poster:40/) // 🎬
  })
})
