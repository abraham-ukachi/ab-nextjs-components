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
*
* @project: ab-nextjs-components
* @name: Active nav item matching (0.4.3)
* @file: ab-sidebar/active.ts
* @type: Pure helpers (client + server)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> getAbActiveHrefs(['/docs', '/docs/x'], '/docs/x?tab=1#top') // → Set { '/docs/x' } (longest match only)
*   2+|> getAbActiveHrefs(['/docs', '/docs/x'], '/docs/x', { match: 'prefix' }) // → Set { '/docs', '/docs/x' }
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧠 no 'use client': AbSidebar (both twins) and AbNavDrawer share these, so one rule lights every nav

// 🌍 locale-prefix stripping (`/fr/docs` → `/docs`)
import { stripAbLocalePrefix } from '../ab-link/locale';

/**
 * 🎯 How an item's href is matched against the current route.
 *
 * - `'best'` (default): prefix matching, but only the **longest** matching href wins, so `/docs` and
 *   `/docs/x` never light up together on `/docs/x`. On `/docs/y` (not in the list) `/docs` still lights.
 * - `'prefix'`: every parent of the route is active (the pre-0.4.3 behaviour; can double-highlight).
 * - `'exact'`: only the item whose href equals the route.
 */
export type AbActiveMatch = 'best' | 'prefix' | 'exact';

/** 🔗 anything with an href, plus an optional per-item override (`exact: true` = never a parent match) */
export interface AbActiveMatchable { href: string; exact?: boolean }

/** ⚙️ options shared by the helpers */
export interface AbActiveMatchOptions {
  match?: AbActiveMatch; // 🎯 default 'best'
  locales?: readonly string[]; // 🌍 stripped from the current route first (e.g. ['en', 'fr'])
}

/** 🧹 normalise a path: drop `?query` and `#hash`, and a trailing slash (but `/` stays `/`) */
export function normalizeAbHref(href: string): string {
  const path = href.split(/[?#]/)[0] || '/'; // ✂️ query + hash (a bare "?x" is the root)
  const trimmed = path.replace(/\/+$/, ''); // ✂️ trailing slashes
  return trimmed === '' ? '/' : trimmed; // 🏠
}

/** 🎯 does one href match the route? `exact` = equality only; otherwise equality or a parent segment */
export function matchAbHref(href: string, current: string, exact = false): boolean {
  const h = normalizeAbHref(href); const c = normalizeAbHref(current); // 🧹 both sides
  if (h === c) return true; // ✅ exact
  if (exact || h === '/') return false; // 🙅 "/" only ever matches itself
  return c.startsWith(`${h}/`); // 🌳 a whole-segment parent (`/doc` never matches `/docs`)
}

/**
 * 🥇 the set of active hrefs (normalised) among `items` for the route `current`.
 * An item's own `exact` wins over `match`; `exact: false` on an item allows prefix matching even when `match='exact'`.
 */
export function getAbActiveHrefs(items: ReadonlyArray<AbActiveMatchable | string>, current: string | undefined, options: AbActiveMatchOptions = {}): Set<string> {
  const out = new Set<string>(); // 📦
  if (!current) return out; // 🚫 no route
  const { match = 'best', locales } = options;
  const route = stripAbLocalePrefix(current, locales); // 🌍
  const hits = items
    .map((it) => (typeof it === 'string' ? { href: it } : it)) // 🔁 plain strings welcome
    .filter((it) => matchAbHref(it.href, route, it.exact ?? match === 'exact')) // 🎯 per-item override first
    .map((it) => normalizeAbHref(it.href)); // 🧹
  if (match !== 'best') { hits.forEach((h) => out.add(h)); return out; } // 🌳 prefix / exact: all hits
  const longest = hits.reduce((a, h) => (h.length > a.length ? h : a), ''); // 🥇 the deepest match
  if (longest) out.add(longest); // ✅ one href (two items sharing it both light, which is intended)
  return out;
}

/** 🌳 flatten nested items (`items` children) into one list, so a child can out-match its parent */
export function flattenAbNavItems<T extends AbActiveMatchable & { items?: readonly T[] }>(items: readonly T[]): T[] {
  return items.flatMap((it) => [it, ...(it.items ? flattenAbNavItems(it.items) : [])]); // 🔁 depth-first
}
