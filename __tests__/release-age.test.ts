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
* @name: Peer ranges + minimumReleaseAge guard - Tests (0.1.13)
* @file: __tests__/release-age.test.ts
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
// 📄 fs + paths
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// 📁 package root + reader
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel: string) => readFileSync(join(root, rel), 'utf8')

/**
 * 🎯 the sibling ranges this release builds on (carets, peer == dev).
 * ✅ 0.1.13: theme ^0.3.4, icons ^0.2.4 and hooks ^0.1.7 are on npm (2026-10-20).
 * ✅ 0.1.14: theme ^0.3.5 is on npm (2026-10-20T20:40:07Z, provenance).
 */
const WANT: Record<string, string> = {
  'ab-nextjs-hooks': '^0.1.7',
  'ab-nextjs-theme': '^0.3.7',
  'ab-nextjs-animations': '^0.2.5',
  'ab-nextjs-icons': '^0.2.4',
}

/**
 * 🛡️ D33: the ONLY allowed pnpm 11 minimumReleaseAge exemptions — our own brand-new ab-nextjs-* releases,
 * exact versions, each with an expiry (registry publish time + 24h, UTC). An expired entry fails the suite,
 * so nobody forgets to remove it.
 */
const ALLOWED_EXCLUDES: Record<string, string> = {
  'ab-nextjs-animations@0.2.5': '2026-10-30T22:54:29.614Z', // ⏰ TODO(remove after expiry): published 2026-10-29T22:54:29.614Z
  'ab-nextjs-theme@0.3.7': '2026-10-30T22:49:34.458Z', // ⏰ TODO(remove after expiry): published 2026-10-29T22:49:34.458Z
}

// 📋 the list under `minimumReleaseAgeExclude:` (stops at the next top-level key)
function readExcludes(ws: string): string[] {
  const block = /^minimumReleaseAgeExclude:[^\n]*\n((?:[ \t]+[^\n]*\n?|[ \t]*#[^\n]*\n?|[ \t]*\n)*)/m.exec(ws)?.[1] ?? '' // 📋
  return [...block.matchAll(/^[ \t]+-[ \t]+['"]?([^'"\s#]+)['"]?/gm)].map((m) => m[1]) // 🔍 entries
}

describe('release age + sibling ranges 📦', () => {
  const pkg = JSON.parse(read('package.json')) // 📦

  it('peer + dev ranges are matching carets; animations + icons are required', () => {
    for (const [name, range] of Object.entries(WANT)) {
      expect(pkg.peerDependencies[name], name).toBe(range) // 🤝 peer
      expect(pkg.devDependencies[name], name).toBe(range) // 🧪 dev
    }
    expect(pkg.peerDependenciesMeta?.['ab-nextjs-animations']).toBeUndefined() // 🚫 optional
    expect(pkg.peerDependenciesMeta?.['ab-nextjs-icons']).toBeUndefined() // 🚫 optional
  })

  it('never commits local links (file:, link:, workspace:, portal:)', () => {
    const all = [...Object.values(pkg.dependencies ?? {}), ...Object.values(pkg.devDependencies), ...Object.values(pkg.peerDependencies)] as string[]
    for (const range of all) expect(range).not.toMatch(/^(file|link|workspace|portal):/) // 🔗
  })

  it('minimumReleaseAgeExclude only lists allowed, unexpired, exact ab-nextjs-* versions', () => {
    const excludes = readExcludes(read('pnpm-workspace.yaml')) // 📋
    for (const e of excludes) {
      expect(e, e).toMatch(/^ab-nextjs-[a-z-]+@\d+\.\d+\.\d+$/) // 🎯 ours, exact
      expect(read('pnpm-lock.yaml'), `${e} is not in the lockfile: drop it`).toContain(`${e}:`) // 🔒 only what we resolve
      expect(Object.keys(ALLOWED_EXCLUDES), e).toContain(e) // 🚫 unlisted
      expect(Date.now(), `${e} is over a day old: remove it from pnpm-workspace.yaml`).toBeLessThan(Date.parse(ALLOWED_EXCLUDES[e])) // ⏰
    }
  })

  it('the minimum release age itself stays on (no repo-level opt-out)', () => {
    expect(read('pnpm-workspace.yaml')).not.toMatch(/^minimumReleaseAge:\s*0\b/m) // 🛡️
  })

  it('.npmrc has no minimum-release-age setting (pnpm 11 ignores it there; James review)', () => {
    let npmrc = '' // 📄 a missing .npmrc is fine
    try { npmrc = read('.npmrc') } catch { /* 🙅 none */ }
    expect(npmrc).not.toMatch(/^\s*minimum-?release-?age/im) // 🚫 minimumReleaseAge / minimum-release-age
  })

  it('pnpm-workspace.yaml turns on minimumReleaseAgeStrict 🛡️', () => {
    expect(read('pnpm-workspace.yaml')).toMatch(/^minimumReleaseAgeStrict:\s*true\b/m) // 🛡️
  })
})
