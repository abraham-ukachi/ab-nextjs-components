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
* @name: AbPackageCard (G45)
* @file: ab-package-card/index.tsx
* @type: React Component (server-safe)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbPackageCard name="ab-nextjs-hooks" href="/docs/hooks" version="0.1.7" description="React hooks." />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { CSSProperties, ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🃏 base card
import AbCard from '../ab-card';
// 🔗 G42 link
import Link from '../ab-link';
// 🏷️ footer chips (0.1.14)
import AbChip from '../ab-chip';
// 🔣 trailing arrow
import AbIcon from '../ab-icon';
// 🎬 motion classes (ab-nextjs-animations ≥ 0.2.4)
import { AB_MOTION } from 'ab-nextjs-animations/motion';
import 'ab-nextjs-animations/motion/styles.css';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbPackageCardProps {
  name: string; // 📦 e.g. "ab-nextjs-hooks"
  href: string; // 🔗 docs page (the card's one link)
  description?: ReactNode; // 📝
  version?: string; // 🏷️ e.g. "0.1.7"
  icon?: ReactNode; // 🔣 e.g. <AbIcon name="webhook" />
  media?: ReactNode; // 🖼️ 0.1.13 (Joseph #14): any media (logo, image); wins over `icon`
  id?: string; // 🆔 0.1.13: anchor target
  badge?: ReactNode; // 🔴 e.g. "New"
  tags?: string[]; // 🏷️ e.g. ['client', 'server']
  headingLevel?: 2 | 3 | 4; // ♿
  className?: string; // 🏷️
  // 🏠 0.1.14 (P10, Home spec §4 package card). Passing `preview` or `title` switches to the Home layout:
  //    56px preview tile · 30px icon tile + display title + mono name · clamped description · chips + →
  preview?: ReactNode; // 🖼️ decorative preview tile content (Aa Aa Aa, swatches, a curve…), aria-hidden
  title?: ReactNode; // 🏷️ display name (e.g. "Fonts"); `name` becomes the mono subtitle
  descriptionLines?: number; // ✂️ clamp the description (Home: 2)
}

/**
 * 🧩 0.1.13 (Joseph): `ab-nextjs-components` → `ab-` `nextjs-` `components` with a `<wbr>` after each
 * hyphen, so a narrow card wraps at a hyphen (never mid-word) instead of cutting the name off.
 */
export function toAbPackageNameParts(name: string): ReactNode[] {
  return name.split(/(?<=-)/).flatMap((part, i) => (i ? [<wbr key={`w${i}`} />, part] : [part])); // ✂️ after each "-"
}

/** 📦 AbPackageCard (G45): a package tile on AbCard (one link, 2px lift on laptop+, none when reduced). */
const AbPackageCard = (props: AbPackageCardProps): ReactElement => (props.preview != null || props.title != null ? <AbPackageCardHome {...props} /> : <AbPackageCardLegacy {...props} />);

/** 🏠 0.1.14 (P10): the Home layout. One link (the title, stretched over the card), focus ring on the card. */
function AbPackageCardHome({ name, href, description, version, icon, media, id, badge, tags, headingLevel = 3, className, preview, title, descriptionLines }: AbPackageCardProps): ReactElement {
  const H = `h${headingLevel}` as 'h2' | 'h3' | 'h4'; // ♿
  const clamp = descriptionLines ? ({ '--ab-package-card-lines': descriptionLines } as CSSProperties) : undefined; // ✂️
  return (
    <article id={id} className={clsx('AbPackageCard', styles.home, AB_MOTION.interactive, className)} data-ab-part="package-card" data-variant="home">
      {preview != null && <div className={styles.homePreview} aria-hidden="true">{preview}</div> /* 🖼️ decorative */}
      <div className={styles.homeHead}>
        {(media ?? icon) != null && <span className={styles.homeIcon} aria-hidden="true">{media ?? icon}</span>}
        <div className={styles.homeTitles}>
          <H className={styles.homeTitle}><Link href={href} className={styles.homeLink}>{title ?? name}</Link></H>
          {title != null && <code className={styles.homeName}>{name}</code> /* ⌨️ the npm name */}
        </div>
        {badge != null && <span className={styles.homeBadge}>{badge}</span>}
      </div>
      {description != null && <p className={styles.homeDesc} data-clamp={descriptionLines ? 'true' : undefined} style={clamp}>{description}</p>}
      {(version || tags?.length) ? (
        <div className={styles.homeFoot}>
          {version && <AbChip size="sm" shape="rounded" mono tone="accent">v{version}</AbChip>}
          {tags?.map((t) => <AbChip key={t} size="sm" shape="rounded" mono tone="sage" className={styles.homeTag}>{t}</AbChip>)}
          <span className={styles.homeGrow} />
          <AbIcon name="arrow_forward" size={16} className={styles.homeGo} />
        </div>
      ) : null}
    </article>
  );
}

/** 🕰️ ≤ 0.1.13 layout on AbCard. */
const AbPackageCardLegacy = ({ name, href, description, version, icon, media, id, badge, tags, headingLevel, className }: AbPackageCardProps): ReactElement => (
  <AbCard
    id={id}
    className={className}
    href={href}
    headingLevel={headingLevel}
    media={media ?? icon}
    title={<span className={styles.abPackageCardName} title={name}>{toAbPackageNameParts(name)}</span>}
    eyebrow={badge}
    description={description}
    footer={(version || tags?.length) ? (
      <>
        {version && <code className={styles.abPackageCardVersion}>v{version}</code>}
        {tags?.map((t) => <span key={t} className={styles.abPackageCardTag}>{t}</span>)}
      </>
    ) : undefined}
  />
);

// 📦 exports
export default AbPackageCard;
export { AbPackageCard };
// 🖼️ 0.2.1 (God 02:44): the Home preview tiles (mock .pv-anim / .pv-code / .pv-comp)
export { AbPackagePreviewCurve, AbPackagePreviewCode, AbPackagePreviewComponents } from './previews';
