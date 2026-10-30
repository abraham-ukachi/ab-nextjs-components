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
* @name: AbErrorHero - Tests (404 gaps)
* @file: __tests__/ab-error-hero.test.tsx
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
// ⚛️ SSR render (server-safe component)
import { renderToStaticMarkup } from 'react-dom/server'
// 📁 CSS + barrel checks
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// 🚧 under test (subpath + barrel)
import AbErrorHero from '../ab-error-hero'
import { AbErrorHero as BarrelHero, supportedComponents } from '../index'
// 🔗🚫 the default badge glyph (ab-nextjs-icons ^0.2.6), registered like an app would
import { registerAbIcons } from '../ab-icon/helpers'
import linkOff from 'ab-nextjs-icons/ab-icons/icons/link_off'

describe('AbErrorHero 🚧', () => {
  it('renders the decorative code, an h1 title (with the code read once), message, hint and actions', () => {
    const html = renderToStaticMarkup(
      <AbErrorHero badge={<svg data-b="1" />} title="Page not found" message="This page moved." hint={<span>/x</span>} actions={<button>Home</button>} />,
    ) // 🚧
    expect(html).toMatch(/<div class="abErrorHeroArt" aria-hidden="true">/) // 🙈 art is decorative
    expect(html).toContain('data-ab-part="error-code">404') // 🔢 default code
    expect(html).toContain('data-b="1"') // 🟫 badge
    expect(html).toMatch(/<h1 class="abErrorHeroTitle"><span class="abErrorHeroSrOnly">404: <\/span>Page not found<\/h1>/) // ♿
    expect(html).toContain('<p class="abErrorHeroMessage">This page moved.</p>') // 📝
    expect(html).toContain('data-ab-part="error-hint"') // 💡
    expect(html).toContain('data-ab-part="error-actions"><button>Home</button>') // 🔘
  })
  it('optional parts are omitted; headingLevel and grid are honoured', () => {
    const html = renderToStaticMarkup(<AbErrorHero code="500" title="Oops" badge={null} headingLevel={2} grid={false} />) // 🧩
    expect(html).toContain('<h2') // ♿
    expect(html).not.toContain('error-grid') // ⠿ off
    expect(html).not.toContain('error-badge') // 🟫 off
    expect(html).not.toContain('error-actions') // 🔘 off
    expect(html).toContain('500') // 🔢
  })
  it('defaults the badge tile to <AbIcon name="link_off"> (mock ai-mocks/404)', () => {
    registerAbIcons({ link_off: linkOff }) // 🗂️ register link_off (no font fallback)
    const html = renderToStaticMarkup(<AbErrorHero title="Page not found" />) // 🔗🚫 no badge prop
    expect(html).toMatch(/data-ab-part="error-badge"><span class="AbIcon[^"]*"[^>]*data-icon="link_off"[^>]*><svg /) // 🟫 an AbIcon svg in the tile
    expect(html).toContain('M4.5 5 L19.5 20') // 🔣 the link_off slash (real svg, no font fallback)
  })
  it('is exported from the barrel and listed in supportedComponents', () => {
    expect(BarrelHero).toBe(AbErrorHero) // 📦
    expect(supportedComponents.some((c) => c.name === 'AbErrorHero' && c.file === 'ab-error-hero/index.tsx')).toBe(true) // 📋
  })
  it('defines NO motion (motion lives in ab-nextjs-animations)', () => {
    const css = readFileSync(join(__dirname, '../ab-error-hero/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // ✂️ comments
    expect(css).not.toMatch(/transition|animation|@keyframes/) // 🚫 motion
  })
})
