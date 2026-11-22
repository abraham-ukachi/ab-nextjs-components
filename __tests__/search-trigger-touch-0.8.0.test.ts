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
* @name: AbSearchTrigger touch audit tests (0.8.0)
* @file: __tests__/search-trigger-touch-0.8.0.test.ts
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
// 📁 fs + path: the CSS module is read as text (happy-dom has no layout)
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// 📖 the trigger stylesheet
const src = readFileSync(join(__dirname, '..', 'ab-search-trigger', 'styles.module.css'), 'utf8')
// ✂️ the declarations of the first rule whose selector starts at `sel` (optionally searching after `from`)
const rule = (sel: string, from = 0): string => { const i = src.indexOf(`${sel} {`, from); expect(i, sel).toBeGreaterThanOrEqual(0); return src.slice(i, src.indexOf('}', i)) }
// 🔢 a px value
const px = (decls: string, prop: string) => Number(decls.match(new RegExp(`(?:^|[\\s;{])${prop}:\\s*(-?[\\d.]+)px`))?.[1])
// 📱 the coarse-pointer block
const coarse = src.indexOf('@media (pointer: coarse)')

describe('👆 AbSearchTrigger touch audit (0.8.0)', () => {
  it('size="sm" keeps its 46px band AND is never narrower than 44px (short locales / no label)', () => {
    const sm = rule(".abSearchTrigger[data-size='sm']") // 🎯
    expect(px(sm, 'height')).toBe(34) // 👀 the look is unchanged
    expect(px(sm, 'min-width')).toBeGreaterThanOrEqual(44) // ↔️ horizontal reach
    expect(rule(".abSearchTrigger[data-size='sm']::after")).toMatch(/inset:\s*-6px 0/) // ↕️ 0.3.3 band kept
  })
  it('under pointer: coarse, every non-sm trigger gets a centred ≥ 44×44 hit area', () => {
    expect(coarse).toBeGreaterThan(0) // 📱 the block exists
    expect(rule(".abSearchTrigger:not([data-size='sm'])", coarse)).toContain('position: relative') // 📌
    const hit = rule(".abSearchTrigger:not([data-size='sm'])::after", coarse) // 🫥
    expect(hit).toContain("content: ''") // 🫥 empty
    expect(hit).toContain('inline-size: max(100%, 44px)') // ↔️
    expect(hit).toContain('block-size: max(100%, 44px)') // ↕️
    expect(hit).toContain('transform: translate(-50%, -50%)') // 🎯 centred
  })
  it('the drawn sizes it covers really are under 44px (so the audit matters): md 40, field 36', () => {
    expect(px(rule('.abSearchTrigger'), 'height')).toBe(40) // 💊 md pill
    expect(px(rule(".abSearchTrigger[data-variant='field']"), 'height')).toBe(36) // 📲 tablet field
    expect(px(rule(".abSearchTrigger[data-size='lg']"), 'height')).toBe(44) // 🔍 404 field: already 44
  })
  it('no CSS transitions or animations in the trigger stylesheet', () => {
    expect(src).not.toMatch(/\btransition\s*:|\banimation\s*:/) // 🚫 house rule
  })
})
