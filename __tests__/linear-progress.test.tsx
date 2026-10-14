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
* @name: AB Linear Progress - Tests
* @file: __tests__/linear-progress.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

// 🧪 vitest API
import { describe, expect, it } from 'vitest'
// 📄 file helpers to inspect the shipped stylesheet
import { readFileSync } from 'node:fs'
// 🗺️ path helpers
import { dirname, join } from 'node:path'
// 🔗 ESM → path
import { fileURLToPath } from 'node:url'
// ⚛️ React element factory (no JSX transform assumptions)
import { createElement } from 'react'
// 🖨️ server renderer → static HTML string
import { renderToStaticMarkup } from 'react-dom/server'
// 📊 component under test
import AbLinearProgress, { clampAbProgress } from '../ab-linear-progress'

// 📁 package root
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// 🎨 shipped CSS text
const css = readFileSync(join(root, 'ab-linear-progress/styles.module.css'), 'utf8')
// 🖨️ tiny render helper
const html = (props: Record<string, unknown>) => renderToStaticMarkup(createElement(AbLinearProgress, props))

describe('AbLinearProgress', () => {
  // 📊 determinate ARIA
  it('renders a determinate progressbar with aria-valuenow', () => {
    const out = html({ progress: 42 }) // 🖨️ render
    expect(out).toContain('role="progressbar"') // ♿ role
    expect(out).toContain('aria-valuenow="42"') // 📊 value
    expect(out).toContain('aria-valuemin="0"') // 📏 min
    expect(out).toContain('aria-valuemax="100"') // 📏 max
    expect(out).toContain('scaleX(0.42)') // 📐 bar width
    expect(out).toContain('data-ab-mode="determinate"') // 🔖 mode
  })

  // ✂️ clamping
  it('clamps progress into 0..100', () => {
    expect(clampAbProgress(-5)).toBe(0) // ⬇️ floor
    expect(clampAbProgress(150)).toBe(100) // ⬆️ ceiling
    expect(clampAbProgress(Number.NaN)).toBe(0) // 🚫 NaN
    expect(html({ progress: 900 })).toContain('aria-valuenow="100"') // 📊 clamped in DOM
  })

  // 🔁 indeterminate
  it('omits aria-valuenow in indeterminate mode', () => {
    const out = html({ isIndeterminate: true, progress: 50 }) // 🖨️ render
    expect(out).not.toContain('aria-valuenow') // 🚫 no value
    expect(out).toContain('aria-busy="true"') // ⏳ busy
    expect(out).toContain('data-ab-mode="indeterminate"') // 🔖 mode
  })

  // 🎨 color prop
  it('exposes the color prop as a CSS custom property', () => {
    expect(html({ color: '#6B4F35' })).toContain('--ab-linear-progress-color:#6B4F35') // 🎨 var
  })

  // 🙈 hidden
  it('supports hidden', () => {
    const out = html({ hidden: true }) // 🖨️ render
    expect(out).toContain('hidden=""') // 🙈 attribute
    expect(out).toContain('aria-hidden="true"') // ♿ hidden from AT
  })

  // ♿🌙 stylesheet guarantees
  it('ships reduced-motion, dark mode and no Tailwind dependency', () => {
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce[\s\S]*width: 100%/) // ♿ static full bar (the package stops the sweep)
    expect(css.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/(transition|animation)[a-z-]*\s*:|@keyframes/) // ✂️ comments stripped // 🎬 motion comes from ab-nextjs-animations
    expect(css).toContain(':global(html.dark)') // 🌙 dark
    expect(css).not.toMatch(/@apply|@tailwind/) // 🚫 Tailwind-free
  })

  // 🗣️ empty label
  it('drops aria-label when the label is empty', () => {
    expect(html({ label: '' })).not.toContain('aria-label') // 🚫 no empty name
    expect(html({})).toContain('aria-label="Loading"') // ✅ default name
  })

  // ↔️ RTL sweep
  it('mirrors the indeterminate sweep in RTL (anchor + keyframes), and stops it with reduced motion', () => {
    expect(css).toMatch(/:global\(\[dir='rtl'\]\) \.abLinearProgress__bar_indeterminate \{[^}]*right: 0/) // ⬅️ anchor
    expect(html({ isIndeterminate: true })).toContain('ab-progress-sweep') // 🔁 sweep (RTL-mirrored + reduced-motion aware) from ab-nextjs-animations
    expect(html({ progress: 40 })).toContain('ab-motion-transform') // 🎞️ value tween from the package
  })
})
