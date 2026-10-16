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
* @name: Motion from ab-nextjs-animations
* @file: __tests__/motion-from-animations.test.tsx
* @type: TypeScript (Vitest)
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
// 🖼️ DOM renderer
import { cleanup, fireEvent, render } from '@testing-library/react'
// 🖨️ server renderer
import { renderToStaticMarkup } from 'react-dom/server'
// 📄 fs + paths
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
// 🎠 + 🔘 under test
import { AbCarousel, AbCarouselNext, AbCarouselPrev, AbCarouselSlide, AbCarouselTrack } from '../ab-carousel'
import AbIconButton from '../ab-icon-button'

// 📁 package root + reader
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel: string) => readFileSync(join(root, rel), 'utf8')
// 🚶 every file under the package (no node_modules / .git)
const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => {
  if (n === 'node_modules' || n.startsWith('.')) return [] // 🙈
  const p = join(dir, n) // 📍
  return statSync(p).isDirectory() ? walk(p) : [relative(root, p)] // 🔁
})
const files = walk(root) // 🗂️

// 🧹
afterEach(cleanup)

describe('all component motion comes from ab-nextjs-animations 🎬', () => {
  it('no CSS module declares its own transition / animation / @keyframes (AbSplash 0s failsafe timers excepted)', () => {
    for (const f of files.filter((x) => x.endsWith('.module.css'))) {
      // 🧹 strip comments, then look for real declarations
      const css = read(f).replace(/\/\*[\s\S]*?\*\//g, '') // ✂️
      if (f === 'ab-splash/styles.module.css') {
        // ⏱️ only the two zero-length failsafe timers remain (they flip visibility / overflow, nothing moves)
        expect(css.match(/animation:[^;]*;/g)).toEqual(['animation: abSplashFailsafe 0s linear 1.2s forwards;', 'animation: abSplashUnlock 0s linear 1.2s forwards;']) // ✅
        expect(css).not.toMatch(/transition\s*:/) // 🚫
        continue
      }
      expect(css, f).not.toMatch(/(^|[;{\s])(transition|animation)(-[a-z-]+)?\s*:/m) // 🚫 transitions / animations
      expect(css, f).not.toContain('@keyframes') // 🚫 keyframes
    }
  })

  it('global chrome CSS + assets: no motion except the named exceptions', () => {
    // 🏷️ named exceptions (James review): kept on purpose, documented in the plan
    const EXCEPTIONS: Record<string, RegExp> = {
      // 📋 consumer-rendered markup (no component renders li.dialog-list-item), so no package class can be added without breaking apps
      'css/dialog.css': /^\s*transition: all 0\.2s ease-in-out;$/m,
    }
    for (const f of files.filter((x) => x.startsWith('css/') && x.endsWith('.css'))) {
      const css = read(f).replace(/\/\*[\s\S]*?\*\//g, '') // ✂️ comments
      const motion = css.match(/^.*(?:^|[\s;{])(transition|animation)(-[a-z-]+)?\s*:.*$|@keyframes/gm) ?? [] // 🔍 declarations only (package tokens like --fade-in-animation-delay are fine)
      if (EXCEPTIONS[f]) {
        expect(motion, f).toHaveLength(1) // ☝️ only the named one
        expect(motion[0], f).toMatch(EXCEPTIONS[f]) // ✅
      } else expect(motion, f).toEqual([]) // 🚫
    }
    // 🌀 spinner SVGs animate themselves (inline <style> @keyframes, used as CSS masks by css/spinner.css): the only animated assets
    const animatedSvgs = files.filter((f) => f.endsWith('.svg') && /<animate|@keyframes|animation\s*:/.test(read(f))).sort() // 🔍
    expect(animatedSvgs).toEqual(['assets/spinners/12-dots-scale-rotate.svg', 'assets/spinners/3-dots-scale.svg']) // 🏷️ named exception
  })

  it('each animated component imports the package stylesheet it uses', () => {
    const uses: Record<string, string[]> = {
      'ab-carousel/index.tsx': ['slide-step', 'motion'], // 🎠
      'ab-flow-diagram/index.tsx': ['wire'], // 〰️
      'ab-theme-toggle/index.tsx': ['motion'], // 🌗
      'ab-icon-button/index.tsx': ['motion'], // 🔘
      'ab-progress-chips/index.tsx': ['motion'], // 📊
      'ab-linear-progress/index.tsx': ['motion', 'progress-sweep'], // ➖
      'ab-collapsible/index.tsx': ['motion'], // 🪗
      'ab-like-button/index.tsx': ['motion', 'spin'], // ❤️
      'ab-searchbar/index.tsx': ['motion', 'spin'], // 🔎
      'ab-brand/index.tsx': ['motion'], // 🏷️
      'server/ab-brand/index.tsx': ['motion'], // 🏷️ server twin
      'ab-splash/index.tsx': ['motion'], // 🌫️
    }
    for (const [f, mods] of Object.entries(uses)) for (const m of mods) expect(read(f), f).toContain(`import 'ab-nextjs-animations/${m}/styles.css';`) // ✅
  })

  it('the package stylesheets the components import exist in the linked ab-nextjs-animations (>= 0.2.4)', () => {
    for (const m of ['slide-step', 'motion', 'wire', 'spin', 'progress-sweep']) expect(read(`node_modules/ab-nextjs-animations/${m}/styles.css`)).toContain('prefers-reduced-motion: reduce') // ♿
  })
  // 📦 peer ranges + the minimumReleaseAge guard moved to __tests__/release-age.test.ts (0.1.13)
})

describe('AbCarousel: direction-aware slide steps ➡️⬅️', () => {
  // 🎞️ three slides
  const Fixture = () => (
    <AbCarousel label="Intro">
      <AbCarouselTrack>
        <AbCarouselSlide>one</AbCarouselSlide>
        <AbCarouselSlide>two</AbCarouselSlide>
        <AbCarouselSlide>three</AbCarouselSlide>
      </AbCarouselTrack>
      <AbCarouselPrev />
      <AbCarouselNext />
    </AbCarousel>
  )
  const slides = (c: HTMLElement) => Array.from(c.querySelectorAll('[data-ab-part="slide"]')) // 🖼️

  it('nothing animates on first paint', () => {
    const { container } = render(<Fixture />) // 🖼️
    expect(container.querySelector('.ab-slide-step-in, .ab-slide-step-out')).toBeNull() // 🧘
    expect(container.querySelector('[data-ab-part="carousel"]')?.hasAttribute('data-ab-direction')).toBe(false) // 🧭 none yet
  })

  it('next → forward: new slide enters, old one leaves', () => {
    const { container, getByLabelText } = render(<Fixture />) // 🖼️
    fireEvent.click(getByLabelText('Next slide')) // ⏭️
    expect(container.querySelector('[data-ab-part="carousel"]')?.getAttribute('data-ab-direction')).toBe('forward') // 🧭
    const [a, b, c] = slides(container) // 🖼️
    expect(b.classList.contains('ab-slide-step-in')).toBe(true) // ⏭️ enters
    expect(a.classList.contains('ab-slide-step-out')).toBe(true) // 👋 leaves
    expect(c.className).not.toMatch(/ab-slide-step/) // 🙅 untouched
  })

  it('prev → back', () => {
    const { container, getByLabelText } = render(<Fixture />) // 🖼️
    fireEvent.click(getByLabelText('Next slide')) // ⏭️ 0 → 1
    fireEvent.click(getByLabelText('Next slide')) // ⏭️ 1 → 2
    fireEvent.click(getByLabelText('Previous slide')) // ⏮️ 2 → 1
    expect(container.querySelector('[data-ab-part="carousel"]')?.getAttribute('data-ab-direction')).toBe('back') // 🧭
    const [a, b, c] = slides(container) // 🖼️
    expect(b.classList.contains('ab-slide-step-in')).toBe(true) // ⏮️ enters
    expect(c.classList.contains('ab-slide-step-out')).toBe(true) // 👋 leaves
    expect(a.className).not.toMatch(/ab-slide-step/) // 🙅
  })

  it('prev / next buttons use the package hover + press motion', () => {
    const { getByLabelText } = render(<Fixture />) // 🖼️
    expect(getByLabelText('Next slide').className).toMatch(/ab-motion-interactive.*ab-motion-press/) // 🎨 🤏
  })
})

describe('AbIconButton: lift / press come from ab-nextjs-animations', () => {
  it('maps expands → ab-motion-lift and shrinks → ab-motion-press', () => {
    const html = renderToStaticMarkup(<AbIconButton icon="add" label="Add" expands shrinks />) // 🖨️
    expect(html).toContain('ab-motion-interactive') // 🎨
    expect(html).toContain('ab-motion-lift') // 🎈
    expect(html).toContain('ab-motion-press') // 🤏
    expect(renderToStaticMarkup(<AbIconButton icon="add" label="Add" />)).not.toMatch(/ab-motion-(lift|press)/) // 🙅 opt-in
  })
})

describe('GitHub mark lives only in ab-nextjs-icons 🐙', () => {
  it('no copied Octicons path or NOTICE in components', () => {
    // 🔍 the first path segment of the icons package github glyph
    const sig = /d="([^"]{20})/.exec(read('node_modules/ab-nextjs-icons/ab-icons/outlined/github.svg'))![1] // 🧬
    for (const f of files.filter((x) => /\.(tsx?|css|svg|md|json)$/.test(x))) expect(read(f), f).not.toContain(sig) // 🚫 copy
    expect(files.some((f) => /(^|\/)NOTICE/i.test(f))).toBe(false) // 🚫 duplicate NOTICE
    expect(files.filter((f) => /\.(tsx?|css)$/.test(f) && !f.startsWith('__tests__/')).some((f) => /octicon/i.test(read(f)))).toBe(false) // 🚫 vendored source
  })
})
