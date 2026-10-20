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
* @name: Home fixes 0.1.15 - Tests
* @file: __tests__/home-fixes-0.1.15.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// @vitest-environment happy-dom
// 🏠 God 00:08 / Joseph fidelity-2: the four Home gaps. Every block lands in the same commit as its change.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbLocaleSwitcher from '../ab-locale-switcher'

const css = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8') // 📄
afterEach(cleanup) // 🧹
const LOCALES = [{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }] as const

// 🧩 4. language list inside the mobile app drawer
describe('AbLocaleSwitcher presentation="inline" 🧩', () => {
  it('renders a labelled group of rows, no trigger and no menu', () => {
    const { getByRole, queryByRole, getAllByRole } = render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" onSelect={() => {}} />)
    const group = getByRole('group', { name: 'Language' }) // ♿
    expect(group.getAttribute('data-presentation')).toBe('inline') // 🧩
    expect(queryByRole('menu')).toBeNull() // 🚫 popover
    const rows = getAllByRole('button') // 🔘 no trigger: only the rows
    expect(rows).toHaveLength(2)
    expect(rows[0].getAttribute('aria-pressed')).toBe('true') // ✅ English
    expect(rows[1].getAttribute('lang')).toBe('fr') // 🗣️
  })
  it('button rows call onSelect; link rows mark aria-current + hreflang', () => {
    const onSelect = vi.fn() // 📣
    const a = render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" onSelect={onSelect} />)
    fireEvent.click(a.getAllByRole('button')[1]) // 🖱️
    expect(onSelect).toHaveBeenCalledWith('fr') // ✅
    a.unmount()
    const b = render(<AbLocaleSwitcher locales={LOCALES} current="fr" label="Language" presentation="inline" getHref={(c) => `/${c}`} />)
    const links = b.getAllByRole('link') // 🔗
    expect(links[1].getAttribute('aria-current')).toBe('true') // 🎯 Français
    expect(links[0].getAttribute('hreflang')).toBe('en') // 🌍
  })
  it('CSS: 48px rows, --tint active, motion-free', () => {
    const s = css('ab-locale-switcher/styles.module.css') // 🎨
    expect(s).toMatch(/\.inlineItem \{[^}]*min-block-size: 48px/) // 👆
    expect(s).toMatch(/\.inlineItem\[data-active='true'\] \{ background: var\(--ab-color-tint, #f4e7db\); color: var\(--ab-color-accent-text, #88603d\)/) // 🎯
  })
})
