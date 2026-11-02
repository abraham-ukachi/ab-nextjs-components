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
* @name: 44px tap targets (0.2.23 gaps) - Tests (0.3.2)
* @file: __tests__/tap-targets-0.3.2.test.ts
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
// 📁 fs + path: the CSS modules are read as text (happy-dom has no layout)
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8') // 📖 one stylesheet
// 🔎 the declarations of the first (or last) rule whose selector list is exactly `sel`
const rule = (src: string, sel: string, last = false): string => {
  const i = last ? src.lastIndexOf(`\n${sel} {`) : src.indexOf(`${sel} {`) // 📍 the rule start (`last` = the later override)
  expect(i, sel).toBeGreaterThanOrEqual(0) // ✅ it exists
  return src.slice(i, src.indexOf('}', i)) // ✂️ up to its closing brace
}
const px = (decls: string, prop: string) => Number(decls.match(new RegExp(`(?:^|[\\s;{])${prop}:\\s*(-?[\\d.]+)px`))?.[1]) // 🔢 a px value

// 👆 God (0.2.23 gaps): every tap target in the mobile chrome is at least 44px (WCAG 2.5.5)
describe('👆 44px tap targets', () => {
  it('AbNavbar items: min-height 44px (was ~42px with indicator="none")', () => {
    expect(px(rule(css('ab-navbar/styles.module.css'), '.abNavbarLink'), 'min-height')).toBeGreaterThanOrEqual(44) // 📏
  })
  it('AbMobileHeader logo link: 44px tall (was 25px)', () => {
    expect(px(rule(css('ab-drawer/kit.module.css'), '.logoRow a'), 'min-block-size')).toBeGreaterThanOrEqual(44) // 📏
  })
  it('AbSearchTrigger size="sm": the 34px pill gets a 44px hit area (6px above + below, 0.3.3)', () => {
    const src = css('ab-search-trigger/styles.module.css') // 📖
    const sm = rule(src, ".abSearchTrigger[data-size='sm']") // 🎯
    expect(px(sm, 'height')).toBe(34) // 👀 the look is unchanged
    expect(sm).toContain('position: relative') // 📌 anchors the hit area
    const hit = rule(src, ".abSearchTrigger[data-size='sm']::after") // 🫥
    const [block] = hit.match(/inset:\s*(-?[\d.]+)px/)!.slice(1).map(Number) // ↕️ the block inset
    expect(block).toBe(-6) // 📏 0.3.3: 6px above + below (was 5)
    expect(34 - 2 * block).toBeGreaterThanOrEqual(44) // ✅ 34 + 6 + 6 = 46
  })
  it('AbThemeToggle variant="icon": 44×44 (was 40), default and thumb', () => {
    const src = css('ab-theme-toggle/styles.module.css') // 📖
    const base = src.slice(src.indexOf('\n.icon {\n  width'), src.indexOf('}', src.indexOf('\n.icon {\n  width'))) // 🔘 the icon button's own 0.3.2 size rule
    expect(px(base, 'width')).toBe(44); expect(px(base, 'height')).toBe(44) // 📏
    const thumb = rule(src, ".icon[data-appearance='thumb']") // 🌗 P7
    expect(px(thumb, 'width')).toBe(44); expect(px(thumb, 'height')).toBe(44) // 📏
  })
  it("AbMobileHeader's own buttons stay 44×44 (the reference size)", () => {
    const ib = rule(css('ab-drawer/kit.module.css'), '.ibtn') // 🔘
    expect(px(ib, 'inline-size')).toBe(44); expect(px(ib, 'block-size')).toBe(44) // 📏
  })
})

// 👆 0.3.2 (God): the sm toggle + every segmented radio get an invisible 44×44 hit area (visuals unchanged)
describe('👆 AbThemeToggle hit areas', () => {
  const src = css('ab-theme-toggle/styles.module.css') // 📖
  const hit = src.slice(src.indexOf('.segment::after,'), src.indexOf('}', src.indexOf('.segment::after,'))) // 🫥 the shared ::after rule
  it('covers the segments and the sm icon button', () => {
    expect(hit).toContain(".icon[data-size='sm']::after") // 🔘 sm
    expect(px(hit, 'width')).toBe(44); expect(px(hit, 'height')).toBe(44) // 📏 44×44
    expect(hit).toContain('transform: translate(-50%, -50%)') // 🎯 centred
    expect(hit).toContain("content: ''") // 🫥 drawn, but empty
  })
  it('the segments are positioned so the area anchors to them', () => {
    expect(src).toMatch(/\.segment,\s*\.icon \{\s*position: relative;/) // 📌
  })
  it('the visuals keep their sizes (40 / 32 / 28px)', () => {
    expect(src).toMatch(/\[data-size='sm'\] \.segment,\s*\.icon\[data-size='sm'\] \{\s*width: 32px;/) // 📏 sm
    expect(src).toMatch(/\.group\[data-appearance='thumb'\] \.segment \{ width: 28px; height: 28px;/) // 📏 thumb
  })
})
