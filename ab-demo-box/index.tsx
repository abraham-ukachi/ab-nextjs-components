/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbDemoBox - Client (port of lyd-demo-box)
* @file: ab-demo-box/index.tsx
*/

'use client';

import type { ReactElement, ReactNode } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbDemoBoxProps {
  className?: string;
  hidden?: boolean;
  children?: ReactNode;
}

const AbDemoBox = forwardRef<HTMLDivElement, AbDemoBoxProps>(function AbDemoBox(
  { className, hidden = false, children },
  ref,
): ReactElement {
  return (
    <div ref={ref} hidden={hidden} className={clsx('AbDemoBox', styles.abDemoBox, className)}>
      {children}
    </div>
  );
});

export default AbDemoBox;
export { AbDemoBox };
