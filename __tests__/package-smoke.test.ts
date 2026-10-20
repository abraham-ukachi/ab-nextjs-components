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
* @file: __tests__/package-smoke.test.ts
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const componentFiles = [
  'ab-icon/index.tsx',
  'ab-logo/index.tsx',
  'ab-button/index.tsx',
  'ab-icon-button/index.tsx',
  'ab-carousel/index.tsx',
  'ab-carousel/helpers.ts',
  'ab-flow-diagram/index.tsx',
  'ab-locale-switcher/index.tsx',
  'ab-install-snippet/index.tsx',
  'ab-pill/index.tsx',
  'ab-chip/index.tsx',
  'ab-link/index.tsx',
  'ab-kbd/index.tsx',
  'ab-search-trigger/index.tsx',
  'ab-app-bar/index.tsx',
  'ab-card/index.tsx',
  'ab-package-card/index.tsx',
  'ab-toc/index.tsx',
  'ab-drawer/index.tsx',
  'ab-drawer/use-ab-drawer.ts',
  'ab-drawer-list/index.tsx',
  'ab-confirm-drawer/index.tsx',
  'ab-bottom-drawer/index.tsx',
  'ab-version-switcher/index.tsx',
  'ab-breadcrumbs/index.tsx',
  'ab-list/index.tsx',
  'ab-sidebar/view.tsx',
  'ab-navbar/view.tsx',
  'ab-theme-toggle/index.tsx',
  'ab-input/index.tsx',
  'ab-balloon/index.tsx',
  'ab-avatar/index.tsx',
  'ab-tab/index.tsx',
  'ab-tabs/index.tsx',
  'ab-menu/index.tsx',
  'ab-collapsible/index.tsx',
  'ab-color/index.tsx',
  'ab-info/index.tsx',
  'ab-like-button/index.tsx',
  'server/ab-icon/index.tsx',
  'server/ab-logo/index.tsx',
  'server/ab-button/index.tsx',
  'server/ab-avatar/index.tsx',
  'server/ab-badge/index.tsx',
  'ab-searchbar/index.tsx',
  'ab-search-result/index.tsx',
  'ab-page-paginator/index.tsx',
  'ab-page-switcher/index.tsx',
  'ab-progress-chips/index.tsx',
  'ab-price/index.tsx',
  'ab-price-tag/index.tsx',
  'ab-image/index.tsx',
  'server/ab-polygon/index.tsx',
  'ab-brand/index.tsx',
  'ab-name/index.tsx',
  'ab-navbar/index.tsx',
  'ab-sidebar/index.tsx',
  'ab-text/index.tsx',
  'ab-test-hello/index.tsx',
  'ab-key-feature/index.tsx',
  'ab-main-headline/index.tsx',
  'ab-preview/index.tsx',
  'ab-product/index.tsx',
  'ab-product-item/index.tsx',
  'ab-switch-back/index.tsx',
  'ab-demo-box/index.tsx',
  'ab-demo-code/index.tsx',
  'server/ab-brand/index.tsx',
  'server/ab-name/index.tsx',
  'server/ab-navbar/index.tsx',
  'server/ab-sidebar/index.tsx',
  'server/ab-nav-link/index.tsx',
  'server/ab-text/index.tsx',
  'server/ab-test-hello/index.tsx',
  'server/ab-key-feature/index.tsx',
  'server/ab-switch-back/index.tsx',
]

