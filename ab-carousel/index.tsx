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
* @name: AbCarousel - Client (G31)
* @file: ab-carousel/index.tsx
* @type: Component (client) — compound: AbCarousel + Track / Slide / Prev / Next / Dots / Counter
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbCarousel label="Introduction to AbElements" titles={titles}>
*    -|>   <AbCarouselTrack>{slides.map((s) => <AbCarouselSlide key={s.id}>{s.body}</AbCarouselSlide>)}</AbCarouselTrack>
*    -|>   <footer><AbCarouselDots /><AbCarouselPrev /><AbCarouselNext /></footer>
*    -|> </AbCarousel>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React runtime + types
import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
// 🧵 class-name joiner
import clsx from 'clsx';
// 👆 G32 swipe hook (single-hook subpath → no whole-barrel import)
import { useAbSwipe } from 'ab-nextjs-hooks/useAbSwipe';
// ♿ G32 reduced-motion hook
import { useAbReducedMotion } from 'ab-nextjs-hooks/useAbReducedMotion';
// 🧮 pure helpers (also importable from server components via `ab-carousel/helpers`)
import {
  AB_CAROUSEL_KEY_IGNORE_SELECTOR,
  clampAbCarouselIndex,
  defaultAbCarouselAnnouncement,
  defaultAbCarouselDotLabel,
  defaultAbCarouselSlideLabel,
  getAbCarouselKeyAction,
  getAbCarouselSlidePosition,
  padAbCarouselNumber,
  type AbCarouselChangeReason,
  type AbCarouselDir,
} from './helpers';
// 🎨 package-shipped CSS module
import styles from './styles.module.css';
// 🔣 AbIcons SVG (G2)
import AbIcon from '../ab-icon';
// 🎬 all carousel motion comes from ab-nextjs-animations (>= 0.2.4): direction-aware slide steps + state transitions
import { getAbSlideStepDirection, AB_SLIDE_STEP_IN_CLASS, AB_SLIDE_STEP_OUT_CLASS, type AbSlideStepDirection } from 'ab-nextjs-animations/slide-step';
import { AB_MOTION } from 'ab-nextjs-animations/motion';
import 'ab-nextjs-animations/slide-step/styles.css'; // ➡️⬅️ .ab-slide-step-in / -out
import 'ab-nextjs-animations/motion/styles.css'; // 🎨 .ab-motion-*

// 📦 re-export the helpers + types so client callers need one import
export * from './helpers';

// ===== TYPES ===== //

// 📣 metadata passed to onIndexChange
export interface AbCarouselChange {
  // 📣 what triggered the change
  reason: AbCarouselChangeReason;
  // ⏮️ index before the change
  from: number;
}

// ⚙️ <AbCarousel /> props
export interface AbCarouselProps {
  // 🏷️ accessible name of the carousel region (required, e.g. "Introduction to AbElements")
  label: string;
  // 🎛️ controlled active index (pair with onIndexChange)
  index?: number;
  // 🏁 uncontrolled starting index (default 0)
  defaultIndex?: number;
  // 📣 called with the NEW index on every requested change (controlled + uncontrolled)
  onIndexChange?: (index: number, change: AbCarouselChange) => void;
  // 🔢 number of slides; auto-counted from <AbCarouselTrack> children when omitted
  count?: number;
  // 📰 optional slide titles (used by the live region and dot labels)
  titles?: ReadonlyArray<string | undefined>;
  // 🔁 wrap from last to first (default false: Welcome stops at both ends)
  loop?: boolean;
  // 🌍 reading direction; default follows <html dir> live
  dir?: AbCarouselDir;
  // ⌨️ ←/→ + Home/End while focus is inside (default true)
  keyboard?: boolean;
  // 👆 touch swipe on the track (default true)
  swipe?: boolean;
  // 📏 swipe distance threshold in px (default 48)
  swipeThreshold?: number;
  // 🙈 drag-start selector ignored by swipe (default `[data-ab-swipe-ignore]`)
  swipeIgnore?: string;
  // ♿ 'auto' follows prefers-reduced-motion, 'always' forces calm, 'never' always animates (default 'auto')
  reducedMotion?: 'auto' | 'always' | 'never';
  // 🏷️ slide aria-label factory (default "3 of 9")
  slideLabel?: (n: number, total: number) => string;
  // 📣 live-region text factory, or false to disable announcements (default "Slide 3 of 9: Title")
  announce?: ((n: number, total: number, title?: string) => string) | false;
  // 📏 0.2.3 (Joseph, Welcome 0.2.21): size the track to the ACTIVE slide (animated, reduced-motion aware)
  //    instead of the tallest one (default false: one grid cell, height = tallest, CLS 0)
  autoHeight?: boolean;
  // 🧱 element for the region (default 'section')
  as?: 'section' | 'div';
  // 🆔 id of the region
  id?: string;
  // 🏷️ extra classes
  className?: string;
  // 🎨 inline style (e.g. `--ab-carousel-duration: 200ms`)
  style?: CSSProperties;
  // 🔗 ref to the region element (React 19 ref-as-prop)
  ref?: Ref<HTMLElement>;
  // 🧩 track, slides, controls and any layout around them
  children?: ReactNode;
}

