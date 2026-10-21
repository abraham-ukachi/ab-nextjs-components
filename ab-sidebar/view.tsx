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
* @name: AbSidebar - Shared view (client + server)
* @file: ab-sidebar/view.tsx
* @type: React Component (no hooks)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ComponentType, ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔗 G42: injectable link
import Link from '../ab-link';
// 🎈 rail tooltips (accessible balloon, 0.1.13)
import AbBalloon from '../ab-balloon';
// 🎨 styles
import styles from './styles.module.css';

/** 🔗 One sidebar destination (G40). `items` = one level of children, shown under the parent. */
export interface AbSidebarItem {
  id?: string; // 🆔 0.1.13 (James nit): stable React key when two items share an href (default: `href`)
  href: string; // 🔗
  icon?: string; // 🔣 AbIcons name: outlined, filled when active
  label: ReactNode; // 🏷️ 0.1.13: any node (Joseph #15), e.g. a mono package name
  labelText?: string; // ♿ plain-text name for the rail tooltip/aria-label when `label` isn't a string
  badge?: ReactNode; // 🔴 e.g. "New" or a count
  items?: AbSidebarItem[]; // 🌳 children
}

/** 🗂️ A labelled group of items. */
export interface AbSidebarSection {
  id: string; // 🆔
  label?: string; // 🏷️ heading (omit for an unlabelled group)
  items: AbSidebarItem[]; // 🔗
  itemSize?: 'md' | 'sm'; // 📏 0.1.14 (P8): 'sm' = 30px rows + 16px icons (the Home PACKAGES group)
}

/** 🕰️ Legacy (≤ 0.1.12) link shape; still accepted via `links`. */
export type AbSidebarLink = {
  href: string;
  icon: string;
  value: string;
  label: string;
};

/** 🌍 Translatable strings. */
export interface AbSidebarLabels {
  nav?: string; // ♿ nav aria-label (default "Sidebar")
  collapse?: string; // ◀️ (default "Collapse sidebar")
  expand?: string; // ▶️ (default "Expand sidebar")
}

/** 🔣 What the view needs from an icon component (client and server AbIcon both fit). */
export type AbSidebarIconComponent = ComponentType<{ name: string; variant?: 'outlined' | 'filled'; size?: number; className?: string }>;

/** ⚙️ Props shared by the client and server AbSidebar. */
export interface AbSidebarBaseProps {
  className?: string; // 🏷️
  id?: string; // 🆔 the list id (aria-controls target), default "ab-sidebar-list"
  sections?: AbSidebarSection[]; // 🗂️ G40
  activeHref?: string; // 🎯 current route (exact or a parent prefix)
  collapsed?: boolean; // 🚪 icon rail
  header?: ReactNode; // 🏷️ top slot (brand, workspace switcher…)
  labels?: AbSidebarLabels; // 🌍
  locales?: readonly string[]; // 🌍 0.1.13: stripped from the pathname (default: AbLinkProvider's)
  // 🏠 0.1.14 (P8, Home spec §4 sidebar)
  density?: 'comfortable' | 'compact'; // 📏 'compact' = 32px rows, 13.5/500, 18px icons, 11px group labels
  activeShape?: 'pill' | 'rounded'; // 🔷 'rounded' = 8px-radius --tint row (default 'pill')
  badgeVariant?: 'chip' | 'text'; // 🏷️ 'text' = plain mono 10.5 --faint meta (e.g. a version), no chip
  // 🏷️ 0.1.15 (God 00:08): a 60px logo row above `header` (mock 06 `.sb-logo`). With core ≥ 0.2.1 panes it only shows
  //    where the app header is hidden (tabletHeader="main" at 768–1179); elsewhere it always shows
  logo?: ReactNode;
  // 🕰️ legacy API (≤ 0.1.12)
  type?: 'customer' | 'admin';
  page?: string;
  links?: AbSidebarLink[];
  brandHref?: string;
  brandLabel?: string;
}

/** 🎯 Is `href` the current route, or a parent of it? */
export function isAbSidebarActive(href: string, activeHref?: string): boolean {
  if (!activeHref) return false; // 🚫
  if (href === activeHref) return true; // ✅ exact
  return href !== '/' && activeHref.startsWith(`${href.replace(/\/$/, '')}/`); // 🌳 parent
}

