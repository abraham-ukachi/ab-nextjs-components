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
* @name: Components - Package Catalog
* @file: index.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

import type { ComponentCatalogEntry } from './types'

/**
 * Catalog from README — Phase 1 keeps every entry Pending.
 * Real LYD ports land in Phase 2 (no fake Done).
 */
const supportedComponents: Array<ComponentCatalogEntry> = [
  // ------ CLIENT components ------
  { name: 'AbLogo', file: 'ab-logo/index.tsx', kind: 'client', status: 'Pending' },
  { name: 'AbIcon', file: 'ab-icon/index.tsx', kind: 'client', status: 'Pending' },
  { name: 'AbButton', file: 'ab-button/index.tsx', kind: 'client', status: 'Pending' },
  { name: 'AbInput', file: 'ab-input/index.tsx', kind: 'client', status: 'Pending' },

  // ------ SERVER components ------
  { name: 'AbLogo', file: 'server/ab-logo/index.tsx', kind: 'server', status: 'Pending' },
  { name: 'AbIcon', file: 'server/ab-icon/index.tsx', kind: 'server', status: 'Pending' },
  { name: 'AbButton', file: 'server/ab-button/index.tsx', kind: 'server', status: 'Pending' },
]

const abComponents = { supportedComponents }

export { supportedComponents }
export default abComponents
