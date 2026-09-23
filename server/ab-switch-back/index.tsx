/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbSwitchBack - Server (port of lyd-switch-back)
* @file: server/ab-switch-back/index.tsx
*/


import type { ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbSwitchBackProps {
  className?: string;
  hidden?: boolean;
  switched?: boolean;
  image: string;
  imageAlt: string;
  title?: ReactNode;
  description?: ReactNode;
  cta1Label: string;
  cta1Link: string;
  cta2Label: string;
  cta2Link: string;
}

const AbSwitchBack = ({
  className,
  hidden = false,
  switched = false,
  image,
  imageAlt,
  title,
  description,
  cta1Label,
  cta1Link,
  cta2Label,
  cta2Link,
}: AbSwitchBackProps): ReactElement => {
  return (
    <section
      hidden={hidden}
      data-switched={switched ? 'true' : 'false'}
      className={clsx('AbSwitchBack', styles.abSwitchBack, className)}
    >
      <div className={styles.abSwitchBackMedia}>
        <Image className={styles.abSwitchBackImage} src={image} alt={imageAlt} width={800} height={600} unoptimized />
      </div>
      <div className={styles.abSwitchBackCopy}>
        {title ? <h2 className={styles.abSwitchBackTitle}>{title}</h2> : null}
        {description ? <div className={styles.abSwitchBackDesc}>{description}</div> : null}
        <div className={styles.abSwitchBackActions}>
          <Link href={cta1Link} className={styles.abSwitchBackCta}>{cta1Label}</Link>
          <Link href={cta2Link} className={clsx(styles.abSwitchBackCta, styles.abSwitchBackCtaSecondary)}>
            {cta2Label}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AbSwitchBack;
export { AbSwitchBack };
