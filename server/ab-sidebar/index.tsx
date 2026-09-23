/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbSidebar - Server (port of lyd-sidebar)
* @file: server/ab-sidebar/index.tsx
*/

import type { ReactElement } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export type AbSidebarLink = {
  href: string;
  icon: string;
  value: string;
  label: string;
};

export interface AbSidebarProps {
  className?: string;
  type?: 'customer' | 'admin';
  page?: string;
  links?: AbSidebarLink[];
  brandHref?: string;
  brandLabel?: string;
}

const AbSidebar = ({
  className,
  type = 'customer',
  page,
  links = [],
  brandHref = '/',
  brandLabel = 'abElements',
}: AbSidebarProps): ReactElement => {
  return (
    <aside data-type={type} className={clsx('AbSidebar', styles.abSidebar, className)} aria-label="Sidebar">
      <Link href={brandHref} className={styles.abSidebarBrand}>
        <span className="material-symbols-rounded" aria-hidden>apps</span>
        <span>{brandLabel}</span>
      </Link>
      <ul className={styles.abSidebarList}>
        {links.map((link) => {
          const active = page === link.value;
          return (
            <li key={link.value}>
              <Link href={link.href} data-active={active ? 'true' : 'false'} className={styles.abSidebarLink}>
                <span className={clsx('material-symbols-rounded', styles.abSidebarIcon)} aria-hidden>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AbSidebar;
export { AbSidebar };
