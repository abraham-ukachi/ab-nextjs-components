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
* @name: AbSearchbar - Client (port of lyd-searchbar)
* @file: ab-searchbar/index.tsx
* @type: TypeScript (React)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

import type { CSSProperties, KeyboardEvent, ReactElement } from 'react';
import { useId, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { AB_MOTION } from 'ab-nextjs-animations/motion'; // 🎬 transition class names (ab-nextjs-animations >= 0.2.4)
import 'ab-nextjs-animations/motion/styles.css'; // 🎨 .ab-motion-*
import { AB_SPIN_CLASS } from 'ab-nextjs-animations/spin'; // 🌀 spinner (ab-nextjs-animations >= 0.2.4)
import 'ab-nextjs-animations/spin/styles.css'; // 🌀 .ab-spin

export interface AbSearchbarProps {
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isBusy?: boolean;
  dividerHidden?: boolean;
  dropdownButtonHidden?: boolean;
  dropdownButtonLabel?: string;
  clearLabel?: string;
  onChange?: (searchValue: string) => void;
  onEnter?: (searchValue: string, event?: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (searchValue: string, event?: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (searchValue: string, event?: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onDropdownButtonClick?: () => void;
  onLoad?: (searchInputElement?: HTMLInputElement | null) => void;
}

const AbSearchbar = ({
  className,
  style,
  hidden = false,
  name = 'q',
  value,
  defaultValue = '',
  placeholder = 'Search…',
  disabled = false,
  isLoading = false,
  isBusy = false,
  dividerHidden = false,
  dropdownButtonHidden = true,
  dropdownButtonLabel = 'Filters',
  clearLabel = 'Clear',
  onChange,
  onEnter,
  onKeyDown,
  onKeyUp,
  onFocus,
  onBlur,
  onClear,
  onDropdownButtonClick,
  onLoad,
}: AbSearchbarProps): ReactElement => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const loadNotified = useRef(false);
  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (node && !loadNotified.current) {
      loadNotified.current = true;
      onLoad?.(node);
    }
  };
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value! : internal;
  const busy = isLoading || isBusy;


  const setValue = (next: string) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const clear = () => {
    setValue('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div
      hidden={hidden}
      style={style}
      className={clsx('AbSearchbar', styles.abSearchbar, AB_MOTION.colors, disabled && styles.isDisabled, className)}
      data-busy={busy ? 'true' : 'false'}
    >
      <span className={clsx('material-symbols-rounded', styles.abSearchbarIcon)} aria-hidden>
        search
      </span>
      <input
        ref={setInputRef}
        id={id}
        name={name}
        type="search"
        className={styles.abSearchbarInput}
        placeholder={placeholder}
        value={current}
        disabled={disabled}
        aria-busy={busy}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(e) => {
          onKeyDown?.(e.currentTarget.value, e);
          if (e.key === 'Enter') onEnter?.(e.currentTarget.value, e);
        }}
        onKeyUp={(e) => onKeyUp?.(e.currentTarget.value, e)}
      />
      {busy ? <span className={clsx(styles.abSearchbarSpinner, AB_SPIN_CLASS)} aria-hidden /> : null}
      {current && !disabled ? (
        <button type="button" className={styles.abSearchbarClear} aria-label={clearLabel} onClick={clear}>
          <span className="material-symbols-rounded" aria-hidden>close</span>
        </button>
      ) : null}
      {!dividerHidden && !dropdownButtonHidden ? <span className={styles.abSearchbarDivider} aria-hidden /> : null}
      {!dropdownButtonHidden ? (
        <button
          type="button"
          className={styles.abSearchbarDropdown}
          disabled={disabled}
          onClick={onDropdownButtonClick}
        >
          {dropdownButtonLabel}
        </button>
      ) : null}
    </div>
  );
};

export default AbSearchbar;
export { AbSearchbar };

