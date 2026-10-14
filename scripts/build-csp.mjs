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
* @name: AbSplash CSP - compiler
* @file: scripts/build-csp.mjs
* @type: Node script — `node scripts/build-csp.mjs` writes ab-splash/csp.mjs; `--check` fails if it is stale
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🗺️ fs + path helpers
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// 📁 package root
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// ⚡ esbuild (explicit devDependency)
const esbuild = (await import('esbuild')).default // ⚡ explicit devDependency
// 📤 compiled target (what `next.config.*` imports at runtime — Node can't load raw .ts from node_modules)
const target = join(root, 'ab-splash/csp.mjs')
// 🔍 check mode (used by check:publish / prepublishOnly)
const checkOnly = process.argv.includes('--check')

// 🧾 license banner for the generated file
const banner = `/*
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
* (MIT license text: see LICENSE)
*
* @project: ab-nextjs-components
* @name: AbSplash - CSP hash helpers (COMPILED, do not edit — run \`node scripts/build-csp.mjs\`)
* @file: ab-splash/csp.mjs
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/
// 🤖 generated from ab-splash/csp.ts + ab-splash/gate.ts (bundled, ESM, Node)`

// 📦 bundle csp.ts (+ gate.ts) into one plain ESM file
const result = await esbuild.build({
  entryPoints: [join(root, 'ab-splash/csp.ts')], // 🚪 entry
  bundle: true, // 📦 inline gate.ts
  platform: 'node', // 🖥️ node:crypto stays external
  format: 'esm', // 📜 ESM
  target: 'node18', // 🎯 Next 16 minimum and up
  write: false, // 🧠 in memory first
  banner: { js: banner }, // 🧾 header
  legalComments: 'none', // 🧹 no duplicate headers
})
// 🧾 compiled text
const code = result.outputFiles[0].text

// 🔍 check mode: compare with the committed file
if (checkOnly) {
  const current = existsSync(target) ? readFileSync(target, 'utf8') : '' // 📖
  if (current !== code) { console.error('✖ ab-splash/csp.mjs is stale — run `node scripts/build-csp.mjs`'); process.exit(1) } // ❌
  console.log('✔ ab-splash/csp.mjs is up to date') // ✅
} else {
  writeFileSync(target, code) // ✍️
  console.log('✔ wrote ab-splash/csp.mjs') // ✅
}
