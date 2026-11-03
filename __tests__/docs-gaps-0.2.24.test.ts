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
* @name: Joseph 0.2.24 docs gaps (AbCodeBlock scheme, header crumbs + search)
* @file: __tests__/docs-gaps-0.2.24.test.ts
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
// 📁 fs + path
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 📖 no comments
const ruleOf = (css: string, sel: string) => { const i = css.indexOf(`${sel} {`); return i < 0 ? '' : css.slice(i, css.indexOf('}', i)) } // 🎯

// 🌑 gap 3: the dark code surface tells the UA it is dark
describe('🌑 gap 3: AbCodeBlock color-scheme', () => {
  it('.abCodeBlock sets color-scheme: dark next to the code surface', () => {
    const rule = ruleOf(read('ab-code-block/styles.module.css'), '.abCodeBlock') // 🔍
    expect(rule).toContain('--ab-color-code-surface') // 🎨
    expect(rule).toMatch(/color-scheme: dark;/) // 🌑
  })
})
