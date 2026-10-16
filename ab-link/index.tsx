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
* @name: AbLink + AbLinkProvider (G42)
* @file: ab-link/index.tsx
* @type: Component (client) — injectable link
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> import { Link } from 'ab-nextjs-i18n/navigation'
*    -|> <AbLinkProvider component={Link}><AbSidebar sections={…} /></AbLinkProvider>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import { createContext, createElement, useContext, type ComponentProps, type ComponentType, type ReactElement, type ReactNode } from 'react';
// 🔗 the default link (the ONLY next/link import in the package, see __tests__/ab-link.test.tsx)
import NextLink from 'next/link';

/** 🔗 Any Link-like component: takes next/link's props (`href`, `prefetch`, `replace`, …). */
export type AbLinkComponent = ComponentType<ComponentProps<typeof NextLink>>;
/** 🎛️ AbLink props = next/link props. */
export type AbLinkProps = ComponentProps<typeof NextLink>;

// 🧠 context: null = use next/link
const AbLinkContext = createContext<AbLinkComponent | null>(null);

/** ⚙️ Props of {@link AbLinkProvider}. */
export interface AbLinkProviderProps {
  /** 🔗 the link every Ab component renders, e.g. ab-nextjs-i18n's locale-aware `Link`. */
  component: AbLinkComponent;
  children?: ReactNode;
}

/**
 * 🔌 AbLinkProvider — swaps the link used by every Ab component (sidebar, navbar, menu, tab, app bar, cards, …).
 * Wrap the app (or one layout) once:
 *   <AbLinkProvider component={Link}>…</AbLinkProvider>   // Link from 'ab-nextjs-i18n/navigation'
 */
export function AbLinkProvider({ component, children }: AbLinkProviderProps): ReactElement {
  return <AbLinkContext.Provider value={component}>{children}</AbLinkContext.Provider>; // 🧠
}

/** 🪝 useAbLink — the link component in effect (the provider's, or next/link). */
export function useAbLink(): AbLinkComponent {
  return useContext(AbLinkContext) ?? (NextLink as AbLinkComponent); // 🔗
}

/**
 * 🔗 AbLink — renders the provided link component (default next/link). Server twins can render it too:
 * it's a client component, so it reads the provider from the client tree above it.
 */
export function AbLink(props: AbLinkProps): ReactElement {
  // 🔌 the context value is a stable component reference (not created during render), so createElement
  //    keeps the react-hooks/static-components rule happy without changing behaviour
  return createElement(useAbLink(), props); // ➡️ same props, same ref (React 19 ref-as-prop)
}

// 📦 exports
export default AbLink;
