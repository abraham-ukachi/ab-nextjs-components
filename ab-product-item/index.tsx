/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbProductItem - Client (Adapt of lyd-product-item; providers stripped)
* @file: ab-product-item/index.tsx
*/

'use client';

import type { CSSProperties, ReactElement } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbProductItemProps {
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  width?: number;
  height?: number;
  id: number | string;
  code: string;
  name?: string;
  image: { id: number | string; path: string };
  price?: number;
  currencySymbol?: string;
}

const AbProductItem = ({
  className,
  style,
  hidden = false,
  width = 72,
  height = 72,
  id,
  code,
  name,
  image,
  price,
  currencySymbol = '€',
}: AbProductItemProps): ReactElement => {
  return (
    <div
      hidden={hidden}
      data-id={id}
      style={style}
      className={clsx('AbProductItem', styles.abProductItem, className)}
    >
      <div className={styles.abProductItemMedia} style={{ width, height }}>
        <Image
          className={styles.abProductItemImg}
          src={image.path}
          alt={name ?? code}
          width={width}
          height={height}
          unoptimized
        />
      </div>
      <div className={styles.abProductItemBody}>
        <span className={styles.abProductItemCode}>{code}</span>
        {name ? <h4 className={styles.abProductItemName}>{name}</h4> : null}
        {price != null ? (
          <span className={styles.abProductItemPrice}>
            {currencySymbol} {price.toFixed(2)}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default AbProductItem;
export { AbProductItem };
