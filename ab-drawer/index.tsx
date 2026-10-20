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
* @name: AbDrawer (G53)
* @file: ab-drawer/index.tsx
* @type: Client component (SSR: in-flow no-JS fallback)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const drawer = useAbDrawer('main')
*    -|> <button {...drawer.triggerProps}>Filters</button>
*    -|> <AbDrawer {...drawer.drawerProps} side="end" title="Filters">…</AbDrawer>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';
// 🌀 portal into the scope's drawer layer
import { createPortal } from 'react-dom';
// 🧵 classes
import clsx from 'clsx';
// 🎨 styles
import styles from './styles.module.css';
// 🎬 motion classes (ab-nextjs-animations >= 0.2.4): the slide + the scrim fade, reduced motion included
import { AB_MOTION } from 'ab-nextjs-animations/motion';
import 'ab-nextjs-animations/motion/styles.css';
// 🎛️ the controller hook + scope type
import { useAbDrawer, type AbDrawerScope, type UseAbDrawer } from './use-ab-drawer';

// 📦 re-exports: one import for the whole drawer API
export { useAbDrawer };
export type { AbDrawerScope, UseAbDrawer };

/** 🧭 where it slides in from. `start` / `end` follow the writing direction (RTL-aware). */
export type AbDrawerSide = 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end';

/** ⚙️ props */
export interface AbDrawerProps {
  open: boolean; // 🚪 controlled
  onClose: () => void; // ⎋ Escape, scrim click and the close button call it
  scope?: AbDrawerScope; // 🗺️ which box clips it (default `app`)
  side?: AbDrawerSide; // 🧭 default `bottom`
  title?: ReactNode; // 🏷️ a string becomes the `<h2>` that labels the dialog
  'aria-labelledby'?: string; // ♿ your own visible title id (wins over `title`)
  'aria-label'?: string; // ♿ when there is no visible title
  id?: string; // 🆔 the dialog id (`aria-controls` target)
  children?: ReactNode; // 📄 the body (it scrolls on its own)
  footer?: ReactNode; // 🔚 actions row (stays put)
  size?: string; // 📏 width (start/end/left/right) or height (top/bottom), e.g. `360px`
  modal?: boolean; // 🔒 trap focus + make the rest of the scope inert (default `true`)
  closeLabel?: string; // 🌍 default "Close"
  noJsFallback?: boolean; // 🧩 D41: without JS, render the content in flow (default `true`)
  initialFocus?: 'first' | 'panel'; // 🎯 on open: the first control (default) or the panel itself (no ring on the ✕; Tab then enters)
  className?: string; // 🏷️
}

/** ⏱️ the slide, same as the panes aside (core 0.1.6) */
export const AB_DRAWER_DURATION = 240;

// 🔎 the element each scope is clipped by (core 0.1.6 data-ab-part hooks)
const SCOPE_SELECTOR: Record<AbDrawerScope, string> = {
  app: '.AbAppLayout', // 🏠 the whole app box
  main: '[data-ab-part="main"]', // 📄 the main pane (not its scroller, so the drawer doesn't scroll away)
  aside: '[data-ab-part="aside"]', // 📑 the aside pane
};

/**
 * 🗺️ getAbDrawerHost — the box a drawer of `scope` is clipped by: the scope element that contains `from`
 * (so two layouts on a page each get their own), else the first one in the document, else `<body>`.
 * Effects / handlers only (it reads the DOM).
 */
export function getAbDrawerHost(scope: AbDrawerScope, from?: Element | null): HTMLElement {
  const sel = SCOPE_SELECTOR[scope]; // 🔎
  return from?.closest<HTMLElement>(sel) ?? document.querySelector<HTMLElement>(sel) ?? document.body; // 🎯
}

// ♿ everything that can take focus inside the panel
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

// 📍 hosts with a drawer layer, ref-counted: `data-ab-drawer-host` stays while ANY drawer still uses the box.
// CSS (`:where([data-ab-drawer-host])`, zero specificity) gives a static host `position: relative`; no inline
// styles are written. A core rule on its layout boxes could replace this later.
const hostCount = new WeakMap<HTMLElement, number>();
const holdHost = (host: HTMLElement) => { const n = (hostCount.get(host) ?? 0) + 1; hostCount.set(host, n); host.setAttribute('data-ab-drawer-host', ''); };
const releaseHost = (host: HTMLElement) => {
  const n = (hostCount.get(host) ?? 1) - 1;
  if (n > 0) { hostCount.set(host, n); return; }
  hostCount.delete(host); host.removeAttribute('data-ab-drawer-host'); // 🧹 last one out
};

// 🥞 open drawers, newest last: only the top one answers Escape / Tab (a drawer opened from a drawer)
const openStack: symbol[] = [];
/** 🥞 is `token` the topmost open drawer? */
const isTopDrawer = (token: symbol): boolean => openStack[openStack.length - 1] === token;

