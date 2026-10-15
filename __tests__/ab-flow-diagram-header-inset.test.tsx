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
* @name: AbFlowDiagram - header-safe stage tests
* @file: __tests__/ab-flow-diagram-header-inset.test.tsx
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

// 🧪 a Live Playground-like scene: "core" sits near the top (it covered the header at 390px)
const nodes = [{ id: 'core', label: 'ab-nextjs-core', x: 50, y: 10, tone: 'hub' as const }, { id: 'hooks', label: 'hooks', x: 15, y: 50 }]
const edges = [{ from: 'hooks', to: 'core' }]

describe('AbFlowDiagram: header-safe stage (0.1.11) 🏷️', () => {
  it('marks the root when a header renders (title, live dot or caption)', () => {
    for (const props of [{ title: 'Live Playground' }, { live: true }, { caption: 'ab-nextjs-core' }]) {
      expect(renderToStaticMarkup(<AbFlowDiagram alt="x" nodes={nodes} edges={edges} {...props} />)).toContain('data-ab-header="true"') // ✅
    }
    expect(renderToStaticMarkup(<AbFlowDiagram alt="x" nodes={nodes} edges={edges} />)).toContain('data-ab-header="false"') // 🚫 no header, full card
  })

  it('reserves a tunable header band only when there is a header', () => {
    expect(rule('.root')).toMatch(/--ab-flow-diagram-stage-top:\s*0px/) // 🚫 no header: no inset
    expect(rule(".root[data-ab-header='true']")).toMatch(/--ab-flow-diagram-stage-top:\s*var\(--ab-flow-diagram-inset-top,\s*2\.75rem\)/) // 🎛️ default 44px
  })

  it('nodes and wires share the same stage box, so wires still meet the nodes', () => {
    expect(rule('.nodes')).toMatch(/inset:\s*var\(--ab-flow-diagram-stage-top\) 0 0/) // 🔵
    const wires = rule('.wires') // 〰️ (viewBox 0–100 is stretched with preserveAspectRatio="none")
    expect(wires).toMatch(/inset:\s*var\(--ab-flow-diagram-stage-top\) 0 0/)
    expect(wires).toMatch(/height:\s*calc\(100% - var\(--ab-flow-diagram-stage-top\)\)/)
  })

  it('a node at the top of the stage clears the header (390px card geometry)', () => {
    // 📐 390px viewport → 360px card → 760/600 ratio → ~284px tall; header row ends at ~33px (0.875rem + one row)
    const headerBottom = 33, stageTop = 2.75 * 16, nodeHalf = 11 // 📏 px (11px text + padding ≈ 22px tall)
    const stageHeight = (360 * 600) / 760 - stageTop
    const coreTop = stageTop + (nodes[0].y / 100) * stageHeight - nodeHalf // 🔵 top edge of the "core" pill
    expect(coreTop).toBeGreaterThan(headerBottom) // ✅ was 9px (under the header) before the stage inset
  })

  it('nodes scale with the card (container query units, clamped)', () => {
    expect(rule('.root')).toMatch(/container-type:\s*inline-size/) // 📦
    expect(rule('.node')).toMatch(/font-size:\s*clamp\(0\.6875rem,\s*[\d.]+cqi,\s*0\.8125rem\)/) // 🔡 11px → 13px
    expect(rule('.node')).toMatch(/padding:\s*clamp\(/) // 🧱
  })
})
