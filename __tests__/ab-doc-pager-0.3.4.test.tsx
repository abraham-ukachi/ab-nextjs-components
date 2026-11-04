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
* @name: AbDocPager - Tests (0.3.4)
* @file: __tests__/ab-doc-pager-0.3.4.test.tsx
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
// ⚛️ React + 🖨️ server render
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
// 🧩 under test
import AbDocPager from '../ab-doc-pager'
import { AbLinkProvider } from '../ab-link'
import * as pkg from '../index'

const prev = { href: '/docs/install', title: 'Install' } // ⬅️
const next = { href: '/docs/theme', title: 'Theme' } // ➡️
// 🔗 a fake app link (as AbLinkProvider would get from ab-nextjs-i18n)
const AppLink = ({ href, children, ...rest }: { href: string; children?: ReactNode }) => <a data-app-link="" href={`/fr${href}`} {...rest}>{children}</a>

// ⏮️⏭️ QA (0.2.24 MDX docs): prev / next at the end of a docs page
describe('⏮️⏭️ AbDocPager', () => {
  it('a named nav with rel=prev / rel=next links whose names read "Previous: Install"', () => {
    const h = renderToStaticMarkup(<AbDocPager prev={prev} next={next} />) // 🖨️
    expect(h).toMatch(/^<nav aria-label="Pages"/) // ♿
    expect(h).toMatch(/<a [^>]*href="\/docs\/install"[^>]*>|<a [^>]*rel="prev"/) // 🔗
    expect(h).toContain('rel="prev"'); expect(h).toContain('rel="next"') // 🕸️
    const text = h.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '') // 📝 the accessible text
    expect(text).toContain('Previous: Install'); expect(text).toContain('Next: Theme') // ♿
  })
  it('goes through AbLinkProvider (the app link, e.g. the i18n one)', () => {
    const h = renderToStaticMarkup(<AbLinkProvider component={AppLink}><AbDocPager next={next} /></AbLinkProvider>) // 🔌
    expect(h).toContain('data-app-link=""'); expect(h).toContain('href="/fr/docs/theme"') // ✅
  })
  it('only one side, or none at all', () => {
    expect(renderToStaticMarkup(<AbDocPager next={next} />)).not.toContain('rel="prev"') // ➡️ only
    expect(renderToStaticMarkup(<AbDocPager />)).toBe('') // 🙅
  })
  it('labels are translatable', () => {
    const h = renderToStaticMarkup(<AbDocPager prev={prev} labels={{ nav: 'Navigation', prev: 'Précédent' }} />) // 🇫🇷
    expect(h).toContain('aria-label="Navigation"'); expect(h).toContain('Précédent') // 🌍
  })
  it('is exported', () => expect(pkg.AbDocPager).toBe(AbDocPager)) // 📦
})
