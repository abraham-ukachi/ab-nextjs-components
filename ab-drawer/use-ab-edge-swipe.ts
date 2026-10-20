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
* @name: useAbEdgeSwipe
* @file: ab-drawer/use-ab-edge-swipe.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { useEffect, useRef } from 'react';
// 🤏 the pure rules
import { AB_SWIPE, createAbVelocityTracker, isInAbEdgeZone, isInAbHorizontalScroller, resolveAbSideRelease } from './gestures';
// 🗺️ the app box (same lookup AbDrawer uses)
import { getAbDrawerHost } from './index';

/** ⚙️ options */
export interface UseAbEdgeSwipeOptions {
  edge: 'left' | 'right'; // 🧱 which edge the swipe starts from (left = left-to-right, opens the left drawer)
  onOpen: () => void; // 🚪 called when the swipe commits
  enabled?: boolean; // 🎚️ e.g. false while that drawer is open, or when the page has no aside (default true)
  width?: number; // 📏 the drawer width the 30% rule uses (default 320)
  pointerTypes?: readonly string[]; // 🖐️ default touch + pen (a mouse never edge-swipes)
}

// 📱 iOS home-screen web app (the zone starts 16px in there)
const standalone = (): boolean => typeof navigator !== 'undefined' && (navigator as Navigator & { standalone?: boolean }).standalone === true;

/**
 * 🤏 useAbEdgeSwipe — open a side drawer with an edge swipe (drawer spec §2 / §3):
 * - 🧱 the press starts in a 24px zone on that edge of the app box (16px in on iOS standalone)
 * - ↔️ it commits past 30% of the drawer width or above 0.5px/ms toward the middle; slower or shorter does nothing
 * - 🎠 ignored inside things that scroll sideways (code blocks, carousels) and `[data-ab-no-edge-swipe]`
 * - 🧭 a mostly vertical move is a scroll, not a swipe
 * - 📱 iOS Safari's own back gesture starts at the very screen edge and takes the touch before the page sees it,
 *   so the two don't fight; in standalone mode the 16px inset leaves that edge to the system
 *
 * The drawer opens on release (it doesn't follow the finger), then slides in with its normal 200ms motion.
 */
export function useAbEdgeSwipe({ edge, onOpen, enabled = true, width = 320, pointerTypes = ['touch', 'pen'] }: UseAbEdgeSwipeOptions): void {
  const latest = useRef(onOpen); // 🔁 latest callback for the listener
  useEffect(() => { latest.current = onOpen; }, [onOpen]);
  const types = pointerTypes.join(','); // 🧮 a stable dep
  useEffect(() => {
    if (!enabled) return;
    let d: { x: number; y: number; axis: 0 | 1 | 2; v: ReturnType<typeof createAbVelocityTracker> } | null = null; // 🫳 the current press
    const sign = edge === 'left' ? 1 : -1; // ➡️ / ⬅️ toward the middle
    const down = (e: PointerEvent) => {
      if (!types.split(',').includes(e.pointerType)) return; // 🖐️
      const host = getAbDrawerHost('app', e.target as Element); // 🗺️ the app box
      const box = host === document.body ? { left: 0, right: window.innerWidth } : host.getBoundingClientRect();
      if (!isInAbEdgeZone(e.clientX, edge, box, standalone())) return; // 🧱 not from the edge
      if (isInAbHorizontalScroller(e.target as Element)) return; // 🎠
      if ((e.target as Element).closest?.('[data-ab-part="drawer"]')) return; // 🗄️ a drawer is already up there
      const v = createAbVelocityTracker(); v.add(e.clientX, e.timeStamp);
      d = { x: e.clientX, y: e.clientY, axis: 0, v };
    };
    const move = (e: PointerEvent) => {
      if (!d || d.axis === 2) return;
      const dx = e.clientX - d.x; const dy = e.clientY - d.y;
      if (d.axis === 0) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < AB_SWIPE.slop) return; // 🫳
        d.axis = Math.abs(dx) > Math.abs(dy) ? 1 : 2; // 🧭 sideways = ours
      }
      if (d.axis === 1) d.v.add(e.clientX, e.timeStamp); // ⚡
    };
    const up = (e: PointerEvent) => {
      const cur = d; d = null;
      if (!cur || cur.axis !== 1) return;
      if (resolveAbSideRelease({ distance: (e.clientX - cur.x) * sign, velocity: cur.v.velocity() * sign, width })) latest.current(); // ✅
    };
    const cancel = () => { d = null; }; // 🧹 the browser took it (scroll)
    document.addEventListener('pointerdown', down, true); // 🎧 capture: before anything stops it
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerup', up, true);
    document.addEventListener('pointercancel', cancel, true);
    return () => {
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerup', up, true);
      document.removeEventListener('pointercancel', cancel, true);
    };
  }, [edge, enabled, width, types]);
}

// 📦 default export
export default useAbEdgeSwipe;
