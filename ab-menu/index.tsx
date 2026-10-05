/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbMenu - Client (port of lyd-menu)
* @file: ab-menu/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import { forwardRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbMenuItemData {
  id: string;
  label: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
  inactive?: boolean;
  href?: string;
  action?: string;
  onClick?: () => void;
}

export interface AbMenuProps {
  className?: string;
  id: string;
  title?: string;
  items: AbMenuItemData[];
  isCancelable?: boolean;
  hidden?: boolean;
  isActive?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
}

const AbMenu = forwardRef<HTMLMenuElement, AbMenuProps>(function AbMenu(
  {
    className,
    id,
    title,
    items,
    isCancelable = false,
    hidden = false,
    isActive = false,
    onCancel,
    cancelLabel = 'Cancel',
  },
  ref,
): ReactElement {
  return (
    <menu
      ref={ref}
      id={id}
      data-id={id}
      hidden={hidden}
      data-active={isActive ? 'true' : 'false'}
      className={clsx('AbMenu', styles.abMenu, isActive && styles.isActive, className)}
    >
      {title ? <p className={styles.abMenuTitle}>{title}</p> : null}
      <ul className={styles.abMenuList}>
        {items.map((item) => {
          const body = (
            <>
              {item.icon ? (
                <span className={clsx('material-symbols-rounded', styles.abMenuIcon)} aria-hidden>
                  {item.icon}
                </span>
              ) : null}
              <span className={styles.abMenuLabel}>{item.label}</span>
            </>
          );
          const itemClass = clsx(
            styles.abMenuItem,
            item.selected && styles.isSelected,
            item.disabled && styles.isDisabled,
            item.inactive && styles.isInactive,
          );
          if (item.href && !item.disabled) {
            return (
              <li key={item.id} className={clsx('menu-item', itemClass)} data-id={item.id} data-action={item.action}>
                <Link href={item.href} className={styles.abMenuLink} onClick={item.onClick}>
                  {body}
                </Link>
              </li>
            );
          }
          return (
            <li key={item.id} className={clsx('menu-item', itemClass)} data-id={item.id} data-action={item.action}>
              <button
                type="button"
                className={styles.abMenuButton}
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {body}
              </button>
            </li>
          );
        })}
        {isCancelable ? (
          <li role="close-menu" className={styles.abMenuCancelItem}>
            <button type="button" className={styles.abMenuCancel} onClick={onCancel}>
              {cancelLabel}
            </button>
          </li>
        ) : null}
      </ul>
    </menu>
  );
});

export default AbMenu;
export { AbMenu };
