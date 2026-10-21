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
* @name: AbBalloon
* @file: ab-balloon/index.tsx
* @type: Client Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbBalloon title="Clear">
*     <button aria-label="Clear">×</button>
*   </AbBalloon>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { cloneElement, isValidElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FocusEvent, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
// 🌀 0.2.1: the fixed tip goes to <body> (out of the rail's stacking context)
import { createPortal } from 'react-dom';
// 🧵 classes
import clsx from 'clsx';
// 🎬 the tooltip pops in with the package keyframes (reduced-motion safe in ab-nextjs-animations)
import 'ab-nextjs-animations/pop-in/styles.css';
// 🎨 styles
import styles from './styles.module.css';

/** 🌀 a store that never changes: true on the client, false on the server */
const noSub = () => () => {};

/** ⏱️ hover delay before the balloon shows (focus shows it at once). */
export const AB_BALLOON_HOVER_DELAY = 300;

// ⚙️ props
export interface AbBalloonProps {
  /** 💬 tooltip text (same prop name as before: `title=`). */
  title?: string;
  /** 🧭 side of the trigger (default `top`). */
  placement?: 'top' | 'bottom' | 'start' | 'end';
  /** ⏱️ hover delay in ms (default 300). */
  delay?: number;
  className?: string; // 🏷️
  hidden?: boolean; // 🙈 render the child alone
  disabled?: boolean; // 🚫 no balloon
  children: ReactNode; // 🎯 the trigger (ideally ONE focusable element)
  /** 📌 0.2.1: `'fixed'` = the tip is placed in the viewport from the trigger's box, so a scrolling / clipped parent
   *  (e.g. the collapsed sidebar rail) can't cut it off. Default `'absolute'` (relative to the wrapper). */
  strategy?: 'absolute' | 'fixed';
}

/**
 * 🎈 AbBalloon (0.1.13, accessible) — a real tooltip instead of the native `title=`:
 * - ♿ `role="tooltip"` + `aria-describedby` on the trigger (added to a single element child)
 * - ⌨️ shows on keyboard focus at once, hides on blur and Escape
 * - 🖱️ shows after a 300ms hover delay, hides on leave
 * - 🎬 `popIn` from ab-nextjs-animations (no motion under prefers-reduced-motion)
 * - 🚫 JS off: the balloon shows on `:focus-within` / `:hover` with CSS alone
 */
const AbBalloon = ({ title, placement = 'top', delay = AB_BALLOON_HOVER_DELAY, className, hidden = false, disabled = false, children, strategy = 'absolute' }: AbBalloonProps): ReactElement => {
  // 🆔 tooltip id for aria-describedby
  const id = useId();
  // 👁️ open state
  const [open, setOpen] = useState(false);
  // ⏱️ hover timer
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 🧹 clear the timer
  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current); // ⏹️
    timer.current = null;
  }, []);
  // ♿ reduced motion: no popIn (ab-nextjs-animations/pop-in has no reduced-motion rule)
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)'); // 🔍
    if (!mq) return;
    const sync = () => setStill(mq.matches); // 🔄
    sync();
    mq.addEventListener?.('change', sync); // 👂
    return () => mq.removeEventListener?.('change', sync); // 🧹
  }, []);
  // 🧹 unmount
  useEffect(() => clear, [clear]);
  // 📌 0.2.1: fixed strategy: measure the trigger when it opens (6px gap, same as the CSS placements)
  const root = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<CSSProperties | undefined>(undefined);
  const mounted = useSyncExternalStore(noSub, () => true, () => false); // 🌀 portals need the DOM (false on the server)
  useLayoutEffect(() => {
    if (strategy !== 'fixed' || !open || !root.current) return; // 🚫 absolute / closed
    const r = root.current.getBoundingClientRect(); // 📐 the trigger box
    const at: Record<NonNullable<AbBalloonProps['placement']>, CSSProperties> = {
      top: { left: r.left + r.width / 2, top: r.top - 6 }, // ⬆️
      bottom: { left: r.left + r.width / 2, top: r.bottom + 6 }, // ⬇️
      start: { left: r.left - 6, top: r.top + r.height / 2 }, // ⬅️
      end: { left: r.right + 6, top: r.top + r.height / 2 }, // ➡️
    };
    setPos(at[placement]); // 📍
  }, [strategy, open, placement]);

  // 🙈 nothing to show
  if (hidden) return <>{children}</>;
  const active = !disabled && !!title; // ✅

  // 🖱️ hover in: wait `delay` ms
  const onPointerEnter = () => {
    if (!active) return;
    clear();
    timer.current = setTimeout(() => setOpen(true), delay); // ⏱️
  };
  // 🖱️ hover out
  const onPointerLeave = () => {
    clear();
    setOpen(false); // 👋
  };
  // ⌨️ focus in: show now
  const onFocus = () => {
    if (active) setOpen(true);
  };
  // ⌨️ focus left the whole balloon
  const onBlur = (e: FocusEvent<HTMLSpanElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
  };
  // ⎋ Escape dismisses (WCAG 1.4.13)
  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Escape' && open) {
      clear();
      setOpen(false);
    }
  };

  // 🔗 describe the trigger: a single element child gets aria-describedby
  const trigger = active && isValidElement<{ 'aria-describedby'?: string }>(children)
    ? cloneElement(children, { 'aria-describedby': clsx(children.props['aria-describedby'], id) || undefined })
    : children;

  return (
    <span
      className={clsx('AbBalloon', styles.abBalloon, className)} // 🏷️
      data-disabled={disabled ? 'true' : 'false'} // 🚫
      data-open={open ? 'true' : 'false'} // 👁️
      data-placement={placement} // 🧭
      data-ab-part="balloon" // 🧩
      data-strategy={strategy === 'fixed' ? 'fixed' : undefined} // 📌 0.2.1
      ref={root} // 📐
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      {trigger}
      {active && strategy !== 'fixed' && (
        <span id={id} role="tooltip" className={clsx(styles.abBalloonTip, open && !still && 'popIn')} data-ab-part="balloon-tip">
          {title}
        </span>
      )}
      {/* 📌 0.2.1 fixed: portalled to <body> so neither a scroller's clip nor a pane's stacking context can hide it */}
      {active && strategy === 'fixed' && mounted && createPortal(
        <span id={id} role="tooltip" className={clsx(styles.abBalloonTip, styles.abBalloonTipFixed, open && !still && 'popIn')} data-ab-part="balloon-tip" data-open={open ? 'true' : 'false'} data-placement={placement} style={pos}>
          {title}
        </span>,
        document.body,
      )}
    </span>
  );
};

// 📦 exports
export default AbBalloon;
export { AbBalloon };
