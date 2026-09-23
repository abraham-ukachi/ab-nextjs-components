/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbProduct - Client (Adapt of lyd-product; db/hooks stripped)
* @file: ab-product/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './styles.module.css';

export type AbProductImage = {
  id: number | string;
  path: string;
  colorId?: number;
};

export interface AbProductProps {
  className?: string;
  hidden?: boolean;
  size?: 'small' | 'normal' | 'medium' | 'large';
  type?: 'contained' | 'outlined' | 'text';
  isLiked?: boolean;
  isCarted?: boolean;
  disabled?: boolean;
  id: number | string;
  code?: string;
  brand?: string;
  name?: string;
  description?: string;
  images?: AbProductImage[];
  posterPath?: string;
  price?: number;
  currency?: string;
  currencySymbol?: string;
  useCurrencySymbol?: boolean;
  onLikeClick?: () => void;
  onCartClick?: () => void;
}

const AbProduct = ({
  className,
  hidden = false,
  size = 'normal',
  type = 'contained',
  isLiked = false,
  isCarted = false,
  disabled = false,
  id,
  brand,
  name,
  description,
  images = [],
  posterPath,
  price,
  currency = 'EUR',
  currencySymbol = '€',
  useCurrencySymbol = true,
  onLikeClick,
  onCartClick,
}: AbProductProps): ReactElement => {
  const src = posterPath ?? images[0]?.path ?? '';
  const money = useCurrencySymbol ? currencySymbol : currency;

  return (
    <article
      hidden={hidden}
      data-size={size}
      data-type={type}
      data-id={id}
      className={clsx('AbProduct', styles.abProduct, className)}
      data-disabled={disabled ? "true" : "false"}
    >
      <div className={styles.abProductMedia}>
        {src ? (
          <Image className={styles.abProductImg} src={src} alt={name ?? ''} width={320} height={320} unoptimized />
        ) : null}
      </div>
      <div className={styles.abProductBody}>
        {brand ? <span className={styles.abProductBrand}>{brand}</span> : null}
        {name ? <h3 className={styles.abProductName}>{name}</h3> : null}
        {description ? <p className={styles.abProductDesc}>{description}</p> : null}
        {price != null ? (
          <span className={styles.abProductPrice}>
            {money} {price.toFixed(2)}
          </span>
        ) : null}
        <div className={styles.abProductActions}>
          <button
            type="button"
            className={styles.abProductBtn}
            data-active={isLiked ? 'true' : 'false'}
            aria-label="Like"
            disabled={disabled}
            onClick={onLikeClick}
          >
            <span className="material-symbols-rounded" aria-hidden>
              {isLiked ? 'favorite' : 'favorite_border'}
            </span>
          </button>
          <button
            type="button"
            className={styles.abProductBtn}
            data-active={isCarted ? 'true' : 'false'}
            aria-label="Add to cart"
            disabled={disabled}
            onClick={onCartClick}
          >
            <span className="material-symbols-rounded" aria-hidden>
              {isCarted ? 'shopping_cart' : 'add_shopping_cart'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default AbProduct;
export { AbProduct };
