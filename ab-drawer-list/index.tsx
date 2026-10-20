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
* @name: AbDrawerList (G53 preset)
* @file: ab-drawer-list/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbDrawerList scope="app" side="bottom" open={d.open} onClose={d.close} title="Language"
*    -|>   items={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }]} value="en" onSelect={setLocale} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import type { ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗄️ the drawer
import AbDrawer, { type AbDrawerProps } from '../ab-drawer';
import type { ComponentType } from 'react';
// 🔗 links go through AbLinkProvider (locale-aware apps)
import Link from '../ab-link';
// 🎨 styles
import styles from './styles.module.css';

/** 📋 one choice */
export interface AbDrawerListItem {
  value: string; // 🆔 e.g. a locale code
  label: ReactNode; // 🏷️
  description?: ReactNode; // 📝 a second line
  icon?: ReactNode; // 🔣 leading, decorative
  href?: string; // 🔗 render a link (e.g. the same page in another locale) instead of a button
  lang?: string; // 🌍 e.g. 'fr' for "Français" (screen readers pronounce it right)
  disabled?: boolean; // 🚫
}

/** ⚙️ props: every AbDrawer prop, plus the list */
export interface AbDrawerListProps extends Omit<AbDrawerProps, 'children'> {
  as?: ComponentType<AbDrawerProps>; // 🧱 the drawer to render in (default AbDrawer; e.g. AbBottomDrawer)
  items: AbDrawerListItem[]; // 📋
  value?: string | null; // 🎯 the selected item (`aria-current="true"` + a check mark)
  onSelect?: (value: string) => void; // 🔔
  closeOnSelect?: boolean; // 🚪 default true
  listLabel?: string; // ♿ the list's name when the title isn't enough
}

/**
 * 📋 AbDrawerList — AbDrawer with one selectable list (languages, sort orders, …). D40: the mobile
 * language picker is `<AbDrawerList scope="app" side="bottom" />`. Items are buttons (or links with
 * `href`), the selected one carries `aria-current="true"`. No-JS: the links still work in the fallback.
 */
const AbDrawerList = ({ as: Drawer = AbDrawer, items, value, onSelect, closeOnSelect = true, listLabel, onClose, className, ...drawer }: AbDrawerListProps): ReactElement => {
  const pick = (v: string) => { onSelect?.(v); if (closeOnSelect) onClose(); }; // 🔔 then 🚪
  return (
    <Drawer {...drawer} onClose={onClose} className={clsx('AbDrawerList', className)}>
      <ul className={styles.abDrawerList} aria-label={listLabel} data-ab-part="drawer-list">
        {items.map((it) => {
          const on = it.value === value; // 🎯
          const inner = (
            <>
              {it.icon != null && <span className={styles.abDrawerListIcon} aria-hidden="true">{it.icon}</span>}
              <span className={styles.abDrawerListText}>
                <span lang={it.lang}>{it.label}</span>
                {it.description != null && <span className={styles.abDrawerListDescription}>{it.description}</span>}
              </span>
              <span className={styles.abDrawerListCheck} aria-hidden="true">{on ? '✓' : ''}</span>
            </>
          );
          return (
            <li key={it.value}>
              {it.href && !it.disabled ? (
                <Link href={it.href} className={styles.abDrawerListItem} data-active={on ? 'true' : 'false'} aria-current={on ? 'true' : undefined} hrefLang={it.lang} onClick={() => pick(it.value)}>{inner}</Link>
              ) : (
                <button type="button" className={styles.abDrawerListItem} data-active={on ? 'true' : 'false'} aria-current={on ? 'true' : undefined} disabled={it.disabled} onClick={() => pick(it.value)}>{inner}</button>
              )}
            </li>
          );
        })}
      </ul>
    </Drawer>
  );
};

// 📦 exports
export default AbDrawerList;
export { AbDrawerList };
