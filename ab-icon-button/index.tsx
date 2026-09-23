/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbIconButton - Client
* @file: ab-icon-button/index.tsx
*/

'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbIconButtonProps {
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  icon: string;
  disabled?: boolean;
  expands?: boolean;
  shrinks?: boolean;
  tabIndex?: number;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  active?: boolean;
  naked?: boolean;
  isLoading?: boolean;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

const AbIconButton = forwardRef<HTMLButtonElement, AbIconButtonProps>(function AbIconButton(props, ref) {
  const {
    className,
    style,
    hidden = false,
    icon,
    disabled = false,
    expands = false,
    shrinks = false,
    tabIndex,
    onClick,
    href,
    active = false,
    naked = false,
    isLoading = false,
    title,
    type = 'button',
  } = props;

  const classNames = clsx('AbIconButton', 'icon-button', styles.abIconButton, className);

  if (href && !isLoading) {
    return (
      <span hidden={hidden} className={styles.wrap} title={title}>
        <a
          href={disabled ? undefined : href}
          role="button"
          className={classNames}
          style={style}
          data-active={String(active)}
          data-naked={String(naked)}
          data-expands={String(expands)}
          data-shrinks={String(shrinks)}
          tabIndex={tabIndex ?? 0}
          aria-disabled={disabled}
        >
          <span className={clsx('material-symbols-rounded', 'icon')}>{icon}</span>
        </a>
      </span>
    );
  }

  return (
    <span hidden={hidden} className={styles.wrap} title={title}>
      <button
        ref={ref}
        type={type}
        className={classNames}
        style={style}
        disabled={disabled || isLoading}
        data-active={String(active)}
        data-naked={String(naked)}
        data-expands={String(expands)}
        data-shrinks={String(shrinks)}
        onClick={onClick}
        tabIndex={tabIndex ?? 0}
        aria-label={title}
      >
        {isLoading ? (
          <span className={clsx('spinner', 'dots-12', styles.spinner)} />
        ) : (
          <span className={clsx('material-symbols-rounded', 'icon')}>{icon}</span>
        )}
      </button>
    </span>
  );
});

export default AbIconButton;
export { AbIconButton };
