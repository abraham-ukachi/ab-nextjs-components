/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbTab - Client (port of lyd-tab)
* @file: ab-tab/index.tsx
*/

'use client';

import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { forwardRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbTabProps {
  className?: string;
  hidden?: boolean;
  id: string;
  title: string;
  children?: ReactNode;
  noIndicator?: boolean;
  disabled?: boolean;
  isNaked?: boolean;
  isSelected?: boolean;
  href?: string | null;
  onClick?: (id?: string, element?: HTMLLIElement, event?: MouseEvent<HTMLLIElement>) => void;
}

const AbTab = forwardRef<HTMLLIElement, AbTabProps>(function AbTab(
  {
    className,
    hidden = false,
    id,
    title,
    children,
    noIndicator = false,
    disabled = false,
    isNaked = false,
    isSelected = false,
    href = null,
    onClick,
  },
  ref,
): ReactElement {
  const handleClick = (event: MouseEvent<HTMLLIElement>) => {
    if (disabled) return;
    onClick?.(id, event.currentTarget, event);
  };

  const content = (
    <>
      <span className={styles.abTabText}>{children ?? title}</span>
      {!noIndicator ? (
        <span
          className={clsx(styles.abTabIndicator, isSelected && styles.abTabIndicatorVisible)}
          aria-hidden
        />
      ) : null}
    </>
  );

  return (
    <li
      role="tab"
      ref={ref}
      id={id}
      hidden={hidden}
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-selected={isSelected ? 'true' : 'false'}
      data-naked={isNaked ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      className={clsx(
        'AbTab',
        styles.abTab,
        isSelected && styles.isSelected,
        disabled && styles.isDisabled,
        isNaked && styles.isNaked,
        className,
      )}
      onClick={handleClick}
    >
      {href && !disabled ? (
        <Link href={href} className={styles.abTabLink} tabIndex={disabled ? -1 : 0}>
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
});

export default AbTab;
export { AbTab };
