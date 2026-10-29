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
* @name: AbButton v6 lg + bronze (God 04:12)
* @file: __tests__/ab-button-v6-lg-bronze.test.tsx
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
// 🧪 0.2.3 (God 04:12): size="lg" + color="bronze" (v6 Welcome CTA), client AND server.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ClientButton from '../ab-button'
import ServerButton from '../server/ab-button'

const css = readFileSync(join(__dirname, '..', 'ab-button', 'styles.module.css'), 'utf8') // 📄 single source
const block = (sel: string, from = 0) => { const i = css.indexOf(sel + ' {', from); expect(i).toBeGreaterThan(-1); return css.slice(i, css.indexOf('}', i)) } // ✂️
const LG = '.abButton.abButton.abButton[data-size="lg"]'
const BR = '.abButton.abButton.abButton.abButton[data-color="bronze"]'

describe('size="lg" 📏', () => {
  it('mobile: 52px, 0 24px, radius 12px, 16px/600, gap 10px (tokens)', () => {
    const r = block(LG)
    for (const t of ['var(--ab-button-height-lg, 52px)', 'var(--ab-button-padding-inline-lg, 24px)', 'var(--ab-button-radius-lg, 12px)', 'var(--ab-button-font-size-lg, 16px)', 'var(--ab-button-font-weight-lg, 600)', 'var(--ab-button-gap-lg, 10px)', 'box-sizing: border-box']) expect(r).toContain(t)
  })
  it('laptop ≥ 1180px: 56px, 0 30px, 17px', () => {
    const m = css.indexOf('@media (width >= 1180px)'); expect(m).toBeGreaterThan(-1)
    const r = block(LG, m)
    for (const t of ['var(--ab-button-height-lg-laptop, 56px)', 'var(--ab-button-padding-inline-lg-laptop, 30px)', 'var(--ab-button-font-size-lg-laptop, 17px)']) expect(r).toContain(t)
  })
  it('comes after (and is more specific than) shape="rounded"', () => {
    expect(css.indexOf(LG)).toBeGreaterThan(css.indexOf('.abButton.abButton[data-shape="rounded"] {'))
  })
})
describe('color="bronze" 🥉', () => {
  it('v6 bg / fg / exact shadow via theme tokens', () => {
    const r = block(BR)
    expect(r).toContain('var(--ab-color-bronze, #a67c52)'); expect(r).toContain('var(--ab-color-on-bronze, #fff8f5)')
    expect(r).toContain('var(--ab-button-bronze-shadow, 0 8px 24px rgba(166, 124, 82, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2))') // ✨
  })
  it('has hover, active, focus-visible, disabled, reduced-motion', () => {
    for (const s of [':hover', ':active', ':focus-visible', ':is(:disabled, [aria-disabled="true"])']) expect(css).toContain(BR + (s.startsWith(':is') ? s : ''))
    expect(css).toMatch(/data-color="bronze"\]:not\(:disabled, \[aria-disabled="true"\]\):hover/)
    expect(css).toMatch(/data-color="bronze"\]:not\(:disabled, \[aria-disabled="true"\]\):active/)
    expect(css).toMatch(/data-color="bronze"\]:focus-visible \{\s*outline: 2px solid var\(--ab-button-bronze-focus-ring, var\(--ab-color-bronze-text/)
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{\s*\.abButton\.abButton\.abButton\.abButton\[data-color="bronze"\]:active \{ transform: none; \}/)
  })
  it('beats rounded+filled: quad class, placed later', () => {
    expect(css.indexOf(BR + ' {')).toBeGreaterThan(css.indexOf('.abButton.abButton[data-shape="rounded"][data-type="filled"] {'))
  })
})
describe('client + server render the same data-* 🧬', () => {
  for (const [name, C] of [['client', ClientButton], ['server', ServerButton]] as const) it(name, () => {
    const html = renderToStaticMarkup(createElement(C as any, { label: 'Get Started', type: 'filled', shape: 'rounded', size: 'lg', color: 'bronze' }))
    expect(html).toContain('data-size="lg"'); expect(html).toContain('data-color="bronze"')
  })
})
