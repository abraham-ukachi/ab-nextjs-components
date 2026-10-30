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
* @name: AbChip long text (ellipsis | wrap) - Tests (404 gaps)
* @file: __tests__/ab-chip-overflow.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { describe, expect, it } from 'vitest'
// ⚛️ SSR render
import { renderToStaticMarkup } from 'react-dom/server'
// 🏷️ under test
import AbChip from '../ab-chip'

const long = '/docs/packages/button/a/very/long/path/that/does/not/fit' // 📏

describe('AbChip overflow ✂️', () => {
  it('defaults to ellipsis with the full text as a title', () => {
    const html = renderToStaticMarkup(<AbChip>{long}</AbChip>) // ✂️
    expect(html).toContain('data-overflow="ellipsis"') // 🗂️
    expect(html).toContain(`title="${long}"`) // 💬
  })
  it('wrap mode has no auto title', () => {
    const html = renderToStaticMarkup(<AbChip overflow="wrap">{long}</AbChip>) // ↩️
    expect(html).toContain('data-overflow="wrap"') // 🗂️
    expect(html).not.toContain('title=') // 🚫
  })
  it('an explicit title wins; non-string children get no auto title', () => {
    expect(renderToStaticMarkup(<AbChip title="Full">x</AbChip>)).toContain('title="Full"') // 💬
    expect(renderToStaticMarkup(<AbChip><b>x</b></AbChip>)).not.toContain('title=') // 🚫
  })
})
