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
* @name: AbDemoBox preview scope (G16, 0.6.0)
* @file: __tests__/demo-box-scope-0.6.0.test.tsx
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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// 🖼️ renderers
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// 🧪 under test
import AbDemoBox from '../ab-demo-box'
import AbDrawer, { AB_DRAWER_DURATION, getAbDrawerHost, useAbDrawer } from '../ab-drawer'

const css = readFileSync(join(__dirname, '..', 'ab-demo-box/styles.module.css'), 'utf8') // 🎨
const src = readFileSync(join(__dirname, '..', 'ab-demo-box/index.tsx'), 'utf8') // 📄
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })

describe('🧪 AbDemoBox as the G16 preview scope', () => {
  it('is server-safe: no "use client", renders on the server', () => {
    expect(src).not.toMatch(/^'use client'/m) // 🖥️ RSC + MDX friendly
    expect(renderToStaticMarkup(<AbDemoBox><b>hi</b></AbDemoBox>)).toContain('data-ab-preview-scope=""') // 📦
  })
  it('scheme forces the theme tokens; inherit sets nothing', () => {
    expect(renderToStaticMarkup(<AbDemoBox scheme="dark" />)).toContain('data-theme="dark"') // 🌙
    expect(renderToStaticMarkup(<AbDemoBox />)).not.toContain('data-theme') // 🌗 follows the page
    expect(css).toMatch(/\.abDemoBox\[data-theme='dark'\] \{ color-scheme: dark; \}/) // 🌙 native UI
  })
  it('is a named region only with a label, and opts out of prose styles', () => {
    const html = renderToStaticMarkup(<AbDemoBox label="Button preview" />)
    expect(html).toContain('role="region"'); expect(html).toContain('aria-label="Button preview"') // ♿
    expect(renderToStaticMarkup(<AbDemoBox />)).not.toContain('role=') // 🙅 no unnamed landmark
    expect(html).toContain('ab-prose-none') // 🧱 no leaking prose styles
  })
  it('contains layout, paint and stacking, with no motion', () => {
    expect(css).toMatch(/contain: layout paint;/) // 📦 fixed children are positioned by the box
    expect(css).toMatch(/isolation: isolate;/) // 🥞
    expect(css).not.toMatch(/transition|animation|@keyframes/) // 🎞️ motion lives in ab-nextjs-animations
  })
})

describe('🗄️ drawers inside a preview stay inside', () => {
  it('getAbDrawerHost returns the preview for every scope, unless a scope box sits inside the preview', () => {
    document.body.innerHTML = '<div class="AbAppLayout"><div data-ab-part="main"><div data-ab-preview-scope id="p"><i id="a"></i><div data-ab-part="aside" id="inner"><i id="b"></i></div></div></div></div>'
    const p = document.getElementById('p')
    for (const scope of ['app', 'main', 'aside'] as const) expect(getAbDrawerHost(scope, document.getElementById('a'))).toBe(p) // 📦
    expect(getAbDrawerHost('aside', document.getElementById('b'))).toBe(document.getElementById('inner')) // 🧱 a layout demo
    expect(getAbDrawerHost('main', document.getElementById('b'))).toBe(p) // 📦 the page's main is outside the preview
  })
  it('an app-scope drawer opened in a preview renders its layer inside the box, and focus returns to its trigger', async () => {
    function Demo() {
      const d = useAbDrawer('app')
      return (
        <div className="AbAppLayout">
          <AbDemoBox label="Drawer preview">
            <button id="t" {...d.triggerProps}>Open</button>
            <AbDrawer {...d.drawerProps} title="Demo drawer"><button>Inside</button></AbDrawer>
          </AbDemoBox>
        </div>
      )
    }
    render(<Demo />)
    const t = document.getElementById('t') as HTMLButtonElement
    t.focus(); fireEvent.click(t); act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) })
    const box = document.querySelector('[data-ab-part="demo-box"]')!
    expect(box.querySelector('[role="dialog"]')).not.toBeNull() // 📦 inside the preview
    expect(box.hasAttribute('data-ab-drawer-host')).toBe(true) // 📌 the preview is the host
    fireEvent.keyDown(document, { key: 'Escape' }); act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) }); await act(async () => {})
    expect(document.activeElement).toBe(t) // ↩️
  })
})
