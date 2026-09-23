/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbMainHeadline - Client (port of lyd-main-headline; providers stripped)
* @file: ab-main-headline/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbMainHeadlineProps {
  className?: string;
  timePeriod?: 'morning' | 'afternoon' | 'evening' | 'night';
  title: string;
  commaHidden?: boolean;
  subtitle: string;
  isFirstNameBold?: boolean;
  hasExclamationMark?: boolean;
}

const AbMainHeadline = ({
  className,
  timePeriod,
  title,
  commaHidden = false,
  subtitle,
  isFirstNameBold = false,
  hasExclamationMark = false,
}: AbMainHeadlineProps): ReactElement => {
  const parts = title.trim().split(/\s+/);
  const first = parts[0] ?? '';
  const rest = parts.slice(1).join(' ');

  return (
    <header className={clsx('AbMainHeadline', styles.abMainHeadline, className)}>
      {timePeriod ? <span className={styles.abMainHeadlinePeriod}>{timePeriod}</span> : null}
      <h1 className={styles.abMainHeadlineTitle}>
        {isFirstNameBold ? <strong>{first}</strong> : first}
        {rest ? ` ${rest}` : ''}
        {!commaHidden ? ',' : ''}
        {hasExclamationMark ? '!' : ''}
      </h1>
      <p className={styles.abMainHeadlineSubtitle}>{subtitle}</p>
    </header>
  );
};

export default AbMainHeadline;
export { AbMainHeadline };
