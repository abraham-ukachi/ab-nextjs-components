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
* @name: AbIcon - Server
* @file: server/ab-icon/index.tsx
*/

import type { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number | string;
  title?: string;
}

/** Material Symbols ligature icon (server / RSC). */
const AbIcon = ({ name, className, filled = false, size, title }: AbIconProps): ReactElement => {
  return (
    <span
      className={clsx('material-symbols-rounded', 'icon', styles.abIcon, className)}
      style={size != null ? { fontSize: typeof size === 'number' ? `${size}px` : size } : undefined}
      title={title}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      data-filled={filled ? 'true' : 'false'}
    >
      {name}
    </span>
  );
};

export default AbIcon;
export { AbIcon };
