/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-components
* @name: AbCollapsible - Client (port of lyd-collapsible)
* @file: ab-collapsible/index.tsx
* @type: TypeScript (React)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import Link from '../ab-link'; // 🔗 G42: injectable via AbLinkProvider (default next/link)
import clsx from 'clsx';
import styles from './styles.module.css';
import { AB_MOTION } from 'ab-nextjs-animations/motion'; // 🎬 transition class names (ab-nextjs-animations >= 0.2.4)
import 'ab-nextjs-animations/motion/styles.css'; // 🎨 .ab-motion-*

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
        className={clsx('material-symbols-rounded', styles.abCollapsibleExpand, AB_MOTION.transform, open && styles.expanded)} // 🔄 rotation tween from ab-nextjs-animations
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
