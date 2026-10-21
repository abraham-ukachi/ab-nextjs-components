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
* @name: AbPackageCard Home previews tests (0.2.1)
* @file: __tests__/package-card-previews.test.tsx
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
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbPackageCard, { AbPackagePreviewCode, AbPackagePreviewComponents, AbPackagePreviewCurve } from '../ab-package-card'

const css = readFileSync(join(__dirname, '../ab-package-card/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🎨
const rule = (sel: string) => (css.match(new RegExp(`\\.${sel} \\{([^}]*)\\}`)) ?? [])[1] ?? '' // 🔍 one rule body

describe('🖼️ Home preview tiles (God 02:44, mock .pv-*)', () => {
  it('〰️ Animations: axes, the mock ease-out curve, end dots and the "ease-out" label', () => {
    const h = renderToStaticMarkup(<AbPackagePreviewCurve />)
    expect(h).toContain('d="M6 38 C 50 38, 58 6, 114 6"') // 〰️ the mock path
    expect(h.match(/<line /g)).toHaveLength(2); expect(h.match(/<circle /g)).toHaveLength(2) // ➖ 🔴
    expect(h).toContain('>ease-out<') // 🏷️
    expect(rule('pvEase')).toMatch(/position: absolute; right: 10px; bottom: 6px; font: 500 9\.5px/) // 📐 bottom right
    expect(rule('pvCrv')).toMatch(/stroke-width: 2\.2/) // 〰️
  })
  it('🪝🧱 Hooks / Core: left-aligned, 500 weight mono, keywords coloured, dim lines faint', () => {
    const h = renderToStaticMarkup(<AbPackagePreviewCode lines={['*use*Theme()', '*use*Media()']} />)
    expect(h).toContain('<span><b>use</b>Theme()</span>') // 🖍️
    const c = renderToStaticMarkup(<AbPackagePreviewCode lines={['<*AbProvider*>', '~  {children}']} />)
    expect(c).toContain('&lt;<b>AbProvider</b>&gt;'); expect(c).toMatch(/class="[^"]*pvDim[^"]*">\u00a0\u00a0\{children\}/) // 🌫️ indent kept
    expect(rule('pvCode')).toMatch(/align-items: flex-start;.*text-align: left; font: 500 11\.5px/) // ⬅️ + bold-ish
    expect(rule('pvCode b')).toMatch(/color: var\(--ab-color-accent-text[^;]*; font-weight: 600/) // 🎨
  })
  it('🧩 Components: button (6px radius kept), switch and pill chip, no stretch, centred', () => {
    const h = renderToStaticMarkup(<AbPackagePreviewComponents />)
    expect(h).toMatch(/>Button<.*<i><\/i>.*>Chip</) // 🔘🎚️💊
    expect(rule('homePreview > \\*')).toMatch(/flex: none/) // 🚫 stretch
    expect(rule('pvComp')).toMatch(/display: inline-flex; align-items: center; justify-content: center/) // 🎯
    expect(rule('pvBtn')).toMatch(/border-radius: 6px/); expect(rule('pvChip')).toMatch(/border-radius: 999px/) // 🔲 💊
    expect(rule('homePreview')).toMatch(/align-items: center; justify-content: center/) // 🎯 both ways
  })
  it('🏠 drops into AbPackageCard `preview` (aria-hidden tile)', () => {
    const h = renderToStaticMarkup(<AbPackageCard name="ab-nextjs-animations" title="Animations" href="/a" preview={<AbPackagePreviewCurve />} />)
    expect(h).toMatch(/aria-hidden="true"><span[^>]*data-ab-part="preview-curve"/) // ✅
  })
  it('🌍 0.2.2 labels: English defaults unchanged, labels win, legacy props still work', () => {
    const d = renderToStaticMarkup(<AbPackagePreviewComponents />)
    expect(d).toMatch(/>Button<.*aria-label="Switch".*>Chip</) // 🇬🇧 defaults
    const fr = renderToStaticMarkup(<AbPackagePreviewComponents labels={{ button: 'Bouton', chip: 'Puce', switch: 'Interrupteur' }} />)
    expect(fr).toMatch(/>Bouton<.*aria-label="Interrupteur".*>Puce</) // 🇫🇷
    expect(renderToStaticMarkup(<AbPackagePreviewComponents chip="Tag" />)).toContain('>Tag<') // 🕰️ 0.2.1 prop
    expect(renderToStaticMarkup(<AbPackagePreviewComponents chip="Tag" labels={{ chip: 'Puce' }} />)).toContain('>Puce<') // 🥇 labels win
    expect(renderToStaticMarkup(<AbPackagePreviewComponents labels={{ button: 'Go' }} />)).toMatch(/>Go<.*>Chip</) // 🧩 partial
  })
})
