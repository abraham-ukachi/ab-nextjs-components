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
* @name: AbButton - Client (port of lyd-button)
* @file: ab-button/index.tsx
*/

'use client';

import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type AbButtonType = 'contained' | 'outlined' | 'text';
export type AbButtonColor = 'primary' | 'secondary' | 'tertiary' | 'white' | 'black';

export interface AbButtonProps {
  id?: string;
  type?: AbButtonType;
  htmlType?: 'button' | 'submit' | 'reset';
  className?: string;
  spinnerClassName?: string;
  hidden?: boolean;
  style?: CSSProperties;
  iconStyle?: CSSProperties;
  rounded?: boolean;
  raised?: boolean;
  shrinks?: boolean;
  expands?: boolean;
  withIcon?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  iconPosition?: 'left' | 'right';
  label: string;
  icon?: string;
  color?: AbButtonColor;
  href?: string;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const AbButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, AbButtonProps>(function AbButton(props, ref) {
  const {
    id,
    type = 'contained',
    htmlType = 'button',
    className,
    spinnerClassName,
    hidden = false,
    style,
    iconStyle,
    rounded = true,
    raised = false,
    shrinks = false,
    expands = false,
    withIcon = false,
    disabled = false,
    isLoading = false,
    iconPosition = 'left',
    label,
    icon,
    color = 'primary',
    href,
    children,
    onClick,
  } = props;

  const classNames = clsx(
    'AbButton',
    styles.abButton,
    className,
    rounded && styles.abButtonRounded,
    type === 'contained' && styles.isContained,
    (disabled || isLoading) && styles.isDisabled,
  );

  const dataAttrs = {
    'data-type': type,
    'data-raised': raised ? 'true' : 'false',
    'data-shrinks': shrinks ? 'true' : 'false',
    'data-expands': expands ? 'true' : 'false',
    'data-rounded': rounded ? 'true' : 'false',
    'data-iconpos': iconPosition,
    'data-color': color,
  } as const;

  const content = (
    <>
      {withIcon && iconPosition === 'left' && icon ? (
        <span className={clsx('material-symbols-rounded', 'icon', styles.abButtonIcon)} style={iconStyle}>{icon}</span>
      ) : null}
      <span className={clsx(styles.abButtonSpinnerSlot, !isLoading && styles.hidden)}>
        <span className={clsx('spinner', 'dot-3', styles.abButtonSpinner, spinnerClassName)} />
      </span>
      <span className={clsx(isLoading && styles.invisible)}>{children ?? label}</span>
      {withIcon && iconPosition === 'right' && icon ? (
        <span className={clsx('material-symbols-rounded', 'icon', styles.abButtonIcon)} style={iconStyle}>{icon}</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        id={id}
        href={disabled ? undefined : href}
        role="button"
        className={classNames}
        style={style}
        hidden={hidden}
        aria-disabled={disabled || isLoading}
        onClick={onClick}
        {...dataAttrs}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      id={id}
      type={htmlType}
      className={classNames}
      style={style}
      hidden={hidden}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...dataAttrs}
    >
      {content}
    </button>
  );
});

export default AbButton;
export { AbButton };
