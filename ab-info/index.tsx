/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbInfo - Client (port of lyd-info)
* @file: ab-info/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbInfoProps {
  className?: string;
  hidden?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'white' | 'black';
  icon: string;
  title: string;
  message: string;
  closeLabel?: string;
  actionLabel?: string;
  actionHref?: string | null;
  onActionClick?: () => void;
  onCloseClick?: () => void;
}

const AbInfo = ({
  className,
  hidden = false,
  color = 'primary',
  icon,
  title,
  message,
  closeLabel = 'Close',
  actionLabel,
  actionHref = null,
  onActionClick,
  onCloseClick,
}: AbInfoProps): ReactElement => {
  return (
    <div
      hidden={hidden}
      data-color={color}
      className={clsx('AbInfo', styles.abInfo, styles[`color_${color}`], className)}
      role="status"
    >
      <span className={styles.abInfoIconWrap} aria-hidden>
        <span className={clsx('material-symbols-rounded', styles.abInfoIcon)}>{icon}</span>
      </span>
      <div className={styles.abInfoContent}>
        <p className={styles.abInfoTitle}>{title}</p>
        <p className={styles.abInfoMessage}>{message}</p>
        {actionLabel ? (
          actionHref ? (
            <Link href={actionHref} className={styles.abInfoAction} onClick={onActionClick}>
              {actionLabel}
            </Link>
          ) : (
            <button type="button" className={styles.abInfoAction} onClick={onActionClick}>
              {actionLabel}
            </button>
          )
        ) : null}
      </div>
      {onCloseClick ? (
        <button
          type="button"
          className={styles.abInfoClose}
          aria-label={closeLabel}
          onClick={onCloseClick}
        >
          <span className="material-symbols-rounded" aria-hidden>
            close
          </span>
        </button>
      ) : null}
    </div>
  );
};

export default AbInfo;
export { AbInfo };
