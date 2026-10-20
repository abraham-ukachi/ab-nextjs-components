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
* @name: AbIcon - Server (G2)
* @file: server/ab-icon/index.tsx
* @type: Server component — any AbIcons name, zero client JS
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ types
import { useId, type CSSProperties, type ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗺️ full icon map: fine here, server components ship no JS to the browser
import { getAbIconSvg } from 'ab-nextjs-icons/ab-icons';
// 🧮 shared helpers (same rules as the client twin)
import { scopeAbIconIds, warnAbIconMissing, getAbIconStroke, getRegisteredAbIcon, pickAbIconMarkup, toAbIconSize, type AbIconSvgData, type AbIconVariant, type AbIconWeight } from '../../ab-icon/helpers';
// 🎨 styles (server copy)
import styles from './styles.module.css';

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

/** 🔣 AbIcons SVG icon (server / RSC): `svg` prop → registry → full AbIcons map → Material ligature fallback + dev warning. */
const AbIcon = ({ name, variant, filled = false, weight, size, label, title, svg, className, style }: AbIconProps): ReactElement => {
  // 🎚️ variant for lookup
  const want: AbIconVariant = variant ?? (filled ? 'filled' : 'outlined');
  // 🔍 explicit → registered → whole map (weight is applied by CSS, so ask for the raw markup)
  const markup = pickAbIconMarkup(svg ?? getRegisteredAbIcon(name), want) ?? getAbIconSvg(name, want);
  // 🆔 one id per rendered instance (Joseph: a hidden twin's mask broke the active Home)
  const uid = useId();
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
        dangerouslySetInnerHTML={{ __html: scopeAbIconIds(markup, uid) }}
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
