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
* @name: AbIconButton - Client
* @file: ab-icon-button/index.tsx
* @type: Component (client) — G6: accessible name on the interactive element
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbIconButton icon="arrow_back" label={t('back')} onClick={prev} />
*    -|> <AbIconButton icon="open_in_new" href="/docs" label="Open docs" /> // 🔗 link variant is named too
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React types + forwardRef
import type { CSSProperties, MouseEvent } from 'react';
import { forwardRef } from 'react';
// 🧵 class-name joiner
import clsx from 'clsx';
// 🎨 package-shipped CSS module
import styles from './styles.module.css';
// 🔣 0.1.13 (G2, Joseph #6): the glyph is an AbIcon SVG, not the Material Symbols font
import AbIcon from '../ab-icon';
import { AB_MOTION } from 'ab-nextjs-animations/motion'; // 🎬 transition class names (ab-nextjs-animations >= 0.2.4)
import 'ab-nextjs-animations/motion/styles.css'; // 🎨 .ab-motion-*

// ⚙️ public props
export interface AbIconButtonProps {
  // 🏷️ extra classes
  className?: string;
  // 🎨 inline style
  style?: CSSProperties;
  // 🙈 hide the whole button
  hidden?: boolean;
  // 🔣 AbIcons name (rendered with AbIcon; unregistered names fall back to the font ligature)
  icon: string;
  // ⬛ 0.1.13: filled variant (default: filled while `active`)
  iconFilled?: boolean;
  // 🚫 disabled (button: native `disabled`; link: `aria-disabled` + no href)
  disabled?: boolean;
  // 🔍 grow a little on hover
  expands?: boolean;
  // 🤏 shrink a little when pressed
  shrinks?: boolean;
  // ⌨️ custom tab index
  tabIndex?: number;
  // 🖱️ click handler (button variant)
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  // 🔗 turns the button into a link
  href?: string;
  // ✅ active / selected look
  active?: boolean;
  // 🫥 no hover background
  naked?: boolean;
  // ⏳ show a spinner instead of the icon (button variant)
  isLoading?: boolean;
  // ♿ G6: accessible name (preferred; translate it). Falls back to `title`.
  label?: string;
  // 💬 tooltip text; also the accessible name when `label` is missing (pre-G6 callers)
  title?: string;
  // 🧾 button type
  type?: 'button' | 'submit' | 'reset';
  // ♿ 0.1.14: disclosure state for menus / drawers / the TOC toggle (button variant)
  'aria-expanded'?: boolean;
  // ♿ 0.1.14: id of the element this button opens
  'aria-controls'?: string;
}

const AbIconButton = forwardRef<HTMLButtonElement, AbIconButtonProps>(function AbIconButton(props, ref) {
  // 🧩 destructure with defaults
  const {
    className, // 🏷️
    style, // 🎨
    hidden = false, // 👀
    icon, // 🔣
    disabled = false, // 🚦
    expands = false, // 🔍
    shrinks = false, // 🤏
    tabIndex, // ⌨️
    onClick, // 🖱️
    href, // 🔗
    active = false, // ✅
    naked = false, // 🫥
    isLoading = false, // ⏳
    label, // ♿
    title, // 💬
    type = 'button', // 🧾
    iconFilled, // ⬛
    'aria-expanded': ariaExpanded, // ♿ 0.1.14
    'aria-controls': ariaControls, // ♿ 0.1.14
  } = props;

  // ♿ G6: one accessible name for both variants, ON the interactive element (not the wrapper span)
  const name = label ?? title;
  // 💬 tooltip: explicit title wins, else reuse the name so sighted mouse users see it too
  const tooltip = title ?? label;
  // 🏷️ classes
  const classNames = clsx('AbIconButton', 'icon-button', styles.abIconButton, AB_MOTION.interactive, expands && AB_MOTION.lift, shrinks && AB_MOTION.press, className); // 🎬 hover lift / press from ab-nextjs-animations
  // 🔣 the glyph is decoration (the button carries the name): AbIcon without a label is aria-hidden
  const glyph = <AbIcon name={icon} variant={(iconFilled ?? active) ? 'filled' : 'outlined'} className="icon" />;

  // 🔗 link variant
  if (href && !isLoading) {
    return (
      <span hidden={hidden} className={styles.wrap}>
        <a
          href={disabled ? undefined : href} // 🚫 a disabled link has no target
          className={classNames} // 🏷️
          style={style} // 🎨
          aria-label={name} // ♿ G6: the href variant is named now
          title={tooltip} // 💬 on the link, not the wrapper
          aria-disabled={disabled || undefined} // 🚦
          data-active={String(active)} // ✅
          data-naked={String(naked)} // 🫥
          data-expands={String(expands)} // 🔍
          data-shrinks={String(shrinks)} // 🤏
          tabIndex={tabIndex ?? (disabled ? -1 : 0)} // ⌨️ a disabled link leaves the tab order
        >
          {glyph}
        </a>
      </span>
    );
  }

  // 🔘 button variant
  return (
    <span hidden={hidden} className={styles.wrap}>
      <button
        ref={ref} // 🔗
        type={type} // 🧾
        className={classNames} // 🏷️
        style={style} // 🎨
        disabled={disabled || isLoading} // 🚦
        aria-label={name} // ♿ accessible name
        title={tooltip} // 💬 tooltip on the button itself
        aria-busy={isLoading || undefined} // ⏳ announce loading
        aria-expanded={ariaExpanded} // ♿ open / closed (omitted when undefined)
        aria-controls={ariaControls} // ♿ what it opens
        data-active={String(active)} // ✅
        data-naked={String(naked)} // 🫥
        data-expands={String(expands)} // 🔍
        data-shrinks={String(shrinks)} // 🤏
        onClick={onClick} // 🖱️
        tabIndex={tabIndex ?? 0} // ⌨️
      >
        {isLoading ? <span className={clsx('spinner', 'dots-12', styles.spinner)} aria-hidden="true" /> : glyph}
      </button>
    </span>
  );
});

// 📦 exports
export default AbIconButton;
export { AbIconButton };
