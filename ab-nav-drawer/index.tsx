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
* @name: AbNavDrawer
* @file: ab-nav-drawer/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> useAbEdgeSwipe({ edge: 'left', onOpen: () => setNav(true), enabled: !nav })
*    -|> <AbNavDrawer open={nav} onClose={() => setNav(false)} logo={<AbLogo />} version="v0.2.x"
*    -|>   sections={[{ id: 'top', items: [{ href: '/', label: 'Home', icon: 'home' }] }]} activeHref="/"
*    -|>   footer={[{ href: '/changelog', label: 'Changelog', icon: 'history' }]} onSettings={openSettings} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import type { MouseEvent, ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗄️ the drawer
import AbDrawer from '../ab-drawer';
// 🔣 icons
import AbIcon from '../ab-icon';
// 🔗 the app's link (AbLinkProvider: next/link, or a locale-aware one)
import Link from '../ab-link';
// 🎯 the same active rule as the laptop sidebar
import { isAbSidebarActive } from '../ab-sidebar/view';
// 🎨 the drawers v2 kit
import kit from '../ab-drawer/kit.module.css';

/** 🔗 one nav row */
export interface AbNavDrawerItem {
  href: string; // 🔗
  label: string; // 🏷️
  icon?: string; // 🔣 an AbIcons name
  meta?: string; // 🏷️ trailing mono text, e.g. a version
}
/** 🗂️ one group: an optional uppercase label (a heading for its list) + rows */
export interface AbNavDrawerSection { id: string; label?: string; items: readonly AbNavDrawerItem[] }

/** ⚙️ props */
export interface AbNavDrawerProps {
  open: boolean; // 🚪
  onClose: () => void; // ⎋ scrim, Esc, ✕, a swipe back, or choosing a link
  logo: ReactNode; // 🏷️ the logoname (a link home, usually)
  version?: ReactNode; // 🏷️ a string = the mono version chip ("v0.2.x ⌄"); or your own picker node
  onVersionClick?: () => void; // 🔽 the chip as a button (e.g. open a version menu)
  sections: readonly AbNavDrawerSection[]; // 🗂️ same content as the laptop sidebar
  activeHref?: string; // 🎯 exact match or parent prefix ("/" only matches itself)
  footer?: readonly AbNavDrawerItem[]; // 📌 pinned 48px rows (e.g. Changelog)
  onSettings?: () => void; // ⚙️ adds a "Settings ›" row; close this drawer, then open the Settings sheet
  onNavigate?: (href: string) => void; // 🔔 after a link is chosen (the drawer closes either way)
  labels?: { title?: string; close?: string; settings?: string; version?: string }; // 🌍 "Site navigation", "Close navigation", "Settings", "Version"
  returnFocus?: string; // ↩️ e.g. the main header logo link (where focus goes after a swipe-open)
  id?: string; // 🆔
  className?: string; // 🏷️
}

/**
 * ⬅️ AbNavDrawer — John's left drawer (drawers v2 §2): the mobile sidebar.
 *
 * - 📐 320px, full height, 0 16 16 0 radius; header = logo + 44px ✕; the version chip; a scrolling nav
 *   (44px rows, uppercase group headings, a 72px fade); a pinned footer of 48px rows
 * - 🤏 opens with `useAbEdgeSwipe({ edge: 'left' })`; closes with a right-to-left swipe on the sheet (AbDrawer `swipe`),
 *   the scrim, Esc, ✕, or choosing a link
 * - ♿ `role="dialog"` + aria-modal, aria-label "Site navigation"; `aria-current="page"` on the active row; each
 *   group label is a heading that labels its list
 * - 🥞 tier 'nav': in front of the right drawer, under the bottom sheet
 */
const AbNavDrawer = ({ open, onClose, logo, version, onVersionClick, sections, activeHref, footer = [], onSettings, onNavigate, labels = {}, returnFocus, id = 'ab-nav-drawer', className }: AbNavDrawerProps): ReactElement => {
  const L = { title: 'Site navigation', close: 'Close navigation', settings: 'Settings', version: 'Version', ...labels }; // 🌍
  const choose = (href: string) => (e: MouseEvent) => { if (e.defaultPrevented) return; onNavigate?.(href); onClose(); }; // 🔗 then close
  const row = (it: AbNavDrawerItem, cls: string) => {
    const on = isAbSidebarActive(it.href, activeHref); // 🎯
    return (
      <Link href={it.href} className={cls} aria-current={on ? 'page' : undefined} onClick={choose(it.href)}>
        {it.icon && <AbIcon name={it.icon} filled={on} size={cls === kit.row ? 24 : 22} />}
        <span>{it.label}</span>
        {it.meta && <span className={kit.mini}>{it.meta}</span>}
      </Link>
    );
  };
  // 🏷️ a string version = the mock chip (mono, accent), optionally a button
  const chip = typeof version === 'string'
    ? (onVersionClick
      ? <button type="button" className={kit.ver} aria-label={`${L.version} ${version}`} aria-haspopup="menu" onClick={onVersionClick}><b>{version}</b><AbIcon name="expand_more" size={18} /></button>
      : <span className={kit.ver} aria-label={`${L.version} ${version}`}><b>{version}</b><AbIcon name="expand_more" size={18} /></span>)
    : version;
  return (
    <AbDrawer
      open={open} onClose={onClose} id={id} side="left" scope="app" tier="nav" swipe size="320px"
      headerStart={<span className={kit.logoRow}>{logo}</span>} aria-label={L.title}
      closeLabel={L.close} closeIcon={<AbIcon name="close" size={24} />} initialFocus="panel" returnFocus={returnFocus}
      className={clsx('AbNavDrawer', kit.sheet, className)}
    >
      {chip != null && <div className={kit.verRow}>{chip}</div>}
      <div className={kit.navWrap}>
        <nav className={kit.nav} aria-label={L.title} data-ab-part="nav-drawer-nav">
          {sections.map((s) => (
            <div key={s.id} role="group" aria-labelledby={s.label ? `${id}-${s.id}` : undefined}>
              {s.label && <h3 id={`${id}-${s.id}`} className={kit.grp}>{s.label}</h3>}
              <ul className={kit.list} aria-labelledby={s.label ? `${id}-${s.id}` : undefined}>
                {s.items.map((it) => <li key={it.href}>{row(it, kit.nv)}</li>)}
              </ul>
            </div>
          ))}
        </nav>
        <div className={kit.fade} aria-hidden="true" />
      </div>
      {(footer.length > 0 || onSettings) && (
        <div className={kit.navFoot} data-ab-part="nav-drawer-footer">
          {footer.map((it) => <div key={it.href}>{row(it, kit.row)}</div>)}
          {onSettings && (
            <button type="button" className={kit.row} aria-haspopup="dialog" onClick={() => { onClose(); onSettings(); }}>
              <AbIcon name="settings" size={24} /><span>{L.settings}</span><AbIcon name="chevron_right" size={24} className={kit.chev} />
            </button>
          )}
        </div>
      )}
    </AbDrawer>
  );
};

// 📦 exports
export default AbNavDrawer;
export { AbNavDrawer };