// ♿ reduced-motion check, read once per open / close on purpose: it only picks the unmount delay for THAT
// toggle (the slide itself is CSS, which follows the media query live), so a listener would buy nothing
const reducedMotion = (): boolean => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 🗄️ AbDrawer (G53) — a panel that slides in from any side, clipped by its **scope** (app / main / aside).
 *
 * - 📐 Rendered into an absolute `inset: 0` layer INSIDE the scope box, so it never makes the document scroll
 *   (the D34 rule); its body is its own scroller (`overscroll-behavior: contain`).
 * - ♿ `role="dialog"` + `aria-modal`, labelled by `title` / `aria-labelledby`; focus moves in on open, is
 *   trapped (Tab / Shift+Tab), and returns to the opener on close; Escape and a scrim click close it;
 *   the rest of the scope is `inert` while it's open (only the scope, unless `scope="app"`).
 * - 🎞️ 240ms slide; no motion and instant open/close under `prefers-reduced-motion`.
 * - 🧱 Scopes need **ab-nextjs-core 0.1.6+** markup (`.AbAppLayout`, `[data-ab-part="main"]`, `[data-ab-part="aside"]`);
 *   with older core (or no layout) it falls back to a viewport layer on `<body>`.
 * - 🧩 D41 no-JS: the server renders the content as an in-flow `<section>` (hidden as soon as scripting runs).
 */
