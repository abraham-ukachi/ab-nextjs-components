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
* @name: AbInstallSnippet - Helpers (G35)
* @file: ab-install-snippet/helpers.ts
* @type: TypeScript (pure, server-safe)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 📦 supported package managers
export type AbPackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

// 🗂️ default tab order (mocks: pnpm first)
export const AB_PACKAGE_MANAGERS: readonly AbPackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'] as const;

// 🔍 narrow an unknown (e.g. from localStorage) to a manager
export function isAbPackageManager(value: unknown): value is AbPackageManager {
  return value === 'pnpm' || value === 'npm' || value === 'yarn' || value === 'bun'; // ✅
}

/**
 * @name getAbInstallCommand
 * @description 🧾 The install command for a manager. Package names are never translated.
 * @example getAbInstallCommand('npm', 'ab-nextjs-core') // "npm i ab-nextjs-core"
 */
export function getAbInstallCommand(pm: AbPackageManager, pkg: string, dev = false): string {
  switch (pm) {
    case 'npm': return `npm i ${dev ? '-D ' : ''}${pkg}`; // 📦
    case 'yarn': return `yarn add ${dev ? '-D ' : ''}${pkg}`; // 🧶
    case 'bun': return `bun add ${dev ? '-d ' : ''}${pkg}`; // 🥟
    default: return `pnpm add ${dev ? '-D ' : ''}${pkg}`; // ⚡ pnpm
  }
}
