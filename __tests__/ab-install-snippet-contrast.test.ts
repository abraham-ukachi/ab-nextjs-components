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
* @name: AbInstallSnippet tab contrast
* @file: __tests__/ab-install-snippet-contrast.test.ts
* @type: Vitest (happy-dom)
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

// 📁 paths: the component CSS + the theme palette the app actually loads
const root = join(__dirname, '..')
const read = (f: string): string => readFileSync(join(root, f), 'utf8') // 📄
const strip = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '') // 🧹
const css = strip(read('ab-install-snippet/styles.module.css'))

// 🎨 a palette = every `--name: value` in the theme files for one mode
type Rgb = [number, number, number]
const palette = (mode: 'light' | 'dark'): Map<string, string> => {
  const map = new Map<string, string>()
  const md = strip(read(`node_modules/ab-nextjs-theme/css/${mode}.css`))
  for (const [, k, v] of md.matchAll(/(--md-sys-color-[\w-]+):\s*([^;]+);/g)) map.set(k, v.trim())
  // 🔗 the --ab-* aliases for this mode (ab-tokens.css block)
  const tokens = strip(read('node_modules/ab-nextjs-theme/css/ab-tokens.css'))
  const blk = tokens.slice(tokens.indexOf(`[data-theme='${mode}']`))
  for (const [, k, v] of blk.slice(0, blk.indexOf('}')).matchAll(/(--ab-color-[\w-]+):\s*([^;]+);/g)) map.set(k, v.trim())
  return map
}

// 🧮 split a CSS argument list at top-level commas
const args = (s: string): string[] => {
  const out: string[] = []; let depth = 0; let cur = ''
  for (const ch of s) {
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue }
    if (ch === '(') depth++
    if (ch === ')') depth--
    cur += ch
  }
  return [...out, cur.trim()]
}

// 🧠 resolve var() / color-mix(in srgb) / rgb() / #hex to an opaque RGB
const resolve = (value: string, p: Map<string, string>): Rgb => {
  const v = value.trim()
  let m = v.match(/^var\((.*)\)$/s)
  if (m) {
    const [name, ...fallback] = args(m[1])
    if (p.has(name)) return resolve(p.get(name)!, p) // ✅ the live token wins
    expect(fallback.length, `no fallback for ${name}`).toBeGreaterThan(0)
    return resolve(fallback.join(','), p)
  }
  m = v.match(/^color-mix\(in srgb,(.*)\)$/s)
  if (m) {
    const [a, b] = args(m[1])
    const [ac, pct] = a.split(/\s+(?=[\d.]+%$)/)
    const w = parseFloat(pct) / 100
    const [x, y] = [resolve(ac, p), resolve(b, p)]
    return x.map((c, i) => c * w + y[i] * (1 - w)) as Rgb
  }
  m = v.match(/^rgb\((\d+)[ ,]+(\d+)[ ,]+(\d+)\)$/)
  if (m) return m.slice(1, 4).map(Number) as Rgb
  m = v.match(/^#([0-9a-f]{6})$/i)
  if (m) return [0, 2, 4].map((i) => parseInt(m![1].slice(i, i + 2), 16)) as Rgb
  throw new Error(`unresolvable colour: ${v}`)
}

// 📐 WCAG 2.x contrast
const lum = (c: Rgb): number => {
  const [r, g, b] = c.map((x) => { const s = x / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export const contrast = (a: Rgb, b: Rgb): number => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// 🔎 the declarations for one selector (later rules override earlier ones, like the cascade)
const decls = (selector: string): Record<string, string> => {
  const out: Record<string, string> = {}
  for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!sel.split(',').map((s) => s.trim()).includes(selector)) continue
    for (const [, k, v] of body.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)) out[k] = v.trim()
  }
  return out
}
// 🗂️ a state = the base .tab rule + its own overrides
const state = (sel: string): Record<string, string> => ({ ...decls('.tab'), ...decls(sel) })

describe('AbInstallSnippet tabs: text/background ≥ 4.5:1 in every state ♿', () => {
  const states = [
    ['inactive', '.tab'],
    ['hover', '.tab:hover'],
    ['active', ".tab[aria-selected='true']"],
    ['active + hover', ".tab[aria-selected='true']:hover"],
  ] as const
  for (const mode of ['light', 'dark'] as const) {
    const p = palette(mode)
    it.each(states)(`${mode}: %s`, (_name, sel) => {
      const d = state(sel)
      expect(d.background, `${sel} paints its own background`).toBeTruthy() // 🫥 no transparent states
      const ratio = contrast(resolve(d.color, p), resolve(d.background, p))
      expect(ratio, `${mode} ${sel}: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
    })
  }
  it('the fallbacks (no theme loaded) also pass', () => {
    for (const [, sel] of states) {
      const d = state(sel)
      expect(contrast(resolve(d.color, new Map()), resolve(d.background, new Map()))).toBeGreaterThanOrEqual(4.5)
    }
  })
})
