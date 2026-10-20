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
* @name: AbTocDrawer
* @file: ab-toc-drawer/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> useAbEdgeSwipe({ edge: 'right', onOpen: () => setToc(true), enabled: hasAside && !toc })
*    -|> <AbTocDrawer open={toc} onClose={() => setToc(false)} items={outline} activeId={spy}
*    -|>   onNavigate={(id) => scrollToAbSection(id)} links={[{ href: editUrl, label: 'Edit this page', icon: 'github' }]} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import type { MouseEvent, ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗄️ the drawer
import AbDrawer from '../ab-drawer';
// 🔣 icons
import AbIcon from '../ab-icon';
// 🔗 the app's link
import Link from '../ab-link';
// 📑 the outline item type (shared with AbToc)
import type { AbTocItem } from '../ab-toc';
// 🎨 the drawers v2 kit
import kit from '../ab-drawer/kit.module.css';

/** 🔗 a row under the outline (Edit this page, Changelog) */
export interface AbTocDrawerLink { href: string; label: string; icon?: string; external?: boolean }

/** ⚙️ props */
export interface AbTocDrawerProps {
  open: boolean; // 🚪
  onClose: () => void; // ⎋ scrim, Esc, ✕, a left-to-right swipe, or choosing a heading
  items: readonly AbTocItem[]; // 📑 the page outline (level 2 / 3 / 4)
  activeId?: string | null; // 🎯 e.g. from useAbScrollSpy (hooks 0.1.7)
  onNavigate?: (id: string) => void; // 🔔 scroll there (e.g. scrollToAbSection); without it a plain #id jump. The drawer closes after
  links?: readonly AbTocDrawerLink[]; // 🔗 below a divider
  labels?: { title?: string; close?: string }; // 🌍 "On this page", "Close outline"
  returnFocus?: string; // ↩️ after a swipe-open
  id?: string; // 🆔
  className?: string; // 🏷️
}

/**
 * ➡️ AbTocDrawer — John's right drawer (drawers v2 §3): the page aside ("On this page") on mobile.
 *
 * - 🧭 Only for routes whose layout has an aside: render it (and enable the right edge swipe) there, nowhere else
 * - 📐 296px, 16 0 0 16 radius, title Mulish 800 20px; 44px outline rows on a 2px rail, level 3 indented 16px,
 *   the active one bronze with `aria-current="location"`; then a divider and the links
 * - 🤏 opens with `useAbEdgeSwipe({ edge: 'right' })` or an "On this page" chip; closes with a left-to-right swipe
 * - 🥞 tier 'aside': one level below the left drawer
 */
const AbTocDrawer = ({ open, onClose, items, activeId, onNavigate, links = [], labels = {}, returnFocus, id = 'ab-toc-drawer', className }: AbTocDrawerProps): ReactElement => {
  const L = { title: 'On this page', close: 'Close outline', ...labels }; // 🌍
  const go = (target: string) => (e: MouseEvent) => {
    if (onNavigate) { e.preventDefault(); onNavigate(target); } // 📜 the app scrolls
    onClose(); // 🚪 then close
  };
  return (
    <AbDrawer
      open={open} onClose={onClose} id={id} side="right" scope="app" tier="aside" swipe size="296px"
      title={L.title} closeLabel={L.close} closeIcon={<AbIcon name="close" size={24} />}
      initialFocus='[aria-current="location"]' returnFocus={returnFocus}
      className={clsx('AbTocDrawer', kit.sheet, kit.titleSm, className)}
    >
      <nav aria-labelledby={`${id}-title`} data-ab-part="toc-drawer-nav">
        <ol className={kit.toc}>
          {items.map((it) => {
            const on = it.id === activeId; // 🎯
            return (
              <li key={it.id}>
                <a href={`#${it.id}`} className={kit.tocLink} data-level={it.level ?? 2} aria-current={on ? 'location' : undefined} onClick={go(it.id)}>{it.label}</a>
              </li>
            );
          })}
        </ol>
      </nav>
      {links.length > 0 && (
        <>
          <hr className={clsx(kit.hr, kit.tocHr)} />
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={clsx(kit.row, kit.tocRow)} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})} onClick={onClose}>
              {l.icon && <AbIcon name={l.icon} size={24} />}<span>{l.label}</span>
            </Link>
          ))}
        </>
      )}
    </AbDrawer>
  );
};

// 📦 exports
export default AbTocDrawer;
export { AbTocDrawer };
