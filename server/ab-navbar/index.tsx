/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbNavbar - Server (port of lyd-navbar)
* @file: server/ab-navbar/index.tsx
*/

import type { ReactElement } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export type AbNavbarLink = {
  href: string;
  icon: string;
  value: string;
  label: string;
};

export interface AbNavbarProps {
  className?: string;
  type?: 'customer' | 'admin';
  page?: string;
  links?: AbNavbarLink[];
}

const AbNavbar = ({
  className,
  type = 'customer',
  page,
  links = [],
}: AbNavbarProps): ReactElement => {
  return (
    <nav data-type={type} data-ab-part="bottomBar" className={clsx('AbNavbar', styles.abNavbar, className)} aria-label="Primary">
      <ul className={styles.abNavbarList}>
        {links.map((link) => {
          const active = page === link.value;
          return (
            <li key={link.value}>
              <Link
                href={link.href}
                data-active={active ? 'true' : 'false'}
                className={styles.abNavbarLink}
              >
                <span className={clsx('material-symbols-rounded', styles.abNavbarIcon)} aria-hidden>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AbNavbar;
export { AbNavbar };
