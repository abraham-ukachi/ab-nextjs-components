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
* @name: AbToc variant="links" - Tests (404 gaps)
* @file: __tests__/ab-toc-links.test.tsx
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
// 🔗 provider
import { AbLinkProvider, type AbLinkProps } from '../ab-link'
// 📑 under test
import AbToc from '../ab-toc'

// 🌍 fake locale link
const FrLink = ({ href, children, ...rest }: AbLinkProps) => <a href={`/fr${String(href)}`} {...(rest as object)}>{children}</a>
const items = [
  { id: 'install', label: 'Installation', description: 'Getting started', href: '/docs/installation', icon: <svg data-i="1" /> },
  { id: 'button', label: 'Button', description: 'Components', href: '/docs/components/button' },
]

describe('AbToc variant="links" 🔗', () => {
  it('renders a plain ul of page links with label + description + icon', () => {
    const html = renderToStaticMarkup(<AbToc variant="links" title="Popular pages" items={items} />) // 📑
    expect(html).toContain('data-variant="links"') // 🗂️
    expect(html).toContain('<ul class="abTocLinks">') // 📋 no rail list
    expect(html).not.toContain('<ol') // 🚫 toc list
    expect(html).toContain('href="/docs/installation"') // 🔗
    expect(html).toContain('<small class="abTocLinksDesc">Getting started</small>') // 📝
    expect(html).toContain('data-i="1"') // 🔣
  })
  it('links go through AbLinkProvider (locale prefix)', () => {
    const html = renderToStaticMarkup(<AbLinkProvider component={FrLink}><AbToc variant="links" items={items} /></AbLinkProvider>) // 🌍
    expect(html).toContain('href="/fr/docs/components/button"') // ✅
  })
  it('the default toc variant is unchanged', () => {
    const html = renderToStaticMarkup(<AbToc items={items} />) // 📑
    expect(html).toContain('<ol') // ✅
    expect(html).toContain('href="#install"') // ✅ anchors
    expect(html).not.toContain('data-variant') // ✅
  })
})
