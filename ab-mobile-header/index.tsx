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
* @name: AbMobileHeader
* @file: ab-mobile-header/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbAppLayout variant="panes" mobileHeader="main" content={<AbMainLayout
*    -|>   mainHeader={<AbMobileHeader logo={<a href="/" id="home-logo">…</a>} onLanguage={openLanguage}
*    -|>     theme={mode} onThemeChange={setMode} />} … />} />
*   0.2.3 (Joseph, Welcome 0.2.21): a counter row under the bar + the 3-state theme cycle
*   2+|> <AbMobileHeader logo={logo} themeMode={mode} onThemeModeChange={setMode}
*    -|>   row={<AbCarouselCounter />} />
*
* 📌 Requires ab-nextjs-core ≥ 0.2.1 with `mobileHeader="main"` on AbAppLayout. That hides the app header below
*    768px and turns the main header slot into this 56px bar; older core shows it inside the normal main header.
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
// 🔣 icons
import AbIcon from '../ab-icon';
// 🎨 the drawers v2 kit
import kit from '../ab-drawer/kit.module.css';

/** 🌗 0.2.3: the three theme modes (same names as ab-nextjs-hooks' AbThemeMode) */
export type AbMobileHeaderThemeMode = 'light' | 'dark' | 'system';
/** 🔁 0.2.3: the 3-state cycle order */
export const AB_MOBILE_HEADER_THEME_CYCLE: readonly AbMobileHeaderThemeMode[] = ['light', 'dark', 'system'];
// 🔣 the glyph of each mode
const THEME_ICON: Record<AbMobileHeaderThemeMode, string> = { light: 'light_mode', dark: 'dark_mode', system: 'computer' };

/** ⚙️ props */
export interface AbMobileHeaderProps {
  logo: ReactNode; // 🏷️ the logoname (22px), usually a link home: the focus target after a swipe-opened drawer closes
  onLanguage?: () => void; // 🌍 the globe: open the Settings sheet with the language list in view
  theme?: 'light' | 'dark'; // 🌗 the resolved theme now
  onThemeChange?: (next: 'light' | 'dark') => void; // 🌗 the toggle (it shows the mode it switches TO: a moon in light)
  actions?: ReactNode; // ➕ more 44px buttons after the two (none in John's frame)
  labels?: { language?: string; toDark?: string; toLight?: string; toSystem?: string; header?: string }; // 🌍 "Change language", "Switch to dark theme", "Switch to light theme", (0.2.3) "Use the system theme", "Main header"
  languageExpanded?: boolean; // ♿ aria-expanded on the globe while its sheet is open
  // 🌗 0.2.3: the 3-state theme (light → dark → system → light). When `onThemeModeChange` is set it replaces the
  //    2-state toggle; the button shows (and names) the mode a tap switches TO, like the 2-state one
  themeMode?: AbMobileHeaderThemeMode;
  onThemeModeChange?: (next: AbMobileHeaderThemeMode) => void;
  // ➕ 0.2.3: extra content shared with the main header, as a second row under the bar (e.g. Welcome's counter
  //    row). Core ≥ 0.2.3 lets the 56px mobile bar grow to fit it
  row?: ReactNode;
  className?: string; // 🏷️
}

/**
 * 📱 AbMobileHeader — John's mobile main header (drawers v2): logo left; a globe ("Change language",
 * `aria-haspopup="dialog"`) and a theme toggle right, each 44×44. No search (the bottom nav has a Search tab) and
 * no menu button (the left drawer opens with an edge swipe). Put it in AbMainLayout's `mainHeader` with core
 * ≥ 0.2.1 `mobileHeader="main"`: the 56px row, its divider and the hidden app header come from core.
 */
const AbMobileHeader = ({ logo, onLanguage, theme = 'light', onThemeChange, themeMode = 'system', onThemeModeChange, actions, row, labels = {}, languageExpanded, className }: AbMobileHeaderProps): ReactElement => {
  const L = { language: 'Change language', toDark: 'Switch to dark theme', toLight: 'Switch to light theme', toSystem: 'Use the system theme', header: 'Main header', ...labels }; // 🌍
  const name: Record<AbMobileHeaderThemeMode, string> = { light: L.toLight, dark: L.toDark, system: L.toSystem }; // ♿ "switch TO" names
  // 🌗 0.2.3: 3-state when onThemeModeChange is given, else the 2-state toggle (unchanged)
  const three = !!onThemeModeChange;
  const next: AbMobileHeaderThemeMode = three
    ? AB_MOBILE_HEADER_THEME_CYCLE[(Math.max(0, AB_MOBILE_HEADER_THEME_CYCLE.indexOf(themeMode)) + 1) % AB_MOBILE_HEADER_THEME_CYCLE.length] // 🔁
    : theme === 'dark' ? 'light' : 'dark'; // 🌗 the target
  const showTheme = three || !!onThemeChange; // 👀
  // 🧱 the 56px bar: logo · globe · theme · actions
  const bar = (
    <>
      <span className={kit.logoRow}>{logo}</span>
      {onLanguage && (
        <button type="button" className={kit.ibtn} aria-label={L.language} aria-haspopup="dialog" aria-expanded={languageExpanded} onClick={onLanguage} data-ab-part="mobile-header-language">
          <AbIcon name="language" size={24} />
        </button>
      )}
      {showTheme && (
        <button
          type="button"
          className={kit.ibtn}
          aria-label={name[next]} // ♿ the mode a tap switches TO
          onClick={() => (three ? onThemeModeChange!(next) : onThemeChange?.(next as 'light' | 'dark'))} // 🌗
          data-ab-part="mobile-header-theme"
          data-theme-mode={three ? themeMode : undefined} // 🧪 0.2.3: the current mode (3-state only)
        >
          <AbIcon name={THEME_ICON[next]} size={24} />
        </button>
      )}
      {actions}
    </>
  );
  return (
    <div
      className={clsx('AbMobileHeader', kit.mh, row != null && kit.mhStack, className)} // 🧱 0.2.3: a column when there is a row
      role="group"
      aria-label={L.header}
      data-ab-part="mobile-header"
      data-ab-header-extra={row != null ? 'true' : undefined} // 📏 0.2.3: core ≥ 0.2.3 lets the 56px slot grow for it
    >
      {row != null ? (
        <>
          <div className={kit.mhBar} data-ab-part="mobile-header-bar">{bar}</div>
          <div className={kit.mhRow} data-ab-part="mobile-header-row">{row}</div>
        </>
      ) : bar}
    </div>
  );
};

// 📦 exports
export default AbMobileHeader;
export { AbMobileHeader };
