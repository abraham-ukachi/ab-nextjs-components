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
* @name: AbNavbar - Client (G41)
* @file: ab-navbar/index.tsx
* @type: Client Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbNavbar activeHref="/docs" items={[
*     { kind: 'link', href: '/', icon: 'home', label: 'Home' },
*     { kind: 'button', id: 'menu', icon: 'menu', label: 'Menu', onSelect: openSheet },
*   ]} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import type { ReactElement } from 'react';
// 🧭 route fallback
import { usePathname } from 'next/navigation';
// 🔣 client AbIcon
import AbIcon from '../ab-icon';
// 🖼️ shared view
import { AbNavbarView, isAbNavbarActive, type AbNavbarBaseProps } from './view';

// 📦 shared types
export type { AbNavbarItem, AbNavbarLinkItem, AbNavbarButtonItem, AbNavbarLink } from './view';
export { isAbNavbarActive } from './view';

/** ⚙️ Client props (link and button items). */
export type AbNavbarProps = AbNavbarBaseProps;

/** 📱 AbNavbar (client, G41): mobile bottom bar, filled active icon, aria-current, safe-area padding. */
const AbNavbar = (props: AbNavbarProps): ReactElement => {
  const pathname = usePathname() ?? ''; // 🧭
  const { page, activeHref } = props;
  const active = (href: string, value?: string) => (page ? page === value : isAbNavbarActive(href, activeHref ?? pathname)); // 🎯
  return <AbNavbarView props={props} Icon={AbIcon} active={active} />;
};

// 📦 exports
export default AbNavbar;
export { AbNavbar };
