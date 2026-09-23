/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbKeyFeature - Server (port of lyd-key-feature)
* @file: server/ab-key-feature/index.tsx
*/


import type { ReactElement } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbKeyFeatureProps {
  className?: string;
  hidden?: boolean;
  icon: string;
  name: string;
  title: string;
  description?: string;
  linkHidden?: boolean;
  linkLabel?: string;
  link?: string;
  watermark?: string;
}

const AbKeyFeature = ({
  className,
  hidden = false,
  icon,
  name,
  title,
  description,
  linkHidden = false,
  linkLabel = 'Learn more',
  link,
  watermark,
}: AbKeyFeatureProps): ReactElement => {
  return (
    <article hidden={hidden} className={clsx('AbKeyFeature', styles.abKeyFeature, className)}>
      <span className={clsx('material-symbols-rounded', styles.abKeyFeatureIcon)} aria-hidden>{icon}</span>
      <span className={styles.abKeyFeatureName}>{name}</span>
      <h3 className={styles.abKeyFeatureTitle}>{title}</h3>
      {description ? <p className={styles.abKeyFeatureDesc}>{description}</p> : null}
      {!linkHidden && link ? (
        <Link href={link} className={styles.abKeyFeatureLink}>{linkLabel}</Link>
      ) : null}
      {watermark ? <span className={styles.abKeyFeatureWatermark} aria-hidden>{watermark}</span> : null}
    </article>
  );
};

export default AbKeyFeature;
export { AbKeyFeature };
