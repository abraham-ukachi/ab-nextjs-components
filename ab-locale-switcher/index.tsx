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
* @name: AbLocaleSwitcher - Client (G7)
* @file: ab-locale-switcher/index.tsx
* @type: Component (client) — globe menu button (APG menu + menuitemradio)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const { switchLocale } = useAbLocaleSwitch() // 🌍 from ab-nextjs-i18n/navigation
*    -|> <AbLocaleSwitcher label={t('language')} current={locale} locales={[{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }]} onSelect={switchLocale} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔣 globe glyph
import AbIcon from '../ab-icon';
// 🎨 styles
import styles from './styles.module.css';

// 🌍 one locale option
export interface AbLocaleOption {
  code: string; // 🏷️ BCP 47, e.g. 'fr'
  label: string; // 🗣️ endonym, e.g. 'Français' (shown in its own language)
}

// ⚙️ props
export interface AbLocaleSwitcherProps {
  locales: readonly AbLocaleOption[]; // 🌍 choices
  current: string; // ✅ active locale code
  label: string; // 🏷️ trigger name, e.g. "Language"
  onSelect?: (code: string) => void; // 📣 button items (e.g. useAbLocaleSwitch().switchLocale)
  getHref?: (code: string) => string; // 🔗 link items instead (real navigation, hreflang)
  variant?: 'icon' | 'menu'; // 🎨 'icon' = globe only; 'menu' = globe + current endonym
  align?: 'start' | 'end'; // ↔️ menu alignment under the trigger
  icon?: ReactNode; // 🖼️ override the globe
  className?: string; // 🏷️
  style?: CSSProperties; // 🎨
}

/**
 * @name getAbTypeaheadIndex
 * @description 🔤 Index of the next option whose label starts with `char` (wraps), else -1.
 */
export function getAbTypeaheadIndex(labels: readonly string[], from: number, char: string): number {
  const c = char.toLocaleLowerCase(); // 🔡
  for (let step = 1; step <= labels.length; step++) {
    const i = (from + step) % labels.length; // 🔁
    if (labels[i].toLocaleLowerCase().startsWith(c)) return i; // ✅
  }
  return -1; // 🙅
}

export function AbLocaleSwitcher(props: AbLocaleSwitcherProps) {
  // 🧩 props
  const { locales, current, label, onSelect, getHref, variant = 'icon', align = 'end', icon, className, style } = props;
  // 🚪 open?
  const [open, setOpen] = useState(false);
  // 🆔 ids
  const base = useId();
  // 📍 refs
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  // 🏷️ current option
  const active = locales.find((l) => l.code === current);
  const activeIndex = Math.max(0, locales.findIndex((l) => l.code === current));

  // 🎯 focus an item
  const focusItem = (i: number) => itemRefs.current[i]?.focus();
  // 🚪 close and return focus to the trigger
  const close = useCallback((returnFocus = true) => {
    setOpen(false); // 🚪
    if (returnFocus) triggerRef.current?.focus(); // 🎯
  }, []);

  // 🎯 on open, focus the checked item (after paint)
  useEffect(() => {
    if (!open) return; // 💤
    const id = requestAnimationFrame(() => focusItem(activeIndex)); // ⏭️
    return () => cancelAnimationFrame(id); // 🧹
  }, [open, activeIndex]);

  // 🖱️ click outside closes (no focus steal)
  useEffect(() => {
    if (!open) return; // 💤
    const onDown = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) close(false); }; // 🚪
    document.addEventListener('pointerdown', onDown); // 👂
    return () => document.removeEventListener('pointerdown', onDown); // 🧹
  }, [open, close]);

  // ⌨️ trigger: ArrowDown/Up/Enter/Space open the menu
  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); } // ⬇️
  };

  // ⌨️ menu keys
  const onMenuKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const i = itemRefs.current.findIndex((el) => el === document.activeElement); // 📍
    const n = locales.length; // 🔢
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem((i + 1) % n); } // ⬇️
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem((i - 1 + n) % n); } // ⬆️
    else if (e.key === 'Home') { e.preventDefault(); focusItem(0); } // ⏮️
    else if (e.key === 'End') { e.preventDefault(); focusItem(n - 1); } // ⏭️
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } // 🚪
    else if (e.key === 'Tab') { close(false); } // ⇥ let Tab move on
    else if (e.key.length === 1 && /\S/.test(e.key)) { // 🔤 typeahead
      const j = getAbTypeaheadIndex(locales.map((l) => l.label), Math.max(i, 0), e.key);
      if (j >= 0) focusItem(j);
    }
  };

  // ✅ choose
  const choose = (code: string) => {
    onSelect?.(code); // 📣
    close(); // 🚪
  };

  return (
    <div ref={rootRef} className={clsx('AbLocaleSwitcher', styles.root, className)} style={style} data-ab-part="locale-switcher" data-align={align}>
      {/* 🌐 trigger */}
      <button
        ref={triggerRef} // 📍
        id={`${base}-trigger`} // 🆔
        type="button" // 🧾
        className={clsx(styles.trigger, variant === 'menu' && styles.withText)} // 🎨
        aria-haspopup="menu" // ♿
        aria-expanded={open} // ♿
        aria-controls={`${base}-menu`} // 🔗
        aria-label={variant === 'icon' ? `${label}: ${active?.label ?? current}` : undefined} // 🏷️ "Language: Français"
        title={label} // 💬
        onClick={() => setOpen((o) => !o)} // 🖱️
        onKeyDown={onTriggerKey} // ⌨️
      >
        <span aria-hidden="true">{icon ?? <AbIcon name="language" size={20} />}</span>
        {variant === 'menu' ? <span lang={current}>{active?.label ?? current}</span> : null /* 🗣️ endonym */}
      </button>
      {/* 📜 menu */}
      <ul
        id={`${base}-menu`} // 🆔
        role="menu" // ♿
        aria-labelledby={`${base}-trigger`} // 🔗
        hidden={!open} // 🙈
        className={styles.menu} // 🎨
        onKeyDown={onMenuKey} // ⌨️
      >
        {locales.map((l, i) => {
          const checked = l.code === current; // ✅
          const common = {
            ref: (el: HTMLElement | null) => { itemRefs.current[i] = el; }, // 📍
            role: 'menuitemradio' as const, // ♿
            'aria-checked': checked, // ✅
            tabIndex: -1, // ⌨️ focus managed by arrows
            lang: l.code, // 🗣️ pronounced in its own language
            className: styles.item, // 🎨
          };
          return (
            <li key={l.code} role="none">
              {getHref ? (
                // 🔗 real navigation (works with middle-click, crawlers see hreflang)
                <a {...common} href={getHref(l.code)} hrefLang={l.code} onClick={() => choose(l.code)}>
                  <span className={styles.check} aria-hidden="true">{checked ? '✓' : ''}</span>{l.label}
                </a>
              ) : (
                // 🔘 callback item
                <button {...common} type="button" onClick={() => choose(l.code)}>
                  <span className={styles.check} aria-hidden="true">{checked ? '✓' : ''}</span>{l.label}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// 📦 default export
export default AbLocaleSwitcher;