// 🧠 everything the parts (and useAbCarousel) can read
export interface AbCarouselContextValue {
  // 📍 active index
  index: number;
  // 🔢 slide count
  count: number;
  // 🔁 wraps?
  loop: boolean;
  // 🌍 resolved reading direction
  dir: AbCarouselDir;
  // ♿ calm mode active?
  reducedMotion: boolean;
  // 🟢 hydrated on the client? (inert / aria-hidden are only applied after hydration → no-JS stays usable)
  hydrated: boolean;
  // 🧭 direction of the last move ('forward' | 'back'); null until the first move (no entry animation on load)
  direction: AbSlideStepDirection | null;
  // ⏮️ the slide that was active before the last move (plays the leave animation); -1 before any move
  previousIndex: number;
  // 🎯 go to an index
  goTo: (index: number, reason?: AbCarouselChangeReason) => void;
  // ⏭️ next slide
  next: (reason?: AbCarouselChangeReason) => void;
  // ⏮️ previous slide
  prev: (reason?: AbCarouselChangeReason) => void;
  // ⏮️ is there a previous slide?
  canPrev: boolean;
  // ⏭️ is there a next slide?
  canNext: boolean;
  // 📰 titles (may be empty)
  titles: ReadonlyArray<string | undefined>;
  // 🏷️ slide label factory
  slideLabel: (n: number, total: number) => string;
  // 🆔 id of the track (aria-controls target)
  trackId: string;
  // 🆔 id of slide i
  slideId: (i: number) => string;
  // 📏 0.2.3: does the track follow the active slide's height?
  autoHeight: boolean;
  // 👆 swipe settings (read by the track)
  swipe: { enabled: boolean; threshold?: number; ignore?: string };
}

// 🧠 the context (null outside <AbCarousel>)
const AbCarouselContext = createContext<AbCarouselContextValue | null>(null);
// 🔢 per-slide index context (set by the track)
const AbCarouselSlideIndexContext = createContext<number>(-1);

/**
 * 🪝 useAbCarousel — read the carousel state from any element inside <AbCarousel>.
 * Use it for custom controls such as the Welcome "Skip" link: `const { goTo, count } = useAbCarousel()`.
 */
export function useAbCarousel(): AbCarouselContextValue {
  // 🔍 nearest carousel
  const ctx = useContext(AbCarouselContext);
  // 💥 used outside → explain how to fix it
  if (!ctx) throw new Error('useAbCarousel() must be used inside <AbCarousel> or <AbCarouselProvider>.');
  // 📦
  return ctx;
}

// ===== INTERNAL HELPERS ===== //

// 🧩 expand fragments + arrays into a flat list of valid elements
function flattenAbSlides(children: ReactNode): ReactElement[] {
  // 📦 result
  const out: ReactElement[] = [];
  // 🔁 Children.toArray flattens arrays and drops null / booleans
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue; // 🙅 text nodes are not slides
    // 🧩 <>…</> → look inside
    if (child.type === Fragment) out.push(...flattenAbSlides((child.props as { children?: ReactNode }).children));
    else out.push(child); // ✅ a slide
  }
  return out; // 📦
}

// 🔍 find <AbCarouselTrack> in the element tree and count its slides (null when not visible from here)
function countAbCarouselSlides(children: ReactNode): number | null {
  // 🔁 breadth-first over the visible element tree
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue; // 🙅
    const props = child.props as { children?: ReactNode }; // 🧩
    if (child.type === AbCarouselTrack) return flattenAbSlides(props.children).length; // ✅ found it
    const nested = countAbCarouselSlides(props.children); // 🔎 dig (layout wrappers like <main>, <div>)
    if (nested !== null) return nested; // ✅
  }
  return null; // 🤷 hidden inside a custom component → pass `count`
}

// 🟢 hydration flag without setState-in-effect: false on the server + hydration pass, true afterwards
const subscribeNothing = () => () => {};
const useAbHydrated = (): boolean => useSyncExternalStore(subscribeNothing, () => true, () => false);

