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
* @name: AbIcon - Client (G2)
* @file: ab-icon/index.tsx
* @type: Component (client) — AbIcons SVG, no icon font
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbIcon name="arrow_back" /> // 🙈 decorative
*    -|> <AbIcon name="github" label="GitHub" svg={github} /> // 🖼️ named image
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ types
import type { CSSProperties, ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🧮 shared helpers (NO icon map import: client bundles stay small)
import { warnAbIconMissing, getAbIconStroke, getRegisteredAbIcon, pickAbIconMarkup, registerAbIcons, toAbIconSize, type AbIconSvgData, type AbIconVariant, type AbIconWeight } from './helpers';
// 🗂️ the 8 glyphs components draw themselves (per-icon modules, not the map)
import { AB_ICON_BUILTINS } from './builtin';
// 🎨 styles
import styles from './styles.module.css';

// 📦 helpers for consumers (registerAbIcons, types)
export * from './helpers';
export { AB_ICON_BUILTINS } from './builtin';
export { AbIconRegistrar, type AbIconRegistrarProps } from './registrar'; // 🗂️ server-safe registration (Joseph #11)

// 🗂️ register built-ins at module scope (same on server render + hydration → no mismatch)
registerAbIcons(AB_ICON_BUILTINS);

// ⚙️ props
export interface AbIconProps {
  name: string; // 🗂️ AbIcons name (snake_case); AbIcons name (registered / svg / map); unknown = Material ligature fallback + dev warning
  variant?: AbIconVariant; // 🎚️ outlined (default) | filled
  filled?: boolean; // 🕰️ legacy alias for variant="filled"
  weight?: AbIconWeight | number; // 📏 100–700 (outlined), default 200
  size?: number | string; // 📐 default 24px
  label?: string; // ♿ NEW: accessible name; omitted = decorative (aria-hidden)
  title?: string; // 💬 legacy tooltip + name
  svg?: AbIconSvgData; // 🧾 NEW: explicit markup (tree-shaken per-icon import)
  className?: string; // 🏷️
  style?: CSSProperties; // 🎨
}

/** 🔣 AbIcons SVG icon (client): `svg` prop → registry → Material ligature fallback + dev warning. */
const AbIcon = ({ name, variant, filled = false, weight, size, label, title, svg, className, style }: AbIconProps): ReactElement => {
  // 🔍 resolve markup without the full map
  const markup = pickAbIconMarkup(svg ?? getRegisteredAbIcon(name), variant ?? (filled ? 'filled' : 'outlined'));
  // 🎚️ legacy `filled` → variant
  const v: AbIconVariant = variant ?? (filled ? 'filled' : 'outlined');
  // 🏷️ accessible name: `label` (new) or `title` (legacy)
  const name_ = label ?? title;
  // 🎨 size + weight as CSS variables (weight overrides SVG stroke-width via CSS)
  const vars = { ...style, '--ab-icon-size': toAbIconSize(size), '--ab-icon-stroke': String(getAbIconStroke(weight)) } as CSSProperties;
  // ♿ labelled = image, else decorative
  const a11y = name_ ? { role: 'img' as const, 'aria-label': name_ } : { 'aria-hidden': true as const };

  // ✅ AbIcons SVG
  if (markup) {
    return (
      <span
        className={clsx('AbIcon', styles.abIcon, className)} // 🏷️
        style={vars} // 🎨
        data-variant={v} // 🎚️
        data-icon={name} // 🗂️
        title={title} // 💬 legacy tooltip only
        {...a11y} // ♿
        // 🔒 trusted, package-generated static markup (never user input)
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }

  // 🕰️ 0.1.13 (James review): NON-breaking fallback for unregistered names. A patch must not blank icons,
  //    so an unknown name still renders the pre-G2 Material Symbols ligature (needs the app's font), and
  //    warns once in development so the missing registration gets fixed before the app drops the font.
  warnAbIconMissing(name);
  return (
    <span
      className={clsx('AbIcon', 'material-symbols-rounded', 'icon', styles.abIconFont, className)} // 🏷️ legacy font class
      style={{ ...style, fontSize: toAbIconSize(size) }} // 📏
      data-icon={name} // 🗂️
      data-filled={v === 'filled' ? 'true' : 'false'} // 🎚️
      data-ab-icon-fallback="font" // 🔎 easy to audit
      title={title} // 💬
      {...a11y} // ♿
    >
      {name}
    </span>
  );
};

// 📦 exports
export default AbIcon;
export { AbIcon };
