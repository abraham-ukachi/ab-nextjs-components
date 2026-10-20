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
* @name: AbSearchDrawer tests
* @file: __tests__/ab-search-drawer.test.tsx
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
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import AbSearchDrawer, { AB_SEARCH_RECENT_KEY, addAbSearchRecent, highlightAbSearch, type AbSearchDrawerGroup } from '../ab-search-drawer'
import { AB_DRAWER_DURATION } from '../ab-drawer'
import * as pkg from '../index'

// 📦 John's frame data
const RES: AbSearchDrawerGroup[] = [
  { id: 'c', label: 'Components', meta: 'ab-nextjs-components', items: [{ id: 'b', href: '/c/button', title: 'AbButton', description: 'Primary, secondary and ghost buttons.', meta: 'v0.2.x', icon: 'widgets' }, { id: 'ib', href: '/c/icon-button', title: 'AbIconButton', description: '44px icon-only button with aria-label.', meta: 'v0.2.x', icon: 'widgets' }] },
  { id: 'h', label: 'Hooks', meta: 'ab-nextjs-hooks', items: [{ id: 'ub', href: '/h/use-button', title: 'useButton', description: 'Press, focus and loading state for buttons.', meta: 'v0.2.x', icon: 'webhook' }] },
]
const search = vi.fn((q: string) => (q.toLowerCase().startsWith('butto') ? RES : []))
const stubMedia = (mobile: boolean) => vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('max-width: 767px') ? mobile : false, media: q, addEventListener: () => {}, removeEventListener: () => {} }))
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)); localStorage.clear(); search.mockClear() })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = async () => { await act(async () => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 200) }); await act(async () => { await Promise.resolve() }) }
const mount = async (over: Record<string, unknown> = {}) => {
  const onClose = vi.fn()
  render(<div className="AbAppLayout"><main data-ab-part="main"><AbSearchDrawer open onClose={onClose} search={search} suggest={(q) => (q === 'buttn' ? 'button' : null)} {...over} /></main></div>)
  await flush()
  return { onClose, input: document.querySelector<HTMLInputElement>('input[role="combobox"]')! }
}
const type = async (el: HTMLInputElement, v: string) => { fireEvent.change(el, { target: { value: v } }); await flush() }

