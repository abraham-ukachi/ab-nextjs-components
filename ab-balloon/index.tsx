/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbBalloon - Client (Adapt — title= locked)
* @file: ab-balloon/index.tsx
*/

'use client';

import type { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbBalloonProps {
  /** Native tooltip text — locked API (`title=`). */
  title?: string;
  className?: string;
  hidden?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

/**
 * AbBalloon — Phase 2 Adapt.
 * Uses the native `title=` tooltip (locked). Not a port of the LYD hover balloon.
 */
const AbBalloon = ({
  title,
  className,
  hidden = false,
  disabled = false,
  children,
}: AbBalloonProps): ReactElement => {
  if (hidden) {
    return <>{children}</>;
  }

  return (
    <span
      className={clsx('AbBalloon', styles.abBalloon, className)}
      title={disabled ? undefined : title}
      data-disabled={disabled ? 'true' : 'false'}
    >
      {children}
    </span>
  );
};

export default AbBalloon;
export { AbBalloon };
