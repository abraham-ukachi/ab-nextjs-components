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
* @name: AbPreviewCode (G16, 0.6.0)
* @file: __tests__/preview-code-0.6.0.test.tsx
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
// 🖼️ renderers
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// 🧪💻 under test
import AbPreviewCode from '../ab-preview-code'
import AbButton from '../ab-button'
import * as pkg from '../index'

afterEach(cleanup) // 🧹
const src = readFileSync(join(__dirname, '..', 'ab-preview-code/index.tsx'), 'utf8') // 📄
const code = '<AbButton label="Save" />' // 📋
const Pair = (p: Partial<Parameters<typeof AbPreviewCode>[0]>) => <AbPreviewCode label="Button example" code={code} {...p}><AbButton label="Save" /></AbPreviewCode>

describe('🧪💻 AbPreviewCode', () => {
  it('server HTML has both panels: the real component in a preview scope, and the escaped source', () => {
    const html = renderToStaticMarkup(<Pair />)
    expect(html).toContain('role="tablist" aria-label="Button example"') // ♿
    expect(html.match(/role="tab"/g)).toHaveLength(2) // 🗂️ Preview + Code
    expect(html).toMatch(/data-ab-preview-scope=""[^>]*>.*<button[^>]*>.*Save/s) // 🧪 real JSX inside the scope
    expect(html).toContain('&lt;AbButton label=&quot;Save&quot; /&gt;') // 💻 escaped source
    expect(html).toMatch(/role="tabpanel"[^>]*hidden=""[^>]*>.*data-ab-part="code-block"/s) // 🙈 Code is hidden by default
  })
  it('D-c: nothing evaluates code (no eval, new Function, react-live or sandpack)', () => {
    for (const bad of [/\beval\(/, /new Function/, /react-live/, /sandpack/]) expect(src).not.toMatch(bad) // 🚫
    expect(src).not.toMatch(/^'use client'/m) // 🖥️ a server component
    expect(renderToStaticMarkup(<AbPreviewCode code="<Boom />"><i>ok</i></AbPreviewCode>)).toContain('<i>ok</i>') // 🧪 the children, never the string
  })
  it('keyboard: arrows switch to Code and back; the Code panel has the copy button', () => {
    const { getByRole } = render(<Pair />)
    const preview = getByRole('tab', { name: 'Preview' }); const codeTab = getByRole('tab', { name: 'Code' })
    expect(preview.getAttribute('aria-selected')).toBe('true') // 🎯 default
    preview.focus(); fireEvent.keyDown(preview, { key: 'ArrowRight' })
    expect(codeTab.getAttribute('aria-selected')).toBe('true'); expect(document.activeElement).toBe(codeTab) // ⌨️
    expect(getByRole('tabpanel').querySelector('[data-ab-part="code-block"]')).not.toBeNull() // 💻 the visible panel
    expect(getByRole('button', { name: 'Copy code' })).toBeTruthy() // 📋
    fireEvent.keyDown(codeTab, { key: 'Home' }); expect(preview.getAttribute('aria-selected')).toBe('true') // ⏮️
  })
  it('defaultTab, scheme, labels and a highlighted child', () => {
    const html = renderToStaticMarkup(<Pair defaultTab="code" scheme="dark" labels={{ preview: 'Aperçu', code: 'Code source', copy: 'Copier' }} highlighted={<pre className="shiki"><code>x</code></pre>} />)
    expect(html).toMatch(/role="tabpanel"[^>]*hidden=""[^>]*>[^]*data-ab-preview-scope/) // 🙈 the preview is the hidden one
    expect(html).toContain('data-theme="dark"') // 🌙 the preview only
    expect(html).toContain('>Aperçu</button>'); expect(html).toContain('aria-label="Copier"') // 🌍
    expect(html).toContain('class="shiki"') // 🖍️
  })
  it('is exported from the package root', () => {
    expect(pkg.AbPreviewCode).toBe(AbPreviewCode) // 📦
  })
})
