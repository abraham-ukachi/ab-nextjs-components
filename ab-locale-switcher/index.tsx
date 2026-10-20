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
*
*   🧩 0.1.15 inline, inside the mobile app drawer (John):
*   2+|> // a) mixed drawer: nav + theme first, LANGUAGE last under a 1px rule
*    -|> <AbBottomDrawer open={open} onClose={close} title={t('menu')}>
*    -|>   <AbDrawerList … />{themeRow}
*    -|>   <AbLocaleSwitcher presentation="inline" divider label={t('language')} current={locale} locales={LOCALES} onSelect={switchLocale} />
*    -|> </AbBottomDrawer>
*   🔁 Switching `presentation` at runtime (e.g. inline in the drawer, menu on desktop) is safe: inline and popover
*      are separate components, so React remounts instead of reordering hooks. `AbLocaleSwitcherInline` is also exported.
*   3+|> // b) language only: the drawer title says it, so no uppercase label
*    -|> <AbBottomDrawer open={open} onClose={close} title={t('language')}>
*    -|>   <AbLocaleSwitcher presentation="inline" showLabel={false} label={t('language')} current={locale} locales={LOCALES} onSelect={switchLocale} />
*    -|> </AbBottomDrawer>
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
// 🗄️ 0.1.14 (G56): drawer presentation
import AbDrawerList from '../ab-drawer-list';
import AbBottomDrawer from '../ab-bottom-drawer';
import type { AbDrawerScope } from '../ab-drawer';
// 🎨 styles
import styles from './styles.module.css';

// 🌍 one locale option
export interface AbLocaleOption {
  code: string; // 🏷️ BCP 47, e.g. 'fr'
  label: string; // 🗣️ endonym, e.g. 'Français' (shown in its own language)
}

// ⚙️ props
/** 🗄️ how a picker opens (G56): popover menu, drawer, or drawer on mobile only */
export type AbPresentation = 'menu' | 'drawer' | 'auto';
/** 📱 resolve `auto` at open time (no hydration flip: the server always renders the closed trigger) */
export const resolveAbPresentation = (p: AbPresentation = 'menu'): 'menu' | 'drawer' =>
  p === 'auto' ? (typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767.98px)').matches ? 'drawer' : 'menu') : p;

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
  /** 🗄️ 0.1.14 (G56, D40): `menu` (default) = popover menu; `drawer` = AbDrawerList; `auto` = drawer below 768px, menu above.
   *  🧩 0.1.15 (God 00:08): `inline` = no trigger; a labelled list of rows rendered in place, e.g. inside the app drawer on mobile */
  presentation?: AbPresentation | 'inline';
  /** 🏷️ 0.1.15 (John): inline only. Show the small uppercase group label (default true). Set false when the language
   *  list is the drawer's only content and the drawer title already says "Language" (the label stays the group's name) */
  showLabel?: boolean;
  /** ➖ 0.1.15 (John): inline only. A 1px --div rule above the block, for when it follows nav / theme items (default false) */
  divider?: boolean;
  drawerScope?: AbDrawerScope; // 🗺️ default 'app'
  drawerSide?: 'top' | 'bottom' | 'start' | 'end'; // 🧭 default 'bottom'
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

/**
 * 🧩 0.1.15: the inline list (no trigger, no popover), e.g. inside the mobile app drawer.
 * Its own component (James): AbLocaleSwitcher picks this OR the popover by type, so switching `presentation`
 * at runtime remounts instead of changing the hook order. Links mark the active row with aria-current, buttons aria-pressed.
 */
