/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbPageSwitcher - Client (port of lyd-page-switcher)
* @file: ab-page-switcher/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbPageSwitcherProps {
  className?: string;
  hidden?: boolean;
  disabled?: boolean;
  page: number;
  total: number;
  min?: number;
  max?: number;
  onChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
}

const AbPageSwitcher = ({
  className,
  hidden = false,
  disabled = false,
  page,
  total,
  min = 1,
  max,
  onChange,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
}: AbPageSwitcherProps): ReactElement => {
  const upper = max ?? total;
  const current = page;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(page));
  const shown = editing ? draft : String(current);

  const go = (next: number) => {
    const clamped = Math.min(upper, Math.max(min, next));
    if (disabled || clamped === current) return;
    setDraft(String(clamped));
    setEditing(false);
    onChange(clamped);
  };

  const commitDraft = () => {
    const parsed = Number.parseInt(draft, 10);
    setEditing(false);
    if (Number.isNaN(parsed)) {
      setDraft(String(current));
      return;
    }
    go(parsed);
  };

  return (
    <div hidden={hidden} className={clsx('AbPageSwitcher', styles.abPageSwitcher, className)}>
      <button
        type="button"
        className={styles.abPageSwitcherBtn}
        aria-label={previousLabel}
        disabled={disabled || current <= min}
        onClick={() => go(current - 1)}
      >
        <span className="material-symbols-rounded" aria-hidden>
          chevron_left
        </span>
      </button>
      <input
        className={styles.abPageSwitcherInput}
        type="number"
        inputMode="numeric"
        min={min}
        max={upper}
        value={shown}
        disabled={disabled}
        aria-label="Page number"
        onFocus={() => {
          setDraft(String(current));
          setEditing(true);
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitDraft();
          }
        }}
      />
      <span className={styles.abPageSwitcherMeta}>/ {total}</span>
      <button
        type="button"
        className={styles.abPageSwitcherBtn}
        aria-label={nextLabel}
        disabled={disabled || current >= upper}
        onClick={() => go(current + 1)}
      >
        <span className="material-symbols-rounded" aria-hidden>
          chevron_right
        </span>
      </button>
    </div>
  );
};

export default AbPageSwitcher;
export { AbPageSwitcher };