describe('AbSearchDrawer (drawers v2 §4) 🔎', () => {
  it('a sheet-tier dialog "Search": full height only on mobile, centred on laptop; the input is autofocused', async () => {
    stubMedia(true); const { input } = await mount()
    const dlg = document.querySelector<HTMLElement>('[role="dialog"]')!
    expect(document.getElementById(dlg.getAttribute('aria-labelledby')!)!.textContent).toBe('Search')
    expect(dlg.dataset.snap).toBe('full') // 📱 no 70% stop
    expect(document.activeElement).toBe(input) // 🎯
    expect(input.placeholder).toBe('Search packages, components, hooks…')
    cleanup(); document.body.innerHTML = ''; stubMedia(false); await mount()
    expect(document.querySelector('[role="dialog"]')!.getAttribute('data-center')).toBe('main') // 💻
  })
  it('combobox → listbox: aria-controls / -autocomplete / -activedescendant; labelled groups; options with aria-selected', async () => {
    const { input } = await mount()
    expect(input.getAttribute('aria-expanded')).toBe('false')
    await type(input, 'button')
    expect(search).toHaveBeenCalledWith('button') // ⏱️ debounced
    const lb = document.getElementById(input.getAttribute('aria-controls')!)!
    expect(lb.getAttribute('role')).toBe('listbox'); expect(input.getAttribute('aria-expanded')).toBe('true'); expect(input.getAttribute('aria-autocomplete')).toBe('list')
    const groups = Array.from(lb.querySelectorAll('[role="group"]')).map((g) => document.getElementById(g.getAttribute('aria-labelledby')!)!.textContent)
    expect(groups).toEqual(['Componentsab-nextjs-components', 'Hooksab-nextjs-hooks']) // 📦 label + package
    const opts = lb.querySelectorAll('[role="option"]'); expect(opts).toHaveLength(3)
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[0].id); expect(opts[0].getAttribute('aria-selected')).toBe('true') // 🎯 the drawn active row
    expect(opts[0].querySelector('mark')!.textContent).toBe('Button') // 🖍️
    expect(document.querySelector('[role="status"]')!.textContent).toBe('3 results') // 📣
  })
  it('↑/↓ wrap across groups; Enter opens the active result and saves the query to recents', async () => {
    const { input, onClose } = await mount(); await type(input, 'button')
    const opts = () => Array.from(document.querySelectorAll('[role="option"]'))
    fireEvent.keyDown(input, { key: 'ArrowUp' }); expect(input.getAttribute('aria-activedescendant')).toBe(opts()[2].id) // 🔁 wraps to the end
    fireEvent.keyDown(input, { key: 'ArrowDown' }); expect(input.getAttribute('aria-activedescendant')).toBe(opts()[0].id) // 🔁 and back
    fireEvent.keyDown(input, { key: 'ArrowDown' }) // 🎯 AbIconButton (another row in the first group)
    const click = vi.fn((e: Event) => e.preventDefault()); opts()[1].addEventListener('click', click)
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(click).toHaveBeenCalled(); expect(onClose).toHaveBeenCalled() // 🔗
    expect(JSON.parse(localStorage.getItem(AB_SEARCH_RECENT_KEY)!)).toEqual(['button']) // 🕘
  })
  it('Esc clears the query first (the drawer stays), then closes', async () => {
    const { input, onClose } = await mount(); await type(input, 'button')
    fireEvent.keyDown(input, { key: 'Escape' }); expect(input.value).toBe(''); expect(onClose).not.toHaveBeenCalled()
    fireEvent.keyDown(input, { key: 'Escape' }); expect(onClose).toHaveBeenCalled()
  })
  it('the clear button empties the input and keeps focus there', async () => {
    const { input } = await mount(); await type(input, 'button')
    fireEvent.click(document.querySelector('button[aria-label="Clear search"]')!)
    expect(input.value).toBe(''); expect(document.activeElement).toBe(input)
  })
  it('recents: up to 4 from localStorage, each removable ("Remove <term>"); tapping one searches it', async () => {
    localStorage.setItem(AB_SEARCH_RECENT_KEY, JSON.stringify(['AbBottomDrawer', 'useTheme', 'dark mode tokens']))
    const { input } = await mount()
    expect(document.querySelector('[data-ab-part="search-results"]')!.textContent).toMatch(/Recent[\s\S]*AbBottomDrawer[\s\S]*useTheme[\s\S]*dark mode tokens/)
    fireEvent.click(document.querySelector('button[aria-label="Remove useTheme"]')!)
    expect(JSON.parse(localStorage.getItem(AB_SEARCH_RECENT_KEY)!)).toEqual(['AbBottomDrawer', 'dark mode tokens'])
    fireEvent.click(Array.from(document.querySelectorAll('button')).find((b) => b.textContent === 'AbBottomDrawer')!)
    expect(input.value).toBe('AbBottomDrawer')
  })
  it('no results: the message, the hint, "Did you mean button?"; live region says No results', async () => {
    const { input } = await mount(); await type(input, 'buttn')
    const empty = document.querySelector('[data-ab-part="search-empty"]')!
    expect(empty.textContent).toMatch(/No results for “buttn”/); expect(empty.textContent).toMatch(/Did you mean.button\?/)
    expect(document.querySelector('[role="status"]')!.textContent).toBe('No results')
    fireEvent.click(empty.querySelector('button')!); expect(input.value).toBe('button')
  })
  it('helpers: addAbSearchRecent de-dupes + caps; highlightAbSearch marks every match', () => {
    expect(addAbSearchRecent(['a', 'B', 'c', 'd'], 'b')).toEqual(['b', 'a', 'c', 'd'])
    expect(addAbSearchRecent(['a', 'b', 'c', 'd'], 'e')).toEqual(['e', 'a', 'b', 'c'])
    expect(renderToStaticMarkup(<>{highlightAbSearch('Button buttons', 'button')}</>)).toBe('<mark class="mark">Button</mark> <mark class="mark">button</mark>s')
  })
  it('is exported from the package root', () => { expect(pkg.AbSearchDrawer).toBe(AbSearchDrawer) })
  it('a rejected (or throwing) search clears to a safe empty state: no stale results, no unhandled rejection (James P2)', async () => {
    let fail = false
    const flaky = vi.fn((q: string) => { if (fail) return q === 'buttons' ? Promise.reject(new Error('net')) : (() => { throw new Error('sync') })(); return RES })
    const { input } = await mount({ search: flaky })
    await type(input, 'button'); await flush()
    expect(document.querySelectorAll('[role="option"]').length).toBe(3) // 📦 results
    fail = true; await type(input, 'buttons'); await flush(); await flush()
    expect(document.querySelectorAll('[role="option"]').length).toBe(0) // 🧯 stale results gone
    expect(input.hasAttribute('aria-activedescendant')).toBe(false)
    await type(input, 'buttonz'); await flush(); await flush()
    expect(document.querySelectorAll('[role="option"]').length).toBe(0) // 🧯 sync throw too
    fail = false; await type(input, 'button'); await flush()
    expect(document.querySelectorAll('[role="option"]').length).toBe(3) // 🔁 recovers
  })
})
