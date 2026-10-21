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
* @name: AbTocPromo tests (0.2.1)
* @file: __tests__/ab-toc-promo.test.tsx
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
import AbTocPromo from '../ab-toc/promo'
import * as pkg from '../index'

const css = readFileSync(join(__dirname, '../ab-toc/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🎨
const rule = (sel: string) => (css.match(new RegExp(`\\.${sel} \\{([^}]*)\\}`)) ?? [])[1] ?? '' // 🔍

describe('🆕 AbTocPromo, the aside "New" box (God 02:44, mock .toc-card)', () => {
  it('renders the chip, the title and the subtitle; server-safe', () => {
    const h = renderToStaticMarkup(<AbTocPromo title="BottomNav & Sheet">Now in <code>ab-nextjs-components</code></AbTocPromo>)
    expect(h).toMatch(/>New<.*BottomNav &amp; Sheet.*<small[^>]*>Now in <code>ab-nextjs-components<\/code><\/small>/) // ✅
    expect(renderToStaticMarkup(<AbTocPromo title="x" badge={null} />)).not.toContain('>New<') // 🚫 chip
  })
  it('rounded, evenly padded container on the card colour', () => {
    const r = rule('abTocPromo').replace(/\s+/g, ' ') // 🧹
    expect(r).toMatch(/padding: 12px;/); expect(r).toMatch(/border-radius: 12px;/) // 📦 🔲
    expect(r).toMatch(/background: var\(--ab-color-card/); expect(r).toMatch(/gap: 6px/) // 🎨
  })
  it('a smaller title (13px) and a relatively smaller subtitle (11.5px, code 10.5px)', () => {
    expect(rule('abTocPromoTitle')).toMatch(/font-size: 13px/) // 🏷️
    expect(rule('abTocPromoText')).toMatch(/font-size: 11\.5px/) // 📝
    expect(rule('abTocPromoText code')).toMatch(/font-size: 10\.5px/) // ⌨️
  })
  it('href = a link over the whole card; exported', () => {
    expect(renderToStaticMarkup(<AbTocPromo title="T" href="/changelog" />)).toContain('href="/changelog"') // 🔗
    expect(pkg.AbTocPromo).toBe(AbTocPromo) // 📦
  })
})
