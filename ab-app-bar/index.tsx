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
import Link, { stripAbLocalePrefix, useAbLocales } from '../ab-link';
// 🧭 current route (fallback when `activeHref` is omitted, like AbSidebar / AbNavbar)
import { usePathname } from 'next/navigation';
// 🔣 icons (more_vert is a built-in)
import AbIcon from '../ab-icon';
// 📋 the overflow menu (G26)
import AbMenu from '../ab-menu';
// 🗄️ 0.1.14 (G56): the More menu can open as a drawer
import AbDrawerList from '../ab-drawer-list';
import AbBottomDrawer from '../ab-bottom-drawer';
import { resolveAbPresentation, type AbPresentation } from '../ab-locale-switcher';
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
  activeHref?: string; // 🎯 default: the pathname without its locale prefix
  locales?: readonly string[]; // 🌍 0.1.13 (Joseph): stripped from the pathname (default: AbLinkProvider's), so `/fr/docs` marks `/docs`
  actions?: ReactNode; // 🔘 right side (theme toggle, locale switcher, GitHub…)
  compactActions?: ReactNode; // 📱 0.1.13 (Joseph #3): shown INSTEAD of `actions` below 768px (e.g. only the theme toggle); the rest can live in the More menu or the nav sheet
  leading?: ReactNode; // ☰ optional slot before the brand (e.g. a rail toggle)
  sticky?: boolean; // 📌 default true (hairline under it)
  labels?: { nav?: string; more?: string }; // 🌍
  className?: string; // 🏷️
  /** 🗄️ 0.1.14 (G56, D40): More as `menu` (default), `drawer` (app-scope bottom AbDrawerList) or `auto` (drawer below 768px) */
  presentation?: AbPresentation;
  /** 📏 0.1.14 (P5): `'compact'` = the Home bar: height from core's `--ab-header-height` (52 / 60 / 64), 13.5px links,
   *  brand column `--ab-app-bar-brand-width` (236, 270 at ≥ 1920), `--div` hairline. Default `'comfortable'` (64px). */
  density?: 'comfortable' | 'compact';
  /** ➖ 0.1.14 (P4): a 1×20 `--div` rule between the nav and the actions (mock: before GitHub) */
  divider?: boolean;
  /** ⋮ 0.1.14 (P19): `false` = no "More" button/menu; below 1180px the nav is simply hidden (default `true`) */
  moreMenu?: boolean;
}

/** 🎯 exact match or parent prefix ("/" only matches itself) */
const isActive = (href: string, active?: string) => !!active && (href === active || (href !== '/' && active.startsWith(`${href.replace(/\/$/, '')}/`)));

/**
 * 🧱 AbAppBar (G43): brand, search, nav, actions, sticky with a hairline. Below 1180px the nav moves into a
 * "More" overflow menu built on AbMenu (G26). JS off: the More button is hidden and the nav scrolls inline.
 */
const AbAppBar = ({ brand, search, nav = [], activeHref, locales, actions, compactActions, leading, sticky = true, labels, className, presentation = 'menu', density = 'comfortable', divider = false, moreMenu = true }: AbAppBarProps): ReactElement => {
  // 🌍 the active link comes from the AbLinkProvider locales, same rule as AbSidebar / AbNavbar
  const appLocales = useAbLocales();
  const pathname = stripAbLocalePrefix(usePathname() ?? '', locales ?? appLocales); // 🧭 `/fr/docs` → `/docs`
  const current = activeHref ?? pathname; // 🎯 explicit wins
  // 🆔 menu id
  const menuId = `ab-app-bar-more-${useId().replace(/:/g, '')}`;
  // 📋 menu state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'menu' | 'drawer'>(presentation === 'drawer' ? 'drawer' : 'menu'); // 🗄️ decided on click
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  // ⎋ Escape + outside click close it
  useEffect(() => {
    if (!open || mode !== 'menu') return; // 🗄️ the drawer has its own Escape / scrim
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
  }, [open, mode]);

  return (
    <header className={clsx('AbAppBar', styles.abAppBar, className)} data-ab-part="app-bar" data-sticky={sticky ? 'true' : 'false'} data-has-compact-actions={compactActions != null ? 'true' : undefined} data-density={density === 'compact' ? 'compact' : undefined} data-more={moreMenu ? undefined : 'false'}>
      {leading}
      {brand && <div className={styles.abAppBarBrand}>{brand}</div>}
      {search && <div className={styles.abAppBarSearch}>{search}</div>}
      {nav.length > 0 && (
        <nav className={styles.abAppBarNav} aria-label={labels?.nav ?? 'Main'}>
          <ul>
            {nav.map((n) => {
              const on = isActive(n.href, current); // 🎯
              return (
                <li key={n.href}>
                  <Link href={n.href} className={styles.abAppBarLink} data-active={on ? 'true' : 'false'} aria-current={on ? 'page' : undefined}>{n.label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      {divider && <span className={styles.abAppBarDivider} aria-hidden="true" data-ab-part="app-bar-divider" /> /* ➖ P4 */}
      <div className={styles.abAppBarActions}>
        {/* 🔘 actions; 📱 below 768px `compactActions` replaces them (both rendered, CSS picks: no hydration flip) */}
        {compactActions != null ? (
          <>
            <div className={styles.abAppBarActionsWide}>{actions}</div>
            <div className={styles.abAppBarActionsCompact}>{compactActions}</div>
          </>
        ) : actions}
        {nav.length > 0 && moreMenu && (
          <div ref={wrap} className={styles.abAppBarMore}>
            <button
              ref={btn}
              type="button"
              className={styles.abAppBarMoreButton} // 🙈 ≥ 1180px and JS off
              aria-label={labels?.more ?? 'More'}
              aria-haspopup={mode === 'drawer' ? 'dialog' : 'menu'}
              aria-expanded={open}
              aria-controls={mode === 'drawer' ? `${menuId}-drawer` : menuId}
              onClick={() => { if (!open) setMode(resolveAbPresentation(presentation)); setOpen((o) => !o); }} // 🖱️ `auto` decides now
            >
              <AbIcon name="more_vert" size={24} />
            </button>
            <AbMenu
              id={menuId}
              hidden={!open || mode !== 'menu'}
              isActive={open && mode === 'menu'}
              className={styles.abAppBarMenu}
              items={nav.map((n) => ({ id: n.href, label: n.label, href: n.href, selected: isActive(n.href, current), onClick: () => setOpen(false) }))}
            />
            {presentation !== 'menu' && (
              <AbDrawerList
                id={`${menuId}-drawer`}
                open={open && mode === 'drawer'}
                onClose={() => setOpen(false)} // 🚪 focus goes back to More
                scope="app"
                side="bottom"
                as={AbBottomDrawer} // 📱
                title={labels?.more ?? 'More'}
                noJsFallback={false} // 🚫 JS off: the nav already scrolls inline
                value={nav.find((n) => isActive(n.href, current))?.href}
                items={nav.map((n) => ({ value: n.href, label: n.label, href: n.href }))}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

// 📦 exports
export default AbAppBar;
export { AbAppBar };
