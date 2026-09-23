/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbBadge - Server (port of server/lyd-badge)
* @file: server/ab-badge/index.tsx
*/

import type { CSSProperties, ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbBadgeProps {
  className?: string;
  hidden?: boolean;
  style?: CSSProperties;
  color?: 'default' | 'red';
  count: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
  maxCount?: number;
}

function formatCount(count: number, maxCount: number): string {
  return count > maxCount ? `${maxCount}+` : String(count);
}

/** Server AbBadge — count pill. No 'use client'. */
const AbBadge = ({
  className,
  hidden = false,
  style,
  color = 'default',
  count,
  position = 'top-right',
  size = 'small',
  maxCount = 99,
}: AbBadgeProps): ReactElement | null => {
  if (hidden) return null;

  return (
    <span
      className={clsx(
        'AbBadge',
        styles.abBadge,
        styles[`color_${color}`],
        styles[`pos_${position.replace('-', '_')}`],
        styles[`size_${size}`],
        className,
      )}
      style={style}
      data-color={color}
      data-position={position}
      data-size={size}
    >
      <span className={styles.abBadgeValue}>{formatCount(count, maxCount)}</span>
    </span>
  );
};

export default AbBadge;
export { AbBadge };
