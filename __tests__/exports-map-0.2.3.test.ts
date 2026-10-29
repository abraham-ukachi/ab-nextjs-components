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
* @name: Exports map vs shipped folders (0.2.3)
* @file: __tests__/exports-map-0.2.3.test.ts
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
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// 📦 package.json: `files` (what ships) + `exports` (what consumers may import)
const root = join(__dirname, '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { files: string[]; exports: Record<string, string | Record<string, string>> }
const target = (v: string | Record<string, string>) => (typeof v === 'string' ? v : v.default ?? Object.values(v)[0]) // 🎯
// 🗂️ shipped top-level folders that have an index entry (ab-*/index.ts|tsx)
const entries = pkg.files.filter((f) => !f.includes('/') && existsSync(join(root, f)) && statSync(join(root, f)).isDirectory())
  .filter((f) => ['index.ts', 'index.tsx'].some((i) => existsSync(join(root, f, i)))) // 📂

// 🛡️ 0.2.3 (Joseph): ./ab-theme-mode shipped but had no exports entry → "Package subpath not defined"
describe('🧭 exports map covers every shipped component folder', () => {
  it('every shipped folder with an index has a ./<folder> exports entry pointing at it', () => {
    const missing = entries.filter((f) => f !== 'server' && f !== 'types' && !(`./${f}` in pkg.exports)) // 🔎
    expect(missing).toEqual([]) // ✅
    for (const f of entries.filter((f) => `./${f}` in pkg.exports)) expect(target(pkg.exports[`./${f}`]), f).toMatch(new RegExp(`^\\./${f}/index\\.tsx?$`)) // 🎯
  })
  it('every exports target exists and ships', () => {
    for (const [k, v] of Object.entries(pkg.exports)) {
      const t = target(v).replace(/^\.\//, '').replace(/\/?\*.*$/, '') // 📍 a `css/*` pattern → its folder
      expect(existsSync(join(root, t)), `${k} → ${t}`).toBe(true) // 📄
      expect(t === 'package.json' || pkg.files.some((f) => t === f || t.startsWith(`${f}/`)), `${k} → ${t} not in files`).toBe(true) // 📦
    }
  })
})
