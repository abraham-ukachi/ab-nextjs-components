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
* @name: AbBreadcrumbs - Tests
* @file: __tests__/ab-breadcrumbs.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbBreadcrumbs from '../ab-breadcrumbs'

afterEach(cleanup)

describe('AbBreadcrumbs (P2) 🍞', () => {
  it('nav > ol; links for ancestors, aria-current on the last; separators hidden', () => {
    const { container } = render(<AbBreadcrumbs items={[{ label: 'Docs', href: '/docs' }, { label: 'Home' }]} />)
    const nav = container.querySelector('nav')!
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb') // ♿
    const lis = nav.querySelectorAll('ol > li')
    expect(lis).toHaveLength(2)
    expect(lis[0].querySelector('a')?.getAttribute('href')).toBe('/docs') // 🔗
    expect(lis[1].querySelector('[aria-current="page"]')?.textContent).toBe('Home') // 🎯
    expect(lis[1].querySelector('a')).toBeNull() // 🙅 current is not a link
    expect(lis[0].querySelector('[data-ab-icon]')).toBeNull() // 🙅 no separator before the first
    expect(lis[1].querySelector('[aria-hidden="true"]')).not.toBeNull() // › decorative
  })
  it('is server-safe and matches the mock .crumb', () => {
    expect(renderToStaticMarkup(<AbBreadcrumbs items={[{ label: 'Docs' }]} />)).toContain('aria-current="page"')
    const css = readFileSync(join(__dirname, '..', 'ab-breadcrumbs/styles.module.css'), 'utf8')
    expect(css).toMatch(/font-size: 13px;/); expect(css).toMatch(/gap: 4px;/); expect(css).toMatch(/font-weight: 650;/); expect(css).toMatch(/width: 16px; height: 16px;/)
  })
})
