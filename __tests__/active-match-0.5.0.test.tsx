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
*
* @project: ab-nextjs-components
* @name: Active nav matching (0.5.0)
* @file: __tests__/active-match-0.5.0.test.tsx
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
import { afterEach, describe, expect, it } from 'vitest'
// 🖼️ renderers
import { cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
// 🎯 under test
import { getAbActiveHrefs, matchAbHref, normalizeAbHref, isAbSidebarActive, type AbActiveMatch } from '../ab-sidebar'
import ServerAbSidebar from '../server/ab-sidebar'
import AbNavDrawer from '../ab-nav-drawer'

afterEach(cleanup) // 🧹

// 🗂️ the double-highlight fixture: a parent and its child are both listed
const items = [{ href: '/' }, { href: '/docs' }, { href: '/docs/x' }]
const on = (current: string, match?: AbActiveMatch, list: Array<{ href: string; exact?: boolean }> = items) => [...getAbActiveHrefs(list, current, { match })]

describe('🧹 normalizeAbHref / matchAbHref', () => {
  it('drops query strings, hashes and trailing slashes; "/" stays "/"', () => {
    expect(normalizeAbHref('/docs/x/?tab=1#top')).toBe('/docs/x') // ✂️
    expect(normalizeAbHref('/')).toBe('/') // 🏠
    expect(normalizeAbHref('/?q=1')).toBe('/') // 🏠 + query
    expect(matchAbHref('/docs/', '/docs#intro')).toBe(true) // ✅ equal once normalised
    expect(matchAbHref('/docs', '/docs/x?y=1')).toBe(true) // 🌳 parent
    expect(matchAbHref('/docs', '/docs/x', true)).toBe(false) // 🎯 exact
    expect(matchAbHref('/doc', '/docs')).toBe(false) // 🚫 whole segments only
    expect(matchAbHref('/', '/docs')).toBe(false) // 🏠 never a parent
    expect(isAbSidebarActive('/docs/', '/docs/x/')).toBe(true) // 🕰️ the old helper got tolerant too
  })
})

describe('🥇 getAbActiveHrefs', () => {
  it('best (default): only the deepest match lights, so /docs and /docs/x never double-highlight', () => {
    expect(on('/docs/x')).toEqual(['/docs/x']) // ✅ the child only
    expect(on('/docs/x/deeper')).toEqual(['/docs/x']) // 🌳 the deepest parent
    expect(on('/docs/y')).toEqual(['/docs']) // 🌳 no child listed: the parent still lights
    expect(on('/docs/')).toEqual(['/docs']) // ✂️ trailing slash
    expect(on('/docs/x?tab=2#a')).toEqual(['/docs/x']) // ✂️ query + hash
    expect(on('/')).toEqual(['/']) // 🏠
    expect(on('/elsewhere')).toEqual([]) // 🚫
  })
  it('prefix: the old behaviour, every parent lights', () => {
    expect(on('/docs/x', 'prefix').sort()).toEqual(['/docs', '/docs/x']) // 🌳🌳
  })
  it('exact: only the equal href', () => {
    expect(on('/docs/x', 'exact')).toEqual(['/docs/x']) // ✅
    expect(on('/docs/y', 'exact')).toEqual([]) // 🚫 no parent fallback
  })
  it('a per-item `exact` overrides the component default either way', () => {
    const list = [{ href: '/docs', exact: true }, { href: '/blog', exact: false }]
    expect(on('/docs/y', 'prefix', list)).toEqual([]) // 🎯 exact: true beats 'prefix'
    expect(on('/docs/y', 'best', list)).toEqual([]) // 🎯 … and 'best'
    expect(on('/blog/post', 'exact', list)).toEqual(['/blog']) // 🌳 exact: false beats 'exact'
  })
  it('strips locale prefixes when `locales` is given', () => {
    expect([...getAbActiveHrefs(items, '/fr/docs/x', { locales: ['en', 'fr'] })]).toEqual(['/docs/x']) // 🌍
    expect([...getAbActiveHrefs(items, '/fr', { locales: ['fr'] })]).toEqual(['/']) // 🌍 locale root = home
    expect([...getAbActiveHrefs(items, '/fresh', { locales: ['fr'] })]).toEqual([]) // 🚫 not a locale segment
  })
  it('accepts plain strings, and no route means nothing is active', () => {
    expect([...getAbActiveHrefs(['/a', '/a/b'], '/a/b')]).toEqual(['/a/b']) // 🔁
    expect([...getAbActiveHrefs(items, undefined)]).toEqual([]) // 🚫
  })
})

// 🗂️ a sidebar with a nested child under /docs and a sibling /docs/x item
const sections = [{ id: 'docs', label: 'Docs', items: [{ href: '/docs', label: 'Docs', items: [{ href: '/docs/x', label: 'X' }] }, { href: '/docs/api', label: 'API' }] }]
const current = (html: string) => (html.match(/<a [^>]*>/g) ?? []).filter((a) => a.includes('aria-current="page"')).map((a) => /href="([^"]+)"/.exec(a)?.[1]) // ♿ which links are current

describe('🧭 AbSidebar activeMatch', () => {
  it('default: one aria-current on /docs/x (nested child beats its parent)', () => {
    expect(current(renderToStaticMarkup(<ServerAbSidebar sections={sections} activeHref="/docs/x/" />))).toEqual(['/docs/x'])
  })
  it('activeMatch="prefix" keeps the old double highlight (opt-out)', () => {
    expect(current(renderToStaticMarkup(<ServerAbSidebar sections={sections} activeHref="/docs/x" activeMatch="prefix" />))).toEqual(['/docs', '/docs/x'])
  })
  it('activeMatch="exact" + an item `exact: false` override', () => {
    const s = [{ id: 's', items: [{ href: '/docs', label: 'Docs', exact: false }, { href: '/blog', label: 'Blog' }] }]
    expect(current(renderToStaticMarkup(<ServerAbSidebar sections={s} activeHref="/blog/post" activeMatch="exact" />))).toEqual([]) // 🎯 /blog is exact
    expect(current(renderToStaticMarkup(<ServerAbSidebar sections={s} activeHref="/docs/post" activeMatch="exact" />))).toEqual(['/docs']) // 🌳 override
  })
  it('server twin strips `locales`', () => {
    expect(current(renderToStaticMarkup(<ServerAbSidebar sections={sections} activeHref="/fr/docs/x" locales={['fr']} />))).toEqual(['/docs/x']) // 🌍
  })
})

describe('⬅️ AbNavDrawer uses the same rule', () => {
  const navSections = [{ id: 'd', label: 'Docs', items: [{ href: '/docs', label: 'Docs' }, { href: '/docs/x', label: 'X' }] }]
  const currentRows = () => Array.from(document.querySelectorAll('[aria-current="page"]')).map((a) => a.getAttribute('href'))
  it('default: only /docs/x on /docs/x?y#z', () => {
    render(<AbNavDrawer open onClose={() => {}} logo="ab" sections={navSections} activeHref="/docs/x?y=1#z" />)
    expect(currentRows()).toEqual(['/docs/x'])
  })
  it('activeMatch="prefix" lights both; locales are stripped', () => {
    render(<AbNavDrawer open onClose={() => {}} logo="ab" sections={navSections} activeHref="/fr/docs/x" activeMatch="prefix" locales={['fr']} />)
    expect(currentRows()).toEqual(['/docs', '/docs/x'])
  })
})
