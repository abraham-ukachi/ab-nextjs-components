/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbPreview - Client (Adapt of lyd-preview; db/providers stripped)
* @file: ab-preview/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './styles.module.css';

export type AbPreviewItem = {
  id: string | number;
  src: string;
  alt?: string;
  href?: string;
};

export interface AbPreviewProps {
  className?: string;
  hidden?: boolean;
  items?: AbPreviewItem[];
  emptyLabel?: string;
}

const AbPreview = ({
  className,
  hidden = false,
  items = [],
  emptyLabel = 'No previews',
}: AbPreviewProps): ReactElement => {
  if (!items.length) {
    return (
      <div hidden={hidden} className={clsx('AbPreview', styles.abPreview, className)}>
        <div className={styles.abPreviewEmpty}>{emptyLabel}</div>
      </div>
    );
  }

  return (
    <div hidden={hidden} className={clsx('AbPreview', styles.abPreview, className)}>
      {items.map((item) => {
        const inner = (
          <Image
            className={styles.abPreviewImg}
            src={item.src}
            alt={item.alt ?? ''}
            width={160}
            height={160}
            unoptimized
          />
        );
        return (
          <div key={item.id} className={styles.abPreviewItem}>
            {item.href ? (
              <a href={item.href} style={{ display: 'contents' }}>
                {inner}
              </a>
            ) : (
              inner
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AbPreview;
export { AbPreview };
