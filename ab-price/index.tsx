/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbPrice - Client (port of lyd-price)
* @file: ab-price/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import { useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbPriceProps {
  className?: string;
  hidden?: boolean;
  weight?: 'bold' | 'normal' | 'light';
  size?: string;
  totalSize?: string;
  noScale?: boolean;
  price: number;
  quantity?: number;
  currency: string;
  symbol: string;
  useSymbol?: boolean;
  isSymbolBefore?: boolean;
  isTaxIncluded?: boolean;
  taxIncludedLabel?: string;
  isTaxIncludedHidden?: boolean;
  locale?: string;
  useLocale?: boolean;
}

const AbPrice = ({
  className,
  hidden = false,
  weight = 'normal',
  size = '12px',
  totalSize = '30px',
  noScale = false,
  price,
  quantity = 1,
  currency,
  symbol,
  useSymbol = false,
  isSymbolBefore = true,
  isTaxIncluded = false,
  taxIncludedLabel = 'Tax included',
  isTaxIncludedHidden = false,
  locale = 'en',
  useLocale = false,
}: AbPriceProps): ReactElement => {
  const totalPrice = useMemo(() => Number((price * quantity).toFixed(2)), [price, quantity]);

  const format = (amount: number) =>
    useLocale ? amount.toLocaleString(locale) : amount.toFixed(2);

  const mark = useSymbol ? symbol : currency;
  const unitStyle = { fontSize: quantity > 1 ? size : totalSize, transform: noScale ? 'none' : undefined };
  const totalStyle = { fontSize: totalSize, transform: noScale ? 'none' : undefined };

  const amount = (n: number) => (
    <>
      {isSymbolBefore ? <>{mark}{' '}</> : null}
      {format(n)}
      {!isSymbolBefore ? <>{' '}{mark}</> : null}
    </>
  );

  return (
    <div
      hidden={hidden}
      className={clsx(
        'AbPrice',
        styles.abPrice,
        weight === 'bold' && styles.isBold,
        weight === 'normal' && styles.isNormal,
        weight === 'light' && styles.isLight,
        className,
      )}
    >
      <span className={styles.abPriceUnit} style={unitStyle} title={format(totalPrice)}>
        {quantity > 1 ? <span className={styles.abPriceMultiplier}>{quantity} × </span> : null}
        <span>{amount(price)}</span>
      </span>
      {quantity > 1 ? (
        <span className={styles.abPriceTotal} style={totalStyle} title={String(totalPrice)}>
          {amount(totalPrice)}
        </span>
      ) : null}
      {isTaxIncluded && !isTaxIncludedHidden ? (
        <span className={styles.abPriceTax}>
          <span className="material-symbols-rounded" aria-hidden>receipt_long</span>
          <b>{taxIncludedLabel}</b>
        </span>
      ) : null}
    </div>
  );
};

export default AbPrice;
export { AbPrice };