// 🌍 live <html dir> (server: 'ltr')
function subscribeAbDocumentDir(onChange: () => void): () => void {
  // 🚫 no DOM / observer
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return () => {};
  // 👀 watch the dir attribute
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
  // 🧹
  return () => observer.disconnect();
}
const readAbDocumentDir = (): AbCarouselDir => (document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr');
const readAbServerDir = (): AbCarouselDir => 'ltr';

// ===== <AbCarousel /> ===== //

/**
 * 🎠 AbCarousel — accessible slide carousel / walkthrough (Welcome v6, gap G31).
 *
 * ♿ a11y (WAI-ARIA APG carousel pattern):
 * - region `aria-roledescription="carousel"` + `aria-label`
 * - each slide `role="group"` + `aria-roledescription="slide"` + `aria-label="3 of 9"`;
 *   inactive slides are `inert` + `aria-hidden` once hydrated (SSR / no-JS keeps them readable)
 * - polite live region announces "Slide 3 of 9: Title" on change (never on first load)
 * - ←/→ (RTL-aware) + Home/End only while focus is inside, and never inside tabs / inputs / radio groups
 * - swipe is optional sugar: buttons + dots always exist
 * - no autoplay, ever
 *
 * 🎬 Motion: slides cross-fade + shift 24px (280ms); reduced motion → 120ms fade, no transform.
 */
// ⚙️ 0.2.3: the provider takes the state props only (no element of its own)
export type AbCarouselProviderProps = Omit<AbCarouselProps, 'as' | 'id' | 'className' | 'style' | 'ref'>;

// 🧷 0.2.3: what the region element needs (spread by <AbCarousel>, or by the consumer in headless mode)
export interface AbCarouselRegionProps {
  className: string; // 🏷️ 'AbCarousel' + the module class (carries the slide-step tokens)
  'aria-roledescription': 'carousel'; // ♿
  'aria-label': string; // 🏷️
  'data-ab-part': 'carousel'; // 🧩
  'data-dir': AbCarouselDir; // 🌍
  'data-reduced-motion': string; // ♿ CSS switch
  'data-ab-reduced-motion': string; // ♿ ab-nextjs-animations switch
  'data-ab-direction'?: AbSlideStepDirection; // 🧭
  'data-hydrated': string; // 🟢
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void; // ⌨️ ←/→ Home/End while focus is inside
}

// 🧠 0.2.3: region props + the live message, for headless consumers (null outside a provider)
const AbCarouselRegionContext = createContext<{ regionProps: AbCarouselRegionProps; message: string } | null>(null);

/**
 * 🧠 the whole carousel brain (state, ids, keyboard, announcements), shared by <AbCarousel> and
 * <AbCarouselProvider>. Internal: render either of those, not this.
 */
function useAbCarouselController(props: AbCarouselProviderProps): { value: AbCarouselContextValue; regionProps: AbCarouselRegionProps; message: string } {
  // 🧩 destructure with defaults
  const {
    label, // 🏷️
    index: indexProp, // 🎛️
    defaultIndex = 0, // 🏁
    onIndexChange, // 📣
    count: countProp, // 🔢
    titles = [], // 📰
    loop = false, // 🔁
    dir: dirProp, // 🌍
    keyboard = true, // ⌨️
    swipe = true, // 👆
    swipeThreshold, // 📏
    swipeIgnore, // 🙈
    reducedMotion: reducedMotionMode = 'auto', // ♿
    autoHeight = false, // 📏 0.2.3
    slideLabel = defaultAbCarouselSlideLabel, // 🏷️
    announce = defaultAbCarouselAnnouncement, // 📣
    children, // 🧩 (only used to count the slides)
  } = props;

  // 🔢 slide count: explicit, else counted from the track
  const count = Math.max(0, countProp ?? countAbCarouselSlides(children) ?? 0);

  // 🎛️ controlled?
  const isControlled = indexProp !== undefined;
  // 📦 uncontrolled state (clamped once)
  const [innerIndex, setInnerIndex] = useState(() => clampAbCarouselIndex(defaultIndex, count));
  // 📍 active index (always clamped for rendering)
  const index = clampAbCarouselIndex(isControlled ? (indexProp as number) : innerIndex, count);

  // 🌍 reading direction: prop wins, else live <html dir>
  const documentDir = useSyncExternalStore(subscribeAbDocumentDir, readAbDocumentDir, readAbServerDir);
  const dir: AbCarouselDir = dirProp ?? documentDir;

  // ♿ reduced motion
  const osReduced = useAbReducedMotion();
  const reducedMotion = reducedMotionMode === 'always' || (reducedMotionMode === 'auto' && osReduced);

  // 🟢 hydrated?
  const hydrated = useAbHydrated();

  // 🆔 stable ids
  const baseId = useId();
  const trackId = `${baseId}-track`;
  const slideId = useCallback((i: number) => `${baseId}-slide-${i}`, [baseId]);

  // 📣 live region: announce only after the index changed at least once ("adjust state while rendering")
  const [lastIndex, setLastIndex] = useState(index);
  const [announcing, setAnnouncing] = useState(false);
  // 🧭 direction + previous slide for the ab-nextjs-animations slide step
  const [direction, setDirection] = useState<AbSlideStepDirection | null>(null);
  const [previousIndex, setPreviousIndex] = useState(-1);
  if (lastIndex !== index) {
    setPreviousIndex(lastIndex); // ⏮️ this one leaves
    setDirection(getAbSlideStepDirection(lastIndex, index, count, loop)); // 🧭 shortest way round when looping
    setLastIndex(index); // 📍 remember
    setAnnouncing(true); // 📣 from now on, speak
  }
  const message = announcing && announce ? announce(index + 1, count, titles[index]) : '';

  // 🎯 change the index (clamped / wrapped); no-op when unchanged
  const goTo = useCallback((target: number, reason: AbCarouselChangeReason = 'api') => {
    // 🔒 resolve the target
    const nextIndex = clampAbCarouselIndex(target, count, loop);
    // 🙅 nothing to do
    if (nextIndex === index || count === 0) return;
    // 📦 uncontrolled → own the state
    if (!isControlled) setInnerIndex(nextIndex);
    // 📣 tell the parent (controlled callers update `index` here)
    onIndexChange?.(nextIndex, { reason, from: index });
  }, [count, loop, index, isControlled, onIndexChange]);

  // ⏭️ / ⏮️
  const next = useCallback((reason: AbCarouselChangeReason = 'next') => goTo(index + 1, reason), [goTo, index]);
  const prev = useCallback((reason: AbCarouselChangeReason = 'prev') => goTo(index - 1, reason), [goTo, index]);
  // 🚦 edges
  const canPrev = count > 1 && (loop || index > 0);
  const canNext = count > 1 && (loop || index < count - 1);

  // ⌨️ keyboard (only while focus is inside the region: the handler lives on the region)
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!keyboard || event.defaultPrevented) return; // 🔌 off / handled already
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return; // 🙅 shortcuts belong to the browser
    const target = event.target as HTMLElement | null; // 🎯
    if (target?.closest?.(AB_CAROUSEL_KEY_IGNORE_SELECTOR)) return; // 🙈 tabs / inputs own their arrows
    const action = getAbCarouselKeyAction(event.key, dir); // 🗺️
    if (!action) return; // 🙅
    event.preventDefault(); // 🛑 no page scroll on Home/End
    if (action === 'next') next('key'); // ⏭️
    else if (action === 'prev') prev('key'); // ⏮️
    else if (action === 'first') goTo(0, 'key'); // ⏮️⏮️
    else goTo(count - 1, 'key'); // ⏭️⏭️
  };

  // 🧠 context value (memoised)
  const value = useMemo<AbCarouselContextValue>(() => ({
    index, count, loop, dir, reducedMotion, hydrated, direction, previousIndex, goTo, next, prev, canPrev, canNext, titles, slideLabel, trackId, slideId, autoHeight,
    swipe: { enabled: swipe && count > 1, threshold: swipeThreshold, ignore: swipeIgnore },
  }), [index, count, loop, dir, reducedMotion, hydrated, direction, previousIndex, goTo, next, prev, canPrev, canNext, titles, slideLabel, trackId, slideId, autoHeight, swipe, swipeThreshold, swipeIgnore]);

  // 🧷 the region's attributes (memo-free: cheap, and onKeyDown closes over the latest state)
  const regionProps: AbCarouselRegionProps = {
    className: clsx('AbCarousel', styles.carousel), // 🏷️ + the slide-step tokens
    'aria-roledescription': 'carousel', // ♿ "carousel" instead of "region"
    'aria-label': label, // 🏷️ accessible name
    'data-ab-part': 'carousel', // 🧩 part hook
    'data-dir': dir, // 🌍
    'data-reduced-motion': String(reducedMotion), // ♿ CSS switch
    'data-ab-reduced-motion': String(reducedMotion), // ♿ ab-nextjs-animations switch (prop OR OS)
    'data-ab-direction': direction ?? undefined, // 🧭 forward / back for .ab-slide-step-*
    'data-hydrated': String(hydrated), // 🟢
    onKeyDown, // ⌨️
  };
  return { value, regionProps, message }; // 📦
}

