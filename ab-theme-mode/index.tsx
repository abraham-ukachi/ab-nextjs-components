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
* @name: AbThemeModeProvider (one shared light / dark / system state)
* @file: ab-theme-mode/index.tsx
* @type: Client component + hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { createContext, useContext, type ReactElement, type ReactNode } from 'react';
// 🌗 the theme engine (hooks ≥ 0.1.6): persisted in localStorage, applied to <html>, follows the OS in 'system'
import { useAbThemeMode, type AbThemeMode, type AbThemeModeResult } from 'ab-nextjs-hooks/useAbTheme';

/** 🧠 what the provider shares: the chosen mode, what paints, and the setter */
export interface AbThemeModeContextValue {
  mode: AbThemeMode | string; // 🎚️ 'light' | 'dark' | 'system'
  resolvedTheme: AbThemeModeResult['resolvedTheme']; // 🎨 what paints ('system' → light / dark)
  setMode: (mode: AbThemeMode | string) => void; // ✍️ persists + applies (through the engine)
}

// 🧠 null outside a provider (each toggle then keeps its own engine, exactly like before)
const AbThemeModeContext = createContext<AbThemeModeContextValue | null>(null);

/** ⚙️ props */
export interface AbThemeModeProviderProps {
  defaultMode?: AbThemeMode; // 🌱 before hydration / nothing saved (default 'light', the engine's default)
  children?: ReactNode; // 🧩 the app
}

/**
 * 🌗 AbThemeModeProvider — 0.2.3 (Joseph, Welcome 0.2.21): ONE theme state for the whole app. Each AbThemeToggle
 * (laptop sidebar, Settings sheet) and AbMobileHeader's 3-state button used to run its own engine, so they drifted
 * across 768px. Under this provider they all read and write this one engine (still persisted under the `theme`
 * key, still following the OS in 'system'). Put it once, high in the tree (e.g. around AbAppLayout).
 *
 * 🧭 Why components and not hooks / theme: the engine already lives in ab-nextjs-hooks; this is only the sharing
 *    glue, and the consumers that must read it are components, so the release set stays core + components.
 */
export function AbThemeModeProvider({ defaultMode = 'light', children }: AbThemeModeProviderProps): ReactElement {
  const engine = useAbThemeMode(defaultMode); // 🌗 the ONE engine
  return <AbThemeModeContext.Provider value={engine}>{children}</AbThemeModeContext.Provider>;
}

/** 🪝 useAbThemeModeContext — the shared state, or `null` outside an AbThemeModeProvider. */
export function useAbThemeModeContext(): AbThemeModeContextValue | null {
  return useContext(AbThemeModeContext); // 🔍
}

// 📦 exports
export default AbThemeModeProvider;
