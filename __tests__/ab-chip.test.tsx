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
* @name: AbChip / AbPill - Tests (G36)
* @file: __tests__/ab-chip.test.tsx
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
// 🖨️ static render (both are server components)
import { renderToStaticMarkup } from 'react-dom/server'
// 🏷️ under test
import AbChip from '../ab-chip'
import AbPill from '../ab-pill'

describe('AbChip / AbPill (G36)', () => {
  it('chips are static text with decorative dots, and can be list items', () => {
    const html = renderToStaticMarkup(<ul><AbChip as="li" dot>Tokens</AbChip><AbChip as="li" dot="sage" icon={<svg />}>Live</AbChip></ul>) // 🖨️
    expect(html.match(/<li /g)).toHaveLength(2) // 🧱 list semantics
    expect(html).toContain('data-tone="bronze"') // 🥉 dot=true
    expect(html).toContain('data-tone="sage"') // 🌿
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(3) // 🙈 2 dots + 1 icon
    expect(html).not.toMatch(/<button|tabindex|role=/) // 🚫 never interactive
  })
  it('pill renders an eyebrow with optional mono + sage dot', () => {
    const html = renderToStaticMarkup(<AbPill dot="sage" mono>ab-nextjs-core</AbPill>) // 🖨️
    expect(html).toContain('data-ab-part="pill"') // 🗂️
    expect(html).toContain('ab-nextjs-core') // 🏷️
    expect(html).toContain('data-tone="sage"') // 🌿
  })
})

// 🏠 0.1.14 (P16): the Home chips (version, count, New, beta)
import { readFileSync as readCss } from 'node:fs'
import { join as joinPath } from 'node:path'
describe('AbChip 0.1.14: size="sm" · shape="rounded" · mono · tone (P16) 🏷️', () => {
  it('emits the data hooks only when asked', () => {
    const html = renderToStaticMarkup(<AbChip size="sm" shape="rounded" mono tone="sage">beta</AbChip>)
    expect(html).toContain('data-size="sm"'); expect(html).toContain('data-shape="rounded"'); expect(html).toContain('data-mono="true"'); expect(html).toContain('data-tone="sage"')
    expect(renderToStaticMarkup(<AbChip>x</AbChip>)).not.toMatch(/data-(size|shape|tone|mono)=/) // 🫥 legacy
  })
  it('CSS: 20px, padding 0 7, radius 6, 11/600, tint/accent-text, sage', () => {
    const css = readCss(joinPath(__dirname, '..', 'ab-chip/styles.module.css'), 'utf8')
    expect(css).toMatch(/height: var\(--ab-chip-height, 20px\)/); expect(css).toMatch(/padding: 0 var\(--ab-chip-padding-inline, 7px\)/)
    expect(css).toMatch(/border-radius: var\(--ab-radius-chip, 6px\)/); expect(css).toMatch(/font-size: 11px; font-weight: 600; line-height: 1;/)
    expect(css).toMatch(/\[data-tone='accent'\] \{ background: var\(--ab-color-tint, #f4e7db\); color: var\(--ab-color-accent-text/)
    expect(css).toMatch(/\[data-tone='sage'\] \{ background: rgb\(119 141 121 \/ 0\.12\); color: var\(--ab-color-sage-accent, #566a58\)/) // ♿ John: AA sage
  })
})
