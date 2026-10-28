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
import { useEffect, useId, useRef, type ReactElement, type RefObject } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗄️ built on AbDrawer
import AbDrawer, { type AbDrawerProps } from '../ab-drawer';
// 🎨 styles
import styles from './styles.module.css';
// 👇 0.2.3 (Joseph, Welcome 0.2.21): swipe down to close
import { useAbSwipeDown } from './use-ab-swipe-down';

/** ⚙️ props: AbDrawer's, minus `side` (always bottom); scope defaults to the whole app */
export interface AbBottomDrawerProps extends Omit<AbDrawerProps, 'side'> {
  side?: AbDrawerProps['side']; // 🙈 accepted for drop-in use (AbDrawerList `as`), always rendered as bottom
  handle?: boolean; // ➖ grab handle at the top (default true; decorative)
  swipeToClose?: boolean; // 👇 0.2.3: a swipe down closes it (default true; off when `snapPoints` drives the drag)
  trigger?: RefObject<HTMLElement | null>; // ↩️ 0.2.3: focused on close (wins over everything); default = the opener, else the `[aria-controls=id]` button
}

/**
 * 📱 AbBottomDrawer: the mobile bottom sheet (God's plan: the language picker on mobile, D40). AbDrawer
 * with `side="bottom"`, `scope="app"`, the Home tokens (card surface, hairline top edge, 20px top radius,
 * grab handle, safe-area padding) and at most 560px wide, centred, above 768px.
 */
const AbBottomDrawer = ({ handle = true, scope = 'app', initialFocus = 'panel', className, swipeToClose = true, trigger, returnFocus, ...rest }: AbBottomDrawerProps): ReactElement => {
  // 🆔 the sheet needs an id: the swipe finds the portalled panel by it, and the trigger points at it (aria-controls)
  const auto = useId().replace(/[^A-Za-z0-9_-]/g, ''); // 🆔 SSR-stable
  const id = rest.id ?? `ab-bottom-drawer-${auto}`;
  // 👇 0.2.3: swipe down to close (AbDrawer's own snap drag owns the gesture when `snapPoints` is on)
  useAbSwipeDown({ id, onClose: rest.onClose, enabled: rest.open && swipeToClose && !rest.snapPoints });
  // ↩️ 0.2.3 (Joseph): focus goes back to the trigger. AbDrawer already returns it to the focused opener; Safari
  //    (and taps on iOS) never focus a clicked <button>, so the opener is <body> and AbDrawer fell back to the logo.
  //    The fallback selector is now the button that controls this sheet, and an explicit `trigger` ref wins.
  const wasOpen = useRef(rest.open); // 🧠 the previous `open`
  useEffect(() => {
    const closing = wasOpen.current && !rest.open; wasOpen.current = rest.open;
    if (!closing || !trigger?.current) return;
    const el = trigger.current; // 📌 this close's target
    const t = window.setTimeout(() => { if (el.isConnected) el.focus({ preventScroll: true }); }, 0); // ⏭️ after AbDrawer's microtask
    return () => window.clearTimeout(t);
  }, [rest.open, trigger]);
  return (
    <AbDrawer
      {...rest}
      id={id}
      returnFocus={returnFocus ?? `[aria-controls="${id}"]`} // ↩️ the trigger (when the opener wasn't focused)
      scope={scope}
      initialFocus={initialFocus}
      side="bottom"
      className={clsx('AbBottomDrawer', styles.abBottomDrawer, handle && styles.withHandle, className)}
    />
  );
};

// 📦 exports
export default AbBottomDrawer;
export { AbBottomDrawer };
export { useAbSwipeDown, isAbScrolledInside, type UseAbSwipeDownOptions } from './use-ab-swipe-down'; // 👇 0.2.3
