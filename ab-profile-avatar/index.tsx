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
* @name: AbProfileAvatar (0.2.1)
* @file: ab-profile-avatar/index.tsx
* @type: React Component (no hooks: client + server)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbProfileAvatar user={{ name: 'Abraham Ukachi' }} />   // → "AU" in a container-coloured circle
*   <AbProfileAvatar user={{ name: 'Abraham Ukachi', image: '/me.jpg' }} size={44} />
*   <AbProfileAvatar />   // 👤 signed out: the profile glyph
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ComponentType, ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🎨 styles
import styles from './styles.module.css';

/** 👤 who is signed in (omit / null = signed out) */
export interface AbProfileUser {
  name: string; // 🏷️ "Abraham Ukachi"
  image?: string; // 🖼️ photo URL (masked to a circle)
  initials?: string; // 🔤 override the computed initials
  email?: string; // ✉️ shown by AbSettingsDrawer's account row
}

/** 🔣 what the avatar needs from an icon component (client and server AbIcon both fit) */
export type AbProfileIconComponent = ComponentType<{ name: string; size?: number; className?: string }>;

/** ⚙️ props */
export interface AbProfileAvatarProps {
  user?: AbProfileUser | null; // 👤
  size?: number; // 📏 px (default 40)
  icon?: string; // 🔣 signed-out glyph (default "person", the bottom nav's Profile)
  Icon?: AbProfileIconComponent; // 🔣 the icon component (pass AbIcon; without it the Material ligature is used)
  className?: string; // 🏷️
}

/** 🔤 "Abraham Ukachi" → "AU" (first + last word, max 2 letters, upper case) */
export function getAbInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean); // ✂️ the words
  if (!words.length) return ''; // 🚫 nothing
  const first = words[0][0] ?? ''; // 🅰️
  const last = words.length > 1 ? words[words.length - 1][0] ?? '' : ''; // 🅱️
  return (first + last).toUpperCase(); // 🔠
}

/**
 * 👤 AbProfileAvatar — a decorative (aria-hidden) circle: the photo masked to a circle (overflow hidden), else the
 * initials on the container colour, else (signed out) the profile glyph. The surrounding control names it.
 * (AbAvatar is a link with a next/image and an online dot, so it doesn't fit inside a button.)
 */
const AbProfileAvatar = ({ user, size = 40, icon = 'person', Icon, className }: AbProfileAvatarProps): ReactElement => {
  const kind = user ? (user.image ? 'image' : 'initials') : 'icon'; // 🧭 what we show
  return (
    <span
      className={clsx('AbProfileAvatar', styles.abProfileAvatar, className)} // 🏷️
      data-ab-part="profile-avatar" // 🧩
      data-kind={kind} // 🧭
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }} // 📏 initials scale with the circle
      aria-hidden="true" // ♿ decorative
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- 🖼️ a tiny avatar; the package must not require next/image's loader config in consumer apps */}
      {kind === 'image' && <img src={user!.image} alt="" className={styles.abProfileAvatarImage} width={size} height={size} /> /* 🖼️ */}
      {kind === 'initials' && <span className={styles.abProfileAvatarInitials}>{user!.initials ?? getAbInitials(user!.name)}</span> /* 🔤 */}
      {kind === 'icon' && (Icon ? <Icon name={icon} size={Math.round(size * 0.55)} /> : <span className="material-symbols-rounded">{icon}</span>) /* 👤 */}
    </span>
  );
};

// 📦 exports
export default AbProfileAvatar;
export { AbProfileAvatar };