/**
 * 🎠 AbCarousel — accessible slide carousel / walkthrough (Welcome v6, gap G31). See the a11y notes above
 * `useAbCarouselController`. It renders the region element itself; for a layout where the carousel can't own one
 * wrapper (e.g. it would have to wrap <main>), use <AbCarouselProvider> + useAbCarouselRegion() instead.
 */
export function AbCarousel(props: AbCarouselProps) {
  const { as: Tag = 'section', id, className, style, ref, children } = props; // 🧱 element props
  const { value, regionProps, message } = useAbCarouselController(props); // 🧠
  // 🖼️ render
  return (
    <AbCarouselContext.Provider value={value}>
      <AbCarouselRegionContext.Provider value={{ regionProps, message }}>
        <Tag
          ref={ref as Ref<HTMLElement & HTMLDivElement>} // 🔗
          id={id} // 🆔
          {...regionProps} // ♿ roledescription / label / data-* / keyboard
          className={clsx(regionProps.className, className)} // 🏷️
          style={style} // 🎨
        >
          {children}
          {/* 📣 polite live region (visually hidden) */}
          <div className={styles.srOnly} aria-live="polite" aria-atomic="true" data-ab-part="status">{message}</div>
        </Tag>
      </AbCarouselRegionContext.Provider>
    </AbCarouselContext.Provider>
  );
}

