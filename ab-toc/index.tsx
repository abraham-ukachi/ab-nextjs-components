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
*   const activeId = useAbScrollSpy(items.map((i) => i.id));
*   <AbToc items={items} activeId={activeId} onNavigate={(id) => scrollToAbSection(id)} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ReactElement } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🎨 styles
import styles from './styles.module.css';

/** 📑 one heading */
export interface AbTocItem {
  id: string; // 🆔 the heading id (link target)
  label: string; // 🏷️
  level?: 2 | 3 | 4; // 📏 indent (default 2)
}

/** ⚙️ props */
export interface AbTocProps {
  items: AbTocItem[]; // 📑
  activeId?: string | null; // 🎯 e.g. from useAbScrollSpy (hooks 0.1.7)
  title?: string; // 🏷️ default "On this page"
  onNavigate?: (id: string) => void; // 🔔 e.g. scrollToAbSection (hooks 0.1.7); plain #id jump without it
  id?: string; // 🆔 root id (default "ab-toc"); the title gets `${id}-title`
  className?: string; // 🏷️
}

/**
 * 📑 AbToc (G46): "On this page" list of plain `#id` links (works without JS), the current one marked with
 * aria-current="location". Pair with `useAbScrollSpy` from ab-nextjs-hooks 0.1.7 for `activeId`.
 * No hooks here, so it also renders on the server.
 */
const AbToc = ({ items, activeId, title = 'On this page', onNavigate, id = 'ab-toc', className }: AbTocProps): ReactElement | null => {
  if (!items.length) return null; // 🙈 nothing to list
  const headingId = `${id}-title`; // 🆔
  return (
    <nav id={id} className={clsx('AbToc', styles.abToc, className)} data-ab-part="toc" aria-labelledby={headingId}>
      <p id={headingId} className={styles.abTocTitle}>{title}</p>
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
    </nav>
  );
};

// 📦 exports
export default AbToc;
export { AbToc };
