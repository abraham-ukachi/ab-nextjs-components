# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository overview
- This repo targets an npm package named "ab-nextjs-components" (root package.json) and includes a Next.js demo app in ab-demo used for local development and showcasing components.
- The library package at the repo root is currently a placeholder (no build pipeline or source files present yet). The active code you can run today is in ab-demo.

Commands
Note: Run these inside ab-demo unless noted otherwise. From the repo root, you can prefix commands with npm --prefix ab-demo ... to avoid changing directories (e.g., npm --prefix ab-demo run dev).

- Install dependencies
  - npm ci
  - If you’ve just added or updated deps: npm install

- Run the development server (Next.js 15 with Turbopack)
  - npm run dev
  - App runs at http://localhost:3000

- Build for production
  - npm run build

- Start the production server
  - npm run start

- Lint (ESLint with Next core-web-vitals + TypeScript)
  - Lint entire project: npm run lint
  - Lint a specific file: npx eslint src/app/page.tsx
  - Auto-fix (where possible): npx eslint . --fix

- Type-check TypeScript (no emit)
  - npx tsc --noEmit -p .

- Testing
  - No tests are configured in this repo yet. The root test script is a placeholder and the ab-demo app has no test runner configured.

High-level architecture and structure
- Root package (ab-nextjs-components)
  - package.json defines the package metadata for a future component library with main: index.js and types: types/index.d.ts, but those outputs and a build step do not exist yet.
  - README describes intended component categories (demo/server/client) and an example type import. These are roadmap goals; actual library source files are not present.

- Demo application (ab-demo)
  - Framework/runtime
    - Next.js 15.5.x (App Router) with React 19 and TypeScript.
    - Turbopack is used for dev and build (via --turbopack flags).
  - Directory layout (only key pieces)
    - src/app: App Router entry with layout.tsx and page.tsx.
    - Global styling: src/app/globals.css uses Tailwind CSS v4 (via @import "tailwindcss") and defines CSS variables and an inline theme.
    - next.config.ts currently minimal.
  - TypeScript configuration (ab-demo/tsconfig.json)
    - Strict TypeScript with bundler moduleResolution and ESNext module target.
    - Path alias: "@/demo/*" -> "./src/*" for clean absolute-style imports from src.
  - Linting (ab-demo/eslint.config.mjs)
    - Flat config via @eslint/eslintrc compat, extending next/core-web-vitals and next/typescript.
    - Ignores: node_modules, .next, out, build, next-env.d.ts.
  - Package manager
    - ab-demo includes a package-lock.json; use npm within ab-demo.

Notes for future work (context for Warp when asked)
- Library build/publish: To make the root package publishable, add a build pipeline (e.g., tsc or tsup) that emits index.js and declaration files to match main and types fields, and include proper exports. This repo does not currently contain those outputs or a src layout for the library.
- Tests: If tests are introduced (e.g., Jest or Vitest) in ab-demo, add scripts (test, test:watch) and document how to run a single test. As of now, no test tooling is present.
