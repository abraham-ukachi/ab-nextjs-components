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
* @name: AbContentTabs + AbContentTab (0.3.4, QA 0.2.24 MDX docs)
* @file: ab-content-tabs/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> // mdx-components.tsx: { Tabs: AbContentTabs, Tab: AbContentTab }
*   2+|> <Tabs label="Package manager"><Tab label="pnpm">…</Tab><Tab label="npm">…</Tab></Tabs>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { Children, isValidElement, useId, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ one tab (a marker element: AbContentTabs reads its props, it renders only its children) */
export interface AbContentTabProps {
  label: ReactNode; // 🏷️ the tab's text, e.g. "pnpm"
  value?: string; // 🔑 a stable key (default: the label text or the index), for `defaultValue`
  children?: ReactNode; // 📝 the panel content (MDX)
}

/** 📄 AbContentTab — one panel of an AbContentTabs (MDX `<Tab>`). On its own it just renders its children. */
const AbContentTab = ({ children }: AbContentTabProps): ReactElement => <>{children}</>;

/** ⚙️ props */
export interface AbContentTabsProps {
  children?: ReactNode; // 📄 AbContentTab elements (anything else is ignored)
  label?: string; // ♿ the tablist's name, e.g. "Package manager"
  defaultValue?: string; // 🎯 the tab open first (default the first)
  onChange?: (value: string) => void; // 📣 after a switch
  className?: string; // 🏷️
}

// 🔑 a tab's value: its `value`, else its string label, else its index
const valueOf = (p: AbContentTabProps, i: number) => p.value ?? (typeof p.label === 'string' ? p.label : String(i));

/**
 * 🗂️ AbContentTabs — the WAI-ARIA tabs pattern for MDX `<Tabs>`: a role="tablist" of buttons (roving tabindex,
 * ←/→ wrap and flip in RTL, Home/End; selection follows focus) over role="tabpanel"s linked by aria-controls /
 * aria-labelledby. Every panel is in the HTML (inactive ones `hidden`), so the server render already has the
 * content. AbTabs is a nav strip of links, so this is its own small component. No motion (the switch is instant).
 */
const AbContentTabs = ({ children, label, defaultValue, onChange, className }: AbContentTabsProps): ReactElement => {
  const id = useId(); // 🆔 tab + panel ids
  // 📄 the AbContentTab children (MDX passes them through as elements)
  const tabs = Children.toArray(children).filter((c): c is ReactElement<AbContentTabProps> => isValidElement(c) && (c.type === AbContentTab || (c.props as Partial<AbContentTabProps>)?.label != null)); // 🛟 also any element with a `label` (e.g. a wrapped Tab across the RSC boundary)
  const values = tabs.map((t, i) => valueOf(t.props, i)); // 🔑
  const [selected, setSelected] = useState(() => (defaultValue && values.includes(defaultValue) ? defaultValue : values[0])); // 🎯
  const current = values.includes(selected) ? selected : values[0]; // 🛟 children changed
  const refs = useRef<Array<HTMLButtonElement | null>>([]); // 📍 to move focus
  const select = (v: string) => { setSelected(v); onChange?.(v); }; // ✅
  // ⌨️ roving keys on the tablist
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = e.currentTarget.closest('[dir]')?.getAttribute('dir') === 'rtl'; // 🌍
    const i = values.indexOf(current); const n = values.length; // 📍
    const next = rtl ? 'ArrowLeft' : 'ArrowRight'; const prev = rtl ? 'ArrowRight' : 'ArrowLeft'; // ↔️
    const j = e.key === next ? (i + 1) % n : e.key === prev ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1; // 🎯
    if (j < 0) return; // 🙅 other keys
    e.preventDefault(); // 🛑 no scroll
    select(values[j]); // ✅ automatic activation
    refs.current[j]?.focus(); // 🎯
  };
  return (
    <div className={clsx('AbContentTabs', styles.abContentTabs, className)} data-ab-part="content-tabs">
      <div role="tablist" aria-label={label} className={styles.abContentTabsList} onKeyDown={onKeyDown}>
        {tabs.map((t, i) => {
          const on = values[i] === current; // ✅
          return (
            <button
              key={values[i]} // 🔑
              ref={(el) => { refs.current[i] = el; }} // 📍
              type="button" // 🧾
              role="tab" // ♿
              id={`${id}-tab-${i}`} // 🆔
              aria-selected={on} // ✅
              aria-controls={`${id}-panel-${i}`} // 🔗
              tabIndex={on ? 0 : -1} // ⌨️ one tab stop
              className={styles.abContentTab} // 🎨
              data-ab-part="content-tab" // 🗂️
              onClick={() => select(values[i])} // 🖱️
            >
              {t.props.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t, i) => (
        <div
          key={values[i]} // 🔑
          role="tabpanel" // ♿
          id={`${id}-panel-${i}`} // 🆔
          aria-labelledby={`${id}-tab-${i}`} // 🔗
          hidden={values[i] !== current} // 🙈 inactive
          tabIndex={0} // ⌨️ reachable even when it has no focusable content (APG)
          className={styles.abContentTabsPanel} // 🎨
          data-ab-part="content-tab-panel" // 🗂️
        >
          {t.props.children}
        </div>
      ))}
    </div>
  );
};

// 📦 exports
export default AbContentTabs;
export { AbContentTabs, AbContentTab };
