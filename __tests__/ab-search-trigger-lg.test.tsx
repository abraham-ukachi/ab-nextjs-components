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
* @name: AbSearchTrigger size="lg" - Tests (404 gaps)
* @file: __tests__/ab-search-trigger-lg.test.tsx
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
// ⚛️ SSR render
import { renderToStaticMarkup } from 'react-dom/server'
// 🔎 under test
import AbSearchTrigger from '../ab-search-trigger'
// 📁 CSS check
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('AbSearchTrigger size="lg" 🔍', () => {
  it('marks data-size="lg" and uses the Home field content (one key cap, 20px icon)', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger size="lg" label="Search docs…" onOpen={() => {}} />) // 🔍
    expect(html).toContain('data-size="lg"') // 🗂️
    expect(html).toContain('data-ab-part="search-label"') // 🏠 field content
    expect(html).toContain('--ab-icon-size:20px') // 🔣 bigger glyph
  })
  it('md stays unmarked (no regression)', () => {
    expect(renderToStaticMarkup(<AbSearchTrigger onOpen={() => {}} />)).not.toContain('data-size') // ✅
  })
  it('CSS: lg is 44px tall and up to 440px wide', () => {
    const css = readFileSync(join(__dirname, '../ab-search-trigger/styles.module.css'), 'utf8') // 🎨
    expect(css).toMatch(/\[data-size='lg'\] \{[^}]*height: 44px/) // 📏
    expect(css).toContain('min(440px, 100%)') // 📏
  })
})
