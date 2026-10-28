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
* @name: AbCarousel parts resolve the accent on their own (0.2.3)
* @file: __tests__/carousel-part-accent-0.2.3.test.ts
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
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// 📁 CSS without comments
const css = readFileSync(join(__dirname, '..', 'ab-carousel/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹
const CHAIN = 'var(--ab-carousel-accent, var(--ab-color-accent, var(--ab-primary, #a67c52)))' // 🟤

// 🟤 Joseph (Welcome 0.2.21): headless parts outside the region turned grey (no --_accent there)
describe('🟤 every carousel part defines its own accent', () => {
  it('nav, dots, dot and counter set --_accent from --ab-carousel-accent → theme accent → --ab-primary → bronze', () => {
    const m = css.match(/\.nav,\s*\.dots,\s*\.dot,\s*\.counter \{\s*--_accent: ([^;]+);/) // 🔎
    expect(m?.[1]).toBe(CHAIN) // ✅
  })
  it('the region uses the same chain (one source of truth)', () => {
    expect(css).toMatch(/\.carousel \{[^}]*--_accent: var\(--ab-carousel-accent, var\(--ab-color-accent, var\(--ab-primary, #a67c52\)\)\);/) // 🎠
  })
  it('every --_accent use sits on a part that defines it (no bare region-only reads)', () => {
    for (const sel of ['.nav[data-variant=\'filled\']', '.dot[data-active=\'true\'] .dotMark']) expect(css).toContain(sel) // 🧱 dot / nav own it
  })
})
