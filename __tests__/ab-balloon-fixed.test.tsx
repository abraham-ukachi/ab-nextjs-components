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
* @name: AbBalloon strategy="fixed" tests (0.2.1)
* @file: __tests__/ab-balloon-fixed.test.tsx
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
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbBalloon from '../ab-balloon'
import AbSidebar from '../ab-sidebar'

vi.mock('next/navigation', () => ({ usePathname: () => '/' })) // 🧭
afterEach(() => cleanup())
const css = readFileSync(join(__dirname, '../ab-balloon/styles.module.css'), 'utf8') // 🎨

describe('📌 AbBalloon strategy="fixed" (collapsed rail tooltips never clipped)', () => {
  it('places the tip in the viewport next to the trigger (end = right + 6px, centred)', () => {
    render(<AbBalloon title="Profile and settings" placement="end" strategy="fixed"><button type="button">p</button></AbBalloon>)
    const w = document.querySelector<HTMLElement>('[data-ab-part="balloon"]')!
    w.getBoundingClientRect = () => ({ left: 10, right: 54, top: 700, bottom: 744, width: 44, height: 44, x: 10, y: 700, toJSON: () => ({}) }) // 📐
    fireEvent.focus(document.querySelector('button')!) // ⌨️ open now
    const tip = document.querySelector<HTMLElement>('[role="tooltip"]')!
    expect(w.getAttribute('data-strategy')).toBe('fixed') // 📌
    expect(tip.style.left).toBe('60px'); expect(tip.style.top).toBe('722px') // 📍
    expect(tip.parentElement).toBe(document.body) // 🌀 portalled: out of the rail's clip + stacking context
    expect(tip.getAttribute('data-open')).toBe('true') // 👁️
    expect(document.querySelector('button')!.getAttribute('aria-describedby')).toBe(tip.id) // ♿ still described
    expect(css).toMatch(/\.abBalloonTipFixed \{ position: fixed; inset: auto; z-index: 1000; \}/) // 🎨
  })
  it('default stays absolute (no inline position)', () => {
    render(<AbBalloon title="x"><button type="button">p</button></AbBalloon>)
    fireEvent.focus(document.querySelector('button')!)
    expect(document.querySelector('[data-ab-part="balloon"]')!.hasAttribute('data-strategy')).toBe(false) // 🕰️
    expect(document.querySelector<HTMLElement>('[role="tooltip"]')!.style.left).toBe('') // 🚫
  })
  it('the collapsed sidebar rail items and the profile button use it', () => {
    render(<AbSidebar collapsed sections={[{ id: 'a', items: [{ href: '/', icon: 'home', label: 'Home' }] }]} profile={{ user: null, theme: 'light', onThemeChange: () => {}, locales: [], locale: 'en', onLocaleChange: () => {} }} />)
    const all = Array.from(document.querySelectorAll('[data-ab-part="balloon"]')) // 🎈
    expect(all.length).toBe(2) // 🏠 + 👤
    expect(all.every((b) => b.getAttribute('data-strategy') === 'fixed')).toBe(true) // 📌
  })
})
