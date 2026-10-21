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
* @name: AbSidebar footer slot tests (0.2.1)
* @file: __tests__/ab-sidebar-footer.test.tsx
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
import { cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import AbSidebar from '../ab-sidebar'
import ServerAbSidebar from '../server/ab-sidebar'

vi.mock('next/navigation', () => ({ usePathname: () => '/' })) // 🧭
afterEach(() => cleanup()) // 🧹
const S = [{ id: 'a', items: [{ href: '/', label: 'Home' }] }] // 🗂️

describe('🦶 AbSidebar footer slot (0.2.1)', () => {
  it('renders after the sections, inside the <nav>', () => {
    const { container } = render(<AbSidebar sections={S} footer={<b>me</b>} />)
    const foot = container.querySelector('nav > [data-ab-part="sidebar-footer"]') // 🦶
    expect(foot?.textContent).toBe('me') // ✅
    expect(foot?.previousElementSibling?.id).toBe('ab-sidebar-list') // ⬇️ last
  })
  it('the server twin renders it too', () => {
    expect(renderToStaticMarkup(<ServerAbSidebar sections={S} footer={<b>me</b>} />)).toContain('data-ab-part="sidebar-footer"') // 🖥️
  })
  it('no footer, no slot', () => {
    const { container } = render(<AbSidebar sections={S} />)
    expect(container.querySelector('[data-ab-part="sidebar-footer"]')).toBeNull() // 🚫
  })
})
