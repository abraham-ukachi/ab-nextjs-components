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
* @name: 0.1.13 review + integration fixes (James, Joseph)
* @file: __tests__/review-0.1.13.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// @vitest-environment happy-dom

// 🧪 vitest
// 🧪 0.2.3 (Joseph 03:37): AbButton owns its box per type now that the theme skips `.AbButton`.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync(join(__dirname, '..', 'ab-button', 'styles.module.css'), 'utf8') // 📄
const rule = (sel: string) => { const i = css.indexOf(sel + ' {'); expect(i).toBeGreaterThan(-1); return css.slice(i, css.indexOf('}', i)) } // ✂️

describe('AbButton self-sizing tokens 📏', () => {
  it('base rule: border-box, 40px, 18/32, 6px 12px, radius 8px — all tokens', () => {
    const r = rule('.abButton[data-type]')
    for (const t of ['box-sizing: border-box', 'var(--ab-button-padding, 6px 12px)', 'var(--ab-button-font-size, 18px)', 'var(--ab-button-line-height, 32px)', 'var(--ab-button-height, 40px)', 'var(--ab-button-min-height, 40px)', 'var(--ab-button-radius, 8px)']) expect(r).toContain(t) // ✅
  })
  it('filled 6px 16px pill, outlined 8px 16px + 2px border', () => {
    expect(rule('.abButton[data-type="filled"]')).toMatch(/6px 16px[\s\S]*999px/) // 💊
    expect(rule('.abButton[data-type="outlined"]')).toMatch(/8px 16px[\s\S]*border: 2px solid/) // ➖
  })
  it('≥ 460px: 8px 16px + 20px like the theme', () => {
    expect(css).toMatch(/@media \(width >= 460px\) \{\s*\.abButton\[data-type\] \{ padding: var\(--ab-button-padding, 8px 16px\); font-size: var\(--ab-button-font-size, 20px\)/) // 🖥️
  })
  it('rounded + size modes stay more specific (doubled class) and come after', () => {
    expect(css).toContain('.abButton.abButton[data-shape="rounded"]') // 🔵
    expect(css).toContain('.abButton.abButton[data-size="md"]') // 📏
  })
})
