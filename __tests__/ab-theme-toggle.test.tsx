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
* @name: AbThemeToggle - Tests (G34)
* @file: __tests__/ab-theme-toggle.test.tsx
* @type: Vitest (happy-dom)
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
// 🖼️ DOM helpers
import { cleanup, fireEvent, render } from '@testing-library/react'
// 🌗 under test
import AbThemeToggle, { getNextAbThemeMode } from '../ab-theme-toggle'

// 🏷️ i18n labels
const labels = { group: 'Theme', light: 'Light', dark: 'Dark', system: 'System' }

// 🧹 fresh storage + DOM
beforeEach(() => window.localStorage.clear())
afterEach(() => cleanup())

describe('getNextAbThemeMode', () => {
  it('wraps and flips in RTL', () => {
    const m = ['light', 'dark', 'system'] as const // 🎚️
    expect(getNextAbThemeMode(m, 'light', 'ArrowRight')).toBe('dark') // ➡️
    expect(getNextAbThemeMode(m, 'light', 'ArrowLeft')).toBe('system') // 🔁 wrap
    expect(getNextAbThemeMode(m, 'light', 'ArrowLeft', 'rtl')).toBe('dark') // 🌍
    expect(getNextAbThemeMode(m, 'dark', 'End')).toBe('system') // ⏭️
    expect(getNextAbThemeMode(m, 'dark', 'Enter')).toBeNull() // 🙅
  })
})

describe('AbThemeToggle (segmented)', () => {
  it('is a radiogroup with three named radios and one tab stop', () => {
    const { getByRole, getAllByRole } = render(<AbThemeToggle labels={labels} />) // 🖼️
    expect(getByRole('radiogroup').getAttribute('aria-label')).toBe('Theme') // ♿
    const radios = getAllByRole('radio') // 🔘
    expect(radios.map((r) => r.getAttribute('aria-label'))).toEqual(['Light', 'Dark', 'System']) // 🏷️
    expect(radios.map((r) => r.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']) // ⌨️ roving
    expect(radios[0].getAttribute('aria-checked')).toBe('true') // ✅ default light
  })

  it('click + arrows select, persist and apply system mode to <html>', () => {
    const { getAllByRole, getByRole } = render(<AbThemeToggle labels={labels} />) // 🖼️
    fireEvent.click(getAllByRole('radio')[1]) // 🌙
    expect(window.localStorage.getItem('theme')).toBe('dark') // 💾
    fireEvent.keyDown(getByRole('radiogroup'), { key: 'ArrowRight' }) // ➡️ → system
    expect(getAllByRole('radio')[2].getAttribute('aria-checked')).toBe('true') // ✅
    expect(document.activeElement).toBe(getAllByRole('radio')[2]) // 🎯 focus follows
    expect(window.localStorage.getItem('theme')).toBe('system') // 💾
    expect(document.documentElement.dataset.themeMode).toBe('system') // 🖌️
  })

  it('controlled: reports, does not persist', () => {
    const onChange = vi.fn() // 📣
    const { getAllByRole } = render(<AbThemeToggle labels={labels} value="dark" onChange={onChange} />) // 🎛️
    fireEvent.click(getAllByRole('radio')[2]) // 🖥️
    expect(onChange).toHaveBeenCalledWith('system') // 📣
    expect(getAllByRole('radio')[1].getAttribute('aria-checked')).toBe('true') // ⏸️ parent decides
  })

  it('two-mode setups still work (modes prop)', () => {
    const { getAllByRole } = render(<AbThemeToggle labels={labels} modes={['light', 'dark']} />) // 🎚️
    expect(getAllByRole('radio')).toHaveLength(2) // ✅
  })
})

describe('AbThemeToggle (icon)', () => {
  it('cycles modes and names the current one', () => {
    const { getByRole } = render(<AbThemeToggle labels={labels} variant="icon" />) // 🖼️
    const button = getByRole('button') // 🔘
    expect(button.getAttribute('aria-label')).toBe('Theme: Light') // ♿
    fireEvent.click(button) // 🔁
    expect(button.getAttribute('aria-label')).toBe('Theme: Dark') // ✅
  })
})