// ===== 0.2.3 HEADLESS MODE: <AbCarouselProvider /> + useAbCarouselRegion() + <AbCarouselStatus /> ===== //

/**
 * 🧠 AbCarouselProvider — 0.2.3 (Joseph, Welcome 0.2.21): the carousel state WITHOUT an element, so it no longer
 * has to wrap <main>. Put it high enough for every control (header counter, aside dots, main track), then mark
 * ONE element as the region with `useAbCarouselRegion()` and drop <AbCarouselStatus /> inside it:
 *
 *   <AbCarouselProvider label="Welcome" count={9}>
 *     <AbAppLayout mainHeader={<AbCarouselCounter />} main={<Slides />} />
 *   </AbCarouselProvider>
 *   function Slides() { const region = useAbCarouselRegion(); return (
 *     <div {...region}><AbCarouselTrack>…</AbCarouselTrack><AbCarouselStatus /></div>) }
 *
 * 🔢 Pass `count` when the track isn't a direct (element-tree) descendant of the provider's children.
 */
export function AbCarouselProvider(props: AbCarouselProviderProps) {
  const { value, regionProps, message } = useAbCarouselController(props); // 🧠
  return (
    <AbCarouselContext.Provider value={value}>
      <AbCarouselRegionContext.Provider value={{ regionProps, message }}>{props.children}</AbCarouselRegionContext.Provider>
    </AbCarouselContext.Provider>
  );
}

/** 🧷 useAbCarouselRegion — 0.2.3: the attributes for YOUR region element (spread them; merge your own className). */
export function useAbCarouselRegion(): AbCarouselRegionProps {
  const ctx = useContext(AbCarouselRegionContext); // 🔍
  if (!ctx) throw new Error('useAbCarouselRegion() must be used inside <AbCarouselProvider> or <AbCarousel>.'); // 💥
  return ctx.regionProps; // 📦
}

/** 📣 AbCarouselStatus — 0.2.3: the polite live region ("Slide 3 of 9: Title"); render it once, inside the region. */
export function AbCarouselStatus({ className }: { className?: string }) {
  const ctx = useContext(AbCarouselRegionContext); // 🔍
  if (!ctx) throw new Error('<AbCarouselStatus> must be used inside <AbCarouselProvider> or <AbCarousel>.'); // 💥
  return <div className={clsx(styles.srOnly, className)} aria-live="polite" aria-atomic="true" data-ab-part="status">{ctx.message}</div>;
}

// ===== 0.2.3 useAbCarouselKeys: arrow keys OUTSIDE the region ===== //

// ⚙️ options
export interface UseAbCarouselKeysOptions {
  // 🎚️ bind or not (default true), e.g. false while a sheet is up
  enabled?: boolean;
  // ⏮️⏭️ Home / End too? Default false: on `document` they would steal the page's own Home / End scroll
  homeEnd?: boolean;
}

// 🙅 focus places that own their keys, beyond the region's ignore list: an open dialog, editable text
const AB_CAROUSEL_KEYS_SKIP = '[role="dialog"], [aria-modal="true"], [contenteditable=""], [contenteditable="true"]';

/**
 * ⌨️ useAbCarouselKeys — 0.2.3 (Joseph, Welcome 0.2.21): the carousel's ←/→ (RTL-aware) on a SCOPE element, not
 * just inside the region. The listener sits on that element only, so keys act only while focus is within it.
 * Call it under <AbCarouselProvider> (or <AbCarousel>):
 *
 *   useAbCarouselKeys('main')                // ✅ RECOMMENDED: the layout's <main> (core's [data-ab-part="main"], else <main>)
 *   useAbCarouselKeys(slidesRef)             // 📌 any element you hold a ref to
 *   useAbCarouselKeys('document')            // ⚠️ OPT-IN only: every key on the page (header, aside…) — a global
 *                                            //    hijack; Joseph's e2e "no global hijack" forbids it on Welcome
 *
 * There is no default: the scope is always explicit.
 *
 * 🧭 Why a hook (and not core passing the region props to <main>): core stays carousel-agnostic, the hook works
 *    with any layout, and the region's own handler is untouched. Safety rules:
 * - 🙈 skips the same targets the region skips (inputs, textareas, selects, tabs, radio groups, sliders…), plus
 *   editable text and anything inside an open dialog / modal
 * - 🎠 skips events from INSIDE a carousel region (its own handler already moved, so no double step)
 * - ⌨️ never with Alt / Ctrl / Meta / Shift, and never an event someone already handled (defaultPrevented)
 * - ⏮️⏭️ Home / End only with `homeEnd: true`
 */
