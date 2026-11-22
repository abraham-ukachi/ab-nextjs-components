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
* @name: index.tsx
* @file: ab-search-trigger/index.tsx
* @type: Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { type MouseEvent, type ReactElement } from 'react';
// ⌨️ 0.8.0 (G10, D49): the ONE shared hotkey hook + the platform-aware key cap / aria-keyshortcuts
import { useAbHotkey, useAbHotkeyLabel, AB_HOTKEY_SEARCH } from 'ab-nextjs-hooks/useAbHotkey';
// 🧵 classes
import clsx from 'clsx';
// 🔗 G42 link (href fallback)
import Link from '../ab-link';
// 🔣 icon (search is a built-in)
import AbIcon from '../ab-icon';
// ⌨️ key hint
import AbKbd from '../ab-kbd';
// 🎬 hover / press motion from the package
import 'ab-nextjs-animations/motion/styles.css';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbSearchTriggerProps {
  label?: string; // 🏷️ placeholder text (default "Search")
  onOpen?: () => void; // 🔔 opens your search dialog (button mode)
  href?: string; // 🔗 no onOpen → a link to a search page (also the JS-off path)
  /** ⌨️ REGISTER a ⌘K / Ctrl+K listener (via `useAbHotkey`) that calls `onOpen` (default true when `onOpen` is set).
   *  0.8.0 (D49): pass `hotkey={false}` when the app shell owns the single `useAbHotkey('mod+k')`. */
  hotkey?: boolean;
  /** 👀 SHOW the ⌘K / Ctrl+K key cap and announce `aria-keyshortcuts` (default: whatever `hotkey` does).
   *  0.8.0 (D49): no longer an alias of `hotkey` — `shortcut` + `hotkey={false}` = "the shell listens, I just show the cap". */
  shortcut?: boolean;
  compact?: boolean; // 📱 icon-only pill (the label stays for screen readers), e.g. the mobile app bar
  comingSoon?: boolean; // 🚧 visible but inert: aria-disabled, no hotkey
  comingSoonLabel?: string; // 🏷️ default "Coming soon"
  variant?: 'pill' | 'field'; // 🔎 0.1.14 (P6): 'field' = the Home 300×36 bordered field (default 'pill', the legacy look)
  /** 📱 0.1.15: a shorter label (e.g. "Search") that a compact AbAppBar shows below 768px instead of `label`
   *  (CSS picks; only one is ever displayed, so the accessible name stays single). Home field only. */
  compactLabel?: string;
  size?: 'md' | 'sm' | 'lg'; // 📱 0.1.14 (P6): 'sm' = the mobile 34px "Search ⌘K" pill (label + key cap stay visible)
  //  🔍 404 gaps: 'lg' = the 404 page's big 44px field (440px wide, full width on mobile; Home field look)
  className?: string; // 🏷️
}

/** 🍎 Apple platforms show ⌘, everyone else Ctrl. 0.8.0: the one implementation now lives in hooks 0.1.9 (re-exported here). */
export { isAbApplePlatform } from 'ab-nextjs-hooks/useAbHotkey';

/**
 * 🔎 AbSearchTrigger (G44): a search "field" that opens your dialog. Shows ⌘K on Apple, Ctrl K elsewhere,
 * announces `aria-keyshortcuts` ("Meta+K" on Apple, "Control+K" elsewhere; SSR renders the Ctrl / Control pair),
 * and falls back to a link when there's no `onOpen`.
 * - ⌨️ 0.8.0 (D49) **shortcut / hotkey split**: `hotkey` registers the listener (hooks 0.1.9 `useAbHotkey`),
 *   `shortcut` only shows the cap. An app with one shell-level `useAbHotkey('mod+k')` renders every trigger with
 *   `shortcut hotkey={false}`: the cap everywhere, ONE listener, no double-open.
 */
