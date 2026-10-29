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
* @name: server/client twin drift guard (Joseph 03:41)
* @file: __tests__/server-twin-drift.test.ts
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
// 🧪 0.2.3 (Joseph 03:41): client/server twins must not drift.
import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import ServerButton from '../server/ab-button'
import ClientButton from '../ab-button'

const root = join(__dirname, '..') // 📁
const body = (f: string) => readFileSync(join(root, f), 'utf8').replace(/^[\s\S]*?\*\/\s*/, '') // ✂️ drop the license header (its @file differs)

describe('server ↔ client twins 🧬', () => {
  it('server AbButton has NO own CSS and imports the client module (single source)', () => {
    expect(existsSync(join(root, 'server/ab-button/styles.module.css'))).toBe(false) // 🚫 copy
    expect(readFileSync(join(root, 'server/ab-button/index.tsx'), 'utf8')).toContain("from '../../ab-button/styles.module.css'") // 🔗
  })
  it('server AbButton gets the same classes as the client one (plain + rounded, every type)', () => {
    for (const type of ['contained', 'filled', 'outlined', 'text'] as const) for (const rounded of [false, true]) {
      const cls = (C: any) => renderToStaticMarkup(createElement(C, { label: 'Go', type, rounded })).match(/class="([^"]*)"/)![1] // 🏷️
      expect(cls(ServerButton)).toBe(cls(ClientButton))
    }
  })
  const twins = readdirSync(join(root, 'server')).filter((d) => existsSync(join(root, 'server', d, 'styles.module.css')) && existsSync(join(root, d, 'styles.module.css'))) // 👯
  it('found the twins to guard', () => { expect(twins.length).toBeGreaterThan(5) })
  for (const d of twins) it(`${d}: server CSS body === client CSS body`, () => { expect(body(`server/${d}/styles.module.css`)).toBe(body(`${d}/styles.module.css`)) }) // 🛡️
})
