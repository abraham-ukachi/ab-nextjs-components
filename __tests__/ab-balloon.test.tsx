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
* @name: AbBalloon a11y - Tests (0.1.13)
* @file: __tests__/ab-balloon.test.tsx
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
// 🖼️ DOM renderer
import { act, cleanup, fireEvent, render } from '@testing-library/react'
// 🎈 under test
import AbBalloon, { AB_BALLOON_HOVER_DELAY } from '../ab-balloon'

beforeEach(() => vi.useFakeTimers()) // ⏱️
afterEach(() => { cleanup(); vi.useRealTimers() }) // 🧹

const setup = () => render(<AbBalloon title="Clear"><button aria-label="Clear">x</button></AbBalloon>) // 🧪

describe('AbBalloon (0.1.13 a11y)', () => {
  it('renders role=tooltip and points aria-describedby at it', () => {
    const { getByRole } = setup()
    const tip = getByRole('tooltip', { hidden: true }) // 💬
    expect(tip.textContent).toBe('Clear') // ✅
    expect(getByRole('button').getAttribute('aria-describedby')).toBe(tip.id) // 🔗
    expect(getByRole('button').closest('.AbBalloon')?.getAttribute('title')).toBeNull() // 🚫 no native title
  })
  it('shows on focus at once, hides on blur and Escape', () => {
    const { getByRole, container } = setup()
    const root = container.querySelector('.AbBalloon')!
    fireEvent.focus(getByRole('button')) // ⌨️
    expect(root.getAttribute('data-open')).toBe('true') // 👁️
    fireEvent.keyDown(getByRole('button'), { key: 'Escape' }) // ⎋
    expect(root.getAttribute('data-open')).toBe('false') // 🙈
    fireEvent.focus(getByRole('button'))
    fireEvent.blur(getByRole('button')) // 👋
    expect(root.getAttribute('data-open')).toBe('false')
  })
  it('waits 300ms on hover before showing', () => {
    const { container } = setup()
    const root = container.querySelector('.AbBalloon')!
    expect(AB_BALLOON_HOVER_DELAY).toBe(300) // ⏱️
    fireEvent.pointerEnter(root) // 🖱️
    act(() => { vi.advanceTimersByTime(299) })
    expect(root.getAttribute('data-open')).toBe('false') // ⏳ not yet
    act(() => { vi.advanceTimersByTime(1) })
    expect(root.getAttribute('data-open')).toBe('true') // ✅
    fireEvent.pointerLeave(root)
    expect(root.getAttribute('data-open')).toBe('false') // 👋
  })
  it('disabled / no title: no tooltip, no describedby', () => {
    const { queryByRole, getByRole } = render(<AbBalloon title="x" disabled><button>b</button></AbBalloon>)
    expect(queryByRole('tooltip', { hidden: true })).toBeNull() // 🚫
    expect(getByRole('button').hasAttribute('aria-describedby')).toBe(false) // 🚫
  })
})
