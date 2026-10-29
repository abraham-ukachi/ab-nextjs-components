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
* @name: AbMobileHeader barAt (0.2.3)
* @file: __tests__/mobile-header-bar-at-0.2.3.test.tsx
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
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbMobileHeader from '../ab-mobile-header'

afterEach(() => cleanup())
const css = readFileSync(join(__dirname, '..', 'ab-drawer/kit.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹
const block = css.slice(css.indexOf('@media (min-width: 768px) {\n  .mh[data-ab-bar-at')) // 📐 the barAt block

describe('📱 AbMobileHeader barAt (Joseph, Welcome 0.2.21)', () => {
  it('server HTML carries data-ab-bar-at (default "auto"), so CSS decides without JS', () => {
    expect(renderToStaticMarkup(<AbMobileHeader logo="x" row={<span>1</span>} />)).toMatch(/data-ab-bar-at="auto"/) // 🖨️
    expect(renderToStaticMarkup(<AbMobileHeader logo="x" barAt="mobile" row={<span>1</span>} />)).toMatch(/data-ab-bar-at="mobile"/)
  })
  it('CSS ≥768px: "mobile" hides the bar, the row stays', () => {
    expect(block).toMatch(/\.mh\[data-ab-bar-at='mobile'\] > \.mhBar,/) // 🙈
  })
  it('CSS ≥768px: "auto" hides it only inside core mainHeaderAt="all" (back-compat elsewhere)', () => {
    expect(block).toMatch(/\[data-main-header-at='all'\] \.mh\[data-ab-bar-at='auto'\] > \.mhBar \{ display: none; \}/) // 🔗 core's attribute
    expect(block).not.toMatch(/\.mh\[data-ab-bar-at='all'\]/) // ✅ 'all' never hides
  })
  it('without a row, a hidden bar hides the whole header (nothing left to show)', () => {
    expect(block).toMatch(/\.mh\[data-ab-bar-at='mobile'\]:not\(\.mhStack\),/) // 🫥
  })
})
