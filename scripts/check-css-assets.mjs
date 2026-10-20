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
* @name: check-css-assets.mjs
* @file: scripts/check-css-assets.mjs
* @type: Node Script
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

// Fails when a shipped CSS file has a relative url() that points outside the
// package or at a file that doesn't exist / isn't listed in package.json `files`.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const files = pkg.files ?? [];

const isShipped = (rel) => files.some((entry) => rel === entry || rel.startsWith(`${entry.replace(/\/$/, '')}/`));

const cssFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const rel = relative(root, abs);
    if (statSync(abs).isDirectory()) walk(abs);
    else if (name.endsWith('.css') && isShipped(rel.split(sep).join('/'))) cssFiles.push(abs);
  }
};
for (const entry of files) {
  const abs = join(root, entry);
  if (!existsSync(abs)) continue;
  if (statSync(abs).isDirectory()) walk(abs);
  else if (entry.endsWith('.css')) cssFiles.push(abs);
}

const URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
const offenders = [];
for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, , raw] of css.matchAll(URL_RE)) {
    const ref = raw.trim().split(/[?#]/)[0];
    if (/^(data:|https?:|\/\/|\/|#)/.test(ref) || ref === '') continue;
    const target = normalize(join(dirname(file), ref));
    const rel = relative(root, target).split(sep).join('/');
    const where = `${relative(root, file)} -> ${raw}`;
    if (rel.startsWith('..')) offenders.push(`  ${where} (escapes the package root)`);
    else if (!existsSync(target)) offenders.push(`  ${where} (file not found)`);
    else if (!isShipped(rel)) offenders.push(`  ${where} (not in package.json "files")`);
  }
}

if (offenders.length) {
  console.error(`\n✖ ${pkg.name}@${pkg.version} has CSS url() references that won't resolve for consumers:\n${offenders.join('\n')}\n`);
  process.exit(1);
}

console.log(`✔ ${pkg.name}@${pkg.version}: all CSS url() references resolve inside the package (${cssFiles.length} CSS files).`);
