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
* @name: AbSidebarProfileButton - Client (0.2.1, God 02:44)
* @file: ab-sidebar/profile-button.tsx
* @type: Client Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbSidebar sections={…} profile={{ user: { name: 'Abraham Ukachi' }, theme, onThemeChange, locales, locale, onLocaleChange }} />
*   <AbSidebarProfileButton user={null} theme={theme} onThemeChange={setTheme} locales={LOCALES} locale={locale} onLocaleChange={setLocale} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import { useId, useState, type ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔣 client AbIcon ("person" from ab-nextjs-icons; register it like every other app glyph)
import AbIcon from '../ab-icon';
// 🎈 the collapsed-rail hover / focus label (same as the rail items)
import AbBalloon from '../ab-balloon';
// 👤 the circle: initials, photo or the profile glyph
import AbProfileAvatar, { type AbProfileUser } from '../ab-profile-avatar';
// ⚙️ the drawer it opens
import AbSettingsDrawer, { type AbSettingsDrawerProps } from '../ab-settings-drawer';
// 🎨 styles (shared with the sidebar)
import styles from './styles.module.css';

/** ⚙️ props: everything AbSettingsDrawer needs (minus the open state, which the button owns) + who is signed in */
export interface AbSidebarProfileButtonProps extends Omit<AbSettingsDrawerProps, 'open' | 'onClose' | 'className' | 'account'> {
  user?: AbProfileUser | null; // 👤 signed in (initials / photo) or signed out (null: the profile glyph)
  label?: string; // ♿🌍 accessible name + collapsed tooltip (default "Profile and settings")
  collapsed?: boolean; // 🚪 the sidebar is an icon rail: avatar only + a balloon tooltip
  size?: number; // 📏 the avatar circle in px (default 40: "fairly large", the sidebar rows are 32)
  showAccount?: boolean; // 👤 pass `user` on to the drawer's Account section (default true)
  className?: string; // 🏷️ on the button
  drawerClassName?: string; // 🏷️ on the drawer
  onOpenChange?: (open: boolean) => void; // 🔔 opened / closed
}

/**
 * 👤 AbSidebarProfileButton — the bottom-left sidebar control (God 02:44, replaces the 0.2.1-draft settings icon
 * button): a 40px profile circle (signed out: the profile glyph; signed in: the initials on the container colour, or
 * the photo masked to a circle) + the name when the sidebar is expanded. Tapping it opens AbSettingsDrawer.
 *
 * - 🖥️ always rendered (server too): CSS hides it below 1180px, so there's no JS gating and no first-paint flash
 * - 🎈 collapsed rail: avatar only, and an AbBalloon names it on hover / focus
 * - ♿ a real <button>: aria-label, aria-haspopup="dialog", aria-expanded + aria-controls the drawer
 * - ↩️ focus goes back to the button when the drawer closes (AbDrawer remembers the opener)
 */
const AbSidebarProfileButton = ({ user = null, label = 'Profile and settings', collapsed = false, size = 40, showAccount = true, className, drawerClassName, onOpenChange, id, ...drawer }: AbSidebarProfileButtonProps): ReactElement => {
  const [open, setOpen] = useState(false); // 🚪
  const auto = useId(); // 🆔 SSR-stable
  const drawerId = id ?? `ab-sidebar-profile-${auto.replace(/:/g, '')}`; // 🆔 aria-controls target
  const set = (next: boolean) => { setOpen(next); onOpenChange?.(next); }; // 🔔
  const button = (
    <button
      type="button" // 🧾
      className={clsx('AbSidebarProfileButton', styles.abSidebarProfile, className)} // 🎨
      data-ab-part="sidebar-profile" // 🧩
      data-signed-in={user ? 'true' : 'false'} // 👤
      data-collapsed={collapsed ? 'true' : undefined} // 🚪
      aria-label={label} // 🏷️
      aria-haspopup="dialog" // ♿
      aria-expanded={open} // ♿
      aria-controls={drawerId} // ♿
      onClick={() => set(!open)} // 🖱️
    >
      <AbProfileAvatar user={user} size={size} Icon={AbIcon} /> {/* 👤 */}
      {!collapsed && user && <span className={styles.abSidebarProfileName} aria-hidden="true">{user.name}</span> /* 🏷️ expanded: the name (the label already says it) */}
    </button>
  );
  return (
    <>
      {collapsed ? <AbBalloon title={label} placement="end" strategy="fixed">{button}</AbBalloon> : button /* 🎈 rail tooltip (fixed: the rail scrolls / clips) */}
      <AbSettingsDrawer {...drawer} account={showAccount ? user : undefined} id={drawerId} className={drawerClassName} open={open} onClose={() => set(false)} /> {/* 🗄️ */}
    </>
  );
};

// 📦 exports
export default AbSidebarProfileButton;
export { AbSidebarProfileButton };
