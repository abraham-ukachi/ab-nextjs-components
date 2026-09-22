/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: Components - Package Catalog
* @file: index.ts
*/

import type { ComponentCatalogEntry } from './types'

/**
 * Catalog — Phase 2 ports marked Done.
 */
const supportedComponents: Array<ComponentCatalogEntry> = [
  // CLIENT
  { name: 'AbIcon', file: 'ab-icon/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbLogo', file: 'ab-logo/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbButton', file: 'ab-button/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbIconButton', file: 'ab-icon-button/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbInput', file: 'ab-input/index.tsx', kind: 'client', status: 'Done' },

  // SERVER
  { name: 'AbIcon', file: 'server/ab-icon/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbLogo', file: 'server/ab-logo/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbButton', file: 'server/ab-button/index.tsx', kind: 'server', status: 'Done' },
]

const abComponents = { supportedComponents }

export { supportedComponents }
export default abComponents

export { default as AbIcon } from './ab-icon'
export { default as AbLogo } from './ab-logo'
export { default as AbButton } from './ab-button'
export { default as AbIconButton } from './ab-icon-button'
export { default as AbInput } from './ab-input'