export function useAbCarouselKeys(target: 'main' | 'document' | RefObject<HTMLElement | null>, options: UseAbCarouselKeysOptions = {}): void {
  const { enabled = true, homeEnd = false } = options;
  const ctx = useAbCarousel(); // 🧠
  const latest = useRef(ctx); // 🔁 the latest state for the listener (no re-binding per slide)
  useEffect(() => { latest.current = ctx; });
  useEffect(() => {
    if (!enabled) return;
    // 🎯 the scope: 'main' = core's main pane (AbMainLayout renders data-ab-part="main"), else the first <main>
    const el: HTMLElement | Document | null = target === 'document' ? document
      : target === 'main' ? document.querySelector<HTMLElement>('[data-ab-part="main"]') ?? document.querySelector('main')
      : target.current;
    if (!el) return;
    const onKey = (event: Event) => {
      const e = event as globalThis.KeyboardEvent; // ⌨️
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return; // 🙅
      const from = e.target as Element | null; // 🎯
      if (from?.closest?.(AB_CAROUSEL_KEY_IGNORE_SELECTOR) || from?.closest?.(AB_CAROUSEL_KEYS_SKIP)) return; // 🙈 owns its keys
      if (from?.closest?.('[data-ab-part="carousel"]')) return; // 🎠 the region already handled it
      const c = latest.current; // 🧠
      const action = getAbCarouselKeyAction(e.key, c.dir); // 🗺️
      if (!action || (!homeEnd && (action === 'first' || action === 'last'))) return; // 🙅
      e.preventDefault(); // 🛑 no sideways scroll
      if (action === 'next') c.next('key'); // ⏭️
      else if (action === 'prev') c.prev('key'); // ⏮️
      else if (action === 'first') c.goTo(0, 'key'); // ⏮️⏮️
      else c.goTo(c.count - 1, 'key'); // ⏭️⏭️
    };
    el.addEventListener('keydown', onKey); // 🎧
    return () => el.removeEventListener('keydown', onKey); // 🧹
  }, [target, enabled, homeEnd]);
}

// ===== <AbCarouselTrack /> ===== //

// ⚙️ track props
export interface AbCarouselTrackProps {
  // 🏷️ extra classes
  className?: string;
  // 🎨 inline style
  style?: CSSProperties;
  // 📏 0.2.3: override the carousel's `autoHeight` for this track
  autoHeight?: boolean;
  // 🎞️ <AbCarouselSlide> children (fragments / arrays are fine)
  children?: ReactNode;
}

/**
 * 🎞️ AbCarouselTrack — stacks the slides in one grid cell (height = tallest slide → no layout shift)
 * and owns the swipe gesture (`touch-action: pan-y` keeps vertical scrolling).
 */
export function AbCarouselTrack({ className, style, autoHeight: autoHeightProp, children }: AbCarouselTrackProps) {
  // 🧠 carousel state
  const ctx = useAbCarousel();
  // 🎯 element for the swipe hook
  const trackRef = useRef<HTMLDivElement>(null);
  // 📏 0.2.3 autoHeight: the track's height follows the active slide (measured, so it also tracks content changes)
  const autoHeight = autoHeightProp ?? ctx.autoHeight;
  const [height, setHeight] = useState<number | null>(null); // 📐 px, null = not measured yet (SSR: tallest slide)
  useEffect(() => {
    const track = trackRef.current;
    if (!autoHeight || !track) return;
    const active = track.querySelector<HTMLElement>(':scope > [data-ab-part="slide"][data-position="active"]'); // ✅ the slide in view
    if (!active) return;
    const measure = () => { const h = Math.ceil(active.getBoundingClientRect().height || active.offsetHeight); setHeight((p) => (p === h ? p : h)); }; // 🧮 no loop
    measure(); // 📏 now
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null; // 👀 fonts, images, viewport
    ro?.observe(active);
    return () => ro?.disconnect(); // 🧹
  }, [autoHeight, ctx.index, ctx.count]);
  // 👆 swipe → next / prev (RTL-aware via dir)
  useAbSwipe(trackRef, {
    onNext: () => ctx.next('swipe'), // ⏭️
    onPrev: () => ctx.prev('swipe'), // ⏮️
    enabled: ctx.swipe.enabled, // 🔌
    threshold: ctx.swipe.threshold, // 📏
    ignore: ctx.swipe.ignore, // 🙈
    dir: ctx.dir, // 🌍
  });
  // 🎞️ flat slide list
  const slides = flattenAbSlides(children);
  // 🖼️ render, giving each slide its index
  return (
    <div
      ref={trackRef}
      id={ctx.trackId}
      className={clsx(styles.track, autoHeight && AB_MOTION.size, className)} // 🎬 0.2.3: height motion from ab-nextjs-animations
      style={autoHeight && height != null ? { ...style, height: `${height}px` } : style} // 📏 0.2.3: the active slide's height
      data-ab-part="track"
      data-auto-height={autoHeight ? 'true' : undefined} // 📏 CSS: top-aligned slides + the height transition
    >
      {slides.map((slide, i) => (
        // 🔢 index provider per slide (keys come from the consumer, else the position)
        <AbCarouselSlideIndexContext.Provider key={slide.key ?? i} value={i}>{slide}</AbCarouselSlideIndexContext.Provider>
      ))}
    </div>
  );
}

