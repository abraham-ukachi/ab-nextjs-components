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
* @name: AbContentTabs - Tests (0.3.4)
* @file: __tests__/ab-content-tabs-0.3.4.test.tsx
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
import { cleanup, fireEvent, render } from '@testing-library/react'
// 🖨️ the server pass (all panels in the HTML)
import { renderToStaticMarkup } from 'react-dom/server'
// 🧩 under test
import AbContentTabs, { AbContentTab } from '../ab-content-tabs'
import * as pkg from '../index'

afterEach(() => cleanup()) // 🧹
// 🧱 an MDX-like <Tabs>: three package managers
const Tabs = (p: { defaultValue?: string; onChange?: (v: string) => void }) => (
  <AbContentTabs label="Package manager" {...p}>
    <AbContentTab label="pnpm"><p>pnpm add x</p></AbContentTab>
    <AbContentTab label="npm"><p>npm i x</p></AbContentTab>
    <AbContentTab label="yarn" value="y"><p>yarn add x</p></AbContentTab>
  </AbContentTabs>
)
const tabs = (c: HTMLElement) => Array.from(c.querySelectorAll<HTMLButtonElement>('[role="tab"]')) // 🔘
const panels = (c: HTMLElement) => Array.from(c.querySelectorAll<HTMLElement>('[role="tabpanel"]')) // 📄

// 🗂️ QA (0.2.24 MDX docs): WAI-ARIA tabs for MDX
describe('🗂️ AbContentTabs', () => {
  it('a named tablist; tabs ↔ panels linked both ways; the first is selected', () => {
    const { container } = render(<Tabs />) // 🖼️
    expect(container.querySelector('[role="tablist"]')!.getAttribute('aria-label')).toBe('Package manager') // ♿
    const t = tabs(container); const p = panels(container) // 🔘 📄
    expect(t.map((b) => b.textContent)).toEqual(['pnpm', 'npm', 'yarn']) // 🏷️
    t.forEach((b, i) => { expect(b.getAttribute('aria-controls')).toBe(p[i].id); expect(p[i].getAttribute('aria-labelledby')).toBe(b.id) }) // 🔗
    expect(t.map((b) => b.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']) // ✅
    expect(t.map((b) => b.tabIndex)).toEqual([0, -1, -1]) // ⌨️ roving
    expect(p.map((x) => x.hidden)).toEqual([false, true, true]) // 🙈
  })
  it('→ / ← wrap, Home / End jump; focus + selection follow; onChange fires', () => {
    const on = vi.fn(); const { container } = render(<Tabs onChange={on} />) // 🖼️
    const list = container.querySelector('[role="tablist"]')! // 🗂️
    fireEvent.keyDown(list, { key: 'ArrowRight' }); expect(document.activeElement).toBe(tabs(container)[1]) // ➡️
    fireEvent.keyDown(list, { key: 'End' }); expect(tabs(container)[2].getAttribute('aria-selected')).toBe('true') // ⏭️
    fireEvent.keyDown(list, { key: 'ArrowRight' }); expect(tabs(container)[0].getAttribute('aria-selected')).toBe('true') // 🔁 wraps
    fireEvent.keyDown(list, { key: 'ArrowLeft' }); expect(panels(container)[2].hidden).toBe(false) // ⬅️ wraps back
    fireEvent.keyDown(list, { key: 'Home' }); expect(document.activeElement).toBe(tabs(container)[0]) // ⏮️
    expect(on.mock.calls.map((c) => c[0])).toEqual(['npm', 'y', 'pnpm', 'y', 'pnpm']) // 📣 values
  })
  it('RTL flips the arrows', () => {
    const { container } = render(<div dir="rtl"><Tabs /></div>) // 🌍
    fireEvent.keyDown(container.querySelector('[role="tablist"]')!, { key: 'ArrowLeft' }) // ⬅️ = next in RTL
    expect(tabs(container)[1].getAttribute('aria-selected')).toBe('true') // ✅
  })
  it('click selects; defaultValue picks the first open tab', () => {
    const { container } = render(<Tabs defaultValue="y" />) // 🎯
    expect(panels(container)[2].hidden).toBe(false) // ✅ yarn
    fireEvent.click(tabs(container)[1]); expect(panels(container)[1].hidden).toBe(false) // 🖱️
  })
  it('the server HTML already holds every panel (inactive ones hidden)', () => {
    const h = renderToStaticMarkup(<Tabs />) // 🖨️
    for (const s of ['pnpm add x', 'npm i x', 'yarn add x']) expect(h).toContain(s) // 📄
    expect(h.match(/role="tabpanel"[^>]*hidden=""/g)).toHaveLength(2) // 🙈
  })
  it('panels are focusable (APG) and AbContentTab alone renders its children', () => {
    const { container } = render(<Tabs />) // 🖼️
    expect(panels(container).every((p) => p.tabIndex === 0)).toBe(true) // ⌨️
    expect(renderToStaticMarkup(<AbContentTab label="x"><b>y</b></AbContentTab>)).toBe('<b>y</b>') // 📄
  })
  it('is exported', () => {
    expect(pkg.AbContentTabs).toBe(AbContentTabs); expect(pkg.AbContentTab).toBe(AbContentTab) // 📦
  })
})
