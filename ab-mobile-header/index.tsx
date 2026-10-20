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

/** ⚙️ props */
export interface AbMobileHeaderProps {
  logo: ReactNode; // 🏷️ the logoname (22px), usually a link home: the focus target after a swipe-opened drawer closes
  onLanguage?: () => void; // 🌍 the globe: open the Settings sheet with the language list in view
  theme?: 'light' | 'dark'; // 🌗 the resolved theme now
  onThemeChange?: (next: 'light' | 'dark') => void; // 🌗 the toggle (it shows the mode it switches TO: a moon in light)
  actions?: ReactNode; // ➕ more 44px buttons after the two (none in John's frame)
  labels?: { language?: string; toDark?: string; toLight?: string; header?: string }; // 🌍 "Change language", "Switch to dark theme", "Switch to light theme", "Main header"
  languageExpanded?: boolean; // ♿ aria-expanded on the globe while its sheet is open
  className?: string; // 🏷️
}

/**
 * 📱 AbMobileHeader — John's mobile main header (drawers v2): logo left; a globe ("Change language",
 * `aria-haspopup="dialog"`) and a theme toggle right, each 44×44. No search (the bottom nav has a Search tab) and
 * no menu button (the left drawer opens with an edge swipe). Put it in AbMainLayout's `mainHeader` with core
 * ≥ 0.2.1 `mobileHeader="main"`: the 56px row, its divider and the hidden app header come from core.
 */
const AbMobileHeader = ({ logo, onLanguage, theme = 'light', onThemeChange, actions, labels = {}, languageExpanded, className }: AbMobileHeaderProps): ReactElement => {
  const L = { language: 'Change language', toDark: 'Switch to dark theme', toLight: 'Switch to light theme', header: 'Main header', ...labels }; // 🌍
  const next = theme === 'dark' ? 'light' : 'dark'; // 🌗 the target
  return (
    <div className={clsx('AbMobileHeader', kit.mh, className)} role="group" aria-label={L.header} data-ab-part="mobile-header">
      <span className={kit.logoRow}>{logo}</span>
      {onLanguage && (
        <button type="button" className={kit.ibtn} aria-label={L.language} aria-haspopup="dialog" aria-expanded={languageExpanded} onClick={onLanguage} data-ab-part="mobile-header-language">
          <AbIcon name="language" size={24} />
        </button>
      )}
      {onThemeChange && (
        <button type="button" className={kit.ibtn} aria-label={next === 'dark' ? L.toDark : L.toLight} onClick={() => onThemeChange(next)} data-ab-part="mobile-header-theme">
          <AbIcon name={next === 'dark' ? 'dark_mode' : 'light_mode'} size={24} />
        </button>
      )}
      {actions}
    </div>
  );
};

// 📦 exports
export default AbMobileHeader;
export { AbMobileHeader };
