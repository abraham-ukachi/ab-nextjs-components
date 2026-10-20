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
* @name: AbIcon - Built-in glyphs (G2)
* @file: ab-icon/builtin.ts
* @type: TypeScript — the only icons components draw themselves
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🔣 one module per icon (ab-nextjs-icons ≥ 0.2.3): bundlers keep only these 15
import arrowBack from 'ab-nextjs-icons/ab-icons/icons/arrow_back'; // ⏮️ AbCarouselPrev
import arrowForward from 'ab-nextjs-icons/ab-icons/icons/arrow_forward'; // ⏭️ AbCarouselNext
import lightMode from 'ab-nextjs-icons/ab-icons/icons/light_mode'; // 🌞 AbThemeToggle
import darkMode from 'ab-nextjs-icons/ab-icons/icons/dark_mode'; // 🌙 AbThemeToggle
import computer from 'ab-nextjs-icons/ab-icons/icons/computer'; // 🖥️ AbThemeToggle (system)
import language from 'ab-nextjs-icons/ab-icons/icons/language'; // 🌐 AbLocaleSwitcher
import contentCopy from 'ab-nextjs-icons/ab-icons/icons/content_copy'; // 📋 AbInstallSnippet
import check from 'ab-nextjs-icons/ab-icons/icons/check'; // ✅ AbInstallSnippet (copied)
import chevronLeft from 'ab-nextjs-icons/ab-icons/icons/chevron_left'; // ◀️ AbSidebar collapse (0.1.13)
import chevronRight from 'ab-nextjs-icons/ab-icons/icons/chevron_right'; // ▶️ AbSidebar expand (0.1.13)
import menu from 'ab-nextjs-icons/ab-icons/icons/menu'; // ☰ AbAppBar (0.1.13)
import moreVert from 'ab-nextjs-icons/ab-icons/icons/more_vert'; // ⋮ AbAppBar "More" (0.1.13)
import search from 'ab-nextjs-icons/ab-icons/icons/search'; // 🔎 AbSearchTrigger (0.1.13)
import close from 'ab-nextjs-icons/ab-icons/icons/close'; // ✖️ AbPage aside close (0.1.13)
import expandMore from 'ab-nextjs-icons/ab-icons/icons/expand_more'; // 🔽 AbLocaleSwitcher no-JS list (0.1.13)
import doubleLeft from 'ab-nextjs-icons/ab-icons/icons/keyboard_double_arrow_left'; // ⏪ AbSidebar outlined collapse (0.1.14, P9)
import doubleRight from 'ab-nextjs-icons/ab-icons/icons/keyboard_double_arrow_right'; // ⏩ AbSidebar outlined expand (0.1.14, P9)
// 🧾 shape
import type { AbIconSvgData } from './helpers';

/** 🗂️ Icons the component library renders internally (always registered by AbIcon). */
export const AB_ICON_BUILTINS: Record<string, AbIconSvgData> = {
  arrow_back: arrowBack, // ⏮️
  arrow_forward: arrowForward, // ⏭️
  light_mode: lightMode, // 🌞
  dark_mode: darkMode, // 🌙
  computer, // 🖥️
  language, // 🌐
  content_copy: contentCopy, // 📋
  check, // ✅
  chevron_left: chevronLeft, // ◀️
  chevron_right: chevronRight, // ▶️
  menu, // ☰
  more_vert: moreVert, // ⋮
  search, // 🔎
  close, // ✖️
  expand_more: expandMore, // 🔽
  keyboard_double_arrow_left: doubleLeft, // ⏪
  keyboard_double_arrow_right: doubleRight, // ⏩
};
