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
* @name: AbErrorHero - Server-safe (404 gaps)
* @file: ab-error-hero/index.tsx
* @type: Component (server-safe, no hooks) — the 404 / error hero: big code + badge tile, title, message, hint, actions
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbErrorHero code="404" badge={<AbIcon name="link_off" />} title="Page not found" message="This page moved or never existed." actions={<AbButton label="Back to home" href="/" />} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React types
import type { ComponentType, ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔣 the default badge glyph (link_off, ab-nextjs-icons ^0.2.6, as in the mock)
import AbIcon from '../ab-icon';
// 🎨 styles (static only: NO motion here, all motion lives in ab-nextjs-animations)
import styles from './styles.module.css';

/** ⚙️ props */
export interface AbErrorHeroProps {
  code?: ReactNode; // 🔢 the big number / word, e.g. "404" (default), "500", "Oops"
  badge?: ReactNode; // 🟫 a small tilted tile pinned to the code, default <AbIcon name="link_off" /> (the mock); pass null to hide (decorative)
  title: ReactNode; // 🏷️ the h1, e.g. "Page not found"
  message?: ReactNode; // 📝 the lede under the title
  hint?: ReactNode; // 💡 an optional row under the message, e.g. the bad path + "Did you mean …" (an AbChip)
  actions?: ReactNode; // 🔘 the actions slot: search trigger, buttons, … (rendered as-is, in order)
  children?: ReactNode; // 🧩 anything below the actions (e.g. "Suggested" cards)
  headingLevel?: 1 | 2; // ♿ default 1 (it IS the page title on a 404); 2 when nested in a page
  grid?: boolean; // ⠿ the dotted backdrop behind the code (default true)
  id?: string; // 🆔 root id
  className?: string; // 🏷️
}

/**
 * 🚧 AbErrorHero: the hero of a 404 / error page (mock ai-mocks/404): a huge gradient code ("404") over a
 * faded dot grid, a tilted badge tile (e.g. link_off), a title, a message, an optional hint and an actions slot.
 * The code is decorative (aria-hidden) and announced once via a visually hidden prefix on the title.
 * No hooks, no state, no motion: renders on the server.
 */
const AbErrorHero = ({ code = '404', badge = <AbIcon name="link_off" /> /* 🔗🚫 mock default */, title, message, hint, actions, children, headingLevel = 1, grid = true, id, className }: AbErrorHeroProps): ReactElement => {
  const H = `h${headingLevel}` as unknown as ComponentType<{ className?: string; children?: ReactNode }>; // ♿ h1 / h2
  return (
    <section id={id} className={clsx('AbErrorHero', styles.abErrorHero, className)} data-ab-part="error-hero">
      {/* 🎨 the art: dot grid + big code + badge tile (all decorative) */}
      <div className={styles.abErrorHeroArt} aria-hidden="true">
        {grid && <span className={styles.abErrorHeroGrid} data-ab-part="error-grid" /> /* ⠿ faded dots */}
        <span className={styles.abErrorHeroCode} data-ab-part="error-code">
          {code /* 🔢 gradient text */}
          {badge != null && <span className={styles.abErrorHeroBadge} data-ab-part="error-badge">{badge}</span> /* 🟫 tilted tile */}
        </span>
      </div>
      {/* 🏷️ title: the code is read once here (visually hidden), then the words */}
      <H className={styles.abErrorHeroTitle}>
        {typeof code === 'string' || typeof code === 'number' ? <span className={styles.abErrorHeroSrOnly}>{code}: </span> : null /* 🗣️ "404: Page not found" */}
        {title}
      </H>
      {message != null && <p className={styles.abErrorHeroMessage}>{message}</p> /* 📝 lede */}
      {hint != null && <div className={styles.abErrorHeroHint} data-ab-part="error-hint">{hint}</div> /* 💡 */}
      {actions != null && <div className={styles.abErrorHeroActions} data-ab-part="error-actions">{actions}</div> /* 🔘 */}
      {children /* 🧩 */}
    </section>
  );
};

// 📦 exports
export default AbErrorHero;
export { AbErrorHero };
