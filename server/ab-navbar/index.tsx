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
* @name: AbNavbar - Server (G41)
* @file: server/ab-navbar/index.tsx
* @type: Server Component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ReactElement } from 'react';
// 🔣 server AbIcon
import AbIcon from '../ab-icon';
// 🖼️ shared view
import { AbNavbarView, isAbNavbarActive, type AbNavbarBaseProps, type AbNavbarLinkItem } from '../../ab-navbar/view';

// 📦 shared types
export type { AbNavbarLinkItem, AbNavbarLink } from '../../ab-navbar/view';

/** ⚙️ Server props: link items only (buttons need a client `onSelect`). */
export type AbNavbarProps = AbNavbarBaseProps<AbNavbarLinkItem>;

/** 📱 AbNavbar (server, G41): same markup as the client twin; active from `activeHref` / legacy `page`. */
const AbNavbar = (props: AbNavbarProps): ReactElement => {
  const { page, activeHref } = props;
  const active = (href: string, value?: string) => (page ? page === value : isAbNavbarActive(href, activeHref)); // 🎯
  return <AbNavbarView props={props} Icon={AbIcon} active={active} />;
};

// 📦 exports
export default AbNavbar;
export { AbNavbar };
