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
* @name: AbDrawerList + AbConfirmDrawer - Tests
* @file: __tests__/ab-drawer-presets.test.tsx
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
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
// 🗄️ under test
import AbDrawerList from '../ab-drawer-list'
import AbConfirmDrawer from '../ab-confirm-drawer'

afterEach(() => { cleanup(); document.body.innerHTML = '' })
const items = [{ value: 'en', label: 'English', lang: 'en' }, { value: 'fr', label: 'Français', lang: 'fr' }, { value: 'de', label: 'Deutsch', disabled: true }, { value: 'docs', label: 'Docs', href: '/docs' }]

describe('AbDrawerList 📋', () => {
  it('marks the current item, selects + closes, respects disabled and links', () => {
    const onSelect = vi.fn(); const onClose = vi.fn()
    render(<AbDrawerList open title="Language" items={items} value="fr" onSelect={onSelect} onClose={onClose} side="bottom" scope="app" />)
    const fr = screen.getByRole('button', { name: /Français/ })
    expect(fr.getAttribute('aria-current')).toBe('true') // ✓
    expect(screen.getByRole('button', { name: /English/ }).hasAttribute('aria-current')).toBe(false)
    expect(fr.querySelector('[lang]')?.getAttribute('lang')).toBe('fr') // 🌐 each language named in itself
    fireEvent.click(screen.getByRole('button', { name: /English/ }))
    expect(onSelect).toHaveBeenCalledWith('en'); expect(onClose).toHaveBeenCalledTimes(1) // 🔔 🚪
    expect((screen.getByRole('button', { name: /Deutsch/ }) as HTMLButtonElement).disabled).toBe(true) // 🚫
    expect(screen.getByRole('link', { name: /Docs/ }).getAttribute('href')).toBe('/docs') // 🔗
  })

  it('closeOnSelect={false} keeps it open; SSR renders the list in flow', () => {
    const onClose = vi.fn()
    render(<AbDrawerList open title="Sort" items={items} onClose={onClose} closeOnSelect={false} />)
    fireEvent.click(screen.getByRole('button', { name: /English/ }))
    expect(onClose).not.toHaveBeenCalled()
    const html = renderToStaticMarkup(<AbDrawerList open={false} title="Language" items={items} onClose={() => {}} />)
    expect(html).toContain('data-ab-part="drawer-fallback"'); expect(html).toContain('Français') // 🧩 D41
  })
})

describe('AbConfirmDrawer ❓', () => {
  it('confirm runs onConfirm then closes; cancel runs onCancel then closes', () => {
    const onConfirm = vi.fn(); const onCancel = vi.fn(); const onClose = vi.fn()
    render(<AbConfirmDrawer open title="Discard changes?" message="Your edits will be lost." confirmLabel="Discard" tone="danger" onConfirm={onConfirm} onCancel={onCancel} onClose={onClose} />)
    expect(screen.getByRole('dialog').getAttribute('data-side')).toBe('bottom') // ⬇️ default
    expect(screen.getByText('Your edits will be lost.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }))
    expect(onConfirm).toHaveBeenCalledTimes(1); expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1); expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('Escape = cancel; busy disables both buttons', () => {
    const onCancel = vi.fn(); const onClose = vi.fn()
    render(<AbConfirmDrawer open title="Delete?" busy onConfirm={() => {}} onCancel={onCancel} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1); expect(onClose).toHaveBeenCalledTimes(1) // ⎋
    expect((screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement).disabled).toBe(true) // ⏳
  })
})
