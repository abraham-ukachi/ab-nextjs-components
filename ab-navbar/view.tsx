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
* @name: AbNavbar - Shared view (client + server)
* @file: ab-navbar/view.tsx
* @type: React Component (no hooks)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ComponentType, ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔗 G42: injectable link
import Link from '../ab-link';
// 🎨 styles
import styles from './styles.module.css';

/** 🔗 A destination (G41). */
export interface AbNavbarLinkItem {
  kind: 'link'; // 🏷️
  href: string; // 🔗
  icon: string; // 🔣 AbIcons name: outlined, filled when active
  label: string; // 🏷️
}

/** 🔘 An action, e.g. "Menu" opening a sheet (client only: needs `onSelect`). */
export interface AbNavbarButtonItem {
  kind: 'button'; // 🏷️
  id: string; // 🆔
  icon: string; // 🔣
  label: string; // 🏷️
  onSelect?: () => void; // 🔔
  expanded?: boolean; // ♿ aria-expanded for sheet toggles
  controls?: string; // ♿ aria-controls
  disabled?: boolean; // 🚫 0.1.13 (Joseph #8, D24/D25): focusable, announced, inert (aria-disabled)
  comingSoon?: boolean | string; // 🚧 0.1.13: inert + a "Coming soon" tag (string = your translated label)
}

/** 🧩 Either kind. */
export type AbNavbarItem = AbNavbarLinkItem | AbNavbarButtonItem;

/** 🕰️ Legacy (≤ 0.1.12) link shape; still accepted via `links`. */
export type AbNavbarLink = {
  href: string;
  icon: string;
  value: string;
  label: string;
};

/** 🔣 What the view needs from an icon component. */
export type AbNavbarIconComponent = ComponentType<{ name: string; variant?: 'outlined' | 'filled'; size?: number; className?: string }>;

/** ⚙️ Props shared by both twins. */
export interface AbNavbarBaseProps<I extends AbNavbarItem = AbNavbarItem> {
  className?: string; // 🏷️
  items?: I[]; // 🧩 G41
  activeHref?: string; // 🎯
  locales?: readonly string[]; // 🌍 0.1.13: stripped from the pathname (default: AbLinkProvider's)
  label?: string; // ♿ nav aria-label (default "Primary")
  // 🕰️ legacy
  type?: 'customer' | 'admin';
  page?: string;
  links?: AbNavbarLink[];
}

/** 🎯 exact match or a parent prefix ("/" only matches itself). */
export function isAbNavbarActive(href: string, activeHref?: string): boolean {
  if (!activeHref) return false;
  if (href === activeHref) return true;
  return href !== '/' && activeHref.startsWith(`${href.replace(/\/$/, '')}/`);
}

/** 🖼️ Render-only bottom bar used by both twins. */
export function AbNavbarView({ props, Icon, active }: {
  props: AbNavbarBaseProps;
  Icon: AbNavbarIconComponent;
  active: (href: string, legacyValue?: string) => boolean;
}): ReactElement {
  const { className, items, links, label = 'Primary', type = 'customer' } = props;
  // 🕰️ legacy links → link items
  const list: AbNavbarItem[] = items?.length ? items : (links ?? []).map(({ href, icon, label: l }) => ({ kind: 'link', href, icon, label: l }));
  const valueOf = (href: string) => links?.find((l) => l.href === href)?.value;

  return (
    <nav data-type={type} data-ab-part="bottomBar" className={clsx('AbNavbar', styles.abNavbar, className)} aria-label={label}>
      <ul className={styles.abNavbarList}>
        {list.map((item) => {
          if (item.kind === 'button') {
            // 🔘 action (🚫 disabled / 🚧 coming soon: stays focusable for the tag, never fires)
            const inert = !!item.disabled || !!item.comingSoon;
            const soon = item.comingSoon ? (typeof item.comingSoon === 'string' ? item.comingSoon : 'Coming soon') : undefined;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.abNavbarLink}
                  data-ab-part="item"
                  data-kind="button"
                  aria-expanded={item.expanded} // ♿
                  aria-controls={item.controls} // ♿
                  aria-disabled={inert || undefined} // 🚫
                  data-coming-soon={item.comingSoon ? 'true' : undefined} // 🚧
                  onClick={inert ? undefined : item.onSelect}
                >
                  <span className={styles.abNavbarPill}><Icon name={item.icon} variant={item.expanded ? 'filled' : 'outlined'} size={24} /></span>
                  <span className={styles.abNavbarLabel}>{item.label}</span>
                  {soon && <span className={styles.abNavbarSoon} data-ab-part="badge"><span className={styles.abNavbarSrOnly}>, </span>{soon}</span>}
                </button>
              </li>
            );
          }
          // 🔗 destination
          const on = active(item.href, valueOf(item.href)); // 🎯
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.abNavbarLink}
                data-ab-part="item"
                data-kind="link"
                data-active={on ? 'true' : 'false'}
                aria-current={on ? 'page' : undefined} // ♿
              >
                <span className={styles.abNavbarPill}><Icon name={item.icon} variant={on ? 'filled' : 'outlined'} size={24} /></span>
                <span className={styles.abNavbarLabel}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
