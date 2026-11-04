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
* @name: AbCodeBlock focusable pre - Tests (0.4.0)
* @file: __tests__/ab-code-block-pre-0.4.0.test.tsx
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
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
// 🖨️ server render (AbCodeBlock is a server component)
import { renderToStaticMarkup } from 'react-dom/server'
// 🧩 under test
import AbCodeBlock from '../ab-code-block'

afterEach(cleanup) // 🧹
const shiki = '<pre class="shiki" tabindex="0"><code>x</code></pre>' // 🖍️ Shiki already sets tabindex
const count = (h: string, re: RegExp) => (h.match(/<pre\b[^>]*>/gi) ?? []).join("").match(re)?.length ?? 0 // 🔢 within the <pre> tags only (the copy button has its own)

// ⌨️ 0.6.0: ONE tab stop per block: the scroller wrapper (named); a direct <pre> never adds a second
const stops = (h: string) => (h.match(/<(div|pre)\b[^>]*>/gi) ?? []).filter((t) => /tabindex="0"/i.test(t)).length // 🔢 tab stops in the code (not the copy button)
describe('⌨️ AbCodeBlock focusable scroller', () => {
  it('plain <pre> children: the wrapper is the stop, named by the title', () => {
    const { container } = render(<AbCodeBlock title="Install"><pre><code>pnpm i</code></pre></AbCodeBlock>) // 🖍️
    const w = container.querySelector('[data-ab-part="code-block-code"]')! // 🎯
    expect(w.getAttribute('tabindex')).toBe('0') // ⌨️
    expect(w.getAttribute('aria-label')).toBe('Install') // 🏷️
    expect(container.querySelector('pre')!.hasAttribute('tabindex')).toBe(false) // 🙅 no second stop
  })
  it('the name falls back: filename, then "<language> code", else none', () => {
    expect(renderToStaticMarkup(<AbCodeBlock filename="a.ts" trustedHtml="<pre>x</pre>" />)).toContain('tabindex="0" role="group" aria-label="a.ts"><pre>x</pre>') // 📄
    expect(renderToStaticMarkup(<AbCodeBlock language="bash" trustedHtml="<pre>x</pre>" />)).toContain('tabindex="0" role="group" aria-label="bash code"><pre>x</pre>') // 🔤
    expect(renderToStaticMarkup(<AbCodeBlock trustedHtml="<pre>x</pre>" />)).toContain('tabindex="0" role="group"><pre>x</pre>') // 🙅 no name to give
    expect(renderToStaticMarkup(<AbCodeBlock language="ts"><pre>x</pre></AbCodeBlock>)).toContain('tabindex="0" role="group" aria-label="ts code"><pre>x</pre>') // 🧩 children path
  })
  it('Shiki trustedHtml: the string is untouched in the server HTML, the wrapper is named', () => {
    const h = renderToStaticMarkup(<AbCodeBlock title="Demo" trustedHtml={shiki} />) // 🧾
    expect(h).toContain(shiki) // ✅ injected as-is (no regex patching)
    expect(count(h, /tabindex=/gi)).toBe(1) // 📜 Shiki's leftover (demoted after hydration, see below)
    expect(h).toContain('aria-label="Demo"') // 🏷️
  })
  it('Shiki trustedHtml after hydration: exactly ONE tab stop (the pre is demoted in the DOM)', () => {
    const { container } = render(<AbCodeBlock title="Demo" trustedHtml={shiki} copy={false} />) // 🖼️ effects ran
    expect(stops(container.innerHTML)).toBe(1) // ⌨️ only the wrapper
    expect(container.querySelector('pre')!.getAttribute('tabindex')).toBe('-1') // ✂️
  })
  it('Shiki children (tabIndex prop): exactly one tab stop, on the wrapper', () => {
    const h = renderToStaticMarkup(<AbCodeBlock language="ts" copy={false}><pre className="shiki" tabIndex={0}><code>x</code></pre></AbCodeBlock>) // 🖍️
    expect(count(h, /tabindex=/gi)).toBe(0) // ✂️ dropped from the pre
    expect(stops(h)).toBe(1) // ⌨️
  })
  it('keeps an author tabIndex -1 / aria-label on the pre', () => {
    const h = renderToStaticMarkup(<AbCodeBlock title="T"><pre tabIndex={-1} aria-label="Mine">x</pre></AbCodeBlock>) // ✋
    expect(h).toContain('<pre tabindex="-1" aria-label="Mine">') // ✅ untouched
  })
  it('trustedHtml is never patched; the wrapper name is escaped by React', () => {
    const h = renderToStaticMarkup(<AbCodeBlock title={'a "b" <c>'} trustedHtml="<pre>1</pre><pre>2</pre>" />) // 🧾
    expect(h).toContain('aria-label="a &quot;b&quot; &lt;c&gt;"><pre>1</pre><pre>2</pre>') // 🔐
  })
  it('the wrapper is the scroller: overflow-x auto on it, the pre is overflow visible', async () => {
    const { readFileSync } = await import('node:fs'); const { join } = await import('node:path') // 📁
    const css = readFileSync(join(__dirname, '..', 'ab-code-block/styles.module.css'), 'utf8') // 🎨
    expect(css).toMatch(/\.abCodeBlockCode \{[^}]*overflow-x:\s*auto/) // ↔️
    expect(css).toMatch(/\.abCodeBlockCode :where\(pre\) \{[^}]*overflow:\s*visible/) // 📜
  })
  it('📋 390px: the scroller reserves a gutter for the 44px copy button (lines never run under it)', async () => {
    const { readFileSync } = await import('node:fs'); const { join } = await import('node:path') // 📁
    const css = readFileSync(join(__dirname, '..', 'ab-code-block/styles.module.css'), 'utf8') // 🎨
    const gutter = Number(/\.abCodeBlockCode \{[^}]*margin-inline-end:\s*(\d+)px/.exec(css)?.[1]) // 📏 not inside a media query: every width
    expect(gutter).toBeGreaterThanOrEqual(44 + 4) // 🔘 button (44) + its 4px inset
    expect(css).toMatch(/\.abCodeBlockCopy \{[^}]*position:\s*absolute[^}]*inset-inline-end:\s*4px/) // 📌 where the button sits
  })
  it('the pre is keyboard-scrollable: overflow auto in the CSS', async () => {
    const { readFileSync } = await import('node:fs'); const { join } = await import('node:path') // 📁
    expect(readFileSync(join(__dirname, '..', 'ab-code-block/styles.module.css'), 'utf8')).toMatch(/overflow(-x)?:\s*auto/) // 📜
  })
})
