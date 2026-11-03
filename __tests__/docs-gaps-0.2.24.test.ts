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
* @name: Joseph 0.2.24 docs gaps (AbCodeBlock scheme, header crumbs + search)
* @file: __tests__/docs-gaps-0.2.24.test.ts
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
// 📁 fs + path
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 📖 no comments
const ruleOf = (css: string, sel: string) => { const i = css.indexOf(`${sel} {`); return i < 0 ? '' : css.slice(i, css.indexOf('}', i)) } // 🎯

// 🌑 gap 3: the dark code surface tells the UA it is dark
describe('🌑 gap 3: AbCodeBlock color-scheme', () => {
  it('.abCodeBlock sets color-scheme: dark next to the code surface', () => {
    const rule = ruleOf(read('ab-code-block/styles.module.css'), '.abCodeBlock') // 🔍
    expect(rule).toContain('--ab-color-code-surface') // 🎨
    expect(rule).toMatch(/color-scheme: dark;/) // 🌑
  })
})

// 🍞 gap 4: at 768px the search field covered the breadcrumb trail
describe('🍞 gap 4: breadcrumbs + search share a row without overlap', () => {
  const crumbs = read('ab-breadcrumbs/styles.module.css') // 🍞
  const search = read('ab-search-trigger/styles.module.css') // 🔎
  it('the trail takes the leftover space but never collapses to 0 (v2)', () => {
    const nav = ruleOf(crumbs, '.abCrumbs') // 🔍
    expect(nav).not.toMatch(/min-width: 0;/) // 🚫 the 0px collapse Joseph rendered
    expect(nav).toMatch(/min-width: var\(--ab-crumbs-min-width, 96px\);/) // 📏
    expect(nav).toMatch(/flex: 1 1 auto;/) // ↔️
  })
  it('the first crumb never shrinks, the others clip in their own box (v2)', () => {
    expect(crumbs).toMatch(/\.abCrumb:first-child \{ flex: none; \}/) // 🏠
    expect(crumbs).toMatch(/\.abCrumb:not\(:first-child\) \{ overflow: hidden; \}/) // ✂️
  })
  it('the list clips instead of painting under its neighbour, crumbs shrink', () => {
    expect(crumbs).toMatch(/\.abCrumbsList \{[^}]*overflow: clip;/) // ✂️
    expect(crumbs).toMatch(/\.abCrumbsList \{[^}]*overflow-clip-margin: 4px;/) // ♿ focus ring room
    expect(crumbs).toMatch(/\.abCrumb \{ flex: 0 1 auto; \}/) // 🗜️
    expect(crumbs).toMatch(/\.abCrumbLink \{ overflow: hidden; \}/) // ✂️
  })
  it('the search field keeps its own minimum width', () => {
    const field = ruleOf(search, ".abSearchTrigger[data-variant='field']") // 🔍
    expect(field).toMatch(/flex: 0 8 auto;/) // ↔️ v2: search shrinks first
    expect(field).toMatch(/min-width: var\(--ab-search-trigger-min-width, 160px\);/) // 📏
  })
})

// 🔠 gap 1 (components side): callout text ignores the theme's base 24px <p> size
describe('🔠 gap 1: AbCallout text inherits its size', () => {
  it('title + text paragraphs inherit font-size + line-height', () => {
    const rule = ruleOf(read('ab-callout/styles.module.css'), '.abCalloutBody :where(p)') // 🔍
    expect(rule).toMatch(/font-size: inherit;/) // 🔠
    expect(rule).toMatch(/line-height: inherit;/) // ↕️
  })
})

// ✂️ gap 4 v3: a squeezed crumb reads "Installa…", not "stallatio"
describe('✂️ gap 4 v3: crumbs ellipsize on the right', () => {
  const crumbs = read('ab-breadcrumbs/styles.module.css') // 🍞
  it('the label text box ellipsizes from the start edge', () => {
    const rule = ruleOf(crumbs, '.abCrumbText') // 🔍
    for (const d of ['display: block;', 'min-width: 0;', 'overflow: hidden;', 'text-overflow: ellipsis;', 'white-space: nowrap;']) expect(rule).toContain(d) // ✂️
  })
  it('the target box centres safely (start on overflow), never plain centre', () => {
    expect(crumbs).toContain('justify-content: safe center;') // 🛟
    expect(crumbs).not.toMatch(/justify-content: center;/) // 🚫
  })
  it('every crumb label is wrapped in the text span', () => {
    const tsx = readFileSync(join(__dirname, '..', 'ab-breadcrumbs/index.tsx'), 'utf8') // 📖
    expect(tsx.match(/className=\{styles\.abCrumbText\}>\{it\.label\}/g)?.length).toBe(3) // 🏷️
  })
})
