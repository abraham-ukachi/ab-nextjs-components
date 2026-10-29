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
* @name: AbButton - Server (no onClick; href→<a> or submit)
* @file: server/ab-button/index.tsx
* @type: Server component — G22 parity with the client twin
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ types
import type { CSSProperties, ReactElement, ReactNode } from 'react';
// 🧵 class joiner
import clsx from 'clsx';
// 🎨 styles (server copy)
// 🧬 0.2.3 (Joseph 03:41): ONE source for the button box — the client module's CSS (no server copy to drift)
import styles from '../../ab-button/styles.module.css';
// 🧮 the SAME rules as the client twin
import {
  getAbButtonDisabledMode,
  getAbButtonSrReason,
  type AbButtonBadgeTone,
  type AbButtonColor,
  type AbButtonType, type AbButtonShape, type AbButtonSize,
} from '../../ab-button/helpers';

// 📦 shared types
export type { AbButtonBadgeTone, AbButtonColor, AbButtonType, AbButtonDisabledMode } from '../../ab-button/helpers';

// ⚙️ props (no onClick on the server)
export interface AbButtonProps {
  id?: string; // 🆔
  type?: AbButtonType; // 🎨
  htmlType?: 'button' | 'submit' | 'reset'; // 🧾
  className?: string; // 🏷️
  hidden?: boolean; // 🙈
  style?: CSSProperties; // 🎨
  rounded?: boolean; // 💊
  shape?: AbButtonShape; // 🔷 0.1.14 (P16)
  size?: AbButtonSize; // 📏 0.1.14 (P16)
  raised?: boolean; // 🏔️
  shrinks?: boolean; // 🤏
  expands?: boolean; // 🔍
  withIcon?: boolean; // 🔣
  disabled?: boolean; // 🚫
  iconPosition?: 'left' | 'right'; // ↔️
  label: string; // 🏷️
  icon?: string; // 🔣
  color?: AbButtonColor; // 🎨
  href?: string; // 🔗
  children?: ReactNode; // 🧩
  startIcon?: ReactNode; // 🖼️ G22
  endIcon?: ReactNode; // 🖼️ G22
  badge?: ReactNode; // 🏷️ G22
  badgeTone?: AbButtonBadgeTone; // 🎨 G22
  disabledReason?: string; // 💬 G22
  focusableWhenDisabled?: boolean; // ⌨️ G22
}

/** 🖥️ Server AbButton: no onClick. Use href for links or htmlType for form submit. No-JS safe. */
const AbButton = ({
  id, type = 'contained', htmlType = 'button', className, hidden = false, style, rounded = true, shape, size, raised = false,
  shrinks = false, expands = false, withIcon = false, disabled = false, iconPosition = 'left', label, icon,
  color = 'primary', href, children, startIcon, endIcon, badge, badgeTone = 'neutral', disabledReason, focusableWhenDisabled,
}: AbButtonProps): ReactElement => {
  // 🚦 shared disabled rules
  const mode = getAbButtonDisabledMode({ disabled, badge, disabledReason, focusableWhenDisabled });
  // 💬 hidden reason
  const srReason = getAbButtonSrReason({ disabled, disabledReason });

  // 🏷️ classes
  const classNames = clsx('AbButton', styles.abButton, className, rounded && styles.abButtonRounded, type === 'contained' && styles.isContained /* 🎨 mirrors client */, type === 'filled' && styles.isFilled /* 🥉 */, mode === 'native' && styles.isDisabled);

  // 🗂️ data attributes
  const dataAttrs = {
    'data-type': type, // 🎨
    'data-raised': raised ? 'true' : 'false', // 🏔️
    'data-shrinks': shrinks ? 'true' : 'false', // 🤏
    'data-expands': expands ? 'true' : 'false', // 🔍
    'data-rounded': rounded ? 'true' : 'false', // 💊
    'data-iconpos': iconPosition, // ↔️
    'data-color': color, // 🎨
    'data-disabled-mode': mode, // 🚦
    'data-shape': shape, // 🔷 P16
    'data-size': size, // 📏 P16
  } as const;

  // 🔣 legacy icon (decorative)
  const legacyIcon = withIcon && icon ? <span className={clsx('material-symbols-rounded', 'icon')} aria-hidden="true">{icon}</span> : null;

  // 🧱 content (same order as the client twin)
  const content = (
    <>
      {iconPosition === 'left' ? legacyIcon : null}
      {startIcon ? <span className={styles.abButtonSlot} aria-hidden="true">{startIcon}</span> : null}
      <span>{children ?? label}</span>
      {badge ? (
        <>
          <span className={styles.srOnly}>, </span>
          <span className={styles.abButtonBadge} data-tone={badgeTone} data-ab-part="badge" aria-hidden={srReason ? true : undefined}>{badge}</span>
        </>
      ) : null}
      {srReason ? <span className={styles.srOnly}>, {srReason}</span> : null}
      {endIcon ? <span className={styles.abButtonSlot} aria-hidden="true">{endIcon}</span> : null}
      {iconPosition === 'right' ? legacyIcon : null}
    </>
  );

  // 🔗 link mode
  if (href) {
    if (mode !== 'none') {
      // 🚫 blocked link: no href, role=link, focusable only in aria mode
      return <span id={id} role="link" aria-disabled="true" tabIndex={mode === 'aria' ? 0 : -1} className={classNames} style={style} hidden={hidden} {...dataAttrs}>{content}</span>;
    }
    // ✅ a link is a link (no role=button)
    return <a id={id} href={href} className={classNames} style={style} hidden={hidden} {...dataAttrs}>{content}</a>;
  }

  // 🔘 button: aria mode is type="button" so a disabled CTA can never submit, even without JS
  return (
    <button
      id={id} // 🆔
      type={mode === 'aria' ? 'button' : htmlType} // 🧾
      className={classNames} // 🏷️
      style={style} // 🎨
      hidden={hidden} // 🙈
      disabled={mode === 'native'} // 🚫
      aria-disabled={mode === 'aria' ? true : undefined} // 🚦
      {...dataAttrs}
    >
      {content}
    </button>
  );
};

// 📦 exports
export default AbButton;
export { AbButton };
