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
* @name: AbVersionSwitcher - Tests
* @file: __tests__/ab-version-switcher.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbVersionSwitcher from '../ab-version-switcher'

afterEach(cleanup)
const versions = [{ value: 'v0.2.x', href: '/docs' }, { value: 'v0.1.x', href: '/v0.1/docs' }]

describe('AbVersionSwitcher (P9) 🏷️', () => {
  it('shows "Docs v0.2.x ▾"; opens the menu with the current version selected; Escape closes + refocuses', () => {
    const { container } = render(<AbVersionSwitcher version="v0.2.x" versions={versions} />)
    const btn = container.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement
    expect(btn.textContent).toContain('Docs'); expect(btn.querySelector('b')?.textContent).toBe('v0.2.x') // 💪
    expect(btn.getAttribute('aria-label')).toBe('Docs v0.2.x') // ♿ WCAG 2.5.3: the name contains the visible text
    expect(btn.getAttribute('aria-label')).toBe(btn.textContent?.replace(/\s+/g, ' ').trim())
    const menu = document.getElementById(btn.getAttribute('aria-controls')!)!
    expect(menu.hidden).toBe(true)
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true'); expect(menu.hidden).toBe(false)
    expect(menu.querySelector('a[aria-current="page"]')?.getAttribute('href')).toBe('/docs') // ✅ current
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(menu.hidden).toBe(true); expect(document.activeElement).toBe(btn) // ⎋ ↩️
  })
  it('button items call onSelect and close; one version = static label', () => {
    const onSelect = vi.fn()
    const { container, rerender } = render(<AbVersionSwitcher version="v0.2.x" versions={[{ value: 'v0.2.x' }, { value: 'v0.1.x' }]} onSelect={onSelect} />)
    fireEvent.click(container.querySelector('button[aria-haspopup]')!)
    fireEvent.click(Array.from(container.querySelectorAll('menu button')).find((b) => b.textContent?.includes('v0.1.x'))!)
    expect(onSelect).toHaveBeenCalledWith('v0.1.x')
    expect(container.querySelector('details')).toBeNull() // 🙅 no-JS list needs hrefs
    rerender(<AbVersionSwitcher version="v0.2.x" />)
    expect(container.querySelector('button')).toBeNull(); expect(container.textContent).toContain('v0.2.x') // 🏷️
  })
  it('matches the mock .ver (28px, radius 8, 0 6 0 10, 12px, 650, 16px icon) and has a no-JS details list', () => {
    const css = readFileSync(join(__dirname, '..', 'ab-version-switcher/styles.module.css'), 'utf8')
    expect(css).toMatch(/--ab-version-height: 28px;/); expect(css).toMatch(/--ab-version-radius: 8px;/)
    expect(css).toMatch(/padding: 0 6px 0 10px;/); expect(css).toMatch(/font-size: 12px;/); expect(css).toMatch(/font-weight: 650;/)
    expect(css).toMatch(/outline: 2px solid var\(--ab-version-ring\); outline-offset: 2px;/) // ♿
    expect(css).toMatch(/@media \(scripting: none\)/) // 🚫 JS
    expect(css).toMatch(/\.abVersionMenu\[hidden\] \{ display: none; \}/) // 🙈 closed menu takes no space
    const { container } = render(<AbVersionSwitcher version="v0.2.x" versions={versions} />)
    expect(container.querySelectorAll('details a')).toHaveLength(2)
  })
})
