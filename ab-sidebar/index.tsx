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
* @name: AbSidebar - Client (G40)
* @file: ab-sidebar/index.tsx
* @type: Client Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbSidebar
*     activeHref="/docs/components"
*     sections={[{ id: 'docs', label: 'Docs', items: [{ href: '/docs/components', icon: 'widgets', label: 'Components' }] }]}
*   />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { useState, type ReactElement } from 'react';
// 🧭 current route (fallback when `activeHref` is omitted)
import { usePathname } from 'next/navigation';
// 🌍 0.1.13 (Joseph #10): locale-stripped pathname
import { stripAbLocalePrefix, useAbLocales } from '../ab-link';
// 🔣 client AbIcon (built-in chevrons are always registered)
import AbIcon from '../ab-icon';
// 🖼️ shared view
import { AbSidebarView, isAbSidebarActive, type AbSidebarBaseProps } from './view';
// 🎨 styles
import styles from './styles.module.css';

// 📦 re-export the shared types
export type { AbSidebarItem, AbSidebarSection, AbSidebarLink, AbSidebarLabels } from './view';
export { isAbSidebarActive, toAbSidebarSections } from './view';

/** ⚙️ Client props: the shared ones + collapse control. */
export interface AbSidebarProps extends AbSidebarBaseProps {
  defaultCollapsed?: boolean; // 🚪 uncontrolled start
  onCollapsedChange?: (collapsed: boolean) => void; // 🔔
  collapsible?: boolean; // 🔘 show the collapse button (default true when sections are given)
  collapseButtonVariant?: 'plain' | 'outlined'; // ⏪ 0.1.14 (P9): 'outlined' = 32×32 bordered `<<` / `>>` (default 'plain' chevron)
}

/**
 * 🧭 AbSidebar (client, G40): sections, filled icon on the active item, aria-current, an icon rail with balloon
 * tooltips, and a collapse button (aria-expanded + aria-controls; hidden when JS is off).
 */
const AbSidebar = (props: AbSidebarProps): ReactElement => {
  const { collapsed: controlled, defaultCollapsed = false, onCollapsedChange, collapsible, collapseButtonVariant = 'plain', activeHref, page, labels, id = 'ab-sidebar-list' } = props;
  const outlined = collapseButtonVariant === 'outlined'; // ⏪ P9
  // 🧭 route
  const appLocales = useAbLocales(); // 🌍 from AbLinkProvider
  const pathname = stripAbLocalePrefix(usePathname() ?? '', props.locales ?? appLocales); // 🧭 `/fr/docs` → `/docs`
  // 🚪 controlled or not
  const [inner, setInner] = useState(defaultCollapsed);
  const collapsed = controlled ?? inner;
  const setCollapsed = (next: boolean) => {
    if (controlled === undefined) setInner(next); // 🧠 uncontrolled
    onCollapsedChange?.(next); // 🔔
  };
  // 🎯 legacy `page` wins, then activeHref, then the pathname
  const active = (href: string, value?: string) => (page ? page === value : isAbSidebarActive(href, activeHref ?? pathname));
  // 🔘 the toggle
  const showToggle = collapsible ?? !!props.sections?.length;
  const toggleLabel = collapsed ? labels?.expand ?? 'Expand sidebar' : labels?.collapse ?? 'Collapse sidebar';
  const toggle = showToggle ? (
    <button
      type="button"
      className={styles.abSidebarToggle} // 🙈 hidden under (scripting: none)
      data-ab-part="collapse"
      data-variant={outlined ? 'outlined' : undefined} // ⏪ P9
      aria-expanded={!collapsed} // ♿
      aria-controls={id} // ♿
      aria-label={toggleLabel} // 🏷️
      onClick={() => setCollapsed(!collapsed)}
    >
      <AbIcon name={outlined ? (collapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left') : collapsed ? 'chevron_right' : 'chevron_left'} size={outlined ? 18 : 20} />
    </button>
  ) : undefined;

  return <AbSidebarView props={{ ...props, collapsed }} Icon={AbIcon} active={active} toggle={toggle} />;
};

// 📦 exports
export default AbSidebar;
export { AbSidebar };