const AbSearchTrigger = ({ label = 'Search', onOpen, href, hotkey, shortcut, compact = false, comingSoon = false, comingSoonLabel = 'Coming soon', compactLabel, variant = 'pill', size = 'md', className }: AbSearchTriggerProps): ReactElement => {
  // 🍎 SSR renders "Ctrl" / "Control+K"; hydration then reads the platform (useSyncExternalStore inside: no mismatch)
  const { apple, ariaKeyShortcuts } = useAbHotkeyLabel(AB_HOTKEY_SEARCH);
  // ⌨️ 0.8.0 (D49): does THIS trigger register the listener? (needs something to open; never while coming soon)
  const listen = !comingSoon && !!onOpen && (hotkey ?? true);
  // 👀 0.8.0 (D49): does it SHOW the cap? Defaults to "only while I listen" (#3, D24a); `shortcut` forces it either way
  const showCap = !comingSoon && (shortcut ?? listen);
  // 👂 the listener itself: hooks' useAbHotkey ('mod+k' = ⌘K on Apple, Ctrl+K elsewhere). `mod+k` fires in
  //    inputs by default (hooks 0.1.9: a combo with a modifier does; a bare key does not), so this keeps the
  //    0.7.1 behaviour (it fired from anywhere). A second binding of the same combo skips the handled event (no double-open)
  useAbHotkey(AB_HOTKEY_SEARCH, () => onOpen?.(), { enabled: listen });

  // 🏠 P6: the Home looks (field / sm pill) show ONE key cap ("⌘ K" / "⌘K") and keep "coming soon" out of the field
  const home = variant === 'field' || size === 'sm' || size === 'lg'; // 🔍 404 gaps: lg is a (bigger) Home field
  // ⌨️ mock: "⌘ K" (field) · "⌘K" (sm). The gap is its own span so a compact app bar can drop it (0.1.15)
  const keyCap = <>{apple ? '⌘' : 'Ctrl'}{size === 'sm' ? null : <span data-ab-part="key-gap"> </span>}K</>;
  // 🧩 inner content
  const inner = home ? (
    <>
      <AbIcon name="search" size={size === 'sm' ? 17 : size === 'lg' ? 20 : 18 /* 🔍 lg: 20px glyph (mock) */} className={styles.abSearchTriggerIcon} />
      <span className={styles.abSearchTriggerLabel} data-ab-part="search-label">{label}</span>
      {compactLabel != null && <span className={clsx(styles.abSearchTriggerLabel, styles.abSearchTriggerShort)} data-ab-part="search-label-compact">{compactLabel}</span> /* 📱 0.1.15 */}
      {/* 🚧 coming soon: tooltip + announced, never painted inside the field (spec §4) */}
      {comingSoon ? <span className={styles.abSearchTriggerSrOnly}>, {comingSoonLabel}</span> : showCap && <AbKbd className={styles.abSearchTriggerCap}>{keyCap}</AbKbd> /* 👀 0.8.0: shortcut, not hotkey */}
    </>
  ) : (
    <>
      <AbIcon name="search" size={20} className={styles.abSearchTriggerIcon} />
      <span className={clsx(styles.abSearchTriggerLabel, compact && styles.abSearchTriggerSrOnly)}>{label}</span>
      {/* 🚧 coming soon tag, or ⌨️ the key hint while the shortcut is real (#3, D24a; 0.8.0: `shortcut` / a listening `hotkey`) */}
      {comingSoon
        ? !compact && <span className={styles.abSearchTriggerSoon}>{comingSoonLabel}</span>
        : showCap && !compact && <AbKbd keys={[apple ? '⌘' : 'Ctrl', 'K']} className={styles.abSearchTriggerKbd} />}
    </>
  );
  const common = {
    className: clsx('AbSearchTrigger', styles.abSearchTrigger, !comingSoon && 'ab-motion-interactive', className), // 🏷️
    'data-ab-part': 'search-trigger', // 🧩
    'aria-keyshortcuts': showCap ? ariaKeyShortcuts : undefined, // ♿ only announced when real (#3); 0.8.0: the platform's own pair
    'data-compact': compact ? 'true' : undefined, // 📱
    'data-variant': variant === 'field' ? 'field' : undefined, // 🔎 P6
    'data-size': size === 'sm' || size === 'lg' ? size : undefined, // 📱 P6 · 🔍 404 gaps: lg
    title: home && comingSoon ? comingSoonLabel : undefined, // 💬 P6: "coming soon" lives in the tooltip
  };

  // 🚧 coming soon: focusable, announced, inert
  if (comingSoon) return <button type="button" {...common} aria-disabled="true" data-coming-soon="true">{inner}</button>;
  // 🔗 href → ALWAYS a real link, so it works with JS off (D24a: /docs). With onOpen too, JS intercepts
  //    the click and opens the dialog instead (#4); modified clicks (new tab, …) keep the link.
  if (href) {
    const onClick = onOpen
      ? (e: MouseEvent<HTMLAnchorElement>) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // 🖱️ let the browser handle it
          e.preventDefault(); // 🚫 navigation
          onOpen(); // 🔔
        }
      : undefined;
    return <Link href={href} {...common} onClick={onClick} aria-haspopup={onOpen ? 'dialog' : undefined}>{inner}</Link>;
  }
  // 🔘 dialog opener
  return <button type="button" {...common} aria-haspopup="dialog" onClick={onOpen}>{inner}</button>;
};

// 📦 exports
export default AbSearchTrigger;
export { AbSearchTrigger };