const AbDrawer = (props: AbDrawerProps): ReactElement => {
  const { open, onClose, scope = 'app', side = 'bottom', title, id, children, footer, size, modal = true, closeLabel = 'Close', noJsFallback = true, initialFocus = 'first', className } = props;
  const auto = useId().replace(/[^A-Za-z0-9_-]/g, ''); // 🆔 SSR-stable
  const dialogId = id ?? `ab-drawer-${auto}`; // 🆔
  const titleId = `${dialogId}-title`; // 🏷️
  const labelledBy = props['aria-labelledby'] ?? (title != null ? titleId : undefined); // ♿
  const anchor = useRef<HTMLDivElement>(null); // 📍 where we are in the tree (picks the right layout)
  const panel = useRef<HTMLDivElement>(null); // 🗄️
  const opener = useRef<Element | null>(null); // ↩️ focus goes back here
  const close = useRef(onClose); // 🔁 latest onClose for the listeners
  useEffect(() => { close.current = onClose; }, [onClose]); // 🔁 synced after render, never during

  // 🧭 client-only state: the layer we portal into, whether the panel is in the DOM, whether it's slid in
  const [layer, setLayer] = useState<HTMLElement | null>(null);
  const [present, setPresent] = useState(open); // 🧱 mounted (open, or sliding out)
  const [shown, setShown] = useState(false); // 🎞️ slid in
  const [token] = useState(() => Symbol('ab-drawer')); // 🥞 our place in the open stack

  // 🗺️ find the scope box once we're on the client and make a layer in it
  useEffect(() => {
    const host = getAbDrawerHost(scope, anchor.current); // 🎯
    const el = document.createElement('div'); // 🧱 one layer per drawer (no shared state to clean up)
    el.setAttribute('data-ab-drawer-layer', scope);
    el.className = clsx('AbDrawerLayer', styles.abDrawerLayer);
    if (host === document.body) el.setAttribute('data-host', 'body'); // 📌 no layout: cover the viewport
    host.appendChild(el);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 🌀 the layer is external DOM that only exists after mount (SSR keeps the in-flow fallback); one extra render on hydration is the point
    setLayer(el);
    return () => { el.remove(); setLayer(null); }; // 🧹
  }, [scope]);

  // 📍 hold the host (position context) while the panel is in the DOM (open or sliding out)
  useEffect(() => {
    const host = layer?.parentElement;
    if (!present || !host || host === document.body) return; // 📌 body layer is fixed: no context needed
    holdHost(host);
    return () => releaseHost(host);
  }, [present, layer]);

  // 🧮 derived during render (React's "adjust state on prop change"): open mounts at once, close starts the slide out
  if (open && !present) setPresent(true);
  if (!open && shown) setShown(false);

  // 🎞️ open → mount, then slide in on the next frame; close → slide out, then unmount
  useEffect(() => {
    const ms = reducedMotion() ? 0 : AB_DRAWER_DURATION; // ♿
    if (open) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); // 🛝 two frames: start state painted first
      return () => cancelAnimationFrame(raf);
    }
    const t = window.setTimeout(() => setPresent(false), ms); // ⏱️ one timer, so quick toggles never race
    return () => window.clearTimeout(t);
  }, [open]);

  // ↩️ remember the trigger the moment we open (before the scope turns inert and blurs it)
  useEffect(() => { if (open && !panel.current?.contains(document.activeElement)) opener.current = document.activeElement; }, [open]);

  // ♿ focus in on open, back to the opener on close
  useEffect(() => {
    if (!open || !present || !panel.current) return;
    const first = initialFocus === 'panel' ? null : panel.current.querySelector<HTMLElement>(FOCUSABLE); // 🎯 first control, else the panel
    (first ?? panel.current).focus({ preventScroll: true });
    return () => {
      const back = opener.current as HTMLElement | null; // ↩️
      // ⏭️ a microtask later: the inert cleanup below runs after this one, and an inert opener can't take focus
      queueMicrotask(() => { if (back && back.isConnected && typeof back.focus === 'function') back.focus({ preventScroll: true }); });
    };
  }, [open, present, layer, initialFocus]); // 🎯 initialFocus is static in practice

  // 🔒 the rest of the scope is inert while open (modal only); we only undo what we set
  useEffect(() => {
    if (!open || !modal || !layer?.parentElement) return;
    const touched: HTMLElement[] = [];
    for (const sib of Array.from(layer.parentElement.children) as HTMLElement[]) {
      if (sib === layer || sib.hasAttribute('inert') || sib.hasAttribute('data-ab-drawer-layer')) continue; // 🙅 ours / already inert / other drawers
      sib.setAttribute('inert', ''); touched.push(sib); // 🧊
    }
    return () => { for (const el of touched) el.removeAttribute('inert'); }; // 🔓
  }, [open, modal, layer]);

  // 🥞 join the open stack while open (StrictMode-safe: cleanup removes exactly us)
  useEffect(() => {
    if (!open) return;
    openStack.push(token);
    return () => { const i = openStack.lastIndexOf(token); if (i >= 0) openStack.splice(i, 1); };
  }, [open, token]);

  // ⎋ Escape closes (skips events an inner menu already handled); Tab stays inside (modal). Topmost drawer only
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!panel.current || !isTopDrawer(token)) return; // 🥞 a drawer under another one stays put
    if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); close.current(); return; } // ⎋
    if (e.key !== 'Tab' || !modal) return;
    const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0 || el === document.activeElement); // 👀 rendered (keeps position: fixed, which has no offsetParent)
    if (items.length === 0) { e.preventDefault(); panel.current.focus(); return; } // 🔒 nothing to tab to
    const [a, z] = [items[0], items[items.length - 1]];
    const inside = panel.current.contains(document.activeElement);
    if (e.shiftKey && (document.activeElement === a || !inside)) { e.preventDefault(); z.focus(); } // ⬅️ wrap
    else if (!e.shiftKey && (document.activeElement === z || !inside)) { e.preventDefault(); a.focus(); } // ➡️ wrap
  }, [modal, token]);
  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', onKeyDown); // 🎧 document-level, so Escape works wherever focus is
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onKeyDown]);

  // 🏷️ a plain-string title becomes the labelling heading
  const heading = title == null ? null : typeof title === 'string' || typeof title === 'number'
    ? <h2 id={titleId} className={styles.abDrawerTitle}>{title}</h2>
    : <div id={props['aria-labelledby'] ? undefined : titleId} className={styles.abDrawerTitle}>{title}</div>;
  const sizeVar = size ? ({ '--ab-drawer-size': size } as CSSProperties) : undefined; // 📏

  // 🧩 D41: before hydration (and with no JS at all) the content is an in-flow section
  if (!layer) {
    return (
      <div ref={anchor} className={styles.abDrawerAnchor} data-ab-part="drawer-anchor">
        {noJsFallback ? (
          <section className={clsx('AbDrawerFallback', styles.abDrawerFallback)} data-ab-part="drawer-fallback" aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : props['aria-label']}>
            {heading}
            <div className={styles.abDrawerBody}>{children}</div>
            {footer != null && <div className={styles.abDrawerFooter}>{footer}</div>}
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={anchor} className={styles.abDrawerAnchor} data-ab-part="drawer-anchor">
      {present && createPortal(
        <div className={styles.abDrawerFrame} data-state={shown ? 'open' : 'closed'} data-side={side} data-scope={scope}>
          {/* 🌫️ scrim: a click closes (pointer only; keyboard users have Escape and the close button) */}
          <div className={clsx(styles.abDrawerScrim, AB_MOTION.colors)} data-ab-part="drawer-scrim" aria-hidden="true" onClick={() => close.current()} />
          <div
            ref={panel}
            id={dialogId}
            role="dialog"
            aria-modal={modal ? 'true' : undefined}
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : props['aria-label']}
            tabIndex={-1} // 🎯 focus target when there are no controls
            className={clsx('AbDrawer', styles.abDrawer, AB_MOTION.transform, className)}
            data-ab-part="drawer"
            data-side={side}
            style={sizeVar}
          >
            <div className={styles.abDrawerHeader}>
              {heading}
              <button type="button" className={styles.abDrawerClose} data-ab-part="drawer-close" aria-label={closeLabel} onClick={() => close.current()}>
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className={styles.abDrawerBody} data-ab-part="drawer-body">{children}</div>
            {footer != null && <div className={styles.abDrawerFooter} data-ab-part="drawer-footer">{footer}</div>}
          </div>
        </div>,
        layer,
      )}
    </div>
  );
};

// 📦 exports
export default AbDrawer;
export { AbDrawer };
