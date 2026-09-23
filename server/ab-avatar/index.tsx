/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbAvatar - Server (port of server/lyd-avatar)
* @file: server/ab-avatar/index.tsx
*/

import type { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbAvatarProps {
  isConnected: boolean;
  isOnline: boolean;
  icon?: 'person' | 'group';
  version?: number;
  image?: string;
  label?: string;
  className?: string;
  width?: number;
  height?: number;
  href?: string;
  offlineHref?: string;
  isActive?: boolean;
  noIndicator?: boolean;
}

const AbAvatar = ({
  isConnected,
  isOnline,
  icon = 'person',
  version = 1,
  image,
  label = 'Avatar',
  className,
  width = 48,
  height = 48,
  href = '/',
  offlineHref = '/',
  isActive = false,
  noIndicator = false,
}: AbAvatarProps): ReactElement => {
  const src = image ?? `/assets/images/avatars/avatar_${version}.png`;

  return (
    <div className={clsx('AbAvatar', styles.abAvatar, className)}>
      {isConnected ? (
        <Link href={href} className={clsx(styles.abAvatarLink, isActive && styles.isActive)}>
          <span className={styles.abAvatarImageWrap}>
            <Image
              src={src}
              className={styles.abAvatarImage}
              width={width}
              height={height}
              alt={label}
            />
            {!noIndicator ? (
              <span
                className={clsx(styles.abAvatarIndicator, !isOnline && styles.isOffline)}
                aria-hidden
              />
            ) : null}
          </span>
        </Link>
      ) : (
        <Link href={offlineHref} className={styles.abAvatarOffline}>
          <span className={clsx('material-symbols-rounded', styles.abAvatarIcon)} aria-hidden>
            {icon}
          </span>
          {label ? <span className={styles.abAvatarLabel}>{label}</span> : null}
        </Link>
      )}
    </div>
  );
};

export default AbAvatar;
export { AbAvatar };
