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
* @name: stripAbLocalePrefix (0.1.13)
* @file: ab-link/locale.ts
* @type: Server-safe helper
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> stripAbLocalePrefix('/fr/docs', ['en', 'fr']) // → '/docs'
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🌍 0.1.13 (Joseph #10): no 'use client', so server twins can import it too

/**
 * 🌍 stripAbLocalePrefix — `/fr/docs/core` → `/docs/core` when `fr` is one of `locales`; `/fr` → `/`.
 * Only exact locale segments are removed (`/fresh` stays), so it is safe for any path.
 */
export function stripAbLocalePrefix(pathname: string, locales: readonly string[] = []): string {
  const seg = /^\/([^/?#]+)/.exec(pathname)?.[1]; // 🔍 first segment
  if (!seg || !locales.some((l) => l.toLowerCase() === seg.toLowerCase())) return pathname; // 🙅 not a locale
  const rest = pathname.slice(seg.length + 1); // ✂️
  return rest === '' || rest[0] !== '/' ? `/${rest.replace(/^\/?/, '')}` : rest; // 🧭 keep a leading slash
}