describe('ab-nextjs-components package smoke', () => {
  it('targets Next 16.3.4 peers + soft peers', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    expect(pkg.name).toBe('ab-nextjs-components')
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/)
    expect(pkg.type).toBe('module')
    expect(pkg.peerDependencies.next).toBe('^16.3.4')
    expect(pkg.peerDependencies.react).toBe('^19')
    expect(pkg.peerDependencies.clsx).toBe('^2')
    expect(pkg.peerDependencies['ab-nextjs-hooks']).toBeTruthy()
    expect(pkg.exports['./ab-button']).toBe('./ab-button/index.tsx')
    expect(pkg.exports['./server/ab-logo']).toBe('./server/ab-logo/index.tsx')
  })

  it('exports supportedComponents catalog (78 Done: 0.1.13 adds 7, 0.1.14 adds 7, 0.2.0 adds 4)', async () => {
    const mod = await import('../index')
    expect(mod.supportedComponents).toHaveLength(78)
    expect(mod.supportedComponents.every((item) => item.status === 'Done')).toBe(true)
    expect(mod.supportedComponents.filter((item) => item.kind === 'client')).toHaveLength(54)
    expect(mod.supportedComponents.filter((item) => item.kind === 'server')).toHaveLength(24)
  })

  it('ships component entry files', () => {
    for (const file of componentFiles) {
      expect(existsSync(join(root, file))).toBe(true)
    }
  })

  it('keeps CSS modules free of @apply', () => {
    const cssFiles = [
      'ab-icon/styles.module.css',
      'ab-logo/styles.module.css',
      'ab-button/styles.module.css',
      'ab-icon-button/styles.module.css',
      'ab-carousel/styles.module.css',
      'ab-flow-diagram/styles.module.css',
      'ab-locale-switcher/styles.module.css',
      'ab-install-snippet/styles.module.css',
      'ab-chip/styles.module.css',
      'ab-kbd/styles.module.css',
      'ab-search-trigger/styles.module.css',
      'ab-app-bar/styles.module.css',
      'ab-card/styles.module.css',
      'ab-package-card/styles.module.css',
      'ab-toc/styles.module.css',
      'ab-drawer/styles.module.css',
      'ab-drawer-list/styles.module.css',
      'ab-confirm-drawer/styles.module.css',
      'ab-bottom-drawer/styles.module.css',
      'ab-version-switcher/styles.module.css',
      'ab-breadcrumbs/styles.module.css',
      'ab-list/styles.module.css',
      'ab-theme-toggle/styles.module.css',
      'ab-input/styles.module.css',
      'ab-balloon/styles.module.css',
      'ab-avatar/styles.module.css',
      'ab-tab/styles.module.css',
      'ab-tabs/styles.module.css',
      'ab-menu/styles.module.css',
      'ab-collapsible/styles.module.css',
      'ab-color/styles.module.css',
      'ab-info/styles.module.css',
      'ab-like-button/styles.module.css',
      'server/ab-avatar/styles.module.css',
      'server/ab-badge/styles.module.css',
      'ab-searchbar/styles.module.css',
      'ab-search-result/styles.module.css',
  'ab-page-paginator/styles.module.css',
  'ab-page-switcher/styles.module.css',
  'ab-progress-chips/styles.module.css',
  'ab-price/styles.module.css',
  'ab-price-tag/styles.module.css',
  'ab-image/styles.module.css',
  'server/ab-polygon/styles.module.css',
  'ab-brand/styles.module.css',
  'ab-name/styles.module.css',
  'ab-navbar/styles.module.css',
  'ab-sidebar/styles.module.css',
  'ab-text/styles.module.css',
  'ab-test-hello/styles.module.css',
  'ab-key-feature/styles.module.css',
  'ab-main-headline/styles.module.css',
  'ab-preview/styles.module.css',
  'ab-product/styles.module.css',
  'ab-product-item/styles.module.css',
  'ab-switch-back/styles.module.css',
  'ab-demo-box/styles.module.css',
  'ab-demo-code/styles.module.css',
  'server/ab-brand/styles.module.css',
  'server/ab-name/styles.module.css',
  'server/ab-nav-link/styles.module.css',
  'server/ab-text/styles.module.css',
  'server/ab-test-hello/styles.module.css',
  'server/ab-key-feature/styles.module.css',
  'server/ab-switch-back/styles.module.css',
]
    for (const file of cssFiles) {
      const css = readFileSync(join(root, file), 'utf8')
      expect(css.includes('@apply')).toBe(false)
    }
  })
})
