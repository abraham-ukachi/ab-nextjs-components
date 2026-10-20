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
* @name: AbThemeToggle - Client (G9/G34)
* @file: ab-theme-toggle/index.tsx
* @type: Component (client) — light / dark / system
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbThemeToggle labels={{ group: t('theme.label'), light: t('theme.light'), dark: t('theme.dark'), system: t('theme.system') }} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { useRef } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🌗 theme engine (hooks ≥ 0.1.6, deep import = tree-shaken)
import { useAbThemeMode, AB_THEME_MODES, type AbThemeMode } from 'ab-nextjs-hooks/useAbTheme';
// 🔣 icons (SVG once G2 lands)
import AbIcon from '../ab-icon';
// 🎨 styles
import styles from './styles.module.css';
import { AB_MOTION } from 'ab-nextjs-animations/motion'; // 🎬 transition class names (ab-nextjs-animations >= 0.2.4)
import 'ab-nextjs-animations/motion/styles.css'; // 🎨 .ab-motion-*

// 📦 re-export the mode type for consumers
export type { AbThemeMode } from 'ab-nextjs-hooks/useAbTheme';

// 🏷️ i18n labels (required: no English defaults baked into a11y names)
export interface AbThemeToggleLabels {
  group: string; // 🗂️ "Theme"
  light: string; // 🌞 "Light"
  dark: string; // 🌙 "Dark"
  system: string; // 🖥️ "System"
}

// ⚙️ props
export interface AbThemeToggleProps {
  labels: AbThemeToggleLabels; // 🏷️
  variant?: 'segmented' | 'icon'; // 🎨 pill of radios, or one cycling icon button
  modes?: readonly AbThemeMode[]; // 🎚️ default light, dark, system
  value?: AbThemeMode; // 🎛️ controlled
  onChange?: (mode: AbThemeMode) => void; // 📣
  defaultMode?: AbThemeMode; // 🌱 before hydration (default 'light')
  icons?: Partial<Record<AbThemeMode, ReactNode>>; // 🖼️ override glyphs
  size?: 'sm' | 'md'; // 📏 sm = 32px, md = 40px segments (hit area ≥ 24px either way)
  appearance?: 'fill' | 'thumb'; // 🌗 0.1.14 (P7): 'thumb' = the Home pill (28px segments, raised card thumb, filled active glyph). Default 'fill'
  className?: string; // 🏷️
  style?: CSSProperties; // 🎨
}

// 🔣 default glyphs (AbIcons names)
const DEFAULT_ICON_NAMES: Record<AbThemeMode, string> = { light: 'light_mode', dark: 'dark_mode', system: 'computer' };

/**
 * @name getNextAbThemeMode
 * @description 🔁 Radio-group arrow logic (pure): wraps, RTL flips Left/Right.
 */
export function getNextAbThemeMode(modes: readonly AbThemeMode[], current: AbThemeMode, key: string, dir: 'ltr' | 'rtl' = 'ltr'): AbThemeMode | null {
  const i = Math.max(0, modes.indexOf(current)); // 📍
  const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'; // ➡️
  const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'; // ⬅️
  if (key === forward || key === 'ArrowDown') return modes[(i + 1) % modes.length]; // ⏭️
  if (key === backward || key === 'ArrowUp') return modes[(i - 1 + modes.length) % modes.length]; // ⏮️
  if (key === 'Home') return modes[0]; // ⏮️⏮️
  if (key === 'End') return modes[modes.length - 1]; // ⏭️⏭️
  return null; // 🙅
}

export function AbThemeToggle(props: AbThemeToggleProps) {
  // 🧩 props
  const { labels, variant = 'segmented', modes = AB_THEME_MODES, value, onChange, defaultMode = 'light', icons, size = 'md', appearance = 'fill', className, style } = props;
  const thumb = appearance === 'thumb'; // 🌗 P7
  // 🌗 engine: persists + applies to <html>
  const engine = useAbThemeMode(defaultMode);
  // 🎛️ controlled or engine-driven
  const current = (value ?? engine.mode) as AbThemeMode;
  // 📍 refs to move focus with the selection
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  // ✍️ select a mode
  const select = (mode: AbThemeMode) => {
    if (value === undefined) engine.setMode(mode); // 🎚️ uncontrolled: apply + persist
    onChange?.(mode); // 📣
  };

  // 🖼️ glyph for a mode (decorative: the label names it)
  //    P7 thumb: 17px (segments) / 22px (mobile icon), filled while active (spec §2 icons)
  const glyph = (mode: AbThemeMode, active = false) =>
    icons?.[mode] ?? <AbIcon name={DEFAULT_ICON_NAMES[mode]} size={thumb ? (variant === 'icon' ? 22 : 17) : 20} variant={thumb && active ? 'filled' : undefined} />;

  // 🔘 single cycling button variant
  if (variant === 'icon') {
    const next = modes[(Math.max(0, modes.indexOf(current)) + 1) % modes.length]; // ⏭️
    return (
      <button
        type="button" // 🧾
        className={clsx('AbThemeToggle', styles.icon, AB_MOTION.colors, className)} // 🏷️
        style={style} // 🎨
        data-ab-part="theme-toggle" // 🗂️
        data-mode={current} // 🎚️
        data-size={size} // 📏
        data-appearance={thumb ? 'thumb' : undefined} // 🌗 P7
        aria-label={`${labels.group}: ${labels[current]}`} // ♿ "Theme: Dark"
        title={`${labels.group}: ${labels[current]}`} // 💬
        onClick={() => select(next)} // 🔁
      >
        <span aria-hidden="true">{glyph(current)}</span>
      </button>
    );
  }

  // ⌨️ roving radio keys
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dir = (event.currentTarget.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr') as 'ltr' | 'rtl'; // 🌍
    const target = getNextAbThemeMode(modes, current, event.key, dir); // 🎯
    if (!target) return; // 🙅 other keys untouched
    event.preventDefault(); // 🛑 no scroll
    select(target); // ✅ selection follows focus (radio pattern)
    refs.current[modes.indexOf(target)]?.focus(); // 🎯
  };

  // 🎛️ segmented radiogroup
  return (
    <div
      role="radiogroup" // ♿
      aria-label={labels.group} // 🏷️
      className={clsx('AbThemeToggle', styles.group, className)} // 🏷️
      style={style} // 🎨
      data-ab-part="theme-toggle" // 🗂️
      data-mode={current} // 🎚️
      data-size={size} // 📏
      data-appearance={thumb ? 'thumb' : undefined} // 🌗 P7
      onKeyDown={onKeyDown} // ⌨️
    >
      {modes.map((mode, i) => {
        const checked = mode === current; // ✅
        return (
          <button
            key={mode} // 🔑
            ref={(el) => { refs.current[i] = el; }} // 📍
            type="button" // 🧾
            role="radio" // ♿
            aria-checked={checked} // ✅
            aria-label={labels[mode]} // 🏷️
            title={labels[mode]} // 💬
            tabIndex={checked ? 0 : -1} // ⌨️ roving: one tab stop
            className={clsx(styles.segment, AB_MOTION.colors)} // 🎨 + colour fade (ab-nextjs-animations)
            data-ab-part="theme-option" // 🗂️
            data-mode={mode} // 🎚️
            onClick={() => select(mode)} // 🖱️
          >
            <span aria-hidden="true">{glyph(mode, checked)}</span>
          </button>
        );
      })}
    </div>
  );
}

// 📦 default export
export default AbThemeToggle;
