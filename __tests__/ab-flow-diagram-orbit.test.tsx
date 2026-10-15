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
* @name: AbFlowDiagram - no clipped side nodes tests
* @file: __tests__/ab-flow-diagram-orbit.test.tsx
* @type: TypeScript (Vitest)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// 🧪 vitest
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// 🎨 component under test
import AbFlowDiagram from '../ab-flow-diagram'

// 📄 the component stylesheet (comments stripped: only what the browser sees)
const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'ab-flow-diagram/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
// 🔎 the declarations of one rule
const rule = (selector: string): string => {
  const i = css.indexOf(`${selector} {`) // 📍
  expect(i, selector).toBeGreaterThan(-1)
  return css.slice(i, css.indexOf('}', i)) // ✂️
}

// 🪐 Joseph's repro: s04 (theme tokens) and s07 (animations) orbit long labels round a hub
const orbit = (labels: string[], r: number) =>
  labels.map((label, i) => {
    const a = (i / labels.length) * 2 * Math.PI - Math.PI / 2 // 🧭 start at 12 o'clock
    return { id: label, label, x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) }
  })
const s04 = orbit(['--ab-color-primary', '--ab-color-bronze', '--ab-font-title', '--ab-color-surface'], 42) // 🎨
const s07 = orbit(['slide-step', 'reduced motion', 'wire-pulse', 'spin', 'progress-sweep', 'motion tokens'], 44) // 🎬

// 📐 where a pill's left / right edges land, given the CSS: left = x% of the stage, translateX(-x% of the pill)
const edges = (x: number, stageX: number, stageW: number, pillW: number) => {
  const p = Math.min(100, Math.max(0, x)) / 100 // ✂️ same clamp as the component
  const left = stageX + p * stageW - p * pillW // ⬅️
  return { left, right: left + pillW } // ➡️
}

describe('AbFlowDiagram: no clipped side nodes (0.1.11) 🪐', () => {
  it('anchors every node proportionally (x% / y% of its own box), from inline vars', () => {
    expect(rule('.node')).toMatch(/transform:\s*translate\(calc\(var\(--ab-flow-node-x, 50\) \* -1%\), calc\(var\(--ab-flow-node-y, 50\) \* -1%\)\)/) // 🎯
    const html = renderToStaticMarkup(<AbFlowDiagram alt="x" nodes={[{ id: 'a', label: 'reduced motion', x: 94, y: -10 }]} edges={[]} />) // 🖨️
    expect(html).toMatch(/left:94%;top:0%;--ab-flow-node-x:94;--ab-flow-node-y:0/) // ✂️ clamped like the wires
  })

  it('nodes and wires share a stage with side margins; long labels ellipsise', () => {
    expect(rule('.root')).toMatch(/--ab-flow-diagram-stage-x:\s*var\(--ab-flow-diagram-inset-x,\s*0\.5rem\)/) // 🎛️
    expect(rule('.nodes')).toMatch(/inset:\s*var\(--ab-flow-diagram-stage-top\) var\(--ab-flow-diagram-stage-x\) 0/) // 🔵
    const wires = rule('.wires') // 〰️
    expect(wires).toMatch(/inset:\s*var\(--ab-flow-diagram-stage-top\) var\(--ab-flow-diagram-stage-x\) 0/)
    expect(wires).toMatch(/width:\s*calc\(100% - 2 \* var\(--ab-flow-diagram-stage-x\)\)/)
    expect(rule('.node')).toMatch(/max-width:\s*100%/) // 📏
    expect(rule('.node')).toMatch(/text-overflow:\s*ellipsis/) // …
  })

  // 📏 390 / 760px viewports (16px page padding each side) × 276 / 380px box heights; pill width ≈ 7px per
  //    char at 11–13px + padding (generous), capped at the stage width like max-width: 100%
  it.each([
    [390, 276], [390, 380], [760, 276], [760, 380],
  ])('s04 + s07: no node crosses the card edge at %ipx wide, %ipx tall', (viewport, height) => {
    const card = viewport - 32, stageX = 8, stageW = card - 2 * stageX // 📐
    for (const n of [...s04, ...s07]) {
      const pillW = Math.min(stageW, n.label.length * 7 + 20) // 💊
      const { left, right } = edges(n.x, stageX, stageW, pillW)
      expect(left, `${n.label} left @${viewport}x${height}`).toBeGreaterThanOrEqual(0) // ⬅️ inside
      expect(right, `${n.label} right @${viewport}x${height}`).toBeLessThanOrEqual(card) // ➡️ inside
      expect(n.x / 100 * stageW + stageX, `${n.label}: wire end inside the pill`).toBeGreaterThanOrEqual(left) // 〰️
      expect(n.x / 100 * stageW + stageX).toBeLessThanOrEqual(right)
    }
  })

  it('the old centring would have clipped them (regression guard for the repro)', () => {
    const card = 390 - 32 // 📐 the 390px box
    const bronze = s04.find((n) => n.label === '--ab-color-bronze')! // 🎨 s04 side node
    const reduced = s07.find((n) => n.label === 'reduced motion')! // 🎬 s07 side node
    for (const n of [bronze, reduced]) {
      const pillW = n.label.length * 7 + 20 // 💊
      const cx = (n.x / 100) * card // 🎯 old: centred on x% of the full card
      expect(cx - pillW / 2 < 0 || cx + pillW / 2 > card, n.label).toBe(true) // ✂️ was clipped
    }
  })
})
