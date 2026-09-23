/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbImage - Client (Adapt of lyd-image — Dexie/offline stripped)
* @file: ab-image/index.tsx
*/

'use client';

import type { CSSProperties, ReactElement } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbImageProps {
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string | null;
  unoptimized?: boolean;
}

const AbImage = ({
  className,
  style,
  hidden = false,
  src,
  alt = '',
  width = 320,
  height = 320,
  fill = false,
  priority = false,
  sizes,
  fallbackSrc = null,
  unoptimized = false,
}: AbImageProps): ReactElement => {
  const [failed, setFailed] = useState(false);
  const activeSrc = failed && fallbackSrc ? fallbackSrc : src;

  if (failed && !fallbackSrc) {
    return (
      <div hidden={hidden} style={style} className={clsx('AbImage', styles.abImage, className)}>
        <div className={styles.abImageFallback} role="img" aria-label={alt || 'Image unavailable'}>
          <span className="material-symbols-rounded" aria-hidden>broken_image</span>
        </div>
      </div>
    );
  }

  return (
    <div hidden={hidden} style={style} className={clsx('AbImage', styles.abImage, className)}>
      <Image
        className={styles.abImageImg}
        src={activeSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        onError={() => setFailed(true)}
      />
    </div>
  );
};

export default AbImage;
export { AbImage };

