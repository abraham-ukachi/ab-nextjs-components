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
* @name: AbIconRegistrar (0.1.13)
* @file: ab-icon/registrar.tsx
* @type: Client Component — server-safe icon registration
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> import home from 'ab-nextjs-icons/ab-icons/icons/home'
*    -|> <AbIconRegistrar icons={{ home }} /> // 🗂️ in a Server Component layout
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// 🗂️ the shared client registry
import { registerAbIcons, type AbIconSvgData } from './helpers';

/** ⚙️ props: the icons to register (plain strings, so a Server Component can pass them) */
export interface AbIconRegistrarProps {
  icons: Record<string, AbIconSvgData>; // 🗂️ e.g. { home, home_filled } from ab-nextjs-icons/ab-icons/icons/*
}

/**
 * 🗂️ AbIconRegistrar (0.1.13, Joseph #11): the SERVER-SAFE way to register icons.
 * `registerAbIcons` is client-only state, so a Server Component (e.g. app/[locale]/layout.tsx) can't call it.
 * Render this once, ABOVE the icons, and pass the svg data as a prop (it is serializable):
 *   import home from 'ab-nextjs-icons/ab-icons/icons/home';
 *   <AbIconRegistrar icons={{ home }} />
 * It registers DURING render (idempotent: same name → same markup), so the server render and hydration see
 * the same set: no mismatch, no effect delay. It renders nothing.
 */
export function AbIconRegistrar({ icons }: AbIconRegistrarProps): null {
  registerAbIcons(icons); // ➕ every render (cheap Map.set, same values)
  return null; // 🫥
}

// 📦 exports
export default AbIconRegistrar;
