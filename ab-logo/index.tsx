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
* @name: AbLogo - Client
* @file: ab-logo/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type AbLogoType = 'contained' | 'outlined' | 'hollow' | 'naked';

export interface AbLogoProps {
  type?: AbLogoType;
  className?: string;
  /** Optional image src (contained). Defaults to the Ab logo shipped in this package (data URI). */
  src?: string;
  /** Optional CSS mask value for outlined/hollow/naked. */
  mask?: string;
  alt?: string;
  size?: number | string;
}

/** Inlined Ab logo shipped with this package (also at `ab-logo/ab-logo.svg`). */
const DEFAULT_SRC = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xml%3Aspace%3D%22preserve%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23A67C52%22%20d%3D%22m1.8%2020.5%209.3-17v17zM22.2%207.7l-9.3-4.2v17l9.3-4.2-4.7-4.3z%22/%3E%3Cpath%20d%3D%22m12.9%2020.5%209.3-4.2-9.3-8.6z%22%20opacity%3D%22.1%22/%3E%3C/svg%3E';

const AbLogo = ({
  type = 'naked',
  className,
  src,
  mask,
  alt = 'Ab',
  size,
}: AbLogoProps): ReactElement => {
  const dim = size != null ? (typeof size === 'number' ? `${size}px` : size) : undefined;

  if (type === 'contained') {
    return (
      <img
        className={clsx('AbLogo', 'app-logo', styles.abLogoContained, className)}
        src={src ?? DEFAULT_SRC}
        alt={alt}
        data-type="contained"
        style={dim ? { width: dim, height: dim } : undefined}
      />
    );
  }

  // With no `mask`/`src`, leave the mask to `ab-nextjs-theme` (`--app-logo-url` / `.app-logo`).
  // When `mask` or `src` is set, apply it inline (src becomes a CSS mask url).
  const maskValue = mask ?? (src ? `url('${src}') no-repeat 50% 50%` : undefined);
  return (
    <span
      className={clsx('AbLogo', 'app-logo', styles.abLogo, className)}
      data-type={type}
      role="img"
      aria-label={alt}
      style={{
        ...(dim ? { width: dim, height: dim } : {}),
        ...(maskValue
          ? { WebkitMask: maskValue, mask: maskValue, WebkitMaskSize: 'cover', maskSize: 'cover' }
          : {}),
      }}
    />
  );
};

export default AbLogo;
export { AbLogo };
