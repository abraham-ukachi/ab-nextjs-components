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
* @name: AbBottomDrawer (mobile bottom drawer)
* @file: ab-bottom-drawer/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbBottomDrawer {...d.drawerProps} title="Language">…</AbBottomDrawer>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import type { ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗄️ built on AbDrawer
import AbDrawer, { type AbDrawerProps } from '../ab-drawer';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props: AbDrawer's, minus `side` (always bottom); scope defaults to the whole app */
export interface AbBottomDrawerProps extends Omit<AbDrawerProps, 'side'> {
  side?: AbDrawerProps['side']; // 🙈 accepted for drop-in use (AbDrawerList `as`), always rendered as bottom
  handle?: boolean; // ➖ grab handle at the top (default true; decorative)
}

/**
 * 📱 AbBottomDrawer: the mobile bottom sheet (God's plan: the language picker on mobile, D40). AbDrawer
 * with `side="bottom"`, `scope="app"`, the Home tokens (card surface, hairline top edge, 20px top radius,
 * grab handle, safe-area padding) and at most 560px wide, centred, above 768px.
 */
const AbBottomDrawer = ({ handle = true, scope = 'app', className, ...rest }: AbBottomDrawerProps): ReactElement => (
  <AbDrawer {...rest} scope={scope} side="bottom" className={clsx('AbBottomDrawer', styles.abBottomDrawer, handle && styles.withHandle, className)} />
);

// 📦 exports
export default AbBottomDrawer;
export { AbBottomDrawer };
