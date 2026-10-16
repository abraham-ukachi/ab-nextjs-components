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
* @name: AbCard (G45)
* @file: ab-card/index.tsx
* @type: React Component (server-safe)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   <AbCard href="/docs/hooks" title="Hooks" description="State, media queries and more." />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ComponentType, ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔗 G42 link
import Link from '../ab-link';
// 🎬 hover colours + transform timing from the package (reduced motion → no transition)
import 'ab-nextjs-animations/motion/styles.css';
// 🎨 styles
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbCardProps {
  title: ReactNode; // 🏷️ also the link text (one link per card)
  href?: string; // 🔗 the whole card is clickable via the title link's overlay
  description?: ReactNode; // 📝
  eyebrow?: ReactNode; // 🔝 small label above the title
  media?: ReactNode; // 🖼️ icon / image slot
  footer?: ReactNode; // 🔚 meta row (must not contain other links: one link per card)
  headingLevel?: 2 | 3 | 4; // ♿ default 3
  className?: string; // 🏷️
  as?: 'article' | 'div' | 'li'; // 🧱 default article
}

/**
 * 🃏 AbCard (G45): ONE link (the title) stretched over the card, so screen readers hear one link, not a
 * nested block of them. Hover lift is 2px, laptop and up only, and none under prefers-reduced-motion.
 */
const AbCard = ({ title, href, description, eyebrow, media, footer, headingLevel = 3, className, as = 'article' }: AbCardProps): ReactElement => {
  const H = `h${headingLevel}` as unknown as ComponentType<{ className?: string; children?: ReactNode }>; // ♿
  const Root = as as unknown as ComponentType<Record<string, unknown>>; // 🧱
  return (
    <Root className={clsx('AbCard', styles.abCard, 'ab-motion-interactive', className)} data-ab-part="card" data-linked={href ? 'true' : 'false'}>
      {media && <div className={styles.abCardMedia} aria-hidden="true">{media}</div>}
      {eyebrow && <p className={styles.abCardEyebrow}>{eyebrow}</p>}
      <H className={styles.abCardTitle}>
        {href ? <Link href={href} className={styles.abCardLink}>{title}</Link> : title}
      </H>
      {description && <p className={styles.abCardDescription}>{description}</p>}
      {footer && <div className={styles.abCardFooter}>{footer}</div>}
    </Root>
  );
};

// 📦 exports
export default AbCard;
export { AbCard };
