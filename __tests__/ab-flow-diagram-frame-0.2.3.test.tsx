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
* @name: AbFlowDiagram frame + rich nodes (0.2.3)
* @file: __tests__/ab-flow-diagram-frame-0.2.3.test.tsx
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
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbFlowDiagram, { getAbFlowRoundedPath, routeAbFlowWires, type AbFlowNode } from '../ab-flow-diagram'

const css = readFileSync(join(__dirname, '..', 'ab-flow-diagram/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹

// 🎯 John's v6 Core scene rects (scenes.py k=1)
const hub: AbFlowNode = { id: 'hub', x: 250, y: 282, w: 260, h: 76, tone: 'hub', caption: 'provider hub', content: createElement('b', null, '<AbProvider>') }
const nodes: AbFlowNode[] = [
  { id: 'cfg', x: 40, y: 104, w: 190, h: 92, caption: 'ab.config.ts', content: 'config' },
  { id: 'slot', x: 300, y: 112, w: 160, h: 60, caption: 'primitive', content: '<Slot/>' },
  { id: 'uc', x: 530, y: 104, w: 190, h: 92, caption: '"use client"', content: 'client' },
  { id: 'a11y', x: 40, y: 450, w: 200, h: 70, caption: 'a11y', content: 'Focus ring' },
  { id: 'portal', x: 290, y: 460, w: 180, h: 56, caption: 'primitive', content: '<Portal/>' },
  { id: 'dir', x: 530, y: 450, w: 190, h: 70, caption: 'locale', content: 'dir' },
]

describe('〰️ v6 route() / rounded() ports', () => {
  it('routeAbFlowWires matches scenes.py route() for the Core scene', () => {
    expect(routeAbFlowWires(nodes, hub)).toEqual([
      [[135, 196], [135, 239], [315, 239], [315, 282]], [[380, 172], [380, 282]], [[625, 196], [625, 239], [445, 239], [445, 282]],
      [[140, 450], [140, 404], [315, 404], [315, 358]], [[380, 460], [380, 358]], [[625, 450], [625, 404], [445, 404], [445, 358]],
    ]) // ✅ same numbers as Python
  })
  it('getAbFlowRoundedPath matches rounded() (r = 12)', () => {
    expect(getAbFlowRoundedPath([[135, 196], [135, 239], [315, 239], [315, 282]])).toBe('M135.0 196.0 L135.0 227.0 Q135.0 239.0 147.0 239.0 L303.0 239.0 Q315.0 239.0 315.0 251.0 L315.0 282.0') // ✅
  })
  it('side nodes wire into the hub sides', () => {
    expect(routeAbFlowWires([{ x: 556, y: 264, w: 180, h: 118 }], { x: 300, y: 262, w: 160, h: 122 })).toEqual([[[556, 323], [460, 323]]]) // ➡️ straight
  })
})

describe('🖼️ AbFlowDiagram frame mode', () => {
  const html = renderToStaticMarkup(createElement(AbFlowDiagram, {
    nodes: [...nodes, hub], frame: { w: 760, h: 600, header: 56 }, alt: 'Core scene', title: 'Live Playground', caption: 'ab-nextjs-core', live: 'live',
    wires: [[[646, 382], [646, 504], [640, 504]]],
  }))
  it('one accessible image; px stage tokens; dotted by default', () => {
    expect(html).toMatch(/^<figure role="img" aria-label="Core scene"/) // ♿
    expect(html).toMatch(/--ab-flow-w:760px;--ab-flow-h:600px;--ab-flow-header:56px/) // 📐
    expect(html).toMatch(/data-ab-frame="true"/); expect(html).toMatch(/data-ab-dotted="true"/); expect(html).toMatch(/data-ab-part="flow-dots"/) // 🟤
  })
  it('auto-routes 6 wires + 1 extra, each with glow, wire and a 2-part pulse dot from ab-nextjs-animations', () => {
    expect(html.match(/class="[^"]*ab-wire-draw/g)).toHaveLength(14) // 🖊️ 7 × (glow + wire)
    expect(html.match(/class="[^"]*ab-wire-pulse/g)).toHaveLength(14) // ✨ 7 × (halo + core)
    expect(html.match(/<i class="anchor"/g)).toHaveLength(14) // ⚓ both ends
    expect(html).toContain('d="M135.0 196.0 L135.0 227.0 Q135.0 239.0 147.0 239.0') // 〰️ the v6 path
  })
  it('rich nodes: px rect, caption label, content; the hub renders last (on top)', () => {
    expect(html).toMatch(/style="left:40px;top:104px;width:190px;height:92px"><span class="nodeCaption">ab.config.ts<\/span>config/) // 📍
    expect(html.lastIndexOf('data-tone="hub"')).toBeGreaterThan(html.lastIndexOf('data-tone="node"')) // 🎯
  })
  it('dotted={false} and anchors={false} turn them off; the island marker is rendered', () => {
    const h2 = renderToStaticMarkup(createElement(AbFlowDiagram, { nodes: [hub, nodes[0]], frame: { w: 760, h: 600 }, alt: 'x', dotted: false, anchors: false }))
    expect(h2).not.toMatch(/flow-dots|class="anchor"/); expect(h2).toMatch(/data-ab-part="flow-frame-scale"/) // 🫥 📐
  })
  it('legacy 0–100 mode still works (edges required there) and gets the dots too', () => {
    const h3 = renderToStaticMarkup(createElement(AbFlowDiagram, { nodes: [{ id: 'a', label: 'A', x: 10, y: 10 }, { id: 'b', label: 'B', x: 90, y: 90, tone: 'hub' }], edges: [{ from: 'a', to: 'b' }], alt: 'x' }))
    expect(h3).toMatch(/data-ab-dotted="true"/); expect(h3).not.toMatch(/data-ab-frame/) // 🧓
  })
})

describe('🎨 CSS', () => {
  it('card = --ab-color-card (fallback surface-container)', () => {
    expect(css).toMatch(/background: var\(--ab-color-card, var\(--ab-color-surface-container, transparent\)\)/) // 🃏
  })
  it('dots read theme --ab-dot-* with v6 fallbacks for light and dark', () => {
    expect(css).toMatch(/--ab-flow-dot: var\(--ab-dot-color, rgb\(107 79 53 \/ 0\.16\)\)/); expect(css).toMatch(/--ab-flow-dot: var\(--ab-dot-color, rgb\(245 235 225 \/ 0\.1\)\)/) // 🌞🌙
    expect(css).toMatch(/inset: var\(--ab-flow-header\) 0 0/) // ⬇️ below the header
  })
  it('stage scales by 100cqw / frame width, the island overrides with --ab-flow-scale', () => {
    expect(css).toMatch(/--ab-flow-scale-css: calc\(100cqw \/ var\(--ab-flow-w\)\)/); expect(css).toMatch(/transform: scale\(var\(--ab-flow-scale, var\(--ab-flow-scale-css, 1\)\)\)/) // 🔍
  })
})
