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
* @name: AbCodeBlock - Tests (0.3.4)
* @file: __tests__/ab-code-block-0.3.4.test.tsx
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
import { act, cleanup, fireEvent, render } from '@testing-library/react'
// 🖨️ server render (AbCodeBlock is a server component)
import { renderToStaticMarkup } from 'react-dom/server'
// 📁 fs: the island must be the only client file
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// 🧩 under test
import AbCodeBlock from '../ab-code-block'
import * as pkg from '../index'

afterEach(() => { cleanup(); vi.unstubAllGlobals() }) // 🧹
const src = (f: string) => readFileSync(join(__dirname, '..', 'ab-code-block', f), 'utf8') // 📖
const shiki = '<pre class="shiki" tabindex="0"><code><span class="line">const a = 1</span></code></pre>' // 🖍️ a Shiki-like string

// 💻 Joseph (0.2.24 MDX docs): server code block + client copy island
describe('💻 AbCodeBlock', () => {
  it('is server-safe: no "use client" in index.tsx, only in copy.tsx', () => {
    expect(src('index.tsx')).not.toMatch(/^'use client'/m) // 🖥️
    expect(src('copy.tsx')).toMatch(/^'use client';/m) // 🏝️ the island
  })
  it('renders an `html` string inside a <figure> with a header (title · filename · language)', () => {
    const h = renderToStaticMarkup(<AbCodeBlock html={shiki} title="Example" filename="app/page.tsx" language="tsx" />) // 🖨️
    expect(h).toMatch(/^<figure class="AbCodeBlock ab-prose-none/) // 🧱 opts out of .ab-prose
    expect(h).toContain('data-language="tsx"') // 🔤
    expect(h).toMatch(/<figcaption[^>]*>.*Example.*app\/page\.tsx.*tsx.*<\/figcaption>/) // 🏷️
    expect(h).toContain(shiki) // 🧾 untouched
  })
  it('renders Shiki children too', () => {
    const h = renderToStaticMarkup(<AbCodeBlock><pre><code>pnpm i</code></pre></AbCodeBlock>) // 🖍️
    expect(h).toContain('<pre><code>pnpm i</code></pre>') // ✅
    expect(h).not.toContain('<figcaption') // 🙅 no header without title/filename/language
  })
  it('a language-only block is named "<language> code"', () => {
    expect(renderToStaticMarkup(<AbCodeBlock language="bash" html="<pre>x</pre>" />)).toContain('aria-label="bash code"') // ♿
  })
  it('copy button: labelled, can be hidden, labels are props', () => {
    expect(renderToStaticMarkup(<AbCodeBlock html="<pre>x</pre>" copyLabel="Copier" />)).toContain('aria-label="Copier"') // 🌍
    expect(renderToStaticMarkup(<AbCodeBlock html="<pre>x</pre>" copy={false} />)).not.toContain('code-block-copy') // 🙅
  })
  it('copies `code` when given, else the rendered text, and announces copiedLabel', async () => {
    const writeText = vi.fn(() => Promise.resolve()) // 📋 a fake clipboard
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } }) // 🔌
    const { container, unmount } = render(<AbCodeBlock html={shiki} copiedLabel="Copié" />) // 🖼️ no `code`
    await act(async () => { fireEvent.click(container.querySelector('[data-ab-part="code-block-copy"] button')!) }) // 🖱️
    expect(writeText).toHaveBeenCalledWith('const a = 1') // 📝 the <pre> text
    expect(container.querySelector('[role="status"]')!.textContent).toBe('Copié') // 📣
    unmount()
    const r = render(<AbCodeBlock html={shiki} code={'raw\nsource'} />) // 🧾 with `code`
    await act(async () => { fireEvent.click(r.container.querySelector('[data-ab-part="code-block-copy"] button')!) }) // 🖱️
    expect(writeText).toHaveBeenLastCalledWith('raw\nsource') // ✅ the raw source wins
  })
  it('is exported (block + island)', () => {
    expect(pkg.AbCodeBlock).toBe(AbCodeBlock) // 📦
    expect(typeof pkg.AbCodeBlockCopy).toBe('function') // 📦
  })
})
