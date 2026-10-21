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
* @name: AbSidebar + AbNavbar v2 - Tests (G40, G41)
* @file: __tests__/ab-shell-nav.test.tsx
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
// 🖼️ renderers
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
// 🧭 next/navigation is mocked (no app router in tests)
vi.mock('next/navigation', () => ({ usePathname: () => '/docs/hooks' }))
// 🧭 under test
import AbSidebar, { isAbSidebarActive } from '../ab-sidebar'
import ServerAbSidebar from '../server/ab-sidebar'
import AbNavbar from '../ab-navbar'
import ServerAbNavbar from '../server/ab-navbar'
// 🔣 the client AbIcon only knows registered icons (per-icon modules keep bundles small)
import { registerAbIcons } from '../ab-icon/helpers'
import menuBook from 'ab-nextjs-icons/ab-icons/icons/menu_book'
registerAbIcons({ menu_book: menuBook }) // 🗂️

afterEach(cleanup) // 🧹

// 🗂️ fixtures
const sections = [
  { id: 'start', label: 'Start', items: [{ href: '/', icon: 'home', label: 'Home' }] },
  { id: 'docs', label: 'Docs', items: [{ href: '/docs/hooks', icon: 'code', label: 'Hooks', badge: 'New' }, { href: '/docs/components', icon: 'widgets', label: 'Components' }] },
]

describe('AbSidebar v2 (G40)', () => {
  it('matches exact and parent routes; "/" only matches itself', () => {
    expect(isAbSidebarActive('/docs', '/docs/hooks')).toBe(true) // 🌳
    expect(isAbSidebarActive('/', '/docs')).toBe(false) // 🏠
    expect(isAbSidebarActive('/doc', '/docs')).toBe(false) // 🚫 not a segment
  })
  it('renders sections with headings, aria-current, filled active icon and badge', () => {
    const html = renderToStaticMarkup(<ServerAbSidebar sections={sections} activeHref="/docs/hooks" />)
    expect(html).toContain('data-ab-part="sidebar"') // 🧩
    expect(html.match(/data-ab-part="section"/g)).toHaveLength(2) // 🗂️
    expect(html).toContain('>Docs</h2>') // 🏷️
    expect(html.match(/aria-current="page"/g)).toHaveLength(1) // ♿ only one
    expect(html).toMatch(/data-variant="filled" data-icon="code"/) // ⬛ active = filled
    expect(html).toMatch(/data-variant="outlined" data-icon="home"/) // ⬜
    expect(html).toContain('data-ab-part="badge"') // 🔴
    expect(html).not.toContain('material-symbols') // 🚫 G2
    expect(html).not.toContain('data-ab-part="collapse"') // 🚫 server: no JS toggle
  })
  it('client: collapse button toggles the rail with aria-expanded + aria-controls', () => {
    const onChange = vi.fn()
    const { container, getByRole } = render(<AbSidebar sections={sections} onCollapsedChange={onChange} />)
    const btn = getByRole('button', { name: 'Collapse sidebar' }) // 🔘
    expect(btn.getAttribute('aria-expanded')).toBe('true') // ♿
    expect(btn.getAttribute('aria-controls')).toBe('ab-sidebar-list') // ♿
    expect(container.querySelector('#ab-sidebar-list')).not.toBeNull() // 🎯 target exists
    expect(container.querySelector('[aria-current="page"]')?.textContent).toContain('Hooks') // 🧭 pathname fallback
    fireEvent.click(btn) // 👆
    expect(onChange).toHaveBeenCalledWith(true) // 🔔
    expect(container.querySelector('nav')!.getAttribute('data-ab-part')).toBe('rail') // 🚪
    expect(getByRole('button', { name: 'Expand sidebar' }).getAttribute('aria-expanded')).toBe('false') // ♿
    expect(document.querySelectorAll('[role="tooltip"]').length).toBe(3) // 🎈 balloons name the icons (0.2.1: portalled to <body>)
  })
  it('legacy links + page still work', () => {
    const html = renderToStaticMarkup(<ServerAbSidebar page="b" links={[{ href: '/a', icon: 'home', value: 'a', label: 'A' }, { href: '/b', icon: 'search', value: 'b', label: 'B' }]} />)
    expect(html).toMatch(/aria-current="page"[^>]*>[\s\S]*?>B</) // 🕰️
    expect(html).toContain('>abElements</a>') // 🏷️ legacy brand
  })
})

describe('AbNavbar v2 (G41)', () => {
  it('link + button items, filled active icon, aria-current', () => {
    const onSelect = vi.fn()
    const { container, getByRole } = render(
      <AbNavbar items={[{ kind: 'link', href: '/docs', icon: 'menu_book', label: 'Docs' }, { kind: 'button', id: 'menu', icon: 'menu', label: 'Menu', onSelect, expanded: false, controls: 'sheet' }]} />,
    )
    const docs = container.querySelector('a[data-kind="link"]')! // 🔗
    expect(docs.getAttribute('aria-current')).toBe('page') // ♿ /docs/hooks is under /docs
    expect(docs.querySelector('[data-variant="filled"]')).not.toBeNull() // ⬛
    const menu = getByRole('button', { name: 'Menu' }) // 🔘
    expect(menu.getAttribute('aria-controls')).toBe('sheet') // ♿
    fireEvent.click(menu)
    expect(onSelect).toHaveBeenCalled() // 🔔
  })
  it('server twin + legacy links', () => {
    const html = renderToStaticMarkup(<ServerAbNavbar page="a" links={[{ href: '/a', icon: 'home', value: 'a', label: 'A' }]} />)
    expect(html).toContain('data-ab-part="bottomBar"') // 🧩
    expect(html).toContain('aria-current="page"') // ♿
  })
})
