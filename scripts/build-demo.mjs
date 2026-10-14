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
* @name: Demo Builder
* @file: scripts/build-demo.mjs
* @type: Node script — `node scripts/build-demo.mjs` → demo/out/*.html
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🗺️ fs + path helpers
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

// 📁 package root
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// ⚡ esbuild, resolved through vitest (no new dependency)
const esbuild = createRequire(createRequire(import.meta.url).resolve('vitest/package.json'))('esbuild')
// 📤 output
const out = join(root, 'demo/out')
// 🔤 local ab-nextjs-fonts checkout (optional, for Quicksand/Zilla/Inter in screenshots)
const fontsDir = process.env.AB_FONTS_DIR ?? join(root, '../ab-nextjs-fonts')

// 🧹 fresh output
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

// 📦 bundle an SSR entry rendering both demos
await esbuild.build({
  stdin: {
    contents: "import { renderToStaticMarkup } from 'react-dom/server'; import { LogoDemo, SplashDemo } from './demo/ab-logo-splash.demo'; export const logo = renderToStaticMarkup(<LogoDemo />); export const splash = renderToStaticMarkup(<SplashDemo />);",
    resolveDir: root, // 📁 resolve from root
    loader: 'tsx', // 🧩 TSX
  },
  bundle: true, // 📦
  platform: 'node', // 🖥️
  format: 'esm', // 📜
  jsx: 'automatic', // ⚛️
  external: ['react', 'react-dom', 'react/*', 'react-dom/*'], // 🔗 installed React
  loader: { '.module.css': 'local-css' }, // 🎨 CSS modules
  outfile: join(out, 'demo.mjs'), // 📤
})

// 🖨️ HTML + CSS
const { logo, splash } = await import(pathToFileURL(join(out, 'demo.mjs')).href)
const css = readFileSync(join(out, 'demo.css'), 'utf8')

// 🔤 @font-face rules from the local fonts checkout (absolute file:// urls)
const face = (family, rel) => existsSync(join(fontsDir, rel)) ? `@font-face{font-family:'${family}';src:url('${pathToFileURL(join(fontsDir, rel)).href}')}` : ''
const fonts = [
  face('Quicksand-Bold', 'quicksand/static/Quicksand-Bold.ttf'), // 🔤 wordmark
  face('ZillaSlab-Bold', 'zilla-slab/static/ZillaSlab-Bold.ttf'), // 🔤 headings
  face('Inter', 'inter/Inter-VariableFont_slnt,wght.ttf'), // 🔤 body
].join('')

// 📄 page writer
const page = (name, theme, body, extraHtmlAttr = '', extraCss = '') => {
  const bg = theme === 'dark' ? '#19120C' : '#FFF8F5' // 🎨 surface
  const fg = theme === 'dark' ? '#FFF8F5' : '#19120C' // 🎨 text
  writeFileSync(join(out, `${name}-${theme}.html`), `<!doctype html><html class="${theme}"${extraHtmlAttr}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${fonts}${css}body{margin:0;background:${bg};color:${fg};font-family:Inter,system-ui,sans-serif}${extraCss}</style></head><body>${body}</body></html>`)
}

// 🌗 light + dark
for (const theme of ['light', 'dark']) {
  page('logo', theme, logo) // 🅰️ gallery
  // 💦 splash frozen "on" (failsafe animation off so the screenshot can catch it)
  page('splash', theme, `<main><p>Page content behind the splash</p></main>${splash}`, ' data-ab-splash="on"', '.AbSplash{animation:none!important}')
}

// ✅ done
console.log('demo written to', out)
