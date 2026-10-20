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
* @name: AbList - Tests
* @file: __tests__/ab-list.test.tsx
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
import { AbList, AbListItem } from '../ab-list'

afterEach(cleanup)
const css = readFileSync(join(__dirname, '..', 'ab-list/styles.module.css'), 'utf8') // 🎨

describe('AbList + AbListItem (P13) 📋', () => {
  it('renders a ul of rows: media tile, title, meta, chevron; href rows are one link', () => {
    const { container } = render(
      <AbList label="Guides">
        <AbListItem href="/guides/install" media={<svg data-testid="ic" />} title="Install AbElements in a Next.js app" meta="Getting started" trailing="chevron" />
        <AbListItem badge="New" badgeTone="primary" title="AbDrawer" meta={<><code>ab-nextjs-components</code> · Oct 20</>} />
      </AbList>,
    )
    const ul = container.querySelector('ul[data-ab-part="list"]')!
    expect(ul.getAttribute('aria-label')).toBe('Guides') // ♿
    const rows = ul.querySelectorAll(':scope > li')
    expect(rows).toHaveLength(2)
    const link = rows[0].querySelector('a')!
    expect(link.getAttribute('href')).toBe('/guides/install') // 🔗 whole row
    expect(link.textContent).toContain('Getting started')
    expect(rows[0].querySelector('[aria-hidden="true"] svg')).not.toBeNull() // 🖼️ decorative tile
    expect(rows[1].querySelector('a')).toBeNull() // 🙅 no href, no link
    expect(rows[1].querySelector('[data-tone="primary"]')?.textContent).toBe('New') // 🏷️
    expect(rows[1].querySelector('code')?.textContent).toBe('ab-nextjs-components')
  })

  it('is server-safe', () => {
    expect(renderToStaticMarkup(<AbList><AbListItem title="x" /></AbList>)).toContain('data-ab-part="list-item"') // 🖥️
  })

  it('matches the mock numbers (home.css .list / .li-ic / .badge)', () => {
    expect(css).toMatch(/--ab-list-radius: 14px;/)
    expect(css).toMatch(/padding: 11px 14px;/)
    expect(css).toMatch(/gap: 12px;/)
    expect(css).toMatch(/width: 30px; height: 30px; border-radius: 8px;/) // 🖼️ tile
    expect(css).toMatch(/width: 64px; height: 22px; border-radius: 6px; font-size: 11px; font-weight: 700;/) // 🏷️
    expect(css).toMatch(/font-size: 13\.5px; font-weight: 600; line-height: 1\.3;/) // 💪
    expect(css).toMatch(/min-height: 44px;/) // 👆
    expect(css).toMatch(/\.abListMeta \{[^}]*font-size: 12px; line-height: 1\.42;/) // 📏 rows 59/60px like the mock (WebKit-measured)
    expect(css).toMatch(/outline-offset: -2px;/) // ♿ inset
    expect(css).toMatch(/\.abListMedia > \*, \.abListMedia svg \{ width: 18px; height: 18px; \}/) // 🔣 raw svg too
  })
})
