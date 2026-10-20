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
* @name: Home fidelity variants 0.1.14 - Tests (P4–P19)
* @file: __tests__/home-variants-0.1.14.test.tsx
* @type: Vitest suite
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// @vitest-environment happy-dom
// 🏠 Joseph's P-items, one describe per item (values = the Home fidelity spec §4, measured in WebKit by
//    /workspace/home-shell/verify-fidelity/run-variants.cjs). Every block lands in the same commit as its change.
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbSearchTrigger from '../ab-search-trigger'

const css = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8') // 📄
afterEach(cleanup) // 🧹

// 🔎 P6
describe('P6 AbSearchTrigger variant="field" · size="sm" 🔎', () => {
  it('field: data hook, 18px icon, one "Ctrl K" cap on the server, label visible', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger variant="field" label="Search docs…" onOpen={() => {}} />)
    expect(html).toContain('data-variant="field"')
    expect(html).toMatch(/<kbd[^>]*>Ctrl K<\/kbd>/) // ⌨️ one cap (⌘ K on Apple after hydration)
    expect(html).toContain('Search docs…')
  })
  it('sm: "Search" + "CtrlK" cap, no space', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger size="sm" onOpen={() => {}} />)
    expect(html).toContain('data-size="sm"'); expect(html).toMatch(/<kbd[^>]*>CtrlK<\/kbd>/)
  })
  it('coming soon stays out of the field: tooltip + SR text only', () => {
    const { container } = render(<AbSearchTrigger variant="field" label="Search docs…" comingSoon />)
    const el = container.querySelector('[data-ab-part="search-trigger"]')!
    expect(el.getAttribute('title')).toBe('Coming soon') // 💬
    expect(el.textContent).toContain(', Coming soon') // 🗣️ announced
    expect(el.querySelector('[class*="Soon"]')).toBeNull() // 🚫 no painted tag
  })
  it('CSS: 36px, padding 0 6 0 10, radius 10, 13.5px faint; sm 34px pill; cap 20px radius 5 + 2px bottom', () => {
    const s = css('ab-search-trigger/styles.module.css')
    expect(s).toMatch(/width: var\(--ab-search-trigger-width, 300px\); max-width: 100%; height: 36px;/)
    expect(s).toMatch(/gap: 8px; padding: 0 6px 0 10px;/); expect(s).toMatch(/border-radius: var\(--ab-radius-button, 10px\);/)
    expect(s).toMatch(/font-size: 13\.5px;/); expect(s).toMatch(/height: 34px;/); expect(s).toMatch(/gap: 6px; padding: 0 6px 0 10px;/)
    expect(s).toMatch(/min-width: 20px; height: 20px; padding: 0 5px; margin-left: 2px;/); expect(s).toMatch(/border-bottom-width: 2px; border-radius: var\(--ab-radius-kbd, 5px\);/)
  })
})
