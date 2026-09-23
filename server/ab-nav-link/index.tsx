/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbNavLink - Server (port of lyd-nav-link)
* @file: server/ab-nav-link/index.tsx
*/

import type { ReactElement } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbNavLinkProps {
  className?: string;
  title?: string;
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  noBadge?: boolean;
  badgeCount?: number;
}

const AbNavLink = ({
  className,
  title,
  href,
  icon,
  label,
  active = false,
  noBadge = true,
  badgeCount = 0,
}: AbNavLinkProps): ReactElement => {
  return (
    <Link
      href={href}
      title={title ?? label}
      data-active={active ? 'true' : 'false'}
      className={clsx('AbNavLink', styles.abNavLink, className)}
    >
      <span className={clsx('material-symbols-rounded', styles.abNavLinkIcon)} aria-hidden>
        {icon}
      </span>
      <span className={styles.abNavLinkLabel}>{label}</span>
      {!noBadge && badgeCount > 0 ? (
        <span className={styles.abNavLinkBadge} aria-label={`${badgeCount} notifications`}>
          {badgeCount}
        </span>
      ) : null}
    </Link>
  );
};

export default AbNavLink;
export { AbNavLink };
