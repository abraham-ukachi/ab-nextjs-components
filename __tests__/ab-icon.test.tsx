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
* @name: AbIcon - Tests (G2)
* @file: __tests__/ab-icon.test.tsx
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
// 🖨️ static render
import { renderToStaticMarkup } from 'react-dom/server'
// 📄 read the client source to guard the bundle
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// 🔣 twins under test
import AbIcon, { AB_ICON_WEIGHT_STROKE, getAbIconStroke, registerAbIcons } from '../ab-icon'
// 🗺️ the real table (test-only import of the full map)
import { abIconWeightStroke } from 'ab-nextjs-icons/ab-icons'
import ServerAbIcon from '../server/ab-icon'

// 📁 package root
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// 🧾 a tiny fake icon
const dot = { outlined: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.25"/></svg>', filled: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>' }

describe('AbIcon client (G2)', () => {
  it('never imports the full icon map (client bundle budget)', () => {
    const src = ['ab-icon/index.tsx', 'ab-icon/helpers.ts', 'ab-icon/builtin.ts'].map((f) => readFileSync(join(root, f), 'utf8')).join('\n') // 📄
    const icons = [...src.matchAll(/^import[^\n]*from ['"](ab-nextjs-icons[^'"]*)['"]/gm)].map((m) => m[1]) // 🔍 real imports
    expect(icons.length).toBeGreaterThan(0) // 🗂️ built-ins come from per-icon modules
    for (const spec of icons) expect(spec).toMatch(/^ab-nextjs-icons\/ab-icons\/icons\/[a-z0-9_]+$/) // 🚫 never the map / root
  })
  it('renders an svg prop, decorative by default, named with label', () => {
    const off = renderToStaticMarkup(<AbIcon name="dot" svg={dot} />) // 🙈
    expect(off).toContain('aria-hidden="true"') // ✅
    expect(off).toContain('<circle') // 🖼️
    expect(off).toContain('--ab-icon-size:24px') // 📏 default
    const on = renderToStaticMarkup(<AbIcon name="dot" svg={dot} label="Status" size={20} weight={400} />) // 🖼️
    expect(on).toContain('role="img"') // ♿
    expect(on).toContain('aria-label="Status"') // 🏷️
    expect(on).toContain('--ab-icon-stroke:1.85') // 📏 400
    expect(on).toContain('--ab-icon-size:20px') // 📐
  })
  it('uses the registry, filled variant, and falls back to the font for unknown names', () => {
    registerAbIcons({ reg_dot: dot }) // 🗂️
    expect(renderToStaticMarkup(<AbIcon name="reg_dot" filled />)).toContain('fill="currentColor"') // ⬛ legacy filled
    const fb = renderToStaticMarkup(<AbIcon name="not_an_icon" title="Old" />) // 🕰️
    expect(fb).toContain('data-ab-icon-fallback="font"') // 🔎
    expect(fb).toContain('material-symbols-rounded') // 🔤
    expect(fb).toContain('aria-label="Old"') // ♿ legacy title still names it
  })
  it('stroke table matches ab-nextjs-icons exactly', () => {
    expect(AB_ICON_WEIGHT_STROKE).toEqual(abIconWeightStroke) // 🔒 no drift
  })
  it('built-ins render as SVG with no registration by the app', () => {
    for (const name of ['arrow_back', 'arrow_forward', 'light_mode', 'dark_mode', 'computer', 'language', 'content_copy', 'check']) {
      expect(renderToStaticMarkup(<AbIcon name={name} />), name).toContain('<svg') // ✅ no font fallback
    }
  })
  it('snaps weights to the nearest stroke', () => {
    expect(getAbIconStroke()).toBe(1.25) // 🧭 200
    expect(getAbIconStroke(680)).toBe(2.85) // 🎯 nearest 700
  })
})

describe('AbIcon server (G2)', () => {
  it('renders any AbIcons name from the full map (zero client JS)', () => {
    const html = renderToStaticMarkup(<ServerAbIcon name="arrow_back" />) // 🖨️
    expect(html).toContain('<svg') // ✅ real SVG
    expect(html).toContain('data-icon="arrow_back"') // 🗂️
    expect(html).not.toContain('material-symbols') // 🚫 no font
    expect(renderToStaticMarkup(<ServerAbIcon name="computer" variant="filled" />)).toContain('<svg') // ⬛
  })
})
