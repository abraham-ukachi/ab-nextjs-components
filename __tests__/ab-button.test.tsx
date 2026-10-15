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
* @name: AbButton - Tests (G22)
* @file: __tests__/ab-button.test.tsx
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
import { cleanup, fireEvent, render } from '@testing-library/react'
// 🖨️ static server render
import { renderToStaticMarkup } from 'react-dom/server'
// 🔘 twins under test
import AbButton from '../ab-button'
import ServerAbButton from '../server/ab-button'
// 🧮 shared rules
import { getAbButtonDisabledMode } from '../ab-button/helpers'

// 🧹 unmount
afterEach(() => cleanup())

describe('getAbButtonDisabledMode', () => {
  it('keeps pre-G22 behaviour unless the button explains itself', () => {
    expect(getAbButtonDisabledMode({})).toBe('none') // ✅
    expect(getAbButtonDisabledMode({ disabled: true })).toBe('native') // 👴 unchanged
    expect(getAbButtonDisabledMode({ isLoading: true })).toBe('native') // ⏳
    expect(getAbButtonDisabledMode({ disabled: true, badge: 'Coming soon' })).toBe('aria') // 🏷️
    expect(getAbButtonDisabledMode({ disabled: true, disabledReason: 'Sign-in arrives later' })).toBe('aria') // 💬
    expect(getAbButtonDisabledMode({ disabled: true, badge: 'x', focusableWhenDisabled: false })).toBe('native') // ⌨️ override
    expect(getAbButtonDisabledMode({ badge: 'New' })).toBe('none') // 🏷️ badge alone ≠ disabled
  })
})

describe('AbButton (client)', () => {
  it('"Continue with GitHub" disabled + coming soon: focusable, named, inert to clicks', () => {
    const onClick = vi.fn() // 🖱️
    const { getByRole } = render(
      <form onSubmit={(e) => { e.preventDefault(); onClick('submit') }}>
        <AbButton type="outlined" htmlType="submit" label="Continue with GitHub" startIcon={<svg data-testid="gh" />} disabled badge="Coming soon" onClick={onClick} />
      </form>,
    )
    const button = getByRole('button') // 🔘
    expect(button.getAttribute('aria-disabled')).toBe('true') // 🚦
    expect(button.hasAttribute('disabled')).toBe(false) // ⌨️ still focusable
    expect(button.getAttribute('type')).toBe('button') // 🧾 can't submit
    expect(button.textContent).toBe('Continue with GitHub, Coming soon') // 🗣️ accessible name
    fireEvent.click(button) // 🖱️
    expect(onClick).not.toHaveBeenCalled() // 🛑 neither handler nor submit
    expect(button.querySelector('[data-ab-part="badge"]')?.getAttribute('data-tone')).toBe('neutral') // 🎨
  })

  it('disabledReason is announced; the badge is then hidden to avoid saying it twice', () => {
    const { getByRole } = render(<AbButton label="Continue with GitHub" disabled badge="Soon" badgeTone="accent" disabledReason="Sign-in arrives in a later release" />)
    const button = getByRole('button') // 🔘
    expect(button.textContent).toContain('Sign-in arrives in a later release') // 💬
    expect(button.querySelector('[data-ab-part="badge"]')?.getAttribute('aria-hidden')).toBe('true') // 🙈
  })

  it('plain disabled stays native; enabled clicks fire', () => {
    const onClick = vi.fn() // 🖱️
    const { getAllByRole } = render(<><AbButton label="A" disabled /><AbButton label="B" onClick={onClick} endIcon={<svg />} /></>)
    const [a, b] = getAllByRole('button') // 🔘
    expect(a.hasAttribute('disabled')).toBe(true) // 👴
    fireEvent.click(b) // 🖱️
    expect(onClick).toHaveBeenCalledOnce() // ✅
    expect(b.querySelectorAll('[aria-hidden="true"] svg')).toHaveLength(1) // 🖼️ icon decorative
  })

  it('links are links; a disabled link has no href', () => {
    const { container } = render(<><AbButton label="Docs" href="/docs" /><AbButton label="Soon" href="/x" disabled badge="Soon" /></>)
    const live = container.querySelector('a') as HTMLAnchorElement // 🔗
    expect(live.getAttribute('role')).toBeNull() // ♿ not role=button
    const dead = container.querySelector('[role="link"]') as HTMLElement // 🚫
    expect(dead.tagName).toBe('SPAN') // 🧱
    expect(dead.getAttribute('aria-disabled')).toBe('true') // 🚦
    expect(dead.getAttribute('tabindex')).toBe('0') // ⌨️ aria mode
  })
})

describe('AbButton (server twin)', () => {
  it('renders the same disabled + badge semantics without JS', () => {
    const html = renderToStaticMarkup(<ServerAbButton htmlType="submit" label="Continue with GitHub" disabled badge="Coming soon" />) // 🖨️
    expect(html).toContain('type="button"') // 🧾 no-JS can't submit
    expect(html).toContain('aria-disabled="true"') // 🚦
    expect(html).not.toMatch(/<button[^>]*\sdisabled=""/) // ⌨️ focusable
    expect(html).toContain('data-disabled-mode="aria"') // 🗂️
    expect(html).toContain('Coming soon') // 🏷️
  })
})
