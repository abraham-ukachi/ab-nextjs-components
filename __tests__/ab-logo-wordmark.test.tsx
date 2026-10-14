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
* @name: AbLogo + AbSplash - Render tests
* @file: __tests__/ab-logo-wordmark.test.tsx
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { describe, expect, it } from 'vitest'
// 📄 fs for CSS assertions
import { readFileSync } from 'node:fs'
// 🗺️ paths
import { join } from 'node:path'
// 🖨️ static renderer
import { renderToStaticMarkup } from 'react-dom/server'
// 🅰️ client + server logos
import AbLogo from '../ab-logo'
import AbLogoServer from '../server/ab-logo'
// 💦 splash
import AbSplash from '../ab-splash'

// 📁 root + reader
const root = join(import.meta.dirname, '..')
const read = (rel: string) => readFileSync(join(root, rel), 'utf8')

describe('AbLogo wordmark', () => {
  it('renders "Elements" with wordmark', () => {
    for (const Logo of [AbLogo, AbLogoServer]) {
      const out = renderToStaticMarkup(<Logo wordmark />) // 🖨️
      expect(out).toContain('>Elements</span>') // 🔤 text
      expect(out).toContain('font-quicksand-bold') // 🔤 ab-nextjs-fonts class
      expect(out).toContain('role="img"') // ♿ one image
      expect(out).toContain('aria-label="Ab Elements"') // 🗣️ name
    }
  })
  it('accepts a custom wordmark and color', () => {
    const out = renderToStaticMarkup(<AbLogo wordmark="Docs" color="#6B4F35" />) // 🖨️
    expect(out).toContain('>Docs</span>') // 🔤
    expect(out).toContain('--ab-logo-color:#6B4F35') // 🎨
  })
  it('without wordmark keeps the old markup', () => {
    expect(renderToStaticMarkup(<AbLogo />)).not.toContain('Elements') // 🅰️ mark only
  })
})

describe('AbLogo naked default (no brown square)', () => {
  it('CSS module masks with the shipped mark by default', () => {
    for (const file of ['ab-logo/styles.module.css', 'server/ab-logo/styles.module.css']) {
      const css = read(file) // 🎨
      expect(css).toMatch(/mask:\s*var\(--app-logo-url,\s*url\("data:image\/svg\+xml,/) // 🎭
      expect(css).toContain('Quicksand-Bold') // 🔤
      expect(css).toContain(':global(html.dark)') // 🌙
    }
  })
})

describe('AbSplash render', () => {
  it('renders the lockup and a progressbar, hidden from AT', () => {
    const out = renderToStaticMarkup(<AbSplash />) // 🖨️
    expect(out).toContain('aria-hidden="true"') // 🙈
    expect(out).toContain('>Elements</span>') // 🔤
    expect(out).toContain('role="progressbar"') // 📶
    expect(out).toContain('aria-valuenow="25"') // 📶 pre-hydration value
  })
  it('styles: mobile track width and reduced motion', () => {
    const css = read('ab-splash/styles.module.css') // 🎨
    expect(css).toContain('width: min(18rem, 28vw)') // ↔️
    expect(css).toMatch(/prefers-reduced-motion: reduce/) // ♿
  })
})
