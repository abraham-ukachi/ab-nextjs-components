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
* @name: AbSettingsDrawer
* @file: ab-settings-drawer/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const [open, setOpen] = useState(false)
*    -|> <AbSettingsDrawer open={open} onClose={() => setOpen(false)} theme={mode} onThemeChange={setMode}
*    -|>   locales={[{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }]} locale="en" onLocaleChange={go} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import { useRef, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗄️ the drawer (tiers, snap points, centring)
import AbDrawer, { type AbSheetSnap } from '../ab-drawer';
// 🔣 icons
import AbIcon from '../ab-icon';
// 👤 0.2.1: the account row's avatar
import AbProfileAvatar, { type AbProfileUser } from '../ab-profile-avatar';
// 🎨 the drawers v2 kit
import kit from '../ab-drawer/kit.module.css';

/** 🌗 a theme choice */
export type AbSettingsTheme = 'light' | 'dark' | 'system';
/** 🌍 a language row */
export interface AbSettingsLocale { code: string; label: string } // 🏷️ `label` in its own language ("Français")

/** 🏷️ every visible / accessible string (English defaults) */
export interface AbSettingsDrawerLabels {
  title?: string; // "Settings"
  theme?: string; // "Theme"
  language?: string; // "Language"
  light?: string; dark?: string; system?: string; // 🌗
  close?: string; // "Close settings"
  expand?: string; collapse?: string; // ➖ the handle: "Expand settings" / "Collapse settings"
  account?: string; // 👤 0.2.1: the section label "Account"
  signIn?: string; // 🔑 0.2.1: the signed-out row "Sign in"
  help?: string; about?: string; // ❓ ℹ️ 0.2.1: "Help" / "About"
}

/** ⚙️ props */
export interface AbSettingsDrawerProps {
  open: boolean; // 🚪
  onClose: () => void; // ⎋
  theme: AbSettingsTheme; // 🌗 the checked theme
  onThemeChange: (theme: AbSettingsTheme) => void; // 📣
  locales: readonly AbSettingsLocale[]; // 🌍
  locale: string; // 🎯 the checked locale code
  onLocaleChange: (code: string) => void; // 📣
  labels?: AbSettingsDrawerLabels; // 🏷️
  themes?: readonly AbSettingsTheme[]; // 🎚️ default light, dark, system
  // 👤 0.2.1 (God 02:44): the account section is back, on top. `account` = signed in (avatar, name, email);
  //    signed out, pass `onSignIn` for a "Sign in" row. Neither = no section.
  account?: AbProfileUser | null;
  onAccount?: () => void; // 👤 tap the signed-in row (e.g. open the profile page)
  onSignIn?: () => void; // 🔑
  onHelp?: () => void; // ❓ 0.2.1: a "Help ›" row after Language
  onAbout?: () => void; // ℹ️ 0.2.1: an "About ›" row after Help
  children?: ReactNode; // ➕ extra sections after Language (your own; Accessibility / About are not built in)
  defaultSnap?: AbSheetSnap; // 🧲 default 'partial' (70%)
  returnFocus?: string; // ↩️ see AbDrawer
  id?: string; // 🆔
  className?: string; // 🏷️
}

// ✓ the 24px 2px-stroke check (the mock's path)
const Check = () => <svg className={kit.ck} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// 🌗 the glyph per theme
const THEME_ICON: Record<AbSettingsTheme, string> = { light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' };

/** ⌨️ radiogroup keys: arrows move AND check (WAI-ARIA radio pattern), Home / End jump */
function radioKeys<T>(e: KeyboardEvent, items: readonly T[], current: T, pick: (v: T) => void, root: HTMLElement | null) {
  const i = items.indexOf(current); let n = -1;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % items.length;
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + items.length) % items.length;
  else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = items.length - 1;
  if (n < 0) return;
  e.preventDefault(); pick(items[n]); // ✅ check it
  root?.querySelectorAll<HTMLElement>('[role="radio"]')[n]?.focus(); // 🎯 and move focus
}

/**
 * ⚙️ AbSettingsDrawer — John's Settings bottom drawer (drawers v2, spec §1): the default bottom sheet, holding
 * ACCOUNT (0.2.1, optional), THEME (a Light / Dark / System segmented radiogroup, 48px) and LANGUAGE (48px radio rows, each label in its
 * own `lang`, the checked one tinted with a check), then optional Help / About rows (0.2.1).
 *
 * - 📱 below 768px: full width, snaps at 70% and full height via the handle (AbDrawer `snapPoints`)
 * - 💻 768px and up: centred in the main pane, min(640px, main width), at most 70% tall
 * - ♿ `role="dialog"` labelled by the title; focus goes to the checked language on open (so the globe's
 *   "Change language" lands right there) and back to the opener on close; Esc / scrim / ✕ close it
 * - 🥞 tier 'sheet': above the left and right drawers. Opening it from the left drawer? Close that one first.
 */
const AbSettingsDrawer = ({ open, onClose, theme, onThemeChange, locales, locale, onLocaleChange, labels = {}, account, onAccount, onSignIn, onHelp, onAbout, themes = ['light', 'dark', 'system'], children, defaultSnap, returnFocus, id, className }: AbSettingsDrawerProps): ReactElement => {
  const seg = useRef<HTMLDivElement>(null); // 🎚️
  const langs = useRef<HTMLDivElement>(null); // 🌍
  const L = { title: 'Settings', theme: 'Theme', language: 'Language', light: 'Light', dark: 'Dark', system: 'System', close: 'Close settings', expand: 'Expand settings', collapse: 'Collapse settings', account: 'Account', signIn: 'Sign in', help: 'Help', about: 'About', ...labels }; // 🏷️
  const base = id ?? 'ab-settings'; // 🆔
  const codes = locales.map((l) => l.code); // 🌍
  return (
    <AbDrawer
      open={open} onClose={onClose} id={id} side="bottom" scope="app" tier="sheet"
      snapPoints centerIn="main" defaultSnap={defaultSnap} handleLabels={{ expand: L.expand, collapse: L.collapse }}
      title={L.title} closeLabel={L.close} closeIcon={<AbIcon name="close" size={24} />}
      initialFocus='[data-ab-part="settings-language"] [aria-checked="true"]' returnFocus={returnFocus}
      className={clsx('AbSettingsDrawer', kit.sheet, className)}
    >
      {/* 👤 0.2.1: ACCOUNT (signed in: avatar · name · email; signed out: "Sign in") */}
      {(account || onSignIn) && (
        <section aria-labelledby={`${base}-account`} data-ab-part="settings-account">
          <p className={kit.lbl} id={`${base}-account`}>{L.account}</p>
          {account ? (
            onAccount ? ( // 👆 tappable: a button with a chevron
              <button type="button" className={clsx(kit.row, kit.acct)} onClick={onAccount} data-ab-part="settings-account-row">
                <AbProfileAvatar user={account} size={36} Icon={AbIcon} />
                <span className={kit.acctText}><b>{account.name}</b>{account.email && <small>{account.email}</small>}</span>
                <AbIcon name="chevron_right" size={24} className={kit.chev} />
              </button>
            ) : ( // 🪧 info only: plain row, not a dead button
              <div className={clsx(kit.row, kit.acct)} data-ab-part="settings-account-row">
                <AbProfileAvatar user={account} size={36} Icon={AbIcon} />
                <span className={kit.acctText}><b>{account.name}</b>{account.email && <small>{account.email}</small>}</span>
              </div>
            )
          ) : (
            <button type="button" className={clsx(kit.row, kit.acct)} onClick={onSignIn} data-ab-part="settings-sign-in">
              <AbProfileAvatar size={36} Icon={AbIcon} /><span>{L.signIn}</span><AbIcon name="chevron_right" size={24} className={kit.chev} />
            </button>
          )}
        </section>
      )}
      <p className={kit.lbl} id={`${base}-theme`}>{L.theme}</p>
      <div ref={seg} className={kit.seg} role="radiogroup" aria-labelledby={`${base}-theme`} data-ab-part="settings-theme">
        {themes.map((t) => (
          <button key={t} type="button" role="radio" aria-checked={t === theme} tabIndex={t === theme ? 0 : -1} className={kit.segBtn} data-value={t}
            onClick={() => onThemeChange(t)} onKeyDown={(e) => radioKeys(e, themes, theme, onThemeChange, seg.current)}>
            <AbIcon name={THEME_ICON[t]} size={18} />{L[t]}
          </button>
        ))}
      </div>
      <p className={kit.lbl} id={`${base}-language`}>{L.language}</p>
      <div ref={langs} role="radiogroup" aria-labelledby={`${base}-language`} data-ab-part="settings-language">
        {locales.map((l) => {
          const on = l.code === locale; // 🎯
          return (
            <button key={l.code} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} lang={l.code} className={kit.row} data-value={l.code}
              onClick={() => onLocaleChange(l.code)} onKeyDown={(e) => radioKeys(e, codes, locale, onLocaleChange, langs.current)}>
              {l.label}{on && <Check />}
            </button>
          );
        })}
      </div>
      {/* ❓ ℹ️ 0.2.1: Help and About rows (back from 0.1.x), after Language */}
      {(onHelp || onAbout) && (
        <div className={kit.more} data-ab-part="settings-more">
          {onHelp && <button type="button" className={kit.row} onClick={onHelp} data-ab-part="settings-help"><AbIcon name="help" size={24} /><span>{L.help}</span><AbIcon name="chevron_right" size={24} className={kit.chev} /></button>}
          {onAbout && <button type="button" className={kit.row} onClick={onAbout} data-ab-part="settings-about"><AbIcon name="info" size={24} /><span>{L.about}</span><AbIcon name="chevron_right" size={24} className={kit.chev} /></button>}
        </div>
      )}
      {children}
    </AbDrawer>
  );
};

// 📦 exports
export default AbSettingsDrawer;
export { AbSettingsDrawer };