/** 🗂️ sections, or the legacy links as one unlabelled section. */
export function toAbSidebarSections(sections?: AbSidebarSection[], links?: AbSidebarLink[]): AbSidebarSection[] {
  if (sections?.length) return sections; // ✅ v2
  return links?.length ? [{ id: 'links', items: links.map(({ href, icon, label }) => ({ href, icon, label })) }] : []; // 🕰️
}

/** 🖼️ Render-only sidebar used by both twins. `active` decides the current item; `toggle` is the client's button. */
export function AbSidebarView({ props, Icon, active, toggle }: {
  props: AbSidebarBaseProps;
  Icon: AbSidebarIconComponent;
  active: (href: string, legacyValue?: string) => boolean;
  toggle?: ReactNode;
}): ReactElement {
  const { className, id = 'ab-sidebar-list', sections, collapsed = false, header, labels, type = 'customer', links, brandHref = '/', brandLabel = 'abElements', density = 'comfortable', activeShape = 'pill', badgeVariant = 'chip' } = props;
  const compact = density === 'compact'; // 📏 P8
  const groups = toAbSidebarSections(sections, links); // 🗂️
  // 🕰️ legacy value lookup (page === link.value)
  const valueOf = (href: string) => links?.find((l) => l.href === href)?.value;

  // 🔗 one item (+ children)
  const renderItem = (item: AbSidebarItem, depth: number, small = false): ReactElement => {
    const on = active(item.href, valueOf(item.href)); // 🎯
    const text = item.labelText ?? (typeof item.label === 'string' ? item.label : undefined); // ♿ plain name
    const link = (
      <Link
        href={item.href}
        className={styles.abSidebarLink}
        data-ab-part="item"
        data-active={on ? 'true' : 'false'}
        data-depth={depth}
        data-size={small ? 'sm' : undefined} // 📏 P8
        aria-current={on ? 'page' : undefined} // ♿
        aria-label={collapsed ? text : undefined} // ♿ rail: the label is visually hidden
      >
        {item.icon && <Icon name={item.icon} variant={on ? 'filled' : 'outlined'} size={compact ? (small ? 16 : 18) : 20} className={styles.abSidebarIcon} />}
        <span className={styles.abSidebarLabel}>{item.label}</span>
        {item.badge != null && <span className={styles.abSidebarBadge} data-ab-part="badge">{item.badge}</span>}
      </Link>
    );
    return (
      <li key={item.id ?? item.href}>
        {/* 🎈 rail: a balloon names the icon on hover / focus */}
        {collapsed && depth === 0 ? <AbBalloon title={text ?? item.href} placement="end">{link}</AbBalloon> : link}
        {!collapsed && item.items?.length ? (
          <ul className={styles.abSidebarList} data-ab-part="children">{item.items.map((c) => renderItem(c, depth + 1))}</ul>
        ) : null}
      </li>
    );
  };

  return (
    <nav
      data-type={type} // 🕰️
      data-ab-part={collapsed ? 'rail' : 'sidebar'} // 🧩
      data-collapsed={collapsed ? 'true' : 'false'} // 🚪
      className={clsx('AbSidebar', styles.abSidebar, className)} // 🏷️
      data-density={compact ? 'compact' : undefined} // 📏 P8
      data-active-shape={activeShape === 'rounded' ? 'rounded' : undefined} // 🔷 P8
      data-badge={badgeVariant === 'text' ? 'text' : undefined} // 🏷️ P8
      aria-label={labels?.nav ?? 'Sidebar'} // ♿
    >
      {props.logo != null && <div className={styles.abSidebarLogo} data-ab-part="sidebar-logo">{props.logo}</div> /* 🏷️ 0.1.15 */}
      {/* 🏷️ header slot, or the legacy brand link */}
      <div className={styles.abSidebarHeader}>
        {header ?? (links?.length && !sections?.length ? <Link href={brandHref} className={styles.abSidebarBrand}>{brandLabel}</Link> : null)}
        {toggle}
      </div>
      <div id={id} className={styles.abSidebarSections}>
        {groups.map((g) => (
          <section key={g.id} className={styles.abSidebarSection} data-ab-part="section" aria-labelledby={g.label ? `${id}-${g.id}` : undefined}>
            {g.label && <h2 id={`${id}-${g.id}`} className={styles.abSidebarHeading}>{g.label}</h2>}
            <ul className={styles.abSidebarList}>{g.items.map((it) => renderItem(it, 0, g.itemSize === 'sm'))}</ul>
          </section>
        ))}
      </div>
    </nav>
  );
}
