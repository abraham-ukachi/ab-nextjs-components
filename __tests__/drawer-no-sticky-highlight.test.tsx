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
* @name: Nav drawer: no highlight on open (Joseph, 0.2.1)
* @file: __tests__/drawer-no-sticky-highlight.test.tsx
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
import { act, cleanup, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbNavDrawer from '../ab-nav-drawer'
import { AB_DRAWER_DURATION } from '../ab-drawer'

beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const kit = readFileSync(join(__dirname, '../ab-drawer/kit.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🎨 no comments

describe('🧹 nav drawer opens with no highlighted row (Joseph fidelity-7)', () => {
  it('🎯 focus lands on the drawer panel, not the Settings row', () => {
    render(<div className="AbAppLayout"><AbNavDrawer open onClose={vi.fn()} onSettings={vi.fn()} logo={<a href="/">Ab</a>} sections={[{ id: 't', items: [{ href: '/', label: 'Home' }] }]} activeHref="/" /></div>)
    act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) }) // ⏱️
    const a = document.activeElement as HTMLElement
    expect(a.getAttribute('data-ab-part')).toBe('drawer') // 🗄️ the panel
    expect(a.textContent).toContain('Settings') // (it's inside the panel)
    expect(a.matches('button')).toBe(false) // 🚫 not the row
  })
  it('🖱️ every kit :hover tint is inside @media (hover: hover) (no sticky tap-hover on touch)', () => {
    const bare = kit.split('\n').filter((l) => l.includes(':hover') && !l.startsWith('@media (hover: hover)')) // 🔍
    expect(bare).toEqual([]) // ✅
  })
  it('♿ rows only get a ring on :focus-visible, never a fill on :focus', () => {
    expect(kit).not.toMatch(/\.row:focus\s*\{[^}]*background/) // 🚫
    expect(kit).toMatch(/\.row:focus-visible \{ outline: 2px solid/) // ♿
  })
})
