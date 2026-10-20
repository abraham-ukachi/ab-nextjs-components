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
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactElement, type ReactNode } from 'react';
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
// 🤏 drawers v2: the pure swipe / snap rules
import { AB_SWIPE, createAbVelocityTracker, resolveAbSheetRelease, resolveAbSideRelease, type AbSheetSnap } from './gestures';

// 📦 re-exports: one import for the whole drawer API
export { useAbDrawer };
export type { AbDrawerScope, UseAbDrawer, AbSheetSnap };
// 🤏 0.2.0: edge swipes + the pure rules, from the same entry
export { useAbEdgeSwipe, type UseAbEdgeSwipeOptions } from './use-ab-edge-swipe';
export { AB_SWIPE, resolveAbSheetRelease, resolveAbSideRelease } from './gestures';

/** 🥞 drawers v2 stacking tiers (spec z-order): aside (right) < nav (left) < sheet (bottom). Unset = the old single level. */
export type AbDrawerTier = 'aside' | 'nav' | 'sheet';

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
  initialFocus?: 'first' | 'panel' | (string & {}); // 🎯 on open: the first control (default), the panel itself, or (0.2.0) a CSS selector inside the panel, e.g. `[role=radio][aria-checked=true]`
  // 🆕 0.2.0 drawers v2 (John, God 01:22): all opt-in, the defaults keep the old drawer
  tier?: AbDrawerTier; // 🥞 stacking tier: 'aside' (z 60) < 'nav' (61) < 'sheet' (62)
  swipe?: boolean; // 🤏 side drawers: swipe the sheet back toward its edge to close (30% of the width or ≥ 0.5px/ms)
  snapPoints?: boolean; // 🧲 bottom only, below 768px: snaps at 70% (S1) and full height (S2) with a handle; gestures per the spec
  defaultSnap?: AbSheetSnap; // 🧲 where it opens (default 'partial'; e.g. 'full' for a search sheet)
  onSnapChange?: (snap: AbSheetSnap) => void; // 🔔
  handleLabels?: { expand: string; collapse: string }; // ♿ the handle button (default "Expand" / "Collapse")
  centerIn?: 'main'; // 💻 bottom only, 768px and up: centred in the main pane, min(640px, main width) wide, ≤ 70% tall
  returnFocus?: string; // ↩️ selector focused on close when there was no focusable opener (an edge swipe), e.g. the header logo link
  closeIcon?: ReactNode; // ✕ the close glyph (default a text ✕)
  headerStart?: ReactNode; // 🏷️ header content that does NOT label the dialog (e.g. a logo; then use `aria-label`). `title` wins
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
  const { tier, swipe = false, snapPoints = false, defaultSnap = 'partial', onSnapChange, handleLabels, centerIn, returnFocus, closeIcon, headerStart } = props; // 🆕 0.2.0
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
    const pick = initialFocus === 'panel' ? null : initialFocus === 'first' ? FOCUSABLE : initialFocus; // 🎯 0.2.0: or a selector
    const first = pick ? panel.current.querySelector<HTMLElement>(pick) ?? (pick !== FOCUSABLE ? panel.current.querySelector<HTMLElement>(FOCUSABLE) : null) : null; // 🎯 that, else the first control, else the panel
    first?.scrollIntoView?.({ block: 'nearest' }); // 👀 e.g. the checked language in view
    (first ?? panel.current).focus({ preventScroll: true });
    return () => {
      const had = opener.current as HTMLElement | null; // ↩️
      const usable = had && had !== document.body && had.isConnected ? had : null; // 🤏 a swipe has no opener
      const back = usable ?? (returnFocus ? document.querySelector<HTMLElement>(returnFocus) : null); // ↩️ 0.2.0 fallback
      // ⏭️ a microtask later: the inert cleanup below runs after this one, and an inert opener can't take focus
      queueMicrotask(() => { if (back && back.isConnected && typeof back.focus === 'function') back.focus({ preventScroll: true }); });
    };
  }, [open, present, layer, initialFocus, returnFocus]); // 🎯 static in practice

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

  // 🧲 0.2.0: snap state (bottom + snapPoints, below 768px) and the laptop centring (centerIn="main", 768px and up)
  const [mobile, setMobile] = useState(false); // 📱 below 768px?
  const [snap, setSnapState] = useState<AbSheetSnap>(defaultSnap); // 🧲 S1 / S2
  const [returned, setReturned] = useState(false); // ✌️ came back to S1 from S2 with a gentle drag
  const [geo, setGeo] = useState<Record<string, string>>({}); // 📐 measured CSS vars (px)
  const snapping = snapPoints && side === 'bottom' && mobile; // 🧲 live?
  const centring = centerIn === 'main' && side === 'bottom' && !mobile; // 💻 live?
  const setSnap = useCallback((next: AbSheetSnap) => { setSnapState(next); onSnapChange?.(next); }, [onSnapChange]);
  // 🔁 every open starts at defaultSnap (derived during render, like `present`)
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) { setLastOpen(open); if (open) { setSnapState(defaultSnap); setReturned(false); } }
  // 📱 follow the 768px breakpoint (the same edge core uses)
  useEffect(() => {
    if (!(snapPoints || centerIn) || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(max-width: 767px)'); // 📱
    const on = () => setMobile(mq.matches);
    on(); mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [snapPoints, centerIn]);
  // 📐 measure: S1 offset (100% − 70% of the app) and the main pane box inside the host
  useEffect(() => {
    const host = layer?.parentElement;
    if (!present || !host || !(snapping || centring)) return;
    const measure = () => {
      const hb = host === document.body ? { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight } : host.getBoundingClientRect(); // 📏
      const next: Record<string, string> = { '--ab-drawer-host-h': `${hb.height}px` };
      if (snapping) {
        const ph = panel.current?.getBoundingClientRect().height ?? hb.height; // 📏 the full-height sheet
        next['--ab-drawer-partial-offset'] = `${Math.max(0, ph - 0.7 * hb.height)}px`; // 🧲 S1 = 70% of the app visible
      }
      if (centring) {
        const main = host.querySelector<HTMLElement>('[data-ab-part="main"]')?.getBoundingClientRect(); // 📄 the main pane
        next['--ab-drawer-main-left'] = `${main ? main.left - hb.left : 0}px`;
        next['--ab-drawer-main-width'] = `${main ? main.width : hb.width}px`;
      }
      setGeo((g) => (JSON.stringify(g) === JSON.stringify(next) ? g : next)); // 🧮 no loop
    };
    measure();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null; // 👀 resizes
    ro?.observe(host); if (panel.current) ro?.observe(panel.current);
    return () => ro?.disconnect();
  }, [present, layer, snapping, centring]);

  // 🤏 0.2.0 drags: side sheets swipe toward their edge to close; the snap sheet follows the finger and resolves
  const drag = useRef<{ x: number; y: number; t: number; axis: 0 | 1 | 2; v: ReturnType<typeof createAbVelocityTracker>; el?: Element; id?: number } | null>(null); // 0 = undecided, 1 = ours, 2 = not ours
  const edgeSign = side === 'left' || side === 'start' ? -1 : side === 'right' || side === 'end' ? 1 : 0; // ⬅️ / ➡️ the closing direction
  const setDragTransform = (value: string | null) => {
    const el = panel.current; if (!el) return;
    el.toggleAttribute('data-dragging', value != null); // 🫳 CSS drops the transition while the finger leads
    if (value != null) el.style.removeProperty('--ab-motion-duration'); // 🧹 last release's speed must not beat the 0ms drag rule
    if (value == null) el.style.removeProperty('transform'); else el.style.setProperty('transform', value);
  };
  const onDragStart = (e: { clientX: number; clientY: number; timeStamp: number }, from: 'grip' | 'body') => {
    if (!(swipe && edgeSign !== 0) && !snapping) return; // 🙅 nothing to drag
    if (from === 'body' && snapping && (panel.current?.querySelector('[data-ab-part="drawer-body"]')?.scrollTop ?? 0) > 0) return; // 📜 content not at the top: let it scroll
    const v = createAbVelocityTracker(); v.add(snapping && edgeSign === 0 ? e.clientY : e.clientX, e.timeStamp);
    drag.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, axis: 0, v };
  };
  const onDragMove = (e: { clientX: number; clientY: number; timeStamp: number; preventDefault?: () => void; cancelable?: boolean }) => {
    const d = drag.current; if (!d || d.axis === 2) return;
    const dx = e.clientX - d.x; const dy = e.clientY - d.y; // ↔️ ↕️
    const vertical = edgeSign === 0; // 🧲 the bottom sheet moves on y
    if (d.axis === 0) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < AB_SWIPE.slop) return; // 🫳 still a tap
      const mine = vertical ? Math.abs(dy) > Math.abs(dx) : Math.abs(dx) > Math.abs(dy); // 🧭 our axis?
      d.axis = mine ? 1 : 2; if (!mine) return;
      if (d.el && d.id != null) d.el.setPointerCapture?.(d.id); // 📌 captured only once it IS a drag (taps on links still click)
    }
    if (e.cancelable) e.preventDefault?.(); // 🚫 no page scroll while we lead
    d.v.add(vertical ? e.clientY : e.clientX, e.timeStamp); // ⚡
    if (vertical) {
      const base = snap === 'full' ? 0 : parseFloat(geo['--ab-drawer-partial-offset'] ?? '0'); // 🧲 where it rests
      setDragTransform(`translateY(${Math.max(0, base + dy)}px)`); // ⬇️⬆️ follow (never above S2)
    } else {
      const along = dx * edgeSign; // ↔️ + = toward the edge
      setDragTransform(`translateX(${Math.max(0, along) * edgeSign}px)`); // ↔️ follow, never past open
    }
  };
  const onDragEnd = (e: { clientX: number; clientY: number; timeStamp: number }) => {
    const d = drag.current; drag.current = null;
    if (!d || d.axis !== 1) { setDragTransform(null); return; }
    const vertical = edgeSign === 0;
    const vel = d.v.velocity(); // ⚡ px/ms
    setDragTransform(null); // 🛬 hand back to CSS (the attribute transition carries on)
    if (!vertical) {
      const dist = (e.clientX - d.x) * edgeSign; // ↔️ toward the edge
      if (resolveAbSideRelease({ distance: dist, velocity: vel * edgeSign, width: panel.current?.offsetWidth ?? 320 })) close.current(); // ✅
      return;
    }
    const hostH = parseFloat(geo['--ab-drawer-host-h'] ?? '0') || window.innerHeight; // 📏
    const ph = panel.current?.offsetHeight || hostH; // 📏 S2 height
    const to = resolveAbSheetRelease({ from: snap, dy: e.clientY - d.y, velocity: vel, partialHeight: 0.7 * hostH, fullHeight: ph, returned }); // 🧲
    // ⏱️ carry the release speed: the remaining distance at that speed, between 120 and 240ms
    const ms = Math.abs(vel) > 0.05 ? Math.round(Math.min(AB_DRAWER_DURATION, Math.max(120, (0.3 * hostH) / Math.abs(vel)))) : AB_DRAWER_DURATION;
    panel.current?.style.setProperty('--ab-motion-duration', `${ms}ms`); // 🎞️ the ab-nextjs-animations token
    if (to === 'closed') { close.current(); return; }
    setReturned(snap === 'full' && to === 'partial'); // ✌️ remember the gentle return
    if (to !== snap) setSnap(to);
  };
  // 🖐️ pointer handlers (touch / pen / mouse). The grip kind rides on `data-ab-grip`, so these are plain handlers
  //    (never called during render); the pointer is captured only once the press becomes a drag
  const onGripDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    onDragStart(e, (e.currentTarget as Element).getAttribute('data-ab-grip') === 'body' ? 'body' : 'grip');
    if (drag.current) { drag.current.el = e.currentTarget as Element; drag.current.id = e.pointerId; } // 📌 for the capture
  };
  const onGripMove = (e: ReactPointerEvent) => onDragMove(e);
  const onGripUp = (e: ReactPointerEvent) => onDragEnd(e);
  const gripProps = { onPointerDown: onGripDown, onPointerMove: onGripMove, onPointerUp: onGripUp, onPointerCancel: onGripUp }; // 🖐️

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
  const head = heading ?? (headerStart != null ? <div className={styles.abDrawerTitle} data-ab-part="drawer-header-start">{headerStart}</div> : null); // 🏷️ 0.2.0
  const sizeVar = (size || snapping || centring ? { ...(size ? { '--ab-drawer-size': size } : {}), ...(snapping || centring ? geo : {}) } : undefined) as CSSProperties | undefined; // 📏 + 🧲 measured vars
  const grip = snapping || (swipe && edgeSign !== 0); // 🤏 drags on
  const handle = snapPoints && side === 'bottom'; // ➖ the handle strip

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
        <div className={styles.abDrawerFrame} data-state={shown ? 'open' : 'closed'} data-side={side} data-scope={scope} data-tier={tier}>
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
            data-snap={snapping ? snap : undefined} // 🧲 0.2.0: CSS places S1 / S2
            data-center={centring ? 'main' : undefined} // 💻 0.2.0: centred in the main pane
            data-swipe={grip ? 'true' : undefined} // 🤏 touch-action hooks
            style={sizeVar}
            {...(swipe && edgeSign !== 0 ? { ...gripProps, 'data-ab-grip': 'body' } : {})}
          >
            {handle && (snapping ? (
              // ➖ 0.2.0: the handle (40×4 bar in a 24px strip, 44px touch zone): a button that toggles S1 / S2
              <button type="button" className={styles.abDrawerHandle} data-ab-part="drawer-handle" aria-expanded={snap === 'full'} aria-label={snap === 'full' ? handleLabels?.collapse ?? 'Collapse' : handleLabels?.expand ?? 'Expand'} onClick={() => { setReturned(false); setSnap(snap === 'full' ? 'partial' : 'full'); }} data-ab-grip="grip" {...gripProps} />
            ) : <div className={styles.abDrawerHandle} data-ab-part="drawer-handle" aria-hidden="true" />)}
            <div className={styles.abDrawerHeader} data-ab-part="drawer-header" {...(snapping ? { ...gripProps, 'data-ab-grip': 'grip' } : {})}>
              {head}
              <button type="button" className={styles.abDrawerClose} data-ab-part="drawer-close" aria-label={closeLabel} onClick={() => close.current()}>
                {closeIcon ?? <span aria-hidden="true">✕</span>}
              </button>
            </div>
            <div className={styles.abDrawerBody} data-ab-part="drawer-body" {...(snapping ? { ...gripProps, 'data-ab-grip': 'body' } : {})}>{children}</div>
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
