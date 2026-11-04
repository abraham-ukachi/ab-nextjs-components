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
* @name: AbDemoCode on AbCodeBlock (G16, 0.6.0)
* @file: __tests__/demo-code-0.6.0.test.tsx
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
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
// 💻 under test
import AbDemoCode from '../ab-demo-code'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('💻 AbDemoCode is an AbCodeBlock', () => {
  it('server-renders an escaped, focusable, named <pre> with no icon font', () => {
    const html = renderToStaticMarkup(<AbDemoCode code={'<AbButton label="Hi" />'} />)
    expect(html).toContain('data-ab-part="code-block"') // 💻 the shared block
    expect(html).toContain('&lt;AbButton label=&quot;Hi&quot; /&gt;') // 🧾 escaped, never evaluated
    expect(html).toMatch(/<pre tabindex="0" aria-label="tsx code">/) // ⌨️ + 🏷️
    expect(html).not.toContain('material-symbols') // 🚫 no icon font
  })
  it('takes Shiki html or a highlighted child; hidden hides the wrapper', () => {
    expect(renderToStaticMarkup(<AbDemoCode code="x" html={'<pre class="shiki" tabindex="0"><code>x</code></pre>'} />)).toContain('class="shiki"') // 🖍️
    expect(renderToStaticMarkup(<AbDemoCode code="x"><pre className="hl"><code>x</code></pre></AbDemoCode>)).toContain('class="hl"') // 🖍️
    expect(renderToStaticMarkup(<AbDemoCode code="x" hidden />)).toMatch(/^<div hidden=""/) // 🙈
  })
  it('Copy copies the raw source and announces "Copied" politely', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    const { getByRole, container } = render(<AbDemoCode code={'const a = 1\n'} html={'<pre><code><span>const</span> a = 1</code></pre>'} />)
    await act(async () => { fireEvent.click(getByRole('button', { name: 'Copy code' })) })
    expect(writeText).toHaveBeenCalledWith('const a = 1') // 📋 the source, not the highlighted markup
    expect(container.querySelector('[role="status"]')?.textContent).toBe('Copied') // 📣
  })
})
