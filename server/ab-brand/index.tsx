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
* @name: AbBrand - Server (port of lyd-brand)
* @file: server/ab-brand/index.tsx
* @type: TypeScript (React)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


import type { CSSProperties, ReactElement } from 'react';
import Link from '../../ab-link'; // 🔗 G42: injectable via AbLinkProvider (default next/link)
import Image from 'next/image';
import clsx from 'clsx';
import styles from './styles.module.css';
import { AB_MOTION } from 'ab-nextjs-animations/motion'; // 🎬 transition class names (ab-nextjs-animations >= 0.2.4)
import 'ab-nextjs-animations/motion/styles.css'; // 🎨 .ab-motion-*

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
        <Image className={clsx(styles.abBrandImage, AB_MOTION.transform)} src={image} alt={imageAlt ?? name} width={640} height={360} unoptimized />
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
