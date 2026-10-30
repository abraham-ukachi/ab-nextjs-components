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
* @name: AbCard icon tile · arrow · bold title - Tests (404 gaps)
* @file: __tests__/ab-card-404.test.tsx
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
// 🃏 under test
import AbCard from '../ab-card'

describe('AbCard 404 gaps 🃏', () => {
  it('renders nothing new by default (additive props)', () => {
    const html = renderToStaticMarkup(<AbCard title="Getting started" href="/docs" />) // 🃏
    expect(html).not.toContain('icon-tile') // 🚫 tile
    expect(html).not.toContain('data-arrow') // 🚫 arrow
    expect(html).not.toContain('abCardTitleBold') // 🚫 bold
  })
  it('iconTile renders a decorative tinted tile', () => {
    const html = renderToStaticMarkup(<AbCard title="T" iconTile={<svg data-x="1" />} />) // 🟫
    expect(html).toMatch(/<span class="abCardIconTile" data-ab-part="icon-tile" aria-hidden="true"><svg data-x="1"><\/svg><\/span>/) // ✅
  })
  it('arrow adds a trailing arrow_forward icon and data-arrow', () => {
    const html = renderToStaticMarkup(<AbCard title="T" href="/x" arrow />) // ➡️
    expect(html).toContain('data-arrow="true"') // 🗂️
    expect(html).toContain('abCardArrow') // ➡️
    expect((html.match(/<a /g) ?? []).length).toBe(1) // ♿ still ONE link per card
  })
  it('boldTitle adds the bold class on the heading', () => {
    const html = renderToStaticMarkup(<AbCard title="T" boldTitle />) // 🅱️
    expect(html).toMatch(/<h3 class="abCardTitle abCardTitleBold">/) // ✅
  })
})