// ===== <AbCarouselSlide /> ===== //

// ⚙️ slide props
export interface AbCarouselSlideProps {
  // 🏷️ extra classes
  className?: string;
  // 🎨 inline style
  style?: CSSProperties;
  // 🏷️ override the default "3 of 9" label
  label?: string;
  // 🧩 slide content (text pane, illustration…)
  children?: ReactNode;
}

/**
 * 🖼️ AbCarouselSlide — one slide: `role="group"` + `aria-roledescription="slide"` + "n of total".
 * Inactive slides are hidden visually (opacity / visibility) and, after hydration, `inert` + `aria-hidden`.
 */
export function AbCarouselSlide({ className, style, label, children }: AbCarouselSlideProps) {
  // 🧠 carousel + my index
  const ctx = useAbCarousel();
  const i = useContext(AbCarouselSlideIndexContext);
  // 📍 position relative to the active slide
  const position = getAbCarouselSlidePosition(i, ctx.index);
  const active = position === 'active';
  // 🙈 hide inactive slides from AT + focus only once JS runs (no-JS stack stays usable)
  const hide = ctx.hydrated && !active;
  // 🎬 slide step (only after a real move, so nothing animates on first paint)
  const step = ctx.direction === null ? undefined : active ? AB_SLIDE_STEP_IN_CLASS : i === ctx.previousIndex ? AB_SLIDE_STEP_OUT_CLASS : undefined;
  // 🖼️ render
  return (
    <div
      id={ctx.slideId(i)} // 🆔 aria-controls target for dots
      role="group" // ♿
      aria-roledescription="slide" // ♿
      aria-label={label ?? ctx.slideLabel(i + 1, ctx.count)} // 🏷️ "3 of 9"
      aria-hidden={hide || undefined} // 🙈
      inert={hide || undefined} // 🚫 no focus / clicks while hidden
      className={clsx(styles.slide, step, className)} // 🏷️ + 🎬 enter / leave
      style={style} // 🎨
      data-ab-part="slide" // 🧩
      data-position={position} // 📍 CSS offset
      data-active={String(active)} // ✅
    >
      {children}
    </div>
  );
}

// ===== <AbCarouselPrev /> + <AbCarouselNext /> ===== //

// ⚙️ prev / next button props
export interface AbCarouselNavProps {
  // 🏷️ accessible name (default "Previous slide" / "Next slide"), also the tooltip
  label?: string;
  // 🎨 'outlined' (default for prev) or 'filled' (default for next, primary bronze)
  variant?: 'outlined' | 'filled';
  // 🙈 render nothing at the edge instead of an aria-disabled button (Welcome s09: no arrows)
  hideAtEdge?: boolean;
  // 🏷️ extra classes
  className?: string;
  // 🎨 inline style
  style?: CSSProperties;
  // 🧩 custom icon / content (default: AbIcons arrow, RTL-mirrored)
  children?: ReactNode;
}

// ➡️ AbIcons arrow (G2): weight 300 = stroke 1.5, mirrored in RTL via .navIcon
function AbCarouselArrow({ kind }: { kind: 'prev' | 'next' }) {
  return <AbIcon className={styles.navIcon} name={kind === 'prev' ? 'arrow_back' : 'arrow_forward'} size={20} weight={300} />; // 🔣 decorative (button is named)
}

