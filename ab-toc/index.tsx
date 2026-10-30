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
* @name: AbToc (G46)
* @file: ab-toc/index.tsx
* @type: React Component (server-safe)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   // 📏 core 0.1.6 panes: the page never scrolls, the main pane does (G55), so spy on and scroll IT
*   const { mainScrollElement } = useAbPage(); // ✅ state from core, safe in render
*   // without core: resolve the DOM node in an EFFECT, never during render (SSR + hydration safe)
*   //   const [main, setMain] = useState<HTMLElement | null>(null); useEffect(() => setMain(getAbMainScroller()), []);
*   const activeId = useAbScrollSpy(items.map((i) => i.id), { root: mainScrollElement });
*   <AbToc items={items} activeId={activeId} onNavigate={(id) => scrollToAbSection(id, { container: mainScrollElement })} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🔗 404 gaps: provider-aware link for the `links` variant (locale prefix via AbLinkProvider)
import AbLink from '../ab-link';
// 🎨 styles
import styles from './styles.module.css';

/** 📜 0.1.13 (D35/G55): core 0.1.6 marks the panes main scroller with this attribute (components doesn't depend on core). */
export const AB_MAIN_SCROLLER_SELECTOR = '[data-ab-part="main-content"]';

/**
 * 📜 getAbMainScroller — the element that scrolls the page content: the core panes main pane when present,
 * else `null` (= the window). Pass `from` (e.g. the heading) to pick the pane that contains it.
 * Use it as `useAbScrollSpy({ root })` / `scrollToAbSection(id, { container })`.
 *
 * ⚠️ Call it only in an effect or an event handler, **never during render**: it reads the DOM, so a render
 *    call returns `null` on the server and the element on the client (hydration mismatch). (James nit)
 */
export function getAbMainScroller(from?: Element | null): HTMLElement | null {
  if (typeof document === 'undefined') return null; // 🖥️ SSR
  const own = from?.closest<HTMLElement>(AB_MAIN_SCROLLER_SELECTOR); // 🎯 the pane holding `from`
  return own ?? document.querySelector<HTMLElement>(AB_MAIN_SCROLLER_SELECTOR); // 🔎 first main pane, or null
}

/** 📑 one heading */
export interface AbTocItem {
  id: string; // 🆔 the heading id (link target)
  label: string; // 🏷️
  level?: 2 | 3 | 4; // 📏 indent (default 2)
  // ===== 404 gaps: variant="links" =====
  href?: string; // 🔗 NEW: a page link (links variant); falls back to `#id`
  description?: ReactNode; // 📝 NEW: a small second line, e.g. "Getting started" (links variant)
  icon?: ReactNode; // 🔣 NEW: a leading icon (links variant, decorative)
}

/** ⚙️ props */
export interface AbTocProps {
  items: AbTocItem[]; // 📑
  activeId?: string | null; // 🎯 e.g. from useAbScrollSpy (hooks 0.1.7)
  title?: string; // 🏷️ default "On this page"
  label?: string; // 🏷️ 0.1.13 (Joseph #16): alias of `title`; `title` wins when both are set
  onNavigate?: (id: string) => void; // 🔔 e.g. scrollToAbSection(id, { container }) (hooks 0.1.7); without it a plain #id jump, which scrolls the nearest scroller (the main pane in core 0.1.6 panes)
  id?: string; // 🆔 root id (default "ab-toc"); the title gets `${id}-title`
  className?: string; // 🏷️
  variant?: 'toc' | 'links'; // 🔗 404 gaps: 'links' = a plain link list (e.g. "Popular pages"), no rail, no scroll spy (default 'toc')
  footer?: ReactNode; // 🧩 0.1.14 (P14): below the list after a 1px rule (Edit this page · Changelog · a promo card); links get the 12.5px Home style
}

/**
 * 📑 AbToc (G46): "On this page" list of plain `#id` links (works without JS), the current one marked with
 * aria-current="location". Pair with `useAbScrollSpy` from ab-nextjs-hooks 0.1.7 for `activeId`.
 * No hooks here, so it also renders on the server.
 */
const AbToc = ({ items, activeId, label, title = label ?? 'On this page', onNavigate, id = 'ab-toc', className, footer, variant = 'toc' }: AbTocProps): ReactElement | null => {
  if (!items.length) return null; // 🙈 nothing to list
  const headingId = `${id}-title`; // 🆔
  return (
    <nav id={id} className={clsx('AbToc', styles.abToc, className)} data-ab-part="toc" data-variant={variant === 'links' ? 'links' : undefined /* 🔗 404 gaps */} aria-labelledby={headingId}>
      <p id={headingId} className={styles.abTocTitle}>{title}</p>
      {variant === 'links' ? (
        // 🔗 404 gaps: plain link list (mock .pops / .pop): icon · bold label · small description
        <ul className={styles.abTocLinks}>
          {items.map((it) => (
            <li key={it.id}>
              <AbLink
                href={it.href ?? `#${it.id}`} // 🔗 page link (provider adds the locale) or in-page anchor
                className={styles.abTocLinksItem} // 🎨
                aria-current={it.id === activeId ? 'page' : undefined} // ♿ the current page, if any
              >
                {it.icon != null && <span className={styles.abTocLinksIcon} aria-hidden="true">{it.icon}</span> /* 🔣 decorative */}
                <span className={styles.abTocLinksText}>
                  <b className={styles.abTocLinksLabel}>{it.label}</b>{/* 🏷️ */}
                  {it.description != null && <small className={styles.abTocLinksDesc}>{it.description}</small> /* 📝 */}
                </span>
              </AbLink>
            </li>
          ))}
        </ul>
      ) : (
      <ol className={styles.abTocList}>
        {items.map((it) => {
          const on = it.id === activeId; // 🎯
          return (
            <li key={it.id} data-level={it.level ?? 2}>
              <a
                href={`#${it.id}`} // 🔗 JS-off friendly
                className={styles.abTocLink}
                data-active={on ? 'true' : 'false'}
                aria-current={on ? 'location' : undefined} // ♿
                onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(it.id); } : undefined}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ol>
      )}
      {footer != null && (
        <>
          <hr className={styles.abTocSep} />{/* ➖ mock .toc-sep */}
          <div className={styles.abTocFooter} data-ab-part="toc-footer">{footer}</div>
        </>
      )}
    </nav>
  );
};

// 📦 exports
export default AbToc;
export { AbToc };

// 🆕 0.2.1 (God 02:44): the aside "New" card
export { AbTocPromo, type AbTocPromoProps } from './promo';
