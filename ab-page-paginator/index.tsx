/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbPagePaginator - Client (port of lyd-page-paginator)
* @file: ab-page-paginator/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import { useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbPagePaginatorProps {
  className?: string;
  hidden?: boolean;
  disabled?: boolean;
  page: number;
  total: number;
  maxLength?: number;
  onChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
}

function buildPageList(current: number, total: number, maxLength: number): Array<number | 'ellipsis'> {
  if (total <= 0) return [];
  if (total <= maxLength) return Array.from({ length: total }, (_, i) => i + 1);

  const half = Math.floor(maxLength / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + maxLength - 1);
  start = Math.max(1, end - maxLength + 1);

  const pages: Array<number | 'ellipsis'> = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('ellipsis');
  }
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total) {
    if (end < total - 1) pages.push('ellipsis');
    pages.push(total);
  }
  return pages;
}

const AbPagePaginator = ({
  className,
  hidden = false,
  disabled = false,
  page,
  total,
  maxLength = 5,
  onChange,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
}: AbPagePaginatorProps): ReactElement => {
  const current = page;
  const pages = useMemo(() => buildPageList(current, total, maxLength), [current, total, maxLength]);

  const go = (next: number) => {
    if (disabled || next < 1 || next > total || next === current) return;
    onChange(next);
  };

  return (
    <nav
      hidden={hidden}
      className={clsx('AbPagePaginator', styles.abPagePaginator, className)}
      aria-label="Pagination"
    >
      <button
        type="button"
        className={styles.abPagePaginatorBtn}
        aria-label={previousLabel}
        disabled={disabled || current <= 1}
        onClick={() => go(current - 1)}
      >
        <span className="material-symbols-rounded" aria-hidden>
          chevron_left
        </span>
      </button>
      <ul className={styles.abPagePaginatorList}>
        {pages.map((item, idx) =>
          item === 'ellipsis' ? (
            <li key={`e-${idx}`} className={styles.abPagePaginatorItem}>
              <span className={styles.abPagePaginatorEllipsis} aria-hidden>
                …
              </span>
            </li>
          ) : (
            <li key={item} className={styles.abPagePaginatorItem}>
              <button
                type="button"
                className={styles.abPagePaginatorBtn}
                data-active={item === current ? 'true' : 'false'}
                aria-current={item === current ? 'page' : undefined}
                disabled={disabled}
                onClick={() => go(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        className={styles.abPagePaginatorBtn}
        aria-label={nextLabel}
        disabled={disabled || current >= total}
        onClick={() => go(current + 1)}
      >
        <span className="material-symbols-rounded" aria-hidden>
          chevron_right
        </span>
      </button>
    </nav>
  );
};

export default AbPagePaginator;
export { AbPagePaginator };
