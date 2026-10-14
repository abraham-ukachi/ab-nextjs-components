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
* @name: AbIconButton - Tests (G6)
* @file: __tests__/ab-icon-button.test.tsx
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
// 🖨️ server renderer → static HTML
import { renderToStaticMarkup } from 'react-dom/server'
// 🔘 component under test
import AbIconButton from '../ab-icon-button'

// 🔍 the attributes of the first <tag …> in some HTML
const attrsOf = (html: string, tag: string) => html.match(new RegExp(`<${tag}\\b[^>]*>`))?.[0] ?? ''

describe('AbIconButton (G6)', () => {
  it('puts aria-label + title on the <button>, not on the wrapper span', () => {
    const html = renderToStaticMarkup(<AbIconButton icon="arrow_back" label="Previous slide" />) // 🖨️
    const button = attrsOf(html, 'button') // 🔘
    expect(button).toContain('aria-label="Previous slide"') // ♿
    expect(button).toContain('title="Previous slide"') // 💬 tooltip follows the label
    expect(attrsOf(html, 'span')).not.toContain('title=') // 🙅 wrapper stays clean
  })

  it('names the href variant and drops role="button" from the link', () => {
    const html = renderToStaticMarkup(<AbIconButton icon="open_in_new" href="/docs" label="Open docs" />) // 🖨️
    const link = attrsOf(html, 'a') // 🔗
    expect(link).toContain('aria-label="Open docs"') // ♿ was missing before G6
    expect(link).toContain('title="Open docs"') // 💬
    expect(link).toContain('href="/docs"') // 🔗
    expect(link).not.toContain('role="button"') // ♿ a link is a link
  })

  it('keeps pre-G6 callers working: title doubles as the accessible name', () => {
    const html = renderToStaticMarkup(<AbIconButton icon="cancel" title="Clear" />) // 🖨️ AbInput style
    expect(attrsOf(html, 'button')).toContain('aria-label="Clear"') // ♿
  })

  it('hides the ligature text from screen readers', () => {
    const html = renderToStaticMarkup(<AbIconButton icon="arrow_back" label="Back" />) // 🖨️
    expect(html).toMatch(/<span class="material-symbols-rounded icon" aria-hidden="true">arrow_back<\/span>/) // 🙈
  })

  it('disabled link: no href, aria-disabled, out of the tab order', () => {
    const link = attrsOf(renderToStaticMarkup(<AbIconButton icon="home" href="/" label="Home" disabled />), 'a') // 🖨️
    expect(link).not.toContain('href=') // 🚫
    expect(link).toContain('aria-disabled="true"') // 🚦
    expect(link).toContain('tabindex="-1"') // ⌨️
  })

  it('loading button is busy and disabled', () => {
    const button = attrsOf(renderToStaticMarkup(<AbIconButton icon="save" label="Save" isLoading />), 'button') // 🖨️
    expect(button).toContain('aria-busy="true"') // ⏳
    expect(button).toContain('disabled=""') // 🚦
  })
})
