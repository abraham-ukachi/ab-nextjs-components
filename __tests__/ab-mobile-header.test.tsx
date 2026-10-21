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
* @name: AbMobileHeader tests
* @file: __tests__/ab-mobile-header.test.tsx
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
import AbMobileHeader from '../ab-mobile-header'
import * as pkg from '../index'

afterEach(() => cleanup())

describe('AbMobileHeader (drawers v2) 📱', () => {
  it('logo, then the globe ("Change language", haspopup dialog) and the theme toggle; no search, no menu', () => {
    const onLanguage = vi.fn(); const onThemeChange = vi.fn()
    const { container } = render(<AbMobileHeader logo={<a href="/" id="logo">AbElements</a>} onLanguage={onLanguage} theme="light" onThemeChange={onThemeChange} />)
    const btns = Array.from(container.querySelectorAll('button'))
    expect(btns.map((b) => b.getAttribute('aria-label'))).toEqual(['Change language', 'Switch to dark theme']) // 🌍 🌗 in order
    expect(btns[0].getAttribute('aria-haspopup')).toBe('dialog')
    expect(btns[1].querySelector('[data-icon]')!.getAttribute('data-icon')).toBe('dark_mode') // 🌙 the target in light
    expect(container.textContent).not.toMatch(/Search|Menu/i) // 🚫
    fireEvent.click(btns[0]); expect(onLanguage).toHaveBeenCalled()
    fireEvent.click(btns[1]); expect(onThemeChange).toHaveBeenCalledWith('dark')
  })
  it('in dark it shows a sun and switches to light', () => {
    const onThemeChange = vi.fn()
    const { container } = render(<AbMobileHeader logo="x" theme="dark" onThemeChange={onThemeChange} />)
    const b = container.querySelector('button')!
    expect(b.getAttribute('aria-label')).toBe('Switch to light theme'); expect(b.querySelector('[data-icon]')!.getAttribute('data-icon')).toBe('light_mode')
    fireEvent.click(b); expect(onThemeChange).toHaveBeenCalledWith('light')
  })
  it('is exported from the package root', () => { expect(pkg.AbMobileHeader).toBe(AbMobileHeader) })
})
