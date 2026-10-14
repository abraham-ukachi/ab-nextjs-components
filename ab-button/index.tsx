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
* @name: AbButton - Client (port of lyd-button)
* @file: ab-button/index.tsx
* @type: Component (client) — G22 disabled + badge + start/end icons
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbButton type="outlined" label="Continue with GitHub" startIcon={<AbIcon name="github" />} disabled badge="Coming soon" />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React types + forwardRef
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { forwardRef } from 'react';
// 🧵 class joiner
import clsx from 'clsx';
// 🎨 styles
import styles from './styles.module.css';
// 🧮 shared (server-safe) rules
import {
  getAbButtonDisabledMode,
  getAbButtonSrReason,
  type AbButtonBadgeTone,
  type AbButtonColor,
  type AbButtonType,
} from './helpers';

// 📦 re-export the shared types (pre-G22 import paths keep working)
export type { AbButtonBadgeTone, AbButtonColor, AbButtonType, AbButtonDisabledMode } from './helpers';

// ⚙️ props
export interface AbButtonProps {
  id?: string; // 🆔
  type?: AbButtonType; // 🎨 contained / outlined / text
  htmlType?: 'button' | 'submit' | 'reset'; // 🧾
  className?: string; // 🏷️
  spinnerClassName?: string; // ⏳ spinner class
  hidden?: boolean; // 🙈
  style?: CSSProperties; // 🎨
  iconStyle?: CSSProperties; // 🎨 Material icon style
  rounded?: boolean; // 💊
  raised?: boolean; // 🏔️
  shrinks?: boolean; // 🤏
  expands?: boolean; // 🔍
  withIcon?: boolean; // 🔣 legacy Material icon on/off
  disabled?: boolean; // 🚫
  isLoading?: boolean; // ⏳
  iconPosition?: 'left' | 'right'; // ↔️ legacy icon side
  label: string; // 🏷️ text (also the accessible name)
  icon?: string; // 🔣 legacy Material ligature
  color?: AbButtonColor; // 🎨
  href?: string; // 🔗 link mode
  children?: ReactNode; // 🧩 replaces label visually
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void; // 🖱️
  // ===== G22 =====
  startIcon?: ReactNode; // 🖼️ NEW: any node before the label (e.g. GitHub mark via AbIcon)
  endIcon?: ReactNode; // 🖼️ NEW: any node after the label (e.g. arrow_forward)
  badge?: ReactNode; // 🏷️ NEW: visible badge, e.g. "Coming soon"; part of the accessible name
  badgeTone?: AbButtonBadgeTone; // 🎨 NEW: 'neutral' (default) | 'accent'
  disabledReason?: string; // 💬 NEW: SR-only reason, appended to the name while blocked
  focusableWhenDisabled?: boolean; // ⌨️ NEW: force aria-disabled (true) or native disabled (false)
}

const AbButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, AbButtonProps>(function AbButton(props, ref) {
  // 🧩 props + defaults
  const {
    id, // 🆔
    type = 'contained', // 🎨
    htmlType = 'button', // 🧾
    className, // 🏷️
    spinnerClassName, // ⏳
    hidden = false, // 🙈
    style, // 🎨
    iconStyle, // 🎨
    rounded = true, // 💊
    raised = false, // 🏔️
    shrinks = false, // 🤏
    expands = false, // 🔍
    withIcon = false, // 🔣
    disabled = false, // 🚫
    isLoading = false, // ⏳
    iconPosition = 'left', // ↔️
    label, // 🏷️
    icon, // 🔣
    color = 'primary', // 🎨
    href, // 🔗
    children, // 🧩
    onClick, // 🖱️
    startIcon, // 🖼️
    endIcon, // 🖼️
    badge, // 🏷️
    badgeTone = 'neutral', // 🎨
    disabledReason, // 💬
    focusableWhenDisabled, // ⌨️
  } = props;

  // 🚦 how are we disabled? (shared with the server twin)
  const mode = getAbButtonDisabledMode({ disabled, isLoading, badge, disabledReason, focusableWhenDisabled });
  // 💬 hidden reason appended to the name
  const srReason = getAbButtonSrReason({ disabled, isLoading, disabledReason });
  // 🚫 any kind of blocked?
  const blocked = mode !== 'none';

  // 🏷️ classes: pointer-events:none only for native mode (aria mode must stay focusable/hoverable)
  const classNames = clsx(
    'AbButton', // 🏷️ public hook
    styles.abButton, // 🎨
    className, // 🏷️
    rounded && styles.abButtonRounded, // 💊
    type === 'contained' && styles.isContained, // 🎨
    mode === 'native' && styles.isDisabled, // 🚫
  );

  // 🗂️ data attributes for styling/tests
  const dataAttrs = {
    'data-type': type, // 🎨
    'data-raised': raised ? 'true' : 'false', // 🏔️
    'data-shrinks': shrinks ? 'true' : 'false', // 🤏
    'data-expands': expands ? 'true' : 'false', // 🔍
    'data-rounded': rounded ? 'true' : 'false', // 💊
    'data-iconpos': iconPosition, // ↔️
    'data-color': color, // 🎨
    'data-disabled-mode': mode, // 🚦
  } as const;

  // 🔣 legacy Material icon (decorative)
  const legacyIcon = withIcon && icon
    ? <span className={clsx('material-symbols-rounded', 'icon', styles.abButtonIcon)} style={iconStyle} aria-hidden="true">{icon}</span>
    : null;

  // 🧱 inner content
  const content = (
    <>
      {iconPosition === 'left' ? legacyIcon : null /* 🔣 legacy left */}
      {startIcon ? <span className={styles.abButtonSlot} aria-hidden="true">{startIcon}</span> : null /* 🖼️ decorative */}
      <span className={clsx(styles.abButtonSpinnerSlot, !isLoading && styles.hidden)} aria-hidden="true">
        <span className={clsx('spinner', 'dot-3', styles.abButtonSpinner, spinnerClassName)} />
      </span>
      <span className={clsx(isLoading && styles.invisible)}>{children ?? label}</span>
      {badge ? (
        <>
          <span className={styles.srOnly}>, </span>{/* 🗣️ pause: "Continue with GitHub, Coming soon" */}
          <span className={styles.abButtonBadge} data-tone={badgeTone} data-ab-part="badge" aria-hidden={srReason ? true : undefined}>{badge}</span>
        </>
      ) : null}
      {srReason ? <span className={styles.srOnly}>, {srReason}</span> : null /* 💬 hidden reason */}
      {endIcon ? <span className={styles.abButtonSlot} aria-hidden="true">{endIcon}</span> : null /* 🖼️ */}
      {iconPosition === 'right' ? legacyIcon : null /* 🔣 legacy right */}
    </>
  );

  // 🛑 aria mode: swallow activation (mouse, Enter/Space, form submit)
  const guardClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (blocked) { event.preventDefault(); return; } // 🚫 no submit / navigation / handler
    onClick?.(event); // ✅
  };

  // 🔗 link mode
  if (href) {
    // 🚫 a blocked link has no target: render a non-navigating span with role=link
    if (blocked) {
      return (
        <span
          ref={ref as Ref<HTMLAnchorElement> as unknown as Ref<HTMLSpanElement>} // 🔗
          id={id} // 🆔
          role="link" // ♿ still announced as a link
          aria-disabled="true" // 🚦
          tabIndex={mode === 'aria' ? 0 : -1} // ⌨️ focusable only in aria mode
          className={classNames} // 🏷️
          style={style} // 🎨
          hidden={hidden} // 🙈
          onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => { if (e.key === 'Enter') e.preventDefault(); }} // 🚫
          {...dataAttrs}
        >
          {content}
        </span>
      );
    }
    // ✅ live link (no role=button: it navigates, so it is a link)
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} id={id} href={href} className={classNames} style={style} hidden={hidden} onClick={guardClick} {...dataAttrs}>
        {content}
      </a>
    );
  }

  // 🔘 button mode
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>} // 🔗
      id={id} // 🆔
      type={mode === 'aria' ? 'button' : htmlType} // 🧾 aria-disabled must never submit
      className={classNames} // 🏷️
      style={style} // 🎨
      hidden={hidden} // 🙈
      disabled={mode === 'native'} // 🚫 native mode
      aria-disabled={mode === 'aria' ? true : undefined} // 🚦 aria mode
      aria-busy={isLoading || undefined} // ⏳
      onClick={guardClick} // 🛑 guarded
      {...dataAttrs}
    >
      {content}
    </button>
  );
});

// 📦 exports
export default AbButton;
export { AbButton };
