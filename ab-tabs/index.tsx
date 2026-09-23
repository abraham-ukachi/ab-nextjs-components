/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbTabs - Client (port of lyd-tabs)
* @file: ab-tabs/index.tsx
*/

'use client';

import type { ReactElement, ReactNode } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbTabsProps {
  className?: string;
  hidden?: boolean;
  children?: ReactNode;
  dividerHidden?: boolean;
}

const AbTabs = forwardRef<HTMLUListElement, AbTabsProps>(function AbTabs(
  { className, hidden = false, children, dividerHidden = false },
  ref,
): ReactElement {
  return (
    <ul
      ref={ref}
      hidden={hidden}
      role="tablist"
      data-divider-hidden={dividerHidden ? 'true' : 'false'}
      className={clsx('AbTabs', styles.abTabs, dividerHidden && styles.noDivider, className)}
    >
      {children}
    </ul>
  );
});

export default AbTabs;
export { AbTabs };
