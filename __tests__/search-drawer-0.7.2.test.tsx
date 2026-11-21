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
* @name: AbSearchDrawer 0.7.2 tests (G60 ids, loading / offline / error, badge, hash returnFocus)
* @file: __tests__/search-drawer-0.7.2.test.tsx
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
// 🧱 DOM renderer
import { act, cleanup, fireEvent, render } from '@testing-library/react'
// 🔎 under test
import AbSearchDrawer, { AbSearchOfflineError, isAbSearchOffline, type AbSearchDrawerGroup, type AbSearchDrawerProps } from '../ab-search-drawer'
// 📦 the root barrel (exports check)
import * as pkg from '../index'
// ⏱️ the slide duration (to flush open / close)
import { AB_DRAWER_DURATION } from '../ab-drawer'

// ⏱️ fake timers + rAF on timers, clean storage (same harness as ab-search-drawer.test.tsx)
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)); localStorage.clear() })
// 🧹 unmount, real timers, globals back
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
// ⏩ run the debounce / slide + settle promises
const flush = async () => { await act(async () => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 200) }); await act(async () => { await Promise.resolve() }) }
// 🧱 mount an open drawer inside a core-like layout
const mount = async (props: Partial<AbSearchDrawerProps> & Pick<AbSearchDrawerProps, 'search'>) => {
  const onClose = vi.fn() // ⎋
  const utils = render(<div className="AbAppLayout"><main data-ab-part="main"><AbSearchDrawer open onClose={onClose} {...props} /></main></div>) // 🗄️
  await flush() // ⏩
  return { onClose, utils, input: document.querySelector<HTMLInputElement>('input[role="combobox"]')! }
}
// ⌨️ type a query and let the debounce run
const type = async (el: HTMLInputElement, v: string) => { fireEvent.change(el, { target: { value: v } }); await flush() }

describe('G60: group / option ids are unique even when the app repeats group ids 🧹', () => {
  // 📦 two groups with the SAME id (and an empty one in between), items with repeated ids
  const DUP: AbSearchDrawerGroup[] = [
    { id: 'pkg', label: 'Components', items: [{ id: 'x', href: '/a', title: 'AbButton' }, { id: 'y', href: '/b', title: 'AbBadge' }] },
    { id: 'pkg', label: 'Empty', items: [] },
    { id: 'pkg', label: 'Hooks', items: [{ id: 'x', href: '/c', title: 'useAbButton' }] },
  ]
  it('every option + group label has its own id; ↓ walks all three options in order', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {}) // 👀 React key warnings
    const { input } = await mount({ search: () => DUP }) // 🗄️
    await type(input, 'ab') // ⌨️
    const opts = Array.from(document.querySelectorAll('[role="option"]')) // 📋
    expect(opts.map((o) => o.textContent)).toEqual(['AbButton', 'AbBadge', 'useAbButton']) // ✅ order, empty group skipped
    expect(new Set(opts.map((o) => o.id)).size).toBe(3) // 🆔 unique option ids (0.7.1 repeated the first group's)
    const labels = Array.from(document.querySelectorAll('[role="group"]')).map((g) => g.getAttribute('aria-labelledby')) // 🏷️
    expect(new Set(labels).size).toBe(2) // 🆔 unique group labels
    for (const id of labels) expect(document.getElementById(id!)).not.toBeNull() // 🔗 they resolve
    fireEvent.keyDown(input, { key: 'ArrowDown' }); fireEvent.keyDown(input, { key: 'ArrowDown' }) // ⬇️⬇️
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[2].id) // 🎯 the Hooks option
    expect(err.mock.calls.flat().join(' ')).not.toMatch(/same key/) // ✅ no duplicate React keys
    err.mockRestore() // 🧹
  })
})

