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
* @name: useAbDrawer (G53)
* @file: ab-drawer/use-ab-drawer.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const drawer = useAbDrawer('app')
*    -|> <button {...drawer.triggerProps}>Language</button>
*    -|> <AbDrawer {...drawer.drawerProps} title="Language">…</AbDrawer>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import { useCallback, useId, useMemo, useState } from 'react';

/** 🗺️ which box clips the drawer (G53): the whole app, the main pane or the aside pane */
export type AbDrawerScope = 'app' | 'main' | 'aside';

/** 🎛️ what useAbDrawer returns */
export interface UseAbDrawer {
  scope: AbDrawerScope; // 🗺️
  id: string; // 🆔 the drawer id (`aria-controls` target)
  open: boolean; // 🚪 is it open?
  show: () => void; // ➕ open it
  close: () => void; // ➖ close it (Escape / scrim / buttons)
  toggle: () => void; // 🔁
  setOpen: (open: boolean) => void; // 🎚️ controlled setter
  /** 🔘 spread on the trigger button: aria-expanded / aria-controls / aria-haspopup / onClick */
  triggerProps: { 'aria-expanded': boolean; 'aria-controls': string; 'aria-haspopup': 'dialog'; onClick: () => void };
  /** 🗄️ spread on the drawer: id / scope / open / onClose */
  drawerProps: { id: string; scope: AbDrawerScope; open: boolean; onClose: () => void };
}

/**
 * 🎛️ useAbDrawer(scope) — one drawer's open state + the trigger / drawer prop bags (G53).
 *
 * 🧭 Lives in **components** (next to AbDrawer), not in core: it holds no layout state, only `open`,
 *    and components doesn't depend on core. Focus return is handled by AbDrawer itself.
 */
export function useAbDrawer(scope: AbDrawerScope = 'app', options: { defaultOpen?: boolean; id?: string } = {}): UseAbDrawer {
  const auto = `ab-drawer-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`; // 🆔 stable across SSR + hydration
  const id = options.id ?? auto; // 🆔
  const [open, setOpen] = useState<boolean>(options.defaultOpen ?? false); // 🚪
  const show = useCallback(() => setOpen(true), []); // ➕
  const close = useCallback(() => setOpen(false), []); // ➖
  const toggle = useCallback(() => setOpen((o) => !o), []); // 🔁
  return useMemo(() => ({
    scope, id, open, show, close, toggle, setOpen,
    triggerProps: { 'aria-expanded': open, 'aria-controls': id, 'aria-haspopup': 'dialog' as const, onClick: toggle },
    drawerProps: { id, scope, open, onClose: close },
  }), [scope, id, open, show, close, toggle]);
}

// 📦 default export
export default useAbDrawer;
