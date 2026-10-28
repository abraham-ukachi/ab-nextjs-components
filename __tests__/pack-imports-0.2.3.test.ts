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
* @name: Pack integrity: shipped relative imports (0.2.3)
* @file: __tests__/pack-imports-0.2.3.test.ts
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
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'

// 📦 the package root + its `files` allow-list (what `pnpm pack` ships, plus package.json)
const root = join(__dirname, '..')
const files: string[] = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).files // 📋
// ✅ is a package-relative path inside one of the `files` entries?
const shipped = (rel: string) => files.some((f) => rel === f || rel.startsWith(`${f}/`)) // 🎯
// 🚶 every file under a shipped entry
const walk = (p: string): string[] => (statSync(p).isDirectory() ? readdirSync(p).flatMap((n) => (n === 'node_modules' ? [] : walk(join(p, n)))) : [p])
const sources = files.filter((f) => existsSync(join(root, f))).flatMap((f) => walk(join(root, f))).filter((p) => /\.(tsx?|mts|css)$/.test(p)) // 📄
// 🔎 relative specifiers: import / export … from, side-effect imports, dynamic import(), CSS @import
const SPEC = /(?:from\s+|import\s*\(?\s*|@import\s+(?:url\()?)['"](\.{1,2}\/[^'"]+)['"]/g
// 🧭 resolve like TS / bundlers: exact, then the extensions, then a folder index
const EXT = ['', '.ts', '.tsx', '.d.ts', '.css', '/index.ts', '/index.tsx', '/index.d.ts']
const target = (from: string, spec: string) => EXT.map((e) => resolve(dirname(from), spec) + e).find((p) => existsSync(p) && statSync(p).isFile()) // 📍

// 🛡️ 0.2.3 (Joseph): ab-theme-mode/ was imported by shipped files but missing from `files` → TS2307 / Module not found
describe('📦 pack integrity: every relative import in a shipped file resolves to a shipped file', () => {
  it('scans a real set of shipped sources', () => { expect(sources.length).toBeGreaterThan(10) }) // 🧮
  it('no import points outside `files` (or nowhere)', () => {
    const broken: string[] = []
    for (const src of sources) {
      const code = readFileSync(src, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '') // 🧹 comments
      for (const m of code.matchAll(SPEC)) {
        const hit = target(src, m[1]) // 📍
        const rel = hit ? relative(root, hit).split(sep).join('/') : null
        if (!rel || !shipped(rel)) broken.push(`${relative(root, src)} → ${m[1]}${rel ? ` (${rel} not in files)` : ' (missing)'}`) // 💥
      }
    }
    expect(broken).toEqual([]) // ✅
  })
})
