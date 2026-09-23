/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbPriceTag - Client (port of lyd-price-tag)
* @file: ab-price-tag/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbPriceTagProps {
  className?: string;
  hidden?: boolean;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  currencySymbol: string;
  useCurrencySymbol?: boolean;
  isBrandHidden?: boolean;
  isCategoryHidden?: boolean;
}

const AbPriceTag = ({
  className,
  hidden = false,
  name,
  brand,
  category,
  price,
  currency,
  currencySymbol,
  useCurrencySymbol = false,
  isBrandHidden = false,
  isCategoryHidden = false,
}: AbPriceTagProps): ReactElement => {
  const money = useCurrencySymbol ? currencySymbol : currency;

  return (
    <div hidden={hidden} className={clsx('AbPriceTag', styles.abPriceTag, className)}>
      <div className={styles.abPriceTagDetails}>
        <div className={styles.abPriceTagBrandCategory}>
          {!isBrandHidden ? <span className={styles.abPriceTagBrand}>{brand}</span> : null}
          {!isCategoryHidden ? <span className={styles.abPriceTagCategory}>{category}</span> : null}
        </div>
        <span className={styles.abPriceTagName}>{name}</span>
        <span className={styles.abPriceTagPrice}>
          {price} {money}
        </span>
      </div>
      <div className={styles.abPriceTagIconWrap} aria-hidden>
        <span className={styles.abPriceTagIconDivider} />
        <span className={clsx('material-symbols-rounded', styles.abPriceTagIcon)}>shopping_cart</span>
      </div>
    </div>
  );
};

export default AbPriceTag;
export { AbPriceTag };

