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
* @name: AbLogo + AbSplash - Demo
* @file: demo/ab-logo-splash.demo.tsx
* @type: Demo (rendered to static HTML by scripts/build-demo.mjs)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🅰️ logo + 💦 splash
import AbLogo from '../ab-logo'
import AbSplash from '../ab-splash'
// 📶 progress bar
import AbLinearProgress from '../ab-linear-progress'

// 🧩 a labelled demo cell
const Cell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <figure style={{ margin: 0, display: 'grid', gap: 12, justifyItems: 'start', width: '100%' }}>
    {/* 🏷️ caption */}
    <figcaption style={{ font: '600 13px/1.4 Inter, system-ui, sans-serif', opacity: 0.75 }}>{title}</figcaption>
    {/* 🅰️ the logo */}
    {children}
  </figure>
)

// 🅰️ logo gallery
export const LogoDemo = () => (
  <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px', display: 'grid', gap: 32 }}>
    {/* 🏷️ heading */}
    <h1 style={{ font: '700 28px/1.2 "ZillaSlab-Bold", "Zilla Slab", Georgia, serif', margin: 0 }}>AbLogo</h1>
    {/* 🔤 default wordmark */}
    <Cell title='wordmark (default "Elements")'><AbLogo wordmark /></Cell>
    {/* 🔤 bigger */}
    <Cell title='wordmark size="3.25rem" (splash size)'><AbLogo wordmark size="3.25rem" /></Cell>
    {/* 🎨 custom */}
    <Cell title='wordmark="Docs" color="#6B4F35"'><AbLogo wordmark="Docs" color="#6B4F35" /></Cell>
    {/* 🅰️ naked, no src — was a brown square */}
    <Cell title="naked, no src (fixed: real mark, not a square)"><AbLogo size={48} /></Cell>
    {/* 🖼️ contained */}
    <Cell title='type="contained"'><AbLogo type="contained" size={48} /></Cell>
  </main>
)

// 💦 splash (the page sets html[data-ab-splash="on"])
export const SplashDemo = () => <AbSplash />

// 📶 AbLinearProgress gallery
export const LinearProgressDemo = () => (
  <main style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px', display: 'grid', gap: 22 }}>
    {/* 🏷️ heading */}
    <h1 style={{ font: '700 28px/1.2 "ZillaSlab-Bold", "Zilla Slab", Georgia, serif', margin: 0 }}>AbLinearProgress</h1>
    {/* 📊 determinate */}
    <Cell title="Determinate · 0 / 25 / 60 / 100"><div style={{ display: 'grid', gap: 10, width: '100%' }}><AbLinearProgress progress={0} /><AbLinearProgress progress={25} /><AbLinearProgress progress={60} /><AbLinearProgress progress={100} /></div></Cell>
    {/* 🔁 indeterminate */}
    <Cell title="Indeterminate (LTR)"><div style={{ width: '100%' }}><AbLinearProgress isIndeterminate /></div></Cell>
    {/* ↔️ RTL */}
    <Cell title='Determinate 40 · dir="rtl"'><div dir="rtl" style={{ width: '100%' }}><AbLinearProgress progress={40} /></div></Cell>
    {/* 🎨 color */}
    <Cell title='color · dark pane #6B4F35 (light) / lighter #D9B48C (dark) · sage accent'><div style={{ display: 'grid', gap: 10, width: '100%' }}><AbLinearProgress progress={70} color="var(--demo-accent, #6B4F35)" /* 🎨 demo page sets a lighter accent in dark mode */ /><AbLinearProgress progress={45} color="#8A9A5B" /></div></Cell>
    {/* 📏 thicker */}
    <Cell title="--ab-linear-progress-height: 8px"><div style={{ width: '100%', ['--ab-linear-progress-height' as string]: '8px' }}><AbLinearProgress progress={50} /></div></Cell>
  </main>
)
