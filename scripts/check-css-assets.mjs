#!/usr/bin/env node
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
