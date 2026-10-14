/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-components
* @name: AbLikeButton - Client (port of lyd-like-button)
* @file: ab-like-button/index.tsx
* @type: TypeScript (React)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

import type { CSSProperties, MouseEvent, ReactElement } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';
import { AB_MOTION } from 'ab-nextjs-animations/motion'; // 🎬 transition class names (ab-nextjs-animations >= 0.2.4)
import 'ab-nextjs-animations/motion/styles.css'; // 🎨 .ab-motion-*
import { AB_SPIN_CLASS } from 'ab-nextjs-animations/spin'; // 🌀 spinner (ab-nextjs-animations >= 0.2.4)
import 'ab-nextjs-animations/spin/styles.css'; // 🌀 .ab-spin

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
    AB_MOTION.interactive, // 🎬 hover / state motion (ab-nextjs-animations)
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
    <span className={clsx(styles.abLikeButtonSpinner, AB_SPIN_CLASS)} aria-hidden />
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
