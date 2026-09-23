/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbCollapsible - Client (port of lyd-collapsible)
* @file: ab-collapsible/index.tsx
*/

'use client';

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbCollapsibleProps {
  href?: string | null;
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  type?: 'contained' | 'outlined';
  effect?: 'normal' | 'morph' | 'translucent';
  title: string;
  subtitle?: string;
  icon?: string;
  resetIcon?: string;
  expandIcon?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  isActive?: boolean;
  autoActiveIcon?: boolean;
  autoHideSubtitle?: boolean;
  hideResetIcon?: boolean;
  hideSubtitle?: boolean;
  subtitleAsCaption?: boolean;
  titleBold?: boolean;
  titleCapitalize?: boolean;
  expands?: boolean;
  titleExpands?: boolean;
  shrinks?: boolean;
  children?: ReactNode;
  onToggle?: (open: boolean) => void;
  onReset?: () => void;
}

const AbCollapsible = ({
  href = null,
  className,
  style,
  hidden = false,
  type = 'contained',
  effect = 'normal',
  title,
  subtitle,
  icon,
  resetIcon = 'close',
  expandIcon = 'expand_more',
  isOpen,
  defaultOpen = false,
  isActive = false,
  autoActiveIcon = true,
  autoHideSubtitle = true,
  hideResetIcon = true,
  hideSubtitle = false,
  subtitleAsCaption = false,
  titleBold = true,
  titleCapitalize = false,
  expands = false,
  titleExpands = false,
  shrinks = false,
  children,
  onToggle,
  onReset,
}: AbCollapsibleProps): ReactElement => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpen ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (isOpen === undefined) setInternalOpen(next);
    onToggle?.(next);
  };

  const headerInner = (
    <>
      {icon ? (
        <span
          className={clsx(
            'material-symbols-rounded',
            styles.abCollapsibleIcon,
            autoActiveIcon && open && styles.iconActive,
          )}
          aria-hidden
        >
          {icon}
        </span>
      ) : null}
      <span className={styles.abCollapsibleTitles}>
        <span
          className={clsx(
            styles.abCollapsibleTitle,
            titleBold && styles.titleBold,
            titleCapitalize && styles.titleCapitalize,
            titleExpands && styles.titleExpands,
          )}
        >
          {title}
        </span>
        {subtitle && !hideSubtitle && !(autoHideSubtitle && !open) ? (
          <span
            className={clsx(
              styles.abCollapsibleSubtitle,
              subtitleAsCaption && styles.subtitleCaption,
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
      {!hideResetIcon ? (
        <button
          type="button"
          className={styles.abCollapsibleReset}
          aria-label="Reset"
          onClick={(e) => {
            e.stopPropagation();
            onReset?.();
          }}
        >
          <span className="material-symbols-rounded" aria-hidden>
            {resetIcon}
          </span>
        </button>
      ) : null}
      <span
        className={clsx('material-symbols-rounded', styles.abCollapsibleExpand, open && styles.expanded)}
        aria-hidden
      >
        {expandIcon}
      </span>
    </>
  );

  return (
    <div
      hidden={hidden}
      style={style}
      data-type={type}
      data-effect={effect}
      data-open={open ? 'true' : 'false'}
      data-active={isActive ? 'true' : 'false'}
      data-expands={expands ? 'true' : 'false'}
      data-shrinks={shrinks ? 'true' : 'false'}
      className={clsx(
        'AbCollapsible',
        styles.abCollapsible,
        open && styles.isOpen,
        isActive && styles.isActive,
        expands && styles.expands,
        shrinks && styles.shrinks,
        className,
      )}
    >
      {href ? (
        <Link href={href} className={styles.abCollapsibleHeader}>
          {headerInner}
        </Link>
      ) : (
        <button
          type="button"
          className={styles.abCollapsibleHeader}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {headerInner}
        </button>
      )}
      {open ? <div className={styles.abCollapsibleBody}>{children}</div> : null}
    </div>
  );
};

export default AbCollapsible;
export { AbCollapsible };
