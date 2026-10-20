#!/usr/bin/env node
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
* @name: check-publish-deps.mjs
* @file: scripts/check-publish-deps.mjs
* @type: Node Script
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/**
 * Prepublish guard: refuse to pack or publish when package.json has local
 * dependency specifiers (file:, link:, workspace:, portal:). Those only make
 * sense on the author's machine and break every install from the registry
 * (that's what happened with ab-nextjs-theme@0.2.8).
 */
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const LOCAL = /^(file|link|workspace|portal):/;
const SECTIONS = [
  'dependencies',
  'peerDependencies',
  'optionalDependencies',
  'bundleDependencies',
  'bundledDependencies',
  'devDependencies',
];

const offenders = [];
for (const section of SECTIONS) {
  const deps = pkg[section];
  if (!deps || Array.isArray(deps)) continue;
  for (const [name, spec] of Object.entries(deps)) {
    if (typeof spec === 'string' && LOCAL.test(spec.trim())) offenders.push(`  ${section}.${name}: "${spec}"`);
  }
}

if (offenders.length) {
  console.error(`\n✖ ${pkg.name}@${pkg.version} has local dependency specifiers that can't be published:\n${offenders.join('\n')}\n\nReplace them with semver ranges from the npm registry before packing/publishing.\n`);
  process.exit(1);
}

console.log(`✔ ${pkg.name}@${pkg.version}: no local (file:/link:/workspace:/portal:) dependencies.`);
