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
* @name: AbFlowDiagram - Tests (G38)
* @file: __tests__/ab-flow-diagram.test.tsx
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
// 🖨️ static render (server component)
import { renderToStaticMarkup } from 'react-dom/server'
// 📄 CSS guard
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// 🎨 under test
import AbFlowDiagram, { getAbFlowEdgePath } from '../ab-flow-diagram'

// 📄 stylesheet
const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'ab-flow-diagram/styles.module.css'), 'utf8')
// 🧪 s02-like scene
const nodes = [{ id: 'hub', label: 'AbProvider', x: 50, y: 55, tone: 'hub' as const }, { id: 'cfg', label: 'config', x: 20, y: 25 }, { id: 'slot', label: 'Slot', x: 80, y: 25 }]
const edges = [{ from: 'cfg', to: 'hub' }, { from: 'slot', to: 'hub', curve: 0.4 }, { from: 'ghost', to: 'hub' }]

describe('getAbFlowEdgePath', () => {
  it('draws straight or curved, clamped to the scene', () => {
    expect(getAbFlowEdgePath({ x: 0, y: 0 }, { x: 100, y: 0 })).toBe('M 0 0 L 100 0') // ➖
    expect(getAbFlowEdgePath({ x: -5, y: 0 }, { x: 100, y: 120 })).toBe('M 0 0 L 100 100') // ✂️
    expect(getAbFlowEdgePath({ x: 0, y: 0 }, { x: 100, y: 0 }, 1)).toBe('M 0 0 Q 50 50 100 0') // 〰️
  })
})

describe('AbFlowDiagram (G38)', () => {
  it('is one accessible image; parts are hidden; unknown edges are skipped', () => {
    const html = renderToStaticMarkup(<AbFlowDiagram alt="Diagram: config and Slot connect to AbProvider." title="Live Playground" caption="ab-nextjs-core" live="live" nodes={nodes} edges={edges} active={false} />) // 🖨️
    expect(html).toMatch(/^<figure role="img" aria-label="Diagram: config and Slot connect to AbProvider\."/) // ♿
    expect(html.match(/<path class="wire ab-wire-draw"/g)).toHaveLength(2) // 〰️ 2 valid edges (ghost skipped), draw-on from ab-nextjs-animations
    expect(html.match(/<path class="pulse ab-wire-pulse"/g)).toHaveLength(2) // ✨ pulse from ab-nextjs-animations
    expect(html).toContain('data-active="false"') // ⏸️
    expect(html).toContain('data-ab-paused="true"') // ⏸️ package pause switch
    expect(html).toContain('--ab-wire-index:1') // ⏱️ stagger token
    expect(html.match(/aria-hidden="true"/g)!.length).toBeGreaterThanOrEqual(3) // 🙈 header, wires, nodes
    expect(html).toContain('--ab-wire-poster:55') // 🖼️ MID 0.45 (package token)
    expect(html).not.toContain('--ab-wire-pulse-iterations') // 🔋 default loops left to CSS (3 on phones)
    expect(html).not.toMatch(/<script|onClick|tabindex/i) // 🚫 zero JS, not focusable
  })
  it('CSS: no local motion (ab-nextjs-animations owns draw / pulse / pause / reduced); phones get 3 loops via token', () => {
    expect(css.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/(transition|animation)[a-z-]*\s*:|@keyframes/) // ✂️ comments stripped // 🎬 none here
    expect(css).toMatch(/@media \(max-width: 639px\) \{\s*\.root \{ --ab-wire-pulse-iterations: 3; \}/) // 🔋 mobile
  })
  it('explicit loops win over the phone default', () => {
    const html = renderToStaticMarkup(<AbFlowDiagram alt="x" nodes={nodes} edges={edges} loops={2} />) // 🖨️
    expect(html).toContain('--ab-wire-pulse-iterations:2') // 🔁
  })
})