export function AbLocaleSwitcherInline(props: AbLocaleSwitcherProps) {
  const { locales, current, label, onSelect, getHref, className, style, showLabel = true, divider = false } = props;
  const base = useId(); // 🆔
  return (
    <div className={clsx('AbLocaleSwitcher', styles.inline, className)} style={style} data-ab-part="locale-switcher" data-presentation="inline" data-divider={divider ? 'true' : undefined} role="group" aria-labelledby={showLabel ? `${base}-label` : undefined} aria-label={showLabel ? undefined : label}>
      {showLabel && <div id={`${base}-label`} className={styles.inlineLabel}>{label}</div> /* 🏷️ hidden when the drawer title says it */}
      <ul className={styles.inlineList}>
        {locales.map((l) => {
          const on = l.code === current; // ✅
          const inner = (<><span className={styles.inlineText}>{l.label}</span><span className={styles.inlineCheck} aria-hidden="true">{on ? <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-ab-part="locale-check"><path d="M3.5 9.5 7.25 13 14.5 5.5" /></svg> : null}</span></>);
          return (
            <li key={l.code}>
              {getHref ? (
                <a className={styles.inlineItem} href={getHref(l.code)} hrefLang={l.code} lang={l.code} data-active={on ? 'true' : 'false'} aria-current={on ? 'true' : undefined} onClick={() => onSelect?.(l.code)}>{inner}</a>
              ) : (
                <button type="button" className={styles.inlineItem} lang={l.code} data-active={on ? 'true' : 'false'} aria-pressed={on} onClick={() => onSelect?.(l.code)}>{inner}</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * 🌍 AbLocaleSwitcher: `presentation="inline"` renders AbLocaleSwitcherInline, anything else the popover / drawer.
 * 🔁 Two component types, so a runtime `presentation` change remounts cleanly (rules of hooks).
 */
export function AbLocaleSwitcher(props: AbLocaleSwitcherProps) {
  return props.presentation === 'inline' ? <AbLocaleSwitcherInline {...props} /> : <AbLocaleSwitcherPopover {...props} />;
}

function AbLocaleSwitcherPopover(props: AbLocaleSwitcherProps) {
  // 🧩 props
  const { locales, current, label, onSelect, getHref, variant = 'icon', align = 'end', icon, className, style, presentation: rawPresentation = 'menu', drawerScope = 'app', drawerSide = 'bottom' } = props;
  const presentation: AbPresentation = rawPresentation === 'inline' ? 'menu' : rawPresentation; // 🗄️ (never 'inline' here: see the dispatcher)
  // 🗄️ how this open happens (decided on click)
  const [mode, setMode] = useState<'menu' | 'drawer'>(presentation === 'drawer' ? 'drawer' : 'menu');
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
    if (!open || mode !== 'menu') return; // 💤 (the drawer manages its own focus)
    const id = requestAnimationFrame(() => focusItem(activeIndex)); // ⏭️
    return () => cancelAnimationFrame(id); // 🧹
  }, [open, mode, activeIndex]);

  // 🖱️ click outside closes (no focus steal)
  useEffect(() => {
    if (!open || mode !== 'menu') return; // 💤 (the drawer portals outside rootRef: it has its own scrim)
    const onDown = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) close(false); }; // 🚪
    document.addEventListener('pointerdown', onDown); // 👂
    return () => document.removeEventListener('pointerdown', onDown); // 🧹
  }, [open, mode, close]);

  // ⌨️ trigger: ArrowDown/Up/Enter/Space open the menu
  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setMode(resolveAbPresentation(presentation)); setOpen(true); } // ⬇️
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
        aria-haspopup={mode === 'drawer' ? 'dialog' : 'menu'} // ♿
        aria-expanded={open} // ♿
        aria-controls={mode === 'drawer' ? `${base}-drawer` : `${base}-menu`} // 🔗
        aria-label={variant === 'icon' ? `${label}: ${active?.label ?? current}` : undefined} // 🏷️ "Language: Français"
        title={label} // 💬
        onClick={() => { if (!open) setMode(resolveAbPresentation(presentation)); setOpen((o) => !o); }} // 🖱️ (`auto` picks menu / drawer now)
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
        hidden={!open || mode !== 'menu'} // 🙈
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
      {/* 🗄️ 0.1.14 (G56): drawer presentation. No in-flow fallback here: the <details> below already is one */}
      {presentation !== 'menu' ? (
        <AbDrawerList
          id={`${base}-drawer`}
          open={open && mode === 'drawer'}
          onClose={() => setOpen(false)} // 🚪 the drawer puts focus back on the trigger
          scope={drawerScope}
          side={drawerSide}
          as={drawerSide === 'bottom' ? AbBottomDrawer : undefined} // 📱 the mobile bottom drawer look
          title={label}
          noJsFallback={false}
          value={current}
          items={locales.map((l) => ({ value: l.code, label: l.label, lang: l.code, href: getHref?.(l.code) }))}
          onSelect={(code) => onSelect?.(code)}
        />
      ) : null}
      {/* 🚫 JS off (0.1.13, gap-review): a native <details> list of hreflang links replaces the menu.
          Only rendered with getHref (a callback can't run without JS). CSS shows it under (scripting: none). */}
      {getHref ? (
        <details className={styles.noJs} data-ab-part="locale-switcher-nojs">
          <summary className={styles.trigger} aria-label={`${label}: ${active?.label ?? current}`}>
            <span aria-hidden="true">{icon ?? <AbIcon name="language" size={20} />}</span>
            <span lang={current}>{active?.label ?? current}</span>
          </summary>
          <ul className={styles.noJsList}>
            {locales.map((l) => (
              <li key={l.code}>
                <a href={getHref(l.code)} hrefLang={l.code} lang={l.code} aria-current={l.code === current ? 'true' : undefined} className={styles.item}>{l.label}</a>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

// 📦 default export
export default AbLocaleSwitcher;
