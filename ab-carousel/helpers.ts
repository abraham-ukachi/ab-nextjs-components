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
* @name: AbCarousel - Helpers (server-safe)
* @file: ab-carousel/helpers.ts
* @type: Pure TypeScript (no React, no 'use client')
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> import { AB_CAROUSEL_NOSCRIPT_CSS } from 'ab-nextjs-components/ab-carousel/helpers'
*    -|> <noscript><style>{AB_CAROUSEL_NOSCRIPT_CSS}</style></noscript> // 📜 no-JS: stack every slide
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧭 reading direction used for keyboard + swipe mapping
export type AbCarouselDir = 'ltr' | 'rtl'

// 🎬 what a key press asks the carousel to do
export type AbCarouselKeyAction = 'next' | 'prev' | 'first' | 'last'

// 📣 why the index changed (handy for analytics, URL sync and focus decisions)
// ⏭️ 'skip' = Welcome Skip → LAST slide (God, §8 Q3); apps move focus to that slide's h1 on it
export type AbCarouselChangeReason = 'next' | 'prev' | 'dot' | 'key' | 'swipe' | 'skip' | 'api'

// 📍 where a slide sits relative to the active one (drives the CSS enter / exit offset)
export type AbCarouselSlidePosition = 'before' | 'active' | 'after'

// 🏷️ default slide label: "3 of 9" (brief §5: aria-label on each role=group slide)
export const defaultAbCarouselSlideLabel = (n: number, total: number): string => `${n} of ${total}`

// 📣 default live-region text: "Slide 3 of 9: Ready-made components" (title optional)
export const defaultAbCarouselAnnouncement = (n: number, total: number, title?: string): string =>
  // 🧩 add the title only when we have one
  title ? `Slide ${n} of ${total}: ${title}` : `Slide ${n} of ${total}`

// 🔘 default dot label: "Go to slide 3: Ready-made components"
export function defaultAbCarouselDotLabel(n: number, total: number, title?: string): string {
  void total // 🧩 unused by the default, but part of the signature for i18n callers ("{n} / {total}")
  // 🏷️ with or without the slide title
  return title ? `Go to slide ${n}: ${title}` : `Go to slide ${n}`
}

// 0️⃣ two-digit zero padding used by the counter ("02 / 09")
export const padAbCarouselNumber = (value: number): string => String(value).padStart(2, '0')

/**
 * 🔒 clampAbCarouselIndex — keep an index inside [0, count - 1].
 * - 🔁 `loop: true` wraps around (−1 → last, count → 0)
 * - 🧯 non-finite values → 0, `count <= 0` → 0
 */
export function clampAbCarouselIndex(index: number, count: number, loop = false): number {
  // 🚫 empty carousel
  if (!Number.isFinite(count) || count <= 0) return 0
  // 🚫 garbage index
  if (!Number.isFinite(index)) return 0
  // 🔢 integers only
  const i = Math.trunc(index)
  // 🔁 wrap (positive modulo)
  if (loop) return ((i % count) + count) % count
  // ✂️ clamp
  return Math.min(count - 1, Math.max(0, i))
}

/**
 * ⌨️ getAbCarouselKeyAction — map a `KeyboardEvent.key` to a carousel action.
 * ←/→ follow the reading direction (RTL flips them); Home / End jump to the ends.
 */
export function getAbCarouselKeyAction(key: string, dir: AbCarouselDir = 'ltr'): AbCarouselKeyAction | null {
  // 🔁 RTL flips the arrows
  const rtl = dir === 'rtl'
  // 🗺️ the map
  switch (key) {
    case 'ArrowRight': return rtl ? 'prev' : 'next' // ➡️
    case 'ArrowLeft': return rtl ? 'next' : 'prev' // ⬅️
    case 'Home': return 'first' // ⏮️
    case 'End': return 'last' // ⏭️
    default: return null // 🙅 not ours
  }
}

// 📍 slide position relative to the active index
export function getAbCarouselSlidePosition(slide: number, active: number): AbCarouselSlidePosition {
  // ⬅️ / ✅ / ➡️
  return slide < active ? 'before' : slide > active ? 'after' : 'active'
}

/**
 * ⌨️ Keyboard is ignored while focus is inside these (they own the arrow keys themselves):
 * form fields, editable text, tablists (install box), sliders, listboxes, menus, radio groups,
 * and anything marked `data-ab-keys-ignore`.
 */
export const AB_CAROUSEL_KEY_IGNORE_SELECTOR = [
  'input', // ✍️ text fields
  'textarea', // 📝
  'select', // 🔽
  '[contenteditable=""]', // ✏️
  '[contenteditable="true"]', // ✏️
  '[role="tablist"]', // 🗂️ install-box tabs use ←/→ for roving focus
  '[role="slider"]', // 🎚️
  '[role="listbox"]', // 📋
  '[role="menu"]', // 🍔
  '[role="radiogroup"]', // 🔘 theme switch
  '[data-ab-keys-ignore]', // 🙈 opt-out
].join(',')

/**
 * 📜 No-JS stylesheet: put it in `<noscript><style>…</style></noscript>` on the page.
 * Every slide is shown as a vertical stack and the JS-only controls are hidden (brief §1.3).
 * Uses `data-ab-part` selectors (CSS-module class names are hashed).
 */
export const AB_CAROUSEL_NOSCRIPT_CSS = [
  // 📚 stack slides instead of overlaying them
  '[data-ab-part="carousel"] [data-ab-part="track"]{display:block!important}',
  // 👀 every slide visible, static, interactive
  '[data-ab-part="carousel"] [data-ab-part="slide"]{opacity:1!important;visibility:visible!important;transform:none!important;pointer-events:auto!important}',
  // 🙈 controls need JS
  '[data-ab-part="carousel"] :is([data-ab-part="dots"],[data-ab-part="prev"],[data-ab-part="next"],[data-ab-part="counter"]){display:none!important}',
].join('')
