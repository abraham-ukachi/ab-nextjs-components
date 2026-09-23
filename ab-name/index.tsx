/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbName - Client (port of lyd-name)
* @file: ab-name/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbNameProps {
  type?: 'light' | 'regular' | 'bold' | 'black';
  className?: string;
  label?: string;
  onClick?: () => void;
}

const AbName = ({
  type = 'regular',
  className,
  label = 'abElements',
  onClick,
}: AbNameProps): ReactElement => {
  const first = label.slice(0, 2);
  const rest = label.slice(2);
  return (
    <span
      data-type={type}
      className={clsx('AbName', styles.abName, className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className={styles.abNameAb}>{first}</span>
      <span className={styles.abNameRest}>{rest}</span>
    </span>
  );
};

export default AbName;
export { AbName };
