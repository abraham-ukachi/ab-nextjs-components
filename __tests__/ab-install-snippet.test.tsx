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
* @name: AbInstallSnippet - Tests (G35)
* @file: __tests__/ab-install-snippet.test.tsx
* @type: Vitest (happy-dom)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// @vitest-environment happy-dom

// 🧪 vitest
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// 🖼️ DOM helpers
import { act, cleanup, fireEvent, render } from '@testing-library/react'
// 📦 under test
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbInstallSnippet, { getAbInstallCommand } from '../ab-install-snippet'

// 🏷️ labels
const labels = { group: 'Install ab-nextjs-core', copy: 'Copy command', copied: 'Copied' }
// 📋 fake clipboard
const writeText = vi.fn(async () => {})
beforeEach(() => {
  window.localStorage.clear() // 🧹
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true }) // 📋
  writeText.mockClear() // 🧹
})
afterEach(() => cleanup())

describe('getAbInstallCommand', () => {
  it('builds each manager command', () => {
    expect(getAbInstallCommand('pnpm', 'ab-nextjs-core')).toBe('pnpm add ab-nextjs-core') // ⚡
    expect(getAbInstallCommand('npm', 'ab-nextjs-core')).toBe('npm i ab-nextjs-core') // 📦
    expect(getAbInstallCommand('yarn', 'x', true)).toBe('yarn add -D x') // 🧶
    expect(getAbInstallCommand('bun', 'x', true)).toBe('bun add -d x') // 🥟
  })
})

describe('AbInstallSnippet (G35)', () => {
  it('tabs follow the APG pattern and switch the command', () => {
    const { getByRole, getAllByRole } = render(<AbInstallSnippet pkg="ab-nextjs-core" labels={labels} />) // 🖼️
    const list = getByRole('tablist') // 🗂️
    expect(list.getAttribute('aria-label')).toBe('Install ab-nextjs-core') // 🏷️
    const tabs = getAllByRole('tab') // 🔘
    expect(tabs.map((t) => t.textContent)).toEqual(['pnpm', 'npm', 'yarn', 'bun']) // 🗂️
    expect(getByRole('tabpanel').textContent).toContain('pnpm add ab-nextjs-core') // 🧾
    fireEvent.keyDown(list, { key: 'ArrowRight' }) // ➡️
    expect(tabs[1].getAttribute('aria-selected')).toBe('true') // ✅
    expect(document.activeElement).toBe(tabs[1]) // 🎯
    expect(getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(tabs[1].id) // 🔗
    expect(getByRole('tabpanel').textContent).toContain('npm i ab-nextjs-core') // 🧾
  })

  it('copies the command and announces "Copied" politely', async () => {
    const { getByLabelText, getByRole } = render(<AbInstallSnippet pkg="ab-nextjs-core" labels={labels} />) // 🖼️
    await act(async () => { fireEvent.click(getByLabelText('Copy command')) }) // 📋
    expect(writeText).toHaveBeenCalledWith('pnpm add ab-nextjs-core') // ✅
    expect(getByRole('status').textContent).toBe('Copied') // 📣
  })

  it('a storageKey shares the choice between snippets (slides) and is swipe-ignored', () => {
    const { getAllByRole, container } = render(<>
      <AbInstallSnippet pkg="a" labels={labels} storageKey="ab-welcome-pm" />
      <AbInstallSnippet pkg="b" labels={labels} storageKey="ab-welcome-pm" />
    </>) // 🖼️ two slides
    fireEvent.click(getAllByRole('tab')[3]) // 🥟 bun in the first
    expect(getAllByRole('tabpanel')[1].textContent).toContain('bun add b') // 🔁 second follows
    expect(container.querySelectorAll('[data-ab-swipe-ignore]')).toHaveLength(2) // 👆 carousel won't swipe here
  })
  it('JS off (0.1.13): server HTML shows the pnpm command and CSS hides copy', () => {
    const html = renderToStaticMarkup(<AbInstallSnippet pkg="ab-nextjs-core" labels={labels} storageKey="ab-pm" />) // 🖨️
    expect(html).toContain('pnpm add ab-nextjs-core') // 🌱 default
    const css = readFileSync(join(__dirname, '..', 'ab-install-snippet/styles.module.css'), 'utf8') // 📄
    expect(css).toMatch(/@media \(scripting: none\) \{\s*\.copy \{ display: none; \}/) // 🙈
  })
})
