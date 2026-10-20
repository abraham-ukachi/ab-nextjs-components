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
* @name: AbConfirmDrawer (G53 preset)
* @file: ab-confirm-drawer/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbConfirmDrawer scope="main" open={d.open} onClose={d.close} title="Discard changes?"
*    -|>   message="Your edits will be lost." confirmLabel="Discard" tone="danger" onConfirm={discard} />
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
// 🗄️ the drawer
import AbDrawer, { type AbDrawerProps } from '../ab-drawer';
// 🔘 the house buttons
import AbButton from '../ab-button';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props: every AbDrawer prop (minus children / footer), plus the decision */
export interface AbConfirmDrawerProps extends Omit<AbDrawerProps, 'children' | 'footer'> {
  message?: ReactNode; // 📝 what happens if you confirm
  confirmLabel?: string; // ✅ default "Confirm"
  cancelLabel?: string; // ❌ default "Cancel"
  onConfirm: () => void; // ✅ the drawer closes after it (unless `closeOnConfirm={false}`)
  onCancel?: () => void; // ❌ default: just close
  tone?: 'default' | 'danger'; // 🎨 `danger` = destructive confirm
  busy?: boolean; // ⏳ disables both buttons + spinner on confirm
  closeOnConfirm?: boolean; // 🚪 default true
}

/**
 * ❓ AbConfirmDrawer — a yes / no decision that belongs to a region (e.g. "Discard changes?" inside main).
 * Defaults to `side="bottom"`; Escape / scrim / close = cancel. For an app-wide blocking decision use a
 * centred dialog instead (layout-rule guide, "Drawer, menu or dialog?").
 */
const AbConfirmDrawer = ({ message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, tone = 'default', busy = false, closeOnConfirm = true, onClose, className, side = 'bottom', ...drawer }: AbConfirmDrawerProps): ReactElement => {
  const cancel = () => { onCancel?.(); onClose(); }; // ❌ then 🚪
  const confirm = () => { onConfirm(); if (closeOnConfirm) onClose(); }; // ✅ then 🚪
  return (
    <AbDrawer
      {...drawer}
      side={side}
      onClose={cancel} // ⎋ Escape / scrim / ✕ all mean "no"
      className={clsx('AbConfirmDrawer', className)}
      footer={
        <>
          <AbButton type="text" label={cancelLabel} onClick={cancel} disabled={busy} />
          <AbButton type="filled" label={confirmLabel} onClick={confirm} isLoading={busy} disabled={busy} className={tone === 'danger' ? styles.abConfirmDanger : undefined} />
        </>
      }
    >
      {message != null && <div className={styles.abConfirmMessage} data-ab-part="confirm-message">{message}</div>}
    </AbDrawer>
  );
};

// 📦 exports
export default AbConfirmDrawer;
export { AbConfirmDrawer };
