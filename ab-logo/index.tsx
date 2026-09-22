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
  /** Optional image src (contained). Defaults to ab-nextjs-icons Ab logo. */
  src?: string;
  /** Optional CSS mask value for outlined/hollow/naked. */
  mask?: string;
  alt?: string;
  size?: number | string;
}

const DEFAULT_SRC = '/ab-nextjs-icons/logos/ab-logo.svg';

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

  const maskValue = mask ?? `url('${DEFAULT_SRC}') no-repeat 50% 50%`;
  return (
    <span
      className={clsx('AbLogo', 'app-logo', styles.abLogo, className)}
      data-type={type}
      role="img"
      aria-label={alt}
      style={{
        ...(dim ? { width: dim, height: dim } : {}),
        WebkitMask: maskValue,
        mask: maskValue,
        WebkitMaskSize: 'cover',
        maskSize: 'cover',
      }}
    />
  );
};

export default AbLogo;
export { AbLogo };
