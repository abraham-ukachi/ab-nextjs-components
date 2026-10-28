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
import { useSyncExternalStore, type MouseEvent, type ReactElement, type ReactNode, type Ref } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔣 icons
import AbIcon from '../ab-icon';
// 🎨 the drawers v2 kit
import kit from '../ab-drawer/kit.module.css';
// 🌗 0.2.3: the shared theme state (AbThemeModeProvider)
import { useAbThemeModeContext } from '../ab-theme-mode';

/** 🌗 0.2.3: the three theme modes (same names as ab-nextjs-hooks' AbThemeMode) */
export type AbMobileHeaderThemeMode = 'light' | 'dark' | 'system';
/** 🔁 0.2.3: the 3-state cycle order */
export const AB_MOBILE_HEADER_THEME_CYCLE: readonly AbMobileHeaderThemeMode[] = ['light', 'dark', 'system'];
// 🔣 the glyph of each mode
const THEME_ICON: Record<AbMobileHeaderThemeMode, string> = { light: 'light_mode', dark: 'dark_mode', system: 'computer' };

/** 🌍 0.2.3: one entry of the no-JS language list */
export interface AbMobileHeaderLanguage {
  locale: string; // 🏷️ e.g. 'fr' (lang + hreflang on the link)
  label: string; // 🗣️ e.g. 'Français' (in its own language)
  href: string; // 🔗 that locale's URL of the current page
  current?: boolean; // ✅ aria-current="true" on the active one
}

// 🟢 hydrated? false on the server + the hydration pass, true after (no setState-in-effect)
const subscribeNothing = () => () => {};
const useHydrated = (): boolean => useSyncExternalStore(subscribeNothing, () => true, () => false);

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
  // 🌍 0.2.3: the globe's popup wiring. `languageControls` = the language sheet's id → aria-controls, and
  //    aria-expanded is always present (false unless `languageExpanded`). `languageRef` = the globe element, e.g.
  //    for AbBottomDrawer's `trigger` focus return
  languageControls?: string;
  languageRef?: Ref<HTMLButtonElement & HTMLAnchorElement>;
  // 🧩 0.2.3 no-JS fallback: with `languageHref` the globe is a real link to a language list (works before
  //    hydration and without JS); once hydrated, `onLanguage` (if set) opens the sheet instead of navigating
  languageHref?: string;
  // 🧩 0.2.3 no-JS fallback (preferred; the app has no language route): with `languages` the globe is a
  //    <details>/<summary> holding a list of links, which works with no JS at all. Once hydrated and `onLanguage`
  //    is set, the summary opens the sheet instead (aria-controls / aria-expanded kept). Wins over `languageHref`
  languages?: readonly AbMobileHeaderLanguage[];
  // 📏 0.2.3: 'compact' = a 48px bar with 18px start inset (the Welcome v6 mock: 48 + the counter row = 96px).
  //    Default 'default' (56px, John's drawers v2 frame)
  size?: 'default' | 'compact';
  className?: string; // 🏷️
}

/**
 * 📱 AbMobileHeader — John's mobile main header (drawers v2): logo left; a globe ("Change language",
 * `aria-haspopup="dialog"`) and a theme toggle right, each 44×44. No search (the bottom nav has a Search tab) and
 * no menu button (the left drawer opens with an edge swipe). Put it in AbMainLayout's `mainHeader` with core
 * ≥ 0.2.1 `mobileHeader="main"`: the 56px row, its divider and the hidden app header come from core.
 */
