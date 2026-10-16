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
* @name: AbCard + AbPackageCard + AbToc - Tests (G45, G46)
* @file: __tests__/ab-card-toc.test.tsx
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
import { afterEach, describe, expect, it, vi } from 'vitest'
// 🖼️ renderers
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// 🃏 under test
import AbCard from '../ab-card'
import AbPackageCard from '../ab-package-card'
import AbToc from '../ab-toc'

afterEach(cleanup) // 🧹
const css = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 📄 no comments

describe('AbCard / AbPackageCard (G45)', () => {
  it('has exactly one link, in the heading', () => {
    const html = renderToStaticMarkup(<AbPackageCard name="ab-nextjs-hooks" href="/docs/hooks" version="0.1.7" tags={['client']} badge="New" description="Hooks" />)
    expect(html.match(/<a /g)).toHaveLength(1) // ☝️ one link
    expect(html).toMatch(/<h3[^>]*><a [^>]*href="\/docs\/hooks"/) // ♿ title is the link
    expect(html).toContain('v0.1.7') // 🏷️
    expect(html).toContain('ab-motion-interactive') // 🎬 package timing
  })
  it('no href: no link, no lift target', () => {
    const html = renderToStaticMarkup(<AbCard title="Static" />)
    expect(html).not.toContain('<a ') // 🚫
    expect(html).toContain('data-linked="false"') // 🚫 lift
  })
  it('lift: 2px, laptop+ only, never under reduced motion (gap-review)', () => {
    const c = css('ab-card/styles.module.css')
    const lifts = c.match(/^.*translateY\(-2px\).*$/gm) ?? [] // 🎈
    expect(lifts).toHaveLength(1) // ☝️ single rule
    const block = c.slice(0, c.indexOf('translateY(-2px)')) // 📍 text before it
    expect(block.slice(block.lastIndexOf('@media'))).toMatch(/^@media \(min-width: 1024px\) and \(hover: hover\) and \(prefers-reduced-motion: no-preference\)/) // ♿
  })
})

describe('AbToc (G46)', () => {
  const items = [{ id: 'intro', label: 'Intro' }, { id: 'api', label: 'API', level: 3 as const }]
  it('plain #id links with aria-current="location"', () => {
    const html = renderToStaticMarkup(<AbToc items={items} activeId="api" />)
    expect(html).toContain('href="#intro"') // 🔗 JS-off friendly
    expect(html.match(/aria-current="location"/g)).toHaveLength(1) // ♿
    expect(html).toContain('aria-labelledby="ab-toc-title"') // ♿
    expect(html).toContain('data-level="3"') // 📏
  })
  it('onNavigate takes over the click', () => {
    const go = vi.fn()
    const { getByText } = render(<AbToc items={items} onNavigate={go} />)
    fireEvent.click(getByText('API'))
    expect(go).toHaveBeenCalledWith('api') // 🔔
  })
  it('empty list renders nothing', () => {
    expect(renderToStaticMarkup(<AbToc items={[]} />)).toBe('') // 🙈
  })
})
