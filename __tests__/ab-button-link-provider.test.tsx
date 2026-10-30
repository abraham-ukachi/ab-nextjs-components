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
* @name: AbButton link mode × AbLinkProvider - Tests (404 gaps)
* @file: __tests__/ab-button-link-provider.test.tsx
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
// ⚛️ SSR render (server + client twins both render statically)
import { renderToStaticMarkup } from 'react-dom/server'
// 🔗 the provider + its link props type
import { AbLinkProvider, type AbLinkProps } from '../ab-link'
// 🔘 the twins under test
import AbButton from '../ab-button'
import ServerAbButton from '../server/ab-button'

// 🌍 a fake locale-aware Link: prefixes `/fr` so we can SEE that it was used
const FrLink = ({ href, children, ...rest }: AbLinkProps) => (
  <a data-fake="fr" href={`/fr${String(href)}`} {...(rest as object)}>{children}</a>
)

describe('AbButton link mode × AbLinkProvider (404 gaps) 🔌', () => {
  it('client: without a provider it still renders a plain link (next/link default)', () => {
    const html = renderToStaticMarkup(<AbButton label="Home" href="/docs" />) // 🔗
    expect(html).toContain('href="/docs"') // ✅ no prefix
    expect(html).not.toContain('data-fake') // 🚫 fake not used
  })
  it('client: link mode goes through the provided Link (locale prefix)', () => {
    const html = renderToStaticMarkup(<AbLinkProvider component={FrLink}><AbButton label="Home" href="/docs" /></AbLinkProvider>) // 🌍
    expect(html).toContain('data-fake="fr"') // ✅ provider's Link rendered
    expect(html).toContain('href="/fr/docs"') // 🌍 prefixed
    expect(html).toContain('AbButton') // 🏷️ classes kept
    expect(html).toContain('data-type="contained"') // 🗂️ data attrs kept
  })
  it('server twin: link mode goes through the provided Link too', () => {
    const html = renderToStaticMarkup(<AbLinkProvider component={FrLink}><ServerAbButton label="Home" href="/docs" /></AbLinkProvider>) // 🖥️
    expect(html).toContain('href="/fr/docs"') // 🌍
  })
  it('a blocked link never reaches the provider (no href at all)', () => {
    const html = renderToStaticMarkup(<AbLinkProvider component={FrLink}><AbButton label="Home" href="/docs" disabled /></AbLinkProvider>) // 🚫
    expect(html).not.toContain('href=') // 🚫 no navigation target
    expect(html).toContain('role="link"') // ♿ still a link
  })
  it('client and server twins render the same link tag (attrs; inner spinner is client-only by design)', () => {
    const c = renderToStaticMarkup(<AbLinkProvider component={FrLink}><AbButton label="Go" href="/x" /></AbLinkProvider>) // 🧬
    const s = renderToStaticMarkup(<AbLinkProvider component={FrLink}><ServerAbButton label="Go" href="/x" /></AbLinkProvider>) // 🧬
    const tag = (h: string) => h.slice(0, h.indexOf('>') + 1) // ✂️ just the <a …> opening tag
    expect(tag(s)).toBe(tag(c)) // 🛡️ no drift
  })
})
