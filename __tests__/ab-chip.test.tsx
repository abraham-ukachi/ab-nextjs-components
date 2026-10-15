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
