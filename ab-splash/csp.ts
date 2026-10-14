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
* @name: AbSplash - CSP hash helpers
* @file: ab-splash/csp.ts
* @type: TypeScript (Node only: use it in next.config / proxy, never in the browser)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🔐 Node's crypto (sync sha256 for build-time CSP)
import { createHash } from 'node:crypto';
// 🚦 the gate script builders
import { abSplashGateScript, buildAbSplashGateScript, type AbSplashGateOptions } from './gate';

// 🔐 CSP source for an inline script: `'sha256-<base64>'`
export function getAbSplashGateSha256(script: string): string {
  // 🧮 hash the exact bytes that go into the <script> tag
  return `'sha256-${createHash('sha256').update(script, 'utf8').digest('base64')}'`;
}

// 🔐 build the script AND its CSP hash in one go (keep both from the same options!)
export function buildAbSplashGate(options: AbSplashGateOptions = {}): { script: string; sha256: string } {
  // 🚦 the script
  const script = buildAbSplashGateScript(options);
  // 📦 script + hash
  return { script, sha256: getAbSplashGateSha256(script) };
}

// 🔐 hash of the default `abSplashGateScript` (static CSP)
export const AB_SPLASH_GATE_SHA256: string = getAbSplashGateSha256(abSplashGateScript);