// 🔘 shared prev / next implementation
function AbCarouselNavButton({ kind, label, variant, hideAtEdge = false, className, style, children }: AbCarouselNavProps & { kind: 'prev' | 'next' }) {
  // 🧠 carousel
  const ctx = useAbCarousel();
  // 🚦 can we move?
  const enabled = kind === 'prev' ? ctx.canPrev : ctx.canNext;
  // 🙈 Welcome s09: no arrows at all
  if (hideAtEdge && !enabled) return null;
  // 🏷️ name
  const name = label ?? (kind === 'prev' ? 'Previous slide' : 'Next slide');
  // 🎨 variant
  const look = variant ?? (kind === 'next' ? 'filled' : 'outlined');
  // 🖼️ aria-disabled (not `disabled`) keeps focus on the button at the edge
  return (
    <button
      type="button" // 🛑 never submits a form
      className={clsx(styles.nav, AB_MOTION.interactive, AB_MOTION.press, className)} // 🏷️ + 🎨 hover / 🤏 press
      style={style} // 🎨
      aria-label={name} // ♿ icon-only → name it
      title={name} // 💬 tooltip
      aria-controls={ctx.trackId} // 🔗
      aria-disabled={!enabled || undefined} // 🚦
      data-ab-part={kind} // 🧩
      data-variant={look} // 🎨
      onClick={() => {
        if (!enabled) return; // 🚦 edge: stay put (focus stays on the button)
        if (kind === 'prev') ctx.prev('prev'); // ⏮️
        else ctx.next('next'); // ⏭️
      }}
    >
      {children ?? <AbCarouselArrow kind={kind} />}
    </button>
  );
}

// ⏮️ previous-slide button
export function AbCarouselPrev(props: AbCarouselNavProps) {
  return <AbCarouselNavButton kind="prev" {...props} />;
}

// ⏭️ next-slide button
export function AbCarouselNext(props: AbCarouselNavProps) {
  return <AbCarouselNavButton kind="next" {...props} />;
}

// ===== <AbCarouselDots /> ===== //

// ⚙️ dots props
export interface AbCarouselDotsProps {
  // 🏷️ group name (default "Choose slide")
  label?: string;
  // 🏷️ per-dot name (default "Go to slide 3: Title")
  dotLabel?: (n: number, total: number, title?: string) => string;
  // 🏷️ extra classes
  className?: string;
  // 🎨 inline style
  style?: CSSProperties;
}

/**
 * 🔘 AbCarouselDots — a `role="group"` of real buttons (not a tablist: slides aren't tab panels).
 * Active dot: `aria-current="step"` + long pill. Each button is a 24×24 target (WCAG 2.5.8).
 */
export function AbCarouselDots({ label = 'Choose slide', dotLabel = defaultAbCarouselDotLabel, className, style }: AbCarouselDotsProps) {
  // 🧠 carousel
  const ctx = useAbCarousel();
  // 🖼️ render
  return (
    <div role="group" aria-label={label} className={clsx(styles.dots, className)} style={style} data-ab-part="dots">
      {Array.from({ length: ctx.count }, (_, i) => {
        const active = i === ctx.index; // ✅
        return (
          <button
            key={i} // 🔑
            type="button" // 🛑
            className={styles.dot} // 🏷️
            aria-label={dotLabel(i + 1, ctx.count, ctx.titles[i])} // ♿
            aria-current={active ? 'step' : undefined} // 📍
            aria-controls={ctx.slideId(i)} // 🔗
            data-ab-part="dot" // 🧩
            data-active={String(active)} // 🎨
            onClick={() => ctx.goTo(i, 'dot')} // 🎯 focus stays on the dot
          >
            {/* 🎨 the visible 8px dot / 24px pill */}
            <span className={clsx(styles.dotMark, AB_MOTION.size)} aria-hidden="true" /> {/* 📏 8 → 24px via ab-motion-size */}
          </button>
        );
      })}
    </div>
  );
}

// ===== <AbCarouselCounter /> ===== //

// ⚙️ counter props
export interface AbCarouselCounterProps {
  // 🧮 custom formatter (default "<b>02</b> / 09")
  format?: (current: number, total: number) => ReactNode;
  // 🏷️ extra classes
  className?: string;
  // 🎨 inline style
  style?: CSSProperties;
}

/**
 * 🔢 AbCarouselCounter — "02 / 09" (mono, current in bold).
 * Hidden from AT by default: each slide's "2 of 9" label + the live region already say it.
 */
export function AbCarouselCounter({ format, className, style }: AbCarouselCounterProps) {
  // 🧠 carousel
  const ctx = useAbCarousel();
  // 🔢 1-based current
  const current = ctx.count === 0 ? 0 : ctx.index + 1;
  // 🖼️ render
  return (
    <span className={clsx(styles.counter, className)} style={style} data-ab-part="counter" aria-hidden="true">
      {format ? format(current, ctx.count) : (<><b>{padAbCarouselNumber(current)}</b>{' / '}{padAbCarouselNumber(ctx.count)}</>)}
    </span>
  );
}

// 📦 default export = the root
export default AbCarousel;
