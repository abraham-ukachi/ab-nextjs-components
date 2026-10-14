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
* @name: AbLocaleSwitcher - Tests (G7)
* @file: __tests__/ab-locale-switcher.test.tsx
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
import { afterEach, describe, expect, it, vi } from 'vitest'
// 🖼️ DOM helpers
import { act, cleanup, fireEvent, render } from '@testing-library/react'
// 🌍 under test
import AbLocaleSwitcher, { getAbTypeaheadIndex } from '../ab-locale-switcher'

// 🌍 fixture locales (endonyms)
const locales = [{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }, { code: 'es', label: 'Español' }, { code: 'ru', label: 'Русский' }]
// 🧹
afterEach(() => cleanup())
// ⏭️ flush the rAF focus
const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 30)) })

describe('getAbTypeaheadIndex', () => {
  it('finds the next match and wraps', () => {
    const l = locales.map((x) => x.label) // 🏷️
    expect(getAbTypeaheadIndex(l, 0, 'e')).toBe(2) // 🔤 Español
    expect(getAbTypeaheadIndex(l, 2, 'e')).toBe(0) // 🔁 English
    expect(getAbTypeaheadIndex(l, 0, 'р')).toBe(3) // 🇷🇺 Cyrillic
    expect(getAbTypeaheadIndex(l, 0, 'z')).toBe(-1) // 🙅
  })
})

describe('AbLocaleSwitcher (G7)', () => {
  it('menu button semantics; opens on the checked item; Esc returns focus', async () => {
    const { getByRole, getAllByRole } = render(<AbLocaleSwitcher label="Language" current="fr" locales={locales} onSelect={() => {}} />) // 🖼️
    const trigger = getByRole('button', { name: 'Language: Français' }) // 🌐
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu') // ♿
    expect(trigger.getAttribute('aria-expanded')).toBe('false') // 🚪
    fireEvent.click(trigger) // 🖱️
    await flush() // ⏭️
    expect(trigger.getAttribute('aria-expanded')).toBe('true') // 🚪
    const items = getAllByRole('menuitemradio') // 🗣️
    expect(items.map((i) => i.getAttribute('lang'))).toEqual(['en', 'fr', 'es', 'ru']) // 🗣️ own language
    expect(items[1].getAttribute('aria-checked')).toBe('true') // ✅
    expect(document.activeElement).toBe(items[1]) // 🎯 checked item focused
    fireEvent.keyDown(getByRole('menu'), { key: 'ArrowDown' }) // ⬇️
    expect(document.activeElement).toBe(items[2]) // ✅
    fireEvent.keyDown(getByRole('menu'), { key: 'Escape' }) // 🚪
    expect(trigger.getAttribute('aria-expanded')).toBe('false') // ✅
    expect(document.activeElement).toBe(trigger) // 🎯
  })

  it('selecting calls onSelect and closes', async () => {
    const onSelect = vi.fn() // 📣
    const { getByRole, getAllByRole } = render(<AbLocaleSwitcher label="Language" current="en" locales={locales} onSelect={onSelect} />)
    fireEvent.keyDown(getByRole('button'), { key: 'ArrowDown' }) // ⬇️ opens
    await flush()
    fireEvent.click(getAllByRole('menuitemradio')[3]) // 🇷🇺
    expect(onSelect).toHaveBeenCalledWith('ru') // ✅
    expect(getByRole('button').getAttribute('aria-expanded')).toBe('false') // 🚪
  })

  it('link items carry href + hreflang', () => {
    const { container } = render(<AbLocaleSwitcher label="Language" current="en" locales={locales} getHref={(c) => (c === 'en' ? '/' : `/${c}`)} />)
    const links = Array.from(container.querySelectorAll('a[role="menuitemradio"]')) // 🔗
    expect(links.map((a) => [a.getAttribute('href'), a.getAttribute('hreflang')])).toEqual([['/', 'en'], ['/fr', 'fr'], ['/es', 'es'], ['/ru', 'ru']]) // ✅
  })
})
