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
import type { ReactElement, ReactNode } from 'react';
// 🃏 base card
import AbCard from '../ab-card';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbPackageCardProps {
  name: string; // 📦 e.g. "ab-nextjs-hooks"
  href: string; // 🔗 docs page (the card's one link)
  description?: ReactNode; // 📝
  version?: string; // 🏷️ e.g. "0.1.7"
  icon?: ReactNode; // 🔣 e.g. <AbIcon name="webhook" />
  badge?: ReactNode; // 🔴 e.g. "New"
  tags?: string[]; // 🏷️ e.g. ['client', 'server']
  headingLevel?: 2 | 3 | 4; // ♿
  className?: string; // 🏷️
}

/** 📦 AbPackageCard (G45): a package tile on AbCard (one link, 2px lift on laptop+, none when reduced). */
const AbPackageCard = ({ name, href, description, version, icon, badge, tags, headingLevel, className }: AbPackageCardProps): ReactElement => (
  <AbCard
    className={className}
    href={href}
    headingLevel={headingLevel}
    media={icon}
    title={<span className={styles.abPackageCardName}>{name}</span>}
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
