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
* @name: AbPreviewStage (0.6.0)
* @file: ab-preview-code/stage.tsx
* @type: Client component (island)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

'use client';

// ⚛️ React
import { useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔣 icons (ab-nextjs-icons built-ins: dark_mode, light_mode, refresh, open_in_new)
import AbIcon from '../ab-icon';
// 🧪 the preview scope (server-safe, fine inside a client island)
import AbDemoBox, { type AbDemoBoxScheme } from '../ab-demo-box';
// 🎨 styles
import styles from './styles.module.css';

/** 🌍 the toolbar's translatable names */
export interface AbPreviewStageLabels {
  toolbar?: string; // ♿ names the toolbar (default "Preview tools")
  dark?: string; // 🌙 the scheme toggle, a pressed-state button (default "Dark preview")
  reload?: string; // 🔄 the remount button (default "Reload preview")
  open?: string; // ↗️ the open-in-new-tab link (default "Open preview in a new tab")
}

/** ⚙️ props */
export interface AbPreviewStageProps {
  children?: ReactNode; // 🧪 the live preview (server-rendered JSX passes straight through)
  scheme?: AbDemoBoxScheme; // 🌗 the starting scheme (default 'inherit'); the toggle then forces light / dark
  align?: 'center' | 'start' | 'stretch'; // 📐 forwarded to AbDemoBox
  href?: string; // ↗️ shows an "open in a new tab" link (target _blank, rel noopener noreferrer)
  toolbar?: boolean; // 🧰 show the toolbar (default true); false = just the box
  labels?: AbPreviewStageLabels; // 🌍
  className?: string; // 🏷️ on the AbDemoBox
}

/**
 * 🧰 AbPreviewStage — the small client island behind AbPreviewCode's preview: a WAI-ARIA toolbar (one tab stop,
 * ←/→/Home/End move between tools) over an AbDemoBox.
 * - 🌗 a light/dark toggle (`aria-pressed` = dark) that changes ONLY this preview's scheme (AbDemoBox `data-theme`)
 * - 🔄 reload: remounts the preview with a key bump (state, timers and animations start fresh)
 * - ↗️ with `href`: an open-in-new-tab link
 * Every tool is a ≥44px target with an overridable aria-label. No motion here (motion lives in ab-nextjs-animations).
 */
const AbPreviewStage = ({ children, scheme = 'inherit', align, href, toolbar = true, labels = {}, className }: AbPreviewStageProps): ReactElement => {
  const L = { toolbar: 'Preview tools', dark: 'Dark preview', reload: 'Reload preview', open: 'Open preview in a new tab', ...Object.fromEntries(Object.entries(labels).filter(([, v]) => v != null)) }; // 🌍 undefined keeps the default
  const [current, setCurrent] = useState<AbDemoBoxScheme>(scheme); // 🌗 this preview only
  const [key, setKey] = useState(0); // 🔄 bumped → AbDemoBox remounts
  const [active, setActive] = useState(0); // 🎯 roving tab stop (index of the focusable tool)
  const bar = useRef<HTMLDivElement>(null); // 🧰
  const dark = current === 'dark'; // 🌙 pressed?

  /** ⌨️ APG toolbar keys: ←/→ wrap, Home/End jump; only the active tool is in the tab order */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tools = Array.from(bar.current?.querySelectorAll<HTMLElement>('[data-ab-tool]') ?? []); // 🔘 the tools
    const i = tools.indexOf(document.activeElement as HTMLElement); // 📍
    if (i < 0) return; // 🙅 focus is elsewhere
    const n = tools.length; // 🔢
    const next = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1; // 🧭
    if (next < 0) return; // ⏭️ other keys pass through
    e.preventDefault(); // 🛑 no page scroll
    setActive(next); // 🎯
    tools[next]?.focus(); // ⌨️
  };
  const tab = (i: number) => (i === active ? 0 : -1); // 🎯 roving tabindex

  return (
    <div className={styles.abPreviewStage} data-ab-part="preview-stage">
      {toolbar && (
        <div ref={bar} role="toolbar" aria-label={L.toolbar} className={styles.abPreviewToolbar} data-ab-part="preview-toolbar" onKeyDown={onKeyDown}>
          <button
            type="button"
            data-ab-tool="scheme" // 🌗
            className={styles.abPreviewTool}
            aria-label={L.dark} // ♿ the name stays; the state is aria-pressed
            aria-pressed={dark} // 🌙 true = dark preview
            tabIndex={tab(0)}
            onFocus={() => setActive(0)}
            onClick={() => setCurrent(dark ? 'light' : 'dark')} // 🔁 light ⇄ dark (from 'inherit' → dark first)
          >
            <AbIcon name={dark ? 'dark_mode' : 'light_mode'} size={20} /> {/* 🌞/🌙 decorative */}
          </button>
          <button
            type="button"
            data-ab-tool="reload" // 🔄
            className={styles.abPreviewTool}
            aria-label={L.reload}
            tabIndex={tab(1)}
            onFocus={() => setActive(1)}
            onClick={() => setKey((k) => k + 1)} // 🔑 key bump → remount
          >
            <AbIcon name="refresh" size={20} />
          </button>
          {href && (
            <a
              href={href}
              target="_blank" // ↗️ new tab
              rel="noopener noreferrer" // 🔐 no window.opener, no referrer
              data-ab-tool="open"
              className={styles.abPreviewTool}
              aria-label={L.open}
              tabIndex={tab(2)}
              onFocus={() => setActive(2)}
            >
              <AbIcon name="open_in_new" size={20} />
            </a>
          )}
        </div>
      )}
      <AbDemoBox key={key} scheme={current} align={align} className={className}>{children}</AbDemoBox>
    </div>
  );
};

// 📦 exports
export default AbPreviewStage;
export { AbPreviewStage };
