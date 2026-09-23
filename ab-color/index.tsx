/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbColor - Client (port of lyd-color)
* @file: ab-color/index.tsx
*/

'use client';

import type { MouseEvent, ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbColorProps {
  className?: string;
  hidden?: boolean;
  disabled?: boolean;
  shape?: 'circle' | 'square';
  name: string;
  colors: string[];
  isActive?: boolean;
  expands?: boolean;
  shrinks?: boolean;
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
}

const AbColor = ({
  className,
  hidden = false,
  disabled = false,
  shape = 'circle',
  name,
  colors,
  isActive = false,
  expands = false,
  shrinks = false,
  onClick,
}: AbColorProps): ReactElement => {
  const swatches = colors.slice(0, 4);

  return (
    <button
      type="button"
      hidden={hidden}
      disabled={disabled}
      aria-label={name}
      aria-pressed={isActive}
      data-shape={shape}
      data-active={isActive ? 'true' : 'false'}
      data-expands={expands ? 'true' : 'false'}
      data-shrinks={shrinks ? 'true' : 'false'}
      className={clsx(
        'AbColor',
        styles.abColor,
        shape === 'square' && styles.square,
        isActive && styles.isActive,
        expands && styles.expands,
        shrinks && styles.shrinks,
        disabled && styles.isDisabled,
        className,
      )}
      onClick={onClick}
    >
      <span className={styles.abColorSwatches} aria-hidden>
        {swatches.map((c, i) => (
          <span
            key={`${name}-${i}`}
            className={styles.abColorSwatch}
            style={{ background: c }}
          />
        ))}
      </span>
      <span className={styles.abColorName}>{name}</span>
    </button>
  );
};

export default AbColor;
export { AbColor };
