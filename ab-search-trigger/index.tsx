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
* @name: AbSearchTrigger (G44)
* @file: ab-search-trigger/index.tsx
* @type: Client Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbSearchTrigger label="Search docs" onOpen={() => setOpen(true)} href="/search" />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { useEffect, useSyncExternalStore, type ReactElement } from 'react';
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
  hotkey?: boolean; // ⌨️ listen for ⌘K / Ctrl+K (default true when onOpen is set)
  comingSoon?: boolean; // 🚧 visible but inert: aria-disabled, no hotkey
  comingSoonLabel?: string; // 🏷️ default "Coming soon"
  className?: string; // 🏷️
}

// 🔕 nothing to subscribe to
const noopSubscribe = () => () => {};

/** 🍎 Apple platforms show ⌘, everyone else Ctrl. */
export function isAbApplePlatform(nav?: { platform?: string; userAgent?: string; userAgentData?: { platform?: string } }): boolean {
  const p = nav?.userAgentData?.platform ?? nav?.platform ?? nav?.userAgent ?? ''; // 🔍
  return /mac|iphone|ipad|ipod/i.test(p); // 🍎
}

/**
 * 🔎 AbSearchTrigger (G44): a search "field" that opens your dialog. Shows ⌘K on Apple, Ctrl K elsewhere,
 * announces `aria-keyshortcuts="Meta+K Control+K"`, and falls back to a link when there's no `onOpen`.
 * Note: the hotkey is a local listener; G48 `useAbHotkey` is deliberately not in hooks 0.1.7.
 */
const AbSearchTrigger = ({ label = 'Search', onOpen, href, hotkey, comingSoon = false, comingSoonLabel = 'Coming soon', className }: AbSearchTriggerProps): ReactElement => {
  // 🍎 SSR renders "Ctrl"; hydration then reads the platform (useSyncExternalStore: no mismatch, no effect)
  const apple = useSyncExternalStore(
    noopSubscribe, // 🔕 the platform never changes
    () => isAbApplePlatform(navigator as Navigator & { userAgentData?: { platform?: string } }), // 🖥️ client
    () => false, // 🖨️ server
  );
  // ⌨️ ⌘K / Ctrl+K
  const listen = !comingSoon && !!onOpen && (hotkey ?? true);
  useEffect(() => {
    if (!listen) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); // 🚫 browser search bar
        onOpen?.(); // 🔔
      }
    };
    window.addEventListener('keydown', onKey); // 👂
    return () => window.removeEventListener('keydown', onKey); // 🧹
  }, [listen, onOpen]);

  // 🧩 inner content
  const inner = (
    <>
      <AbIcon name="search" size={20} className={styles.abSearchTriggerIcon} />
      <span className={styles.abSearchTriggerLabel}>{label}</span>
      {comingSoon
        ? <span className={styles.abSearchTriggerSoon}>{comingSoonLabel}</span>
        : <AbKbd keys={[apple ? '⌘' : 'Ctrl', 'K']} className={styles.abSearchTriggerKbd} />}
    </>
  );
  const common = {
    className: clsx('AbSearchTrigger', styles.abSearchTrigger, !comingSoon && 'ab-motion-interactive', className), // 🏷️
    'data-ab-part': 'search-trigger', // 🧩
    'aria-keyshortcuts': comingSoon ? undefined : 'Meta+K Control+K', // ♿
  };

  // 🚧 coming soon: focusable, announced, inert
  if (comingSoon) return <button type="button" {...common} aria-disabled="true" data-coming-soon="true">{inner}</button>;
  // 🔗 no handler → link (works without JS)
  if (!onOpen && href) return <Link href={href} {...common}>{inner}</Link>;
  // 🔘 dialog opener
  return <button type="button" {...common} aria-haspopup="dialog" onClick={onOpen}>{inner}</button>;
};

// 📦 exports
export default AbSearchTrigger;
export { AbSearchTrigger };