const AbMobileHeader = ({ logo, onLanguage, theme = 'light', onThemeChange, themeMode = 'system', onThemeModeChange, actions, row, labels = {}, languageExpanded, languageControls, languageRef, languageHref, languages, size = 'default', className }: AbMobileHeaderProps): ReactElement => {
  const L = { language: 'Change language', toDark: 'Switch to dark theme', toLight: 'Switch to light theme', toSystem: 'Use the system theme', header: 'Main header', ...labels }; // 🌍
  const name: Record<AbMobileHeaderThemeMode, string> = { light: L.toLight, dark: L.toDark, system: L.toSystem }; // ♿ "switch TO" names
  // 🌗 0.2.3: under an AbThemeModeProvider with no theme props, the button is the 3-state cycle on the SHARED state
  //    (same mode as the laptop toggles, no drift across 768px). Explicit props still win
  const shared = useAbThemeModeContext();
  const hydrated = useHydrated(); // 🟢 0.2.3: the <details> fallback hands over to the sheet only once JS runs
  const sheet = hydrated && !!onLanguage; // 📱 the globe opens the sheet
  const fromShared = !!shared && !onThemeModeChange && !onThemeChange; // 🧠
  const mode3 = fromShared ? (shared.mode as AbMobileHeaderThemeMode) : themeMode; // 🔗 the mode shown
  const set3 = fromShared ? shared.setMode : onThemeModeChange; // 🔗 the setter used
  // 🌗 0.2.3: 3-state when onThemeModeChange is given (or shared), else the 2-state toggle (unchanged)
  const three = !!set3;
  const next: AbMobileHeaderThemeMode = three
    ? AB_MOBILE_HEADER_THEME_CYCLE[(Math.max(0, AB_MOBILE_HEADER_THEME_CYCLE.indexOf(mode3)) + 1) % AB_MOBILE_HEADER_THEME_CYCLE.length] // 🔁
    : theme === 'dark' ? 'light' : 'dark'; // 🌗 the target
  const showTheme = three || !!onThemeChange; // 👀
  // 🧱 the 56px bar: logo · globe · theme · actions
  const bar = (
    <>
      <span className={kit.logoRow}>{logo}</span>
      {languages && languages.length > 0 ? (
        // 🧩 0.2.3: <details> = a native disclosure of plain links: no JS needed. With JS + onLanguage, the summary
        //    click is intercepted (no toggle) and opens the sheet; its popup ARIA only appears then
        <details className={kit.langDetails} data-ab-part="mobile-header-languages">
          <summary
            ref={languageRef as Ref<HTMLElement>}
            className={kit.ibtn}
            aria-label={L.language}
            aria-haspopup={sheet ? 'dialog' : undefined} // ♿
            aria-controls={sheet ? languageControls : undefined} // 🔗
            aria-expanded={sheet ? !!languageExpanded : undefined} // ♿ native <details> state otherwise
            onClick={(e: MouseEvent<HTMLElement>) => { if (!sheet) return; e.preventDefault(); onLanguage!(); }} // 📱
            data-ab-part="mobile-header-language"
          >
            <AbIcon name="language" size={24} />
          </summary>
          <ul className={kit.langList} aria-label={L.language}>
            {languages.map((l) => (
              <li key={l.locale}>
                <a href={l.href} hrefLang={l.locale} lang={l.locale} aria-current={l.current ? 'true' : undefined}>{l.label}</a>
              </li>
            ))}
          </ul>
        </details>
      ) : languageHref != null ? (
        // 🧩 0.2.3: a link first (no-JS / pre-hydration: navigates to the list), upgraded to the sheet by onLanguage
        <a
          ref={languageRef}
          href={languageHref}
          className={kit.ibtn}
          aria-label={L.language}
          aria-haspopup={onLanguage ? 'dialog' : undefined} // ♿ only when it opens a sheet
          aria-controls={onLanguage ? languageControls : undefined} // 🔗
          aria-expanded={onLanguage && languageControls ? !!languageExpanded : languageExpanded} // ♿
          onClick={(e: MouseEvent<HTMLAnchorElement>) => { if (!onLanguage || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); onLanguage(); }} // 🖱️ new-tab clicks still navigate
          data-ab-part="mobile-header-language"
        >
          <AbIcon name="language" size={24} />
        </a>
      ) : onLanguage && (
        <button
          ref={languageRef}
          type="button"
          className={kit.ibtn}
          aria-label={L.language}
          aria-haspopup="dialog"
          aria-controls={languageControls} // 🔗 0.2.3
          aria-expanded={languageControls ? !!languageExpanded : languageExpanded} // ♿ 0.2.3: always set with a target
          onClick={onLanguage}
          data-ab-part="mobile-header-language"
        >
          <AbIcon name="language" size={24} />
        </button>
      )}
      {showTheme && (
        <button
          type="button"
          className={kit.ibtn}
          aria-label={name[next]} // ♿ the mode a tap switches TO
          onClick={() => (three ? set3!(next) : onThemeChange?.(next as 'light' | 'dark'))} // 🌗
          data-ab-part="mobile-header-theme"
          data-theme-mode={three ? mode3 : undefined} // 🧪 0.2.3: the current mode (3-state only)
        >
          <AbIcon name={THEME_ICON[next]} size={24} />
        </button>
      )}
      {actions}
    </>
  );
  return (
    <div
      className={clsx('AbMobileHeader', kit.mh, row != null && kit.mhStack, size === 'compact' && kit.mhCompact, className)} // 🧱 0.2.3: a column when there is a row
      role="group"
      aria-label={L.header}
      data-ab-part="mobile-header"
      data-ab-header-size={size === 'compact' ? 'compact' : undefined} // 📏 0.2.3: core ≥ 0.2.3 sizes the slot to 48px
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
