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
* @name: AbBreadcrumbs 24px targets - Tests (0.3.4)
* @file: __tests__/breadcrumbs-target-0.3.4.test.ts
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

const css = readFileSync(join(__dirname, '..', 'ab-breadcrumbs/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 📖 no comments
const rule = css.slice(css.indexOf('.abCrumbLink,\n.abCrumbCurrent {'), css.indexOf('}', css.indexOf('.abCrumbLink,\n.abCrumbCurrent {'))) // 🎯 the shared rule

// 👆 QA (0.2.24 docs): WCAG 2.5.8 target size (minimum) = 24×24 CSS px
describe('👆 AbBreadcrumbs crumbs are ≥ 24×24', () => {
  it('links and the current crumb share one sizing rule', () => expect(rule.length).toBeGreaterThan(0)) // ✅
  it('min-width + min-height 24px', () => {
    expect(rule).toMatch(/min-width: 24px;/) // ↔️
    expect(rule).toMatch(/min-height: 24px;/) // ↕️
  })
  it('an inline-flex box (min sizes apply to inline links) with the text centred', () => {
    expect(rule).toMatch(/display: inline-flex;/) // 📐
    expect(rule).toMatch(/align-items: center;/) // ↕️
  })
})