describe('⏳ 0.7.2: loading (aria-busy), offline and error states', () => {
  // 📦 one tiny result set
  const ONE: AbSearchDrawerGroup[] = [{ id: 'c', label: 'Components', items: [{ id: 'b', href: '/c/button', title: 'AbButton' }] }]
  // 🔎 the results box + live region
  const box = () => document.querySelector<HTMLElement>('[data-ab-part="search-results"]')! // 📜
  const live = () => document.querySelector('[role="status"]')!.textContent // 📣
  // 🎛️ a search we resolve / reject by hand
  const deferred = () => { let res!: (g: readonly AbSearchDrawerGroup[]) => void, rej!: (e: unknown) => void; const p = new Promise<readonly AbSearchDrawerGroup[]>((a, b) => { res = a; rej = b }); return { p, res, rej } }

  it('an async search shows "Searching…" with aria-busy, then the results (busy cleared)', async () => {
    const d = deferred() // 🎛️
    const { input } = await mount({ search: () => d.p }) // 🗄️
    await type(input, 'button') // ⌨️
    expect(box().getAttribute('aria-busy')).toBe('true') // ⏳ busy
    expect(document.querySelector('[role="listbox"]')!.getAttribute('aria-busy')).toBe('true') // ⏳ the listbox too
    expect(document.querySelector('[data-ab-part="search-loading"]')!.textContent).toBe('Searching…') // 👀
    expect(live()).toBe('Searching…') // 📣
    expect(document.querySelector('[data-ab-part="search-empty"]')).toBeNull() // 🙅 not "No results" while waiting
    await act(async () => { d.res(ONE); await Promise.resolve() }) // ✅ answer
    expect(box().hasAttribute('aria-busy')).toBe(false) // ⏳ done
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1) // 📦
    expect(live()).toBe('1 result') // 📣
  })
  it('a sync search never flashes the loading state', async () => {
    const { input } = await mount({ search: () => ONE }) // 🗄️
    await type(input, 'button') // ⌨️
    expect(document.querySelector('[data-ab-part="search-loading"]')).toBeNull() // 🙅
    expect(box().getAttribute('data-status')).toBe('done') // ✅
  })
  it('offline (AbSearchOfflineError): the offline panel + Try again, never "No results"; retry re-runs the search', async () => {
    let offline = true // 📴
    const search = vi.fn(() => (offline ? Promise.reject(new AbSearchOfflineError()) : Promise.resolve(ONE))) // 🔎
    const { input } = await mount({ search, labels: { offlineTitle: 'Hors ligne', retry: 'Réessayer' } }) // 🌍 labels override
    await type(input, 'button'); await flush() // ⌨️
    const panel = document.querySelector('[data-ab-part="search-offline"]')! // 📴
    expect(panel.querySelector('b')!.textContent).toBe('Hors ligne') // 🏷️
    expect(document.querySelector('[data-ab-part="search-empty"]')).toBeNull() // 🙅 not "No results"
    expect(live()).toBe('Hors ligne') // 📣
    expect(box().hasAttribute('aria-busy')).toBe(false) // ⏳ not busy
    offline = false // 🌐 back
    fireEvent.click(panel.querySelector('button')!) // 🔁 Réessayer
    expect(panel.querySelector('button')!.textContent).toContain('Réessayer') // 🏷️
    await flush(); await flush() // ⏩
    expect(search).toHaveBeenCalledTimes(2) // 🔁 re-ran
    expect(document.activeElement).toBe(input) // 🎯 focus stays in the input
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1) // ✅ results
  })
  it('offline retries by itself when the browser comes back online', async () => {
    let offline = true // 📴
    const search = vi.fn(() => (offline ? Promise.reject(Object.assign(new Error('x'), { offline: true })) : Promise.resolve(ONE))) // 🔎 `offline: true` flag
    const { input } = await mount({ search }) // 🗄️
    await type(input, 'button'); await flush() // ⌨️
    expect(document.querySelector('[data-ab-part="search-offline"]')).not.toBeNull() // 📴
    offline = false; await act(async () => { window.dispatchEvent(new Event('online')) }); await flush(); await flush() // 🌐
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1) // ✅
  })
  it('any other failure (reject or sync throw) shows the error panel, not "No results"', async () => {
    const { input } = await mount({ search: () => { throw new Error('boom') } }) // 🛑 sync throw
    await type(input, 'button'); await flush() // ⌨️
    expect(document.querySelector('[data-ab-part="search-error"] b')!.textContent).toBe('Search isn’t available right now') // 🛑
    expect(document.querySelector('[data-ab-part="search-empty"]')).toBeNull() // 🙅
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(0) // 🧯
  })
  it('isAbSearchOffline: by name, by flag, or by navigator.onLine; exported from the root', () => {
    expect(isAbSearchOffline(new AbSearchOfflineError())).toBe(true) // 📴
    expect(isAbSearchOffline({ name: 'AbSearchOfflineError' })).toBe(true) // 📴 duck-typed
    expect(isAbSearchOffline({ offline: true })).toBe(true) // 📴 flag
    expect(isAbSearchOffline(new Error('500'))).toBe(false) // 🛑
    vi.stubGlobal('navigator', { onLine: false }) // 🌐 offline browser
    expect(isAbSearchOffline(new Error('fetch'))).toBe(true) // 📴
    expect(typeof pkg.isAbSearchOffline).toBe('function'); expect(typeof pkg.AbSearchOfflineError).toBe('function') // 📦
  })
})
