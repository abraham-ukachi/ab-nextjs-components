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
* @name: AbSplash - CSP hash helpers (types for csp.mjs)
* @file: ab-splash/csp.d.ts
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚙️ gate options (mirror of `AbSplashGateOptions` in ./gate.ts)
export interface AbSplashGateOptions {
  // 🌍 every configured locale
  locales?: readonly string[]
  // 🏠 the default (unprefixed) locale
  defaultLocale?: string
  // 🚪 extra root sub-paths (default ['welcome'])
  rootSubPaths?: readonly string[]
}

// 🔐 `'sha256-<base64>'` CSP source for an inline script
export declare function getAbSplashGateSha256(script: string): string
// 🔐 the gate script + its hash, from the same options
export declare function buildAbSplashGate(options?: AbSplashGateOptions): { script: string; sha256: string }
// 🔐 hash of the default `abSplashGateScript`
export declare const AB_SPLASH_GATE_SHA256: string
