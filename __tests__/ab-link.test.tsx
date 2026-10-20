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
* @name: AbLink / AbLinkProvider - Tests (0.1.13)
* @file: __tests__/ab-link.test.tsx
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
// 📁 fs + path (repo-wide grep)
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
// 🔗 under test
import AbLink, { AbLinkProvider, type AbLinkProps } from '../ab-link'

// 🧪 a fake locale-aware link: proves the provider's component is the one rendered
const FakeLink = ({ href, children, ...rest }: AbLinkProps) => (
  <a data-fake="yes" href={`/fr${String(href)}`} {...(rest as object)}>{children}</a>
)

// 📂 every source file of the package (no deps, tests, build output)
const ROOT = join(__dirname, '..')
const SKIP = new Set(['node_modules', 'dist', '__tests__', '.git', 'coverage'])
function walk(dir: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    if (SKIP.has(n)) continue // 🚫
    const p = join(dir, n)
    if (statSync(p).isDirectory()) walk(p, out) // 📁
    else if (/\.(tsx?|mjs|js)$/.test(n)) out.push(p) // 📄
  }
  return out
}

describe('AbLink (0.1.13)', () => {
  it('renders next/link by default', () => {
    const html = renderToStaticMarkup(<AbLink href="/docs">Docs</AbLink>) // 🔗
    expect(html).toContain('href="/docs"') // ✅
    expect(html).not.toContain('data-fake') // 🚫 no provider
  })
  it('renders the provider component instead', () => {
    const html = renderToStaticMarkup(
      <AbLinkProvider component={FakeLink}><AbLink href="/docs">Docs</AbLink></AbLinkProvider>,
    ) // 🔌
    expect(html).toContain('data-fake="yes"') // ✅ swapped
    expect(html).toContain('href="/fr/docs"') // 🌍 locale-aware
  })
  it('ab-link is the only next/link import in the package', () => {
    const offenders = walk(ROOT)
      .filter((f) => /from ['"]next\/link['"]/.test(readFileSync(f, 'utf8'))) // 🔎
      .map((f) => relative(ROOT, f))
    expect(offenders).toEqual(['ab-link/index.tsx']) // 🔒
  })
})
