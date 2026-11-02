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
* @name: AbCallout - Tests (0.3.4)
* @file: __tests__/ab-callout-0.3.4.test.tsx
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
// 🖨️ server render (AbCallout is a server component)
import { renderToStaticMarkup } from 'react-dom/server'
// 🧩 under test
import AbCallout, { AB_CALLOUT_ICONS } from '../ab-callout'
import { AB_ICON_BUILTINS } from '../ab-icon'
import * as pkg from '../index'

// 💡 Joseph (0.2.24 MDX docs): note / tip / warning / danger admonitions
describe('💡 AbCallout', () => {
  it('defaults to a note: role="note", data-variant, the info icon', () => {
    const h = renderToStaticMarkup(<AbCallout title="Note">Body</AbCallout>) // 🖨️
    expect(h).toMatch(/^<div role="note"/) // ♿ static aside, not an alert
    expect(h).toContain('data-variant="note"') // 🎨
    expect(h).toContain('data-icon="info"') // 🔣
    expect(h).toContain('>Note</p>') // 🏷️ the title
    expect(h).toContain('>Body</div>') // 📝
  })
  for (const [variant, icon] of Object.entries(AB_CALLOUT_ICONS)) {
    it(`${variant}: the ${icon} built-in icon, hidden from AT`, () => {
      const h = renderToStaticMarkup(<AbCallout variant={variant as 'note'}>x</AbCallout>) // 🖨️
      expect(h).toContain(`data-variant="${variant}"`) // 🎨
      expect(h).toMatch(new RegExp(`aria-hidden="true"><span[^>]*data-icon="${icon}"`)) // 🔣 decorative
      expect(h).toContain('<svg') // 🖼️ real glyph
      expect(AB_ICON_BUILTINS[icon], icon).toBeDefined() // 🗂️ a built-in (client AbIcon too)
    })
  }
  it('without a title the kind is its accessible name (not colour/icon alone)', () => {
    expect(renderToStaticMarkup(<AbCallout variant="danger">x</AbCallout>)).toContain('aria-label="Danger"') // ♿
    expect(renderToStaticMarkup(<AbCallout variant="tip" label="Astuce">x</AbCallout>)).toContain('aria-label="Astuce"') // 🇫🇷
    expect(renderToStaticMarkup(<AbCallout title="T">x</AbCallout>)).not.toContain('aria-label') // 🏷️ the title is visible
  })
  it('role and icon can be overridden; icon={null} hides it', () => {
    expect(renderToStaticMarkup(<AbCallout role="alert">x</AbCallout>)).toMatch(/^<div role="alert"/) // 📣
    expect(renderToStaticMarkup(<AbCallout icon={null}>x</AbCallout>)).not.toContain('data-icon') // 🙅
    expect(renderToStaticMarkup(<AbCallout icon="check">x</AbCallout>)).toContain('data-icon="check"') // 🔁
  })
  it('is exported', () => {
    expect(pkg.AbCallout).toBe(AbCallout) // 📦
    expect(pkg.AB_CALLOUT_ICONS).toBe(AB_CALLOUT_ICONS) // 📦
  })
})
