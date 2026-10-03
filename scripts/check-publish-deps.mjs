#!/usr/bin/env node
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
