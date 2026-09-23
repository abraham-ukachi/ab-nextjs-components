/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbBrand - Server (port of lyd-brand)
* @file: server/ab-brand/index.tsx
*/


import type { CSSProperties, ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbBrandProps {
  className?: string;
  type?: 'default' | 'blurred';
  effect?: 'normal' | 'zoom';
  hidden?: boolean;
  image: string;
  imageAlt?: string;
  logo: string;
  logoAlt?: string;
  name: string;
  shortName: string;
  description: string;
  autohideDescription?: boolean;
  color?: string;
  accentColor?: string;
  link: string;
  ctaLabel: string;
}

const AbBrand = ({
  className,
  type = 'default',
  effect = 'normal',
  hidden = false,
  image,
  imageAlt,
  logo,
  logoAlt,
  name,
  shortName,
  description,
  autohideDescription = false,
  color,
  accentColor,
  link,
  ctaLabel,
}: AbBrandProps): ReactElement => {
  const style = {
    '--ab-brand-color': color,
    '--ab-brand-accent': accentColor,
  } as CSSProperties;

  return (
    <Link
      href={link}
      hidden={hidden}
      data-type={type}
      data-effect={effect}
      data-autohide-desc={autohideDescription ? 'true' : 'false'}
      className={clsx('AbBrand', styles.abBrand, className)}
      style={style}
    >
      <div className={styles.abBrandImageWrap}>
        <Image className={styles.abBrandImage} src={image} alt={imageAlt ?? name} width={640} height={360} unoptimized />
      </div>
      <div className={styles.abBrandMeta}>
        <Image className={styles.abBrandLogo} src={logo} alt={logoAlt ?? shortName} width={40} height={40} unoptimized />
        <span className={styles.abBrandShort}>{shortName}</span>
        <h3 className={styles.abBrandName}>{name}</h3>
        <p className={styles.abBrandDesc}>{description}</p>
        <span className={styles.abBrandCta}>{ctaLabel}</span>
      </div>
    </Link>
  );
};

export default AbBrand;
export { AbBrand };
