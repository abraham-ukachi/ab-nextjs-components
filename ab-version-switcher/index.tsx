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
* @name: AbVersionSwitcher (P9)
* @file: ab-version-switcher/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbVersionSwitcher version="v0.2.x" versions={[{ value: "v0.2.x", href: "/" }, { value: "v0.1.x", href: "/v0.1" }]} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import { useEffect, useId, useRef, useState, type ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔣 icons
import AbIcon from '../ab-icon';
// 📋 the menu it opens (spec §5: "opens AbMenu")
import AbMenu from '../ab-menu';
// 🎨 styles
import styles from './styles.module.css';

/** 🏷️ one version */
export interface AbVersionOption {
  value: string; // 🆔 e.g. 'v0.2.x'
  label?: string; // 🏷️ menu text (default: value)
  href?: string; // 🔗 real navigation (works without JS via the <details> fallback)
}

/** ⚙️ props */
export interface AbVersionSwitcherProps {
  label?: string; // 🏷️ text before the version; default none (0.2.0, God 01:27: the app IS the docs, so no "Docs" prefix)
  version: string; // ✅ current version (shown bold), e.g. 'v0.2.x'
  versions?: readonly AbVersionOption[]; // 📋 the choices (none / one = a static label, no menu)
  onSelect?: (value: string) => void; // 📣 button items
  menuLabel?: string; // ♿ accessible name of the trigger (default "{label} {version}": contains the visible text, WCAG 2.5.3)
  className?: string; // 🏷️
}

/**
 * 🏷️ AbVersionSwitcher (P9): the sidebar's "Docs **v0.2.x** ▾" control. 28px, 8px radius, hairline border,
 * card background, 16px `expand_more`; opens an AbMenu below it (Escape / outside click close, focus returns).
 * JS off: with `href`s it's a native `<details>` list of links.
 */
const AbVersionSwitcher = ({ label = '', version, versions = [], onSelect, menuLabel, className }: AbVersionSwitcherProps): ReactElement => {
  const [open, setOpen] = useState(false); // 🚪
  const menuId = `ab-version-menu-${useId().replace(/:/g, '')}`; // 🆔
  const wrap = useRef<HTMLDivElement>(null); // 📍
  const btn = useRef<HTMLButtonElement>(null); // 📍
  const name = menuLabel ?? (label ? `${label} ${version}` : version); // ♿ WCAG 2.5.3 label-in-name (James)
  const hasMenu = versions.length > 1; // 📋

  // ⎋ Escape + outside click close it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } }; // ⎋ + ↩️
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); }; // 👋
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  // 🧱 the visible face (same for button, static label and no-JS summary)
  const face = (
    <>
      {label && <><span>{label}</span> </>}<b className={styles.abVersionValue}>{version}</b>
      {hasMenu && <AbIcon name="expand_more" size={16} className={styles.abVersionIcon} />}
    </>
  );

  if (!hasMenu) return <span className={clsx('AbVersionSwitcher', styles.abVersion, className)} data-ab-part="version-switcher">{face}</span>; // 🏷️ static

  const linksOnly = versions.every((v) => v.href); // 🔗 can it work without JS?
  return (
    <div ref={wrap} className={clsx('AbVersionSwitcher', styles.abVersionRoot, className)} data-ab-part="version-switcher">
      <button
        ref={btn}
        type="button"
        className={clsx(styles.abVersion, linksOnly && styles.abVersionJs)}
        aria-label={name}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        {face}
      </button>
      <AbMenu
        id={menuId}
        hidden={!open}
        isActive={open}
        className={styles.abVersionMenu}
        items={versions.map((v) => ({ id: v.value, label: v.label ?? v.value, href: v.href, selected: v.value === version, onClick: () => { onSelect?.(v.value); setOpen(false); } }))}
      />
      {/* 🚫 JS off: a native <details> of links (CSS shows it only under scripting: none) */}
      {linksOnly && (
        <details className={styles.abVersionNoJs} data-ab-part="version-switcher-nojs">
          <summary className={styles.abVersion} aria-label={name}>{face}</summary>
          <ul className={styles.abVersionNoJsList}>
            {versions.map((v) => <li key={v.value}><a href={v.href} aria-current={v.value === version ? 'page' : undefined}>{v.label ?? v.value}</a></li>)}
          </ul>
        </details>
      )}
    </div>
  );
};

// 📦 exports
export default AbVersionSwitcher;
export { AbVersionSwitcher };
