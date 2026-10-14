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
* @name: AbLogo - Server
* @file: server/ab-logo/index.tsx
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🖥️ server build (no 'use client'; the client twin lives in `ab-logo`)

// 🧩 React types only
import type { CSSProperties, ReactElement } from 'react';
// 🧵 class-name joiner
import clsx from 'clsx';
// 🎨 package-shipped CSS module (Tailwind-independent)
import styles from './styles.module.css';

// 🅰️ the four logo looks
export type AbLogoType = 'contained' | 'outlined' | 'hollow' | 'naked';

// 📐 public props
export interface AbLogoProps {
  // 🅰️ look of the mark (default: naked)
  type?: AbLogoType;
  // 🏷️ consumer classes
  className?: string;
  /** 🖼️ Optional image src. Defaults to the Ab mark shipped in this package (data URI). */
  src?: string;
  /** 🎭 Optional CSS mask value for outlined/hollow/naked. */
  mask?: string;
  // 🗣️ accessible name of the mark
  alt?: string;
  // 📏 mark size (or wordmark font-size when `wordmark` is on)
  size?: number | string;
  /** 🔤 Show the wordmark next to the mark: `true` → "Elements", or any string. */
  wordmark?: boolean | string;
  /** 🎨 Mark + wordmark color (CSS color). Defaults to bronze (light) / #FFF8F5 (dark). */
  color?: string;
}

/** 🅰️ Inlined Ab logo shipped with this package (also at `ab-logo/ab-logo.svg`). */
export const AB_LOGO_DEFAULT_SRC = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xml%3Aspace%3D%22preserve%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23A67C52%22%20d%3D%22m1.8%2020.5%209.3-17v17zM22.2%207.7l-9.3-4.2v17l9.3-4.2-4.7-4.3z%22/%3E%3Cpath%20d%3D%22m12.9%2020.5%209.3-4.2-9.3-8.6z%22%20opacity%3D%22.1%22/%3E%3C/svg%3E';

// 🔤 the default wordmark text (a brand name, never translated)
export const AB_LOGO_DEFAULT_WORDMARK = 'Elements';

// 📏 number → px, string → as is
const toCssSize = (size?: number | string): string | undefined =>
  size != null ? (typeof size === 'number' ? `${size}px` : size) : undefined;

const AbLogo = ({
  type = 'naked', // 🅰️ naked by default
  className, // 🏷️ consumer classes
  src, // 🖼️ optional image
  mask, // 🎭 optional mask
  alt = 'Ab', // 🗣️ default name
  size, // 📏 optional size
  wordmark, // 🔤 optional wordmark
  color, // 🎨 optional color
}: AbLogoProps): ReactElement => {
  // 📏 normalized size
  const dim = toCssSize(size);
  // 🔤 wordmark text (null = no wordmark)
  const text = wordmark === true ? AB_LOGO_DEFAULT_WORDMARK : typeof wordmark === 'string' && wordmark ? wordmark : null;
  // 🎨 color as a custom property consumed by the CSS module
  const colorVar = (color ? { '--ab-logo-color': color } : {}) as CSSProperties;

  // 🖼️ build the mark
  let mark: ReactElement;
  if (type === 'contained') {
    // 🖼️ contained = a real <img>
    mark = (
      <img
        className={clsx(!text && ['AbLogo', 'app-logo', className], styles.abLogoContained, text && styles.abLogo__mark)}
        src={src ?? AB_LOGO_DEFAULT_SRC}
        alt={text ? '' : alt}
        aria-hidden={text ? true : undefined}
        data-type="contained"
        style={!text && dim ? { width: dim, height: dim } : undefined}
      />
    );
  } else {
    // 🎭 explicit mask/src wins; otherwise the CSS module masks with `--app-logo-url` or the shipped mark (no brown square ✅)
    const maskValue = mask ?? (src ? `url('${src}') no-repeat 50% 50%` : undefined);
    mark = (
      <span
        className={clsx(!text && ['AbLogo', 'app-logo', className], styles.abLogo, text && styles.abLogo__mark)}
        data-type={type}
        role={text ? undefined : 'img'}
        aria-label={text ? undefined : alt}
        aria-hidden={text ? true : undefined}
        style={{
          ...(!text ? colorVar : {}), // 🎨 color (standalone mark only; lockup sets it on the wrapper)
          ...(!text && dim ? { width: dim, height: dim } : {}), // 📏 size
          ...(maskValue ? { WebkitMask: maskValue, mask: maskValue, WebkitMaskSize: 'cover', maskSize: 'cover' } : {}), // 🎭 custom mask
        }}
      />
    );
  }

  // 🅰️ no wordmark → just the mark (unchanged API)
  if (!text) return mark;

  // 🔤 lockup: mark + wordmark, one accessible image
  return (
    <span
      className={clsx('AbLogo', 'AbLogo--wordmark', styles.abLogo__lockup, className)}
      data-type={type}
      role="img"
      aria-label={`${alt} ${text}`.trim()}
      style={{ ...colorVar, ...(dim ? { fontSize: dim } : {}) }}
    >
      {/* 🅰️ the mark */}
      {mark}
      {/* 🔤 the wordmark — Quicksand Bold from ab-nextjs-fonts */}
      <span className={clsx('font-quicksand-bold', styles.abLogo__wordmark)} aria-hidden="true">{text}</span>
    </span>
  );
};

// 📦 exports
export default AbLogo;
export { AbLogo };
