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
* @name: AbIcon - Shared helpers + registry (G2)
* @file: ab-icon/helpers.ts
* @type: TypeScript (pure, server-safe)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> import arrowBack from 'ab-nextjs-icons/ab-icons/icons/arrow_back' // 📦 icons ≥ 0.2.3, one icon per module
*    -|> registerAbIcons({ arrow_back: arrowBack }) // 🗂️ at module scope (same on server + client → no hydration mismatch)
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧾 one icon's SVG markup (same shape as ab-nextjs-icons `AbIconSvgEntry`)
export interface AbIconSvgData {
  outlined: string; // ✏️ outlined markup (stroke = currentColor)
  filled?: string; // ⬛ filled markup (optional)
}

// 🎚️ variants + weights (mirrors ab-nextjs-icons ≥ 0.2.0)
export type AbIconVariant = 'outlined' | 'filled';
export type AbIconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;

// 📏 weight → stroke width. Copied from ab-nextjs-icons `abIconWeightStroke`
//    (importing it would pull the whole 378 KB icon map into client bundles).
export const AB_ICON_WEIGHT_STROKE: Record<AbIconWeight, number> = {
  100: 1.0, 200: 1.25, 300: 1.5, 400: 1.85, 500: 2.2, 600: 2.5, 700: 2.85, // ✅ test guards drift
};

// 🧭 package default weight (icons 0.2.0+: 200)
export const AB_ICON_DEFAULT_WEIGHT: AbIconWeight = 200;

// 🗂️ module-level registry: name → markup (client bundles only carry what you register)
const registry = new Map<string, AbIconSvgData>();

/**
 * @name registerAbIcons
 * @description 🗂️ Make icons available to the client `<AbIcon name>`. Call at module
 *   scope so server render + hydration see the same set. Later calls overwrite names.
 */
export function registerAbIcons(icons: Record<string, AbIconSvgData>): void {
  for (const [name, data] of Object.entries(icons)) registry.set(name, data); // ➕
}

// 🔍 registry lookup (tests + server twin fallback)
export function getRegisteredAbIcon(name: string): AbIconSvgData | undefined {
  return registry.get(name); // 🎯
}

/**
 * @name pickAbIconMarkup
 * @description 🎯 Choose markup for a variant; filled falls back to outlined (like getAbIconSvg).
 */
export function pickAbIconMarkup(data: AbIconSvgData | undefined, variant: AbIconVariant): string | undefined {
  if (!data) return undefined; // 🙅
  return variant === 'filled' ? (data.filled ?? data.outlined) : data.outlined; // ✅
}

/**
 * @name getAbIconStroke
 * @description 📏 Stroke width for a weight (snaps to the nearest supported weight).
 */
export function getAbIconStroke(weight: number = AB_ICON_DEFAULT_WEIGHT): number {
  const keys = Object.keys(AB_ICON_WEIGHT_STROKE).map(Number) as AbIconWeight[]; // 🔢
  const nearest = keys.reduce((a, b) => (Math.abs(b - weight) < Math.abs(a - weight) ? b : a)); // 🎯
  return AB_ICON_WEIGHT_STROKE[nearest]; // 📏
}

// 📏 normalise size → CSS length
export function toAbIconSize(size: number | string | undefined): string {
  if (size == null) return '24px'; // 🧭 default 24
  return typeof size === 'number' ? `${size}px` : size; // 📏
}


// 🔕 names we already warned about (one warning per name per page load)
const warned = new Set<string>()

/**
 * ⚠️ 0.1.13 (G2): warns once in development when a name isn't an AbIcon (registered, explicit `svg`, or in
 * the map). It falls back to the Material Symbols ligature, which shows the NAME as text once the font is gone.
 * Register it with `registerAbIcons({ name: icon })` from `ab-nextjs-icons/ab-icons/icons/<name>`.
 */
export function warnAbIconMissing(name: string): void {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return // 🤫 silent in prod
  if (warned.has(name)) return // 🔕 once
  warned.add(name) // 📝
  console.warn(`[AbIcon] "${name}" is not a registered AbIcon. Register it: registerAbIcons({ ${name} }) from 'ab-nextjs-icons/ab-icons/icons/${name}'. (Falling back to the Material Symbols font ligature.)`) // ⚠️
}

/**
 * 🆔 0.1.13 (Joseph): scopeAbIconIds — suffix every `id` in the markup, plus the `url(#…)` / `href="#…"`
 * refs that point at it, so two filled Homes on one page (bottom bar + sidebar) never share a mask.
 * Same rules as ab-nextjs-icons 0.2.4 `scopeAbIconSvgIds` (copied: importing it is fine, but the client
 * bundle rule above says no icon-package imports here). `AbIcon` calls it with React `useId()`.
 */
export function scopeAbIconIds(markup: string, scope: string): string {
  const ids = Array.from(markup.matchAll(/\sid="([^"]+)"/g), (m) => m[1]); // 🔎 declared ids
  if (ids.length === 0) return markup; // 🙅 most outlined icons
  const suffix = `-${scope.replace(/[^A-Za-z0-9_-]/g, '') || 'x'}`; // 🧼 `:r1:` / `«r1»` → `-r1`
  let out = markup;
  for (const id of new Set(ids)) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 🛡️ regex-escape
    out = out
      .replace(new RegExp(`(\\sid=")${esc}(")`, 'g'), `$1${id}${suffix}$2`) // 🆔
      .replace(new RegExp(`url\\(#${esc}\\)`, 'g'), `url(#${id}${suffix})`) // 🎭
      .replace(new RegExp(`(href=")#${esc}(")`, 'g'), `$1#${id}${suffix}$2`); // 🔗
  }
  return out; // ✅
}
