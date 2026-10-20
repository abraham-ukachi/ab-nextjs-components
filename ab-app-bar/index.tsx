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
* @name: AbAppBar (G43)
* @file: ab-app-bar/index.tsx
* @type: Client Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbAppBar
*     brand={<AbBrand />}
*     search={<AbSearchTrigger onOpen={openSearch} />}
*     nav={[{ href: '/docs', label: 'Docs' }, { href: '/components', label: 'Components' }]}
*     activeHref="/docs"
*     actions={<AbThemeToggle />}
*   />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔗 G42 link
import Link from '../ab-link';
// 🔣 icons (more_vert is a built-in)
import AbIcon from '../ab-icon';
// 📋 the overflow menu (G26)
import AbMenu from '../ab-menu';
// 🎨 styles
import styles from './styles.module.css';

/** 🔗 a top-level destination */
export interface AbAppBarNavItem {
  href: string; // 🔗
  label: string; // 🏷️
}

/** ⚙️ props */
export interface AbAppBarProps {
  brand?: ReactNode; // 🏷️ logo / wordmark (left)
  search?: ReactNode; // 🔎 e.g. <AbSearchTrigger />
  nav?: AbAppBarNavItem[]; // 🧭 inline from 1180px, in the "More" menu below
  activeHref?: string; // 🎯
  actions?: ReactNode; // 🔘 right side (theme toggle, locale switcher, GitHub…)
  compactActions?: ReactNode; // 📱 0.1.13 (Joseph #3): shown INSTEAD of `actions` below 768px (e.g. only the theme toggle); the rest can live in the More menu or the nav sheet
  leading?: ReactNode; // ☰ optional slot before the brand (e.g. a rail toggle)
  sticky?: boolean; // 📌 default true (hairline under it)
  labels?: { nav?: string; more?: string }; // 🌍
  className?: string; // 🏷️
}

/** 🎯 exact match or parent prefix ("/" only matches itself) */
const isActive = (href: string, active?: string) => !!active && (href === active || (href !== '/' && active.startsWith(`${href.replace(/\/$/, '')}/`)));

/**
 * 🧱 AbAppBar (G43): brand, search, nav, actions, sticky with a hairline. Below 1180px the nav moves into a
 * "More" overflow menu built on AbMenu (G26). JS off: the More button is hidden and the nav scrolls inline.
 */
const AbAppBar = ({ brand, search, nav = [], activeHref, actions, compactActions, leading, sticky = true, labels, className }: AbAppBarProps): ReactElement => {
  // 🆔 menu id
  const menuId = `ab-app-bar-more-${useId().replace(/:/g, '')}`;
  // 📋 menu state
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  // ⎋ Escape + outside click close it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus(); // ♿ focus back on the trigger
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false); // 👋
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <header className={clsx('AbAppBar', styles.abAppBar, className)} data-ab-part="app-bar" data-sticky={sticky ? 'true' : 'false'} data-has-compact-actions={compactActions != null ? 'true' : undefined}>
      {leading}
      {brand && <div className={styles.abAppBarBrand}>{brand}</div>}
      {search && <div className={styles.abAppBarSearch}>{search}</div>}
      {nav.length > 0 && (
        <nav className={styles.abAppBarNav} aria-label={labels?.nav ?? 'Main'}>
          <ul>
            {nav.map((n) => {
              const on = isActive(n.href, activeHref); // 🎯
              return (
                <li key={n.href}>
                  <Link href={n.href} className={styles.abAppBarLink} data-active={on ? 'true' : 'false'} aria-current={on ? 'page' : undefined}>{n.label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      <div className={styles.abAppBarActions}>
        {/* 🔘 actions; 📱 below 768px `compactActions` replaces them (both rendered, CSS picks: no hydration flip) */}
        {compactActions != null ? (
          <>
            <div className={styles.abAppBarActionsWide}>{actions}</div>
            <div className={styles.abAppBarActionsCompact}>{compactActions}</div>
          </>
        ) : actions}
        {nav.length > 0 && (
          <div ref={wrap} className={styles.abAppBarMore}>
            <button
              ref={btn}
              type="button"
              className={styles.abAppBarMoreButton} // 🙈 ≥ 1180px and JS off
              aria-label={labels?.more ?? 'More'}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((o) => !o)}
            >
              <AbIcon name="more_vert" size={24} />
            </button>
            <AbMenu
              id={menuId}
              hidden={!open}
              isActive={open}
              className={styles.abAppBarMenu}
              items={nav.map((n) => ({ id: n.href, label: n.label, href: n.href, selected: isActive(n.href, activeHref), onClick: () => setOpen(false) }))}
            />
          </div>
        )}
      </div>
    </header>
  );
};

// 📦 exports
export default AbAppBar;
export { AbAppBar };
