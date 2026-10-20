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
import { useEffect, useSyncExternalStore, type MouseEvent, type ReactElement } from 'react';
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
  shortcut?: boolean; // ⌨️ alias of `hotkey` (Joseph's spec name); `hotkey` wins when both are set
  compact?: boolean; // 📱 icon-only pill (the label stays for screen readers), e.g. the mobile app bar
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
const AbSearchTrigger = ({ label = 'Search', onOpen, href, hotkey, shortcut, compact = false, comingSoon = false, comingSoonLabel = 'Coming soon', className }: AbSearchTriggerProps): ReactElement => {
  // 🍎 SSR renders "Ctrl"; hydration then reads the platform (useSyncExternalStore: no mismatch, no effect)
  const apple = useSyncExternalStore(
    noopSubscribe, // 🔕 the platform never changes
    () => isAbApplePlatform(navigator as Navigator & { userAgentData?: { platform?: string } }), // 🖥️ client
    () => false, // 🖨️ server
  );
  // ⌨️ ⌘K / Ctrl+K
  const listen = !comingSoon && !!onOpen && (hotkey ?? shortcut ?? true);
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
      <span className={clsx(styles.abSearchTriggerLabel, compact && styles.abSearchTriggerSrOnly)}>{label}</span>
      {/* 🚧 coming soon tag, or ⌨️ the key hint ONLY while a hotkey is really listening (James #3, D24a) */}
      {comingSoon
        ? !compact && <span className={styles.abSearchTriggerSoon}>{comingSoonLabel}</span>
        : listen && !compact && <AbKbd keys={[apple ? '⌘' : 'Ctrl', 'K']} className={styles.abSearchTriggerKbd} />}
    </>
  );
  const common = {
    className: clsx('AbSearchTrigger', styles.abSearchTrigger, !comingSoon && 'ab-motion-interactive', className), // 🏷️
    'data-ab-part': 'search-trigger', // 🧩
    'aria-keyshortcuts': listen ? 'Meta+K Control+K' : undefined, // ♿ only announced when bound (James #3)
    'data-compact': compact ? 'true' : undefined, // 📱
  };

  // 🚧 coming soon: focusable, announced, inert
  if (comingSoon) return <button type="button" {...common} aria-disabled="true" data-coming-soon="true">{inner}</button>;
  // 🔗 href → ALWAYS a real link, so it works with JS off (D24a: /docs). With onOpen too, JS intercepts
  //    the click and opens the dialog instead (James #4); modified clicks (new tab, …) keep the link.
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
