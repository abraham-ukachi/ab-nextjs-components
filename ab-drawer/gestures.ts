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
* @name: AbDrawer gestures
* @file: ab-drawer/gestures.ts
* @type: TypeScript — pure swipe / snap resolvers
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🤏 drawers v2 (John, God 01:22): the thresholds and decisions behind every drawer swipe, as pure functions,
//    so the rules are unit-tested without a DOM and the components only feed them numbers.

/** 🎚️ the spec numbers (drawer-spec.md "Gestures" + "Edge zones") */
export const AB_SWIPE = {
  ratio: 0.3, // 📏 30% of the travel / sheet / drawer width
  velocity: 0.5, // ⚡ px per ms: at or above this a release counts as a fast swipe
  edge: 24, // 🧱 edge zone width (px) for the side-drawer swipes
  standaloneInset: 16, // 📱 iOS standalone: the zone starts 16px in (the system owns the very edge)
  slop: 8, // 🫳 px of movement before a press becomes a drag (taps stay taps)
  secondSwipe: 24, // ✌️ px: after a gentle return to S1, a swipe down this long closes (the "second swipe")
} as const;

/** 🧲 bottom-sheet snap states: S1 (`partial`, 70%), S2 (`full`) or gone */
export type AbSheetSnap = 'partial' | 'full';
/** 🏁 what a release resolves to */
export type AbSheetRelease = AbSheetSnap | 'closed';

/** 📥 one release of a bottom-sheet drag */
export interface AbSheetReleaseInput {
  from: AbSheetSnap; // 🧲 where the drag started
  dy: number; // ↕️ total movement, + = down
  velocity: number; // ⚡ px/ms at release, + = down
  partialHeight: number; // 📏 S1 height (70% of the app height)
  fullHeight: number; // 📏 S2 height (app height minus the safe-area top)
  returned?: boolean; // ✌️ the sheet came back to S1 from S2 with a gentle drag (so the next swipe down closes)
}

/**
 * 🧲 resolveAbSheetRelease — where a released bottom sheet goes (spec §1 "Gestures"):
 * - ⬆️ up past 30% of S1→S2, or faster than 0.5px/ms → `full`
 * - ⬇️ at S2: fast (≥ 0.5px/ms) or past 30% of the sheet → `closed`; a gentle drag → back to `partial`
 * - ⬇️ at S1: fast or past 30% of S1 → `closed`; after a gentle return from S2 any real swipe down (≥ 24px) → `closed`
 * - otherwise it springs back to where it was
 */
export function resolveAbSheetRelease({ from, dy, velocity, partialHeight, fullHeight, returned = false }: AbSheetReleaseInput): AbSheetRelease {
  const fast = Math.abs(velocity) >= AB_SWIPE.velocity; // ⚡
  if (dy < 0) { // ⬆️ up
    if (from === 'full') return 'full'; // 🧱 already at the top
    const travel = Math.max(1, fullHeight - partialHeight); // 📏 S1 → S2 distance
    return -dy > AB_SWIPE.ratio * travel || (fast && velocity < 0) ? 'full' : 'partial'; // 🧲
  }
  if (from === 'full') { // ⬇️ from S2
    if ((fast && velocity > 0) || dy > AB_SWIPE.ratio * fullHeight) return 'closed'; // 💨 hard swipe
    return dy > AB_SWIPE.slop ? 'partial' : 'full'; // 🫳 gentle → S1 (a tap jitter stays at S2)
  }
  // ⬇️ from S1
  if ((fast && velocity > 0) || dy > AB_SWIPE.ratio * partialHeight) return 'closed'; // 💨
  if (returned && dy >= AB_SWIPE.secondSwipe) return 'closed'; // ✌️ the second swipe
  return 'partial'; // 🧲 spring back
}

/** 📥 one release of a side-drawer swipe (edge swipe to open, or a swipe on the sheet to close) */
export interface AbSideReleaseInput {
  distance: number; // ↔️ movement in the opening / closing direction (px, + = that way)
  velocity: number; // ⚡ px/ms in that same direction
  width: number; // 📏 the drawer width (320 left, 296 right)
}

/** ↔️ resolveAbSideRelease — does a side swipe commit? Past 30% of the width, or faster than 0.5px/ms that way. */
export function resolveAbSideRelease({ distance, velocity, width }: AbSideReleaseInput): boolean {
  if (distance <= 0) return false; // 🚫 wrong way (or nowhere)
  return distance > AB_SWIPE.ratio * width || velocity >= AB_SWIPE.velocity; // ✅
}

/** 🧱 isInAbEdgeZone — does a press at `x` start inside the `edge` zone of a box [left, right]? */
export function isInAbEdgeZone(x: number, edge: 'left' | 'right', box: { left: number; right: number }, standalone = false): boolean {
  const inset = standalone ? AB_SWIPE.standaloneInset : 0; // 📱 iOS standalone: 16px in
  const d = edge === 'left' ? x - box.left : box.right - x; // 📏 distance from that edge
  return d >= inset && d <= inset + AB_SWIPE.edge; // 🎯
}

/** ⚡ a tiny velocity tracker: feed it samples, read px/ms over the last ~100ms */
export function createAbVelocityTracker(windowMs = 100): { add: (pos: number, t: number) => void; velocity: () => number; reset: () => void } {
  let samples: Array<[number, number]> = []; // 🧺 [pos, time]
  return {
    add(pos, t) { samples.push([pos, t]); samples = samples.filter(([, ts]) => t - ts <= windowMs); }, // ➕ keep the window
    velocity() {
      if (samples.length < 2) return 0; // 🫥
      const [p0, t0] = samples[0]; const [p1, t1] = samples[samples.length - 1]; // 📍 first / last
      return t1 > t0 ? (p1 - p0) / (t1 - t0) : 0; // ⚡
    },
    reset() { samples = []; }, // 🧹
  };
}

/** 🎠 isInAbHorizontalScroller — is `el` inside something that scrolls sideways (a code block, a carousel)?
 *  Edge swipes started there are ignored, so they never fight the user's horizontal scroll. */
export function isInAbHorizontalScroller(el: Element | null, stop?: Element | null): boolean {
  for (let n = el; n && n !== stop && n !== document.documentElement; n = n.parentElement) {
    if (n.closest('[data-ab-no-edge-swipe]') === n) return true; // 🙅 explicit opt-out
    const ox = getComputedStyle(n).overflowX; // 🔎
    if ((ox === 'auto' || ox === 'scroll') && n.scrollWidth > n.clientWidth) return true; // 🎠
  }
  return false;
}
