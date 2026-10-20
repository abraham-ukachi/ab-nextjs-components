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
// 🌍 pure, server-safe locale helper (0.1.13)
import { stripAbLocalePrefix } from './locale';
export { stripAbLocalePrefix };
// 🔗 the default link (the ONLY next/link import in the package, see __tests__/ab-link.test.tsx)
import NextLink from 'next/link';

/** 🔗 Any Link-like component: takes next/link's props (`href`, `prefetch`, `replace`, …). */
export type AbLinkComponent = ComponentType<ComponentProps<typeof NextLink>>;
/** 🎛️ AbLink props = next/link props. */
export type AbLinkProps = ComponentProps<typeof NextLink>;

// 🧠 context: null = use next/link
const AbLinkContext = createContext<AbLinkComponent | null>(null);
// 🌍 0.1.13 (Joseph #10): the app's locale codes, so active states can ignore the `/fr` prefix
const AbLocalesContext = createContext<readonly string[]>([]);


/** 🪝 useAbLocales — the locale codes given to the nearest {@link AbLinkProvider} (default none). */
export function useAbLocales(): readonly string[] {
  return useContext(AbLocalesContext); // 🌍
}

/** 🧩 0.1.13 (Joseph #9): the STRUCTURAL shape a provided link needs: an `href` (any type, e.g. next-intl's
 *  `string | { pathname, query }`) and children. next/link, next-intl's Link, ab-nextjs-i18n's Link all fit. */
export interface AbLinkLikeProps {
  href?: unknown; // 🔗
  children?: ReactNode; // 🧒
}

/** ⚙️ Props of {@link AbLinkProvider}: generic over the link's own props, so no cast is needed. */
export interface AbLinkProviderProps<P extends AbLinkLikeProps = ComponentProps<typeof NextLink>> {
  /** 🔗 the link every Ab component renders, e.g. ab-nextjs-i18n's locale-aware `Link`. */
  component: ComponentType<P>;
  /** 🌍 0.1.13: locale codes (e.g. `routing.locales`), stripped from the pathname for active states. */
  locales?: readonly string[];
  children?: ReactNode;
}

/**
 * 🔌 AbLinkProvider — swaps the link used by every Ab component (sidebar, navbar, menu, tab, app bar, cards, …).
 * Wrap the app (or one layout) once:
 *   <AbLinkProvider component={Link}>…</AbLinkProvider>   // Link from 'ab-nextjs-i18n/navigation'
 */
export function AbLinkProvider<P extends AbLinkLikeProps>({ component, locales, children }: AbLinkProviderProps<P>): ReactElement {
  // 🧠 Ab components always pass next/link-compatible props (href string, className, aria-*, onClick, …)
  const link = <AbLinkContext.Provider value={component as unknown as AbLinkComponent}>{children}</AbLinkContext.Provider>;
  return locales ? <AbLocalesContext.Provider value={locales}>{link}</AbLocalesContext.Provider> : link; // 🌍
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
