/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbSearchResult - Client (port of lyd-search-result)
* @file: ab-search-result/index.tsx
*/

'use client';

import type { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbSearchResultProps {
  className?: string;
  emptyImageClassName?: string;
  hidden?: boolean;
  isEmpty?: boolean;
  isActionButtonHidden?: boolean;
  emptyImage?: string | null;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyActionButtonClick?: () => void;
  children?: ReactNode;
}

const AbSearchResult = ({
  className,
  emptyImageClassName,
  hidden = false,
  isEmpty = false,
  isActionButtonHidden = false,
  emptyImage = null,
  emptyTitle = 'No results',
  emptyMessage = 'Try another search.',
  emptyActionLabel = 'Clear search',
  onEmptyActionButtonClick,
  children,
}: AbSearchResultProps): ReactElement => {
  if (isEmpty) {
    return (
      <div hidden={hidden} className={clsx('AbSearchResult', styles.abSearchResult, className)} role="status">
        <div className={styles.abSearchResultEmpty}>
          {emptyImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={emptyImage} alt="" className={clsx(styles.abSearchResultEmptyImage, emptyImageClassName)} />
          ) : (
            <span className="material-symbols-rounded" style={{ fontSize: 64 }} aria-hidden>
              search_off
            </span>
          )}
          <h3 className={styles.abSearchResultEmptyTitle}>{emptyTitle}</h3>
          <p className={styles.abSearchResultEmptyMessage}>{emptyMessage}</p>
          {!isActionButtonHidden && onEmptyActionButtonClick ? (
            <button type="button" className={styles.abSearchResultEmptyAction} onClick={onEmptyActionButtonClick}>
              {emptyActionLabel}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div hidden={hidden} className={clsx('AbSearchResult', styles.abSearchResult, className)}>
      <div className={styles.abSearchResultContent}>{children}</div>
    </div>
  );
};

export default AbSearchResult;
export { AbSearchResult };

