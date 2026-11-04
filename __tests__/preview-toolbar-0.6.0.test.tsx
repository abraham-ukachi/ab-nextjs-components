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
* @name: AbPreviewStage toolbar (0.6.0)
* @file: __tests__/preview-toolbar-0.6.0.test.tsx
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
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { useEffect } from 'react'
// 🧰 the components
import AbPreviewCode from '../ab-preview-code'
import AbPreviewStage from '../ab-preview-code/stage'
import { AB_ICON_BUILTINS } from '../ab-icon'

afterEach(cleanup) // 🧹

let mounts = 0 // 🔢 counts preview mounts (reload = remount)
const Probe = () => { useEffect(() => { mounts++ }, []); return <b>live</b> } // 🧪

describe('🧰 AbPreviewCode toolbar', () => {
  it('server-renders a named toolbar with default labels; no link without href', () => {
    const h = renderToStaticMarkup(<AbPreviewCode code="x"><b>x</b></AbPreviewCode>) // 🖨️
    expect(h).toContain('role="toolbar" aria-label="Preview tools"') // ♿
    expect(h).toContain('aria-label="Dark preview" aria-pressed="false"') // 🌙
    expect(h).toContain('aria-label="Reload preview"') // 🔄
    expect(h).not.toContain('target="_blank"') // 🙅
  })
  it('index.tsx stays server-safe (no use client); the island is client', () => {
    expect(readFileSync(join(__dirname, '..', 'ab-preview-code/index.tsx'), 'utf8')).not.toMatch(/^'use client'/m) // 🖥️
    expect(readFileSync(join(__dirname, '..', 'ab-preview-code/stage.tsx'), 'utf8')).toMatch(/^'use client';/m) // 🏝️
  })
  it('labels override every name; href adds a safe new-tab link', () => {
    const { getByRole } = render(<AbPreviewCode code="x" href="/ex/button" labels={{ toolbar: 'Outils', dark: 'Sombre', reload: 'Recharger', open: 'Ouvrir' }}><b>x</b></AbPreviewCode>) // 🌍
    expect(getByRole('toolbar').getAttribute('aria-label')).toBe('Outils') // 🧰
    expect(getByRole('button', { name: 'Sombre' })).toBeTruthy() // 🌙
    expect(getByRole('button', { name: 'Recharger' })).toBeTruthy() // 🔄
    const a = getByRole('link', { name: 'Ouvrir' }) // ↗️
    expect(a.getAttribute('href')).toBe('/ex/button') // 🔗
    expect(a.getAttribute('target')).toBe('_blank') // 🪟
    expect(a.getAttribute('rel')).toBe('noopener noreferrer') // 🔐
  })
  it('toolbar={false} renders just the box', () => {
    expect(renderToStaticMarkup(<AbPreviewCode code="x" toolbar={false}><b>x</b></AbPreviewCode>)).not.toContain('role="toolbar"') // 🙅
  })
})

describe('🌗 scheme toggle + 🔄 reload', () => {
  it('toggles aria-pressed and ONLY the preview box scheme', () => {
    const { getByRole, container } = render(<AbPreviewStage><b>x</b></AbPreviewStage>) // 🖼️
    const t = getByRole('button', { name: 'Dark preview' }) // 🌙
    const box = () => container.querySelector('[data-ab-part="demo-box"]')! // 🧪
    expect(box().hasAttribute('data-theme')).toBe(false) // 🌗 inherit
    fireEvent.click(t) // 🖱️
    expect(t.getAttribute('aria-pressed')).toBe('true') // ✅
    expect(box().getAttribute('data-theme')).toBe('dark') // 🌑
    expect(document.documentElement.getAttribute('data-theme')).toBeNull() // 🙅 the page is untouched
    fireEvent.click(t) // 🖱️
    expect(t.getAttribute('aria-pressed')).toBe('false') // ✅
    expect(box().getAttribute('data-theme')).toBe('light') // 🌞
  })
  it('a starting scheme="dark" is pressed', () => {
    const { getByRole } = render(<AbPreviewStage scheme="dark"><b>x</b></AbPreviewStage>) // 🌑
    expect(getByRole('button', { name: 'Dark preview' }).getAttribute('aria-pressed')).toBe('true') // ✅
  })
  it('reload remounts the preview (key bump)', () => {
    mounts = 0 // 🔢
    const { getByRole } = render(<AbPreviewStage><Probe /></AbPreviewStage>) // 🧪
    expect(mounts).toBe(1) // 1️⃣
    fireEvent.click(getByRole('button', { name: 'Reload preview' })) // 🔄
    expect(mounts).toBe(2) // 2️⃣ fresh mount
  })
})

describe('⌨️ toolbar keyboard + targets', () => {
  it('one tab stop; arrows / Home / End rove', () => {
    const { getByRole } = render(<AbPreviewStage href="/x"><b>x</b></AbPreviewStage>) // 🖼️
    const bar = getByRole('toolbar') // 🧰
    const tools = Array.from(bar.querySelectorAll<HTMLElement>('[data-ab-tool]')) // 🔘
    expect(tools.map((t) => t.tabIndex)).toEqual([0, -1, -1]) // 🎯 one stop
    tools[0].focus(); fireEvent.keyDown(bar, { key: 'ArrowRight' }) // ➡️
    expect(document.activeElement).toBe(tools[1]) // ✅
    fireEvent.keyDown(bar, { key: 'End' }) // ⏭️
    expect(document.activeElement).toBe(tools[2]) // ✅
    fireEvent.keyDown(bar, { key: 'ArrowRight' }) // 🔁 wraps
    expect(document.activeElement).toBe(tools[0]) // ✅
    fireEvent.keyDown(bar, { key: 'ArrowLeft' }) // ⬅️ wraps back
    expect(document.activeElement).toBe(tools[2]) // ✅
    expect(tools.map((t) => t.tabIndex)).toEqual([-1, -1, 0]) // 🎯 the stop follows focus
  })
  it('tools are ≥44px targets; icons are built-ins from ab-nextjs-icons', () => {
    const css = readFileSync(join(__dirname, '..', 'ab-preview-code/styles.module.css'), 'utf8') // 🎨
    expect(css).toMatch(/\.abPreviewTool \{[^}]*min-inline-size:\s*44px[^}]*min-block-size:\s*44px/) // 🔘
    for (const n of ['dark_mode', 'light_mode', 'refresh', 'open_in_new']) expect(AB_ICON_BUILTINS[n], n).toBeDefined() // 🔣
  })
})
