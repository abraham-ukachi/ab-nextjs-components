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
* @name: trustedHtml (0.6.0 security review)
* @file: __tests__/trusted-html-0.6.0.test.tsx
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
// ⚛️ render
import { renderToStaticMarkup } from 'react-dom/server'
import { render } from '@testing-library/react'
// 💻 the components
import AbCodeBlock, { warnAbRiskyHtml } from '../ab-code-block'
import AbDemoCode from '../ab-demo-code'
import AbPreviewCode from '../ab-preview-code'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs() }) // 🧹

// 🔁 the rename: `trustedHtml` flows through all three components
describe('🧾 trustedHtml rename', () => {
  const pre = '<pre class="shiki"><code>ok</code></pre>' // 🖍️
  it('AbCodeBlock / AbDemoCode / AbPreviewCode render it', () => {
    expect(renderToStaticMarkup(<AbCodeBlock trustedHtml={pre} />)).toContain(pre) // 💻
    expect(renderToStaticMarkup(<AbDemoCode code="ok" trustedHtml={pre} />)).toContain(pre) // 🧩
    expect(renderToStaticMarkup(<AbPreviewCode code="ok" trustedHtml={pre}><b>x</b></AbPreviewCode>)).toContain(pre) // 🪟
  })
  it('the old `html` prop is gone (type-level)', () => {
    // @ts-expect-error 🙅 `html` was renamed to `trustedHtml`
    const h = renderToStaticMarkup(<AbCodeBlock html={pre} code="raw" />)
    expect(h).not.toContain('class="shiki"') // ✅ ignored
  })
})

// ⚠️ dev-only warning on risky patterns
describe('⚠️ warnAbRiskyHtml', () => {
  const risky = ['<script>alert(1)</script>', '<img src=x onerror="x()">', '<a href="javascript:x()">a</a>', '<iframe src="/"></iframe>', '<div srcdoc="x"></div>'] // 🚨
  it.each(risky)('warns on %s', (h) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {}) // 🔇
    renderToStaticMarkup(<AbCodeBlock trustedHtml={h} />) // 💻
    expect(warn).toHaveBeenCalledTimes(1) // ⚠️
    expect(String(warn.mock.calls[0][0])).toContain('trustedHtml') // 🏷️
  })
  it('silent on clean Shiki HTML (even with `>` and "on" in text)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {}) // 🔇
    warnAbRiskyHtml('<pre class="shiki" style="--x:a>b"><code>button on click =&gt; x</code></pre>') // ✅
    expect(warn).not.toHaveBeenCalled() // 🤫
  })
  it('silent in production', () => {
    vi.stubEnv('NODE_ENV', 'production') // 🏭
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {}) // 🔇
    warnAbRiskyHtml('<script>x</script>') // 🚨
    expect(warn).not.toHaveBeenCalled() // 🤫
  })
})

// ⌨️ focus attrs live on the wrapper, the HTML is never regex-patched
describe('⌨️ wrapper focus', () => {
  it('wrapper is focusable + named, `>` inside an attribute survives', () => {
    const h = '<pre class="shiki" data-x="a>b" style="color:red"><code>x</code></pre>' // 🧪 `>` inside an attribute
    const { container } = render(<AbCodeBlock filename="a.ts" trustedHtml={h} />) // 🖼️
    const wrap = container.querySelector('[data-ab-part="code-block-code"]')! // 🎯
    expect(wrap.getAttribute('tabindex')).toBe('0') // ⌨️
    expect(wrap.getAttribute('aria-label')).toBe('a.ts') // 🏷️
    const p = wrap.querySelector('pre')! // 📜
    expect(p.getAttribute('data-x')).toBe('a>b') // ✅ untouched
    expect(p.getAttribute('style')).toBe('color:red') // ✅
    expect(p.hasAttribute('tabindex')).toBe(false) // 🙅 nothing injected (no Shiki tabindex in this string)
    expect(p.hasAttribute('aria-label')).toBe(false) // 🙅
  })
})
