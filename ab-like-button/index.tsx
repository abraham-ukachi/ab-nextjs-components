/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbLikeButton - Client (port of lyd-like-button)
* @file: ab-like-button/index.tsx
*/

'use client';

import type { CSSProperties, MouseEvent, ReactElement } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbLikeButtonProps {
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  liked?: boolean;
  disabled?: boolean;
  expands?: boolean;
  shrinks?: boolean;
  tabIndex?: number;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  href?: string | null;
  isActive?: boolean;
  isNaked?: boolean;
  isLoading?: boolean;
  likeIcon?: string;
  likedIcon?: string;
  ariaLabel?: string;
}

const AbLikeButton = ({
  className,
  style,
  hidden = false,
  liked = false,
  disabled = false,
  expands = false,
  shrinks = false,
  tabIndex,
  onClick,
  href = null,
  isActive = false,
  isNaked = false,
  isLoading = false,
  likeIcon = 'favorite_border',
  likedIcon = 'favorite',
  ariaLabel = 'Like',
}: AbLikeButtonProps): ReactElement => {
  const icon = liked ? likedIcon : likeIcon;
  const classNames = clsx(
    'AbLikeButton',
    styles.abLikeButton,
    liked && styles.isLiked,
    isActive && styles.isActive,
    isNaked && styles.isNaked,
    expands && styles.expands,
    shrinks && styles.shrinks,
    disabled && styles.isDisabled,
    isLoading && styles.isLoading,
    className,
  );

  const inner = isLoading ? (
    <span className={styles.abLikeButtonSpinner} aria-hidden />
  ) : (
    <span className={clsx('material-symbols-rounded', styles.abLikeButtonIcon)} aria-hidden>
      {icon}
    </span>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        hidden={hidden}
        style={style}
        className={classNames}
        aria-label={ariaLabel}
        data-liked={liked ? 'true' : 'false'}
        data-naked={isNaked ? 'true' : 'false'}
        tabIndex={tabIndex}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      hidden={hidden}
      style={style}
      className={classNames}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-pressed={liked}
      data-liked={liked ? 'true' : 'false'}
      data-naked={isNaked ? 'true' : 'false'}
      tabIndex={tabIndex}
      onClick={onClick}
    >
      {inner}
    </button>
  );
};

export default AbLikeButton;
export { AbLikeButton };
