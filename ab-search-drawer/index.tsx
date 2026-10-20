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
* @name: AbSearchDrawer
* @file: ab-search-drawer/index.tsx
* @type: Client component
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const [open, setOpen] = useState(false)
*    -|> <AbSearchTrigger variant="field" label="Search…" onOpen={() => setOpen(true)} hotkey={false} />
*    -|> <AbSearchDrawer open={open} onClose={() => setOpen(false)} search={(q) => index.query(q)} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client';

// ⚛️ React
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗄️ the drawer (fullOnly sheet on mobile, centred on laptop)
import AbDrawer from '../ab-drawer';
// 🔣 icons
import AbIcon from '../ab-icon';
// 🔗 the app's link
import Link from '../ab-link';
// 🎨 the drawers v2 kit
import kit from '../ab-drawer/kit.module.css';

/** 🔎 one result row */
export interface AbSearchDrawerItem {
  id: string; // 🆔 unique across all groups
  href: string; // 🔗 where it opens
  title: string; // 🏷️ e.g. "AbButton"
  description?: string; // 📝 one line (ellipsis)
  meta?: string; // 🏷️ mono, e.g. "v0.2.x"
  icon?: string; // 🔣 the 32px tile's AbIcons name
}
/** 📦 results grouped by package */
export interface AbSearchDrawerGroup { id: string; label: string; meta?: string; items: readonly AbSearchDrawerItem[] } // 🏷️ "Components" + "ab-nextjs-components"

/** 🌍 strings (English defaults) */
export interface AbSearchDrawerLabels {
  title?: string; // "Search"
  close?: string; // "Close search"
  placeholder?: string; // "Search packages, components, hooks…"
  clear?: string; // "Clear search"
  recent?: string; // "Recent"
  remove?: (term: string) => string; // "Remove <term>"
  results?: (n: number) => string; // "4 results"
  noResults?: string; // "No results"
  noResultsFor?: (q: string) => ReactNode; // No results for “q”
  hint?: ReactNode; // the line under it
  didYouMean?: string; // "Did you mean"
}

/** ⚙️ props */
export interface AbSearchDrawerProps {
  open: boolean; // 🚪
  onClose: () => void; // ⎋
  search: (query: string) => readonly AbSearchDrawerGroup[] | Promise<readonly AbSearchDrawerGroup[]>; // 🔎 called 150ms after typing stops, from 2 characters
  suggest?: (query: string) => string | null | undefined; // 💡 the "Did you mean …?" term on no results
  onOpenResult?: (item: AbSearchDrawerItem) => void; // 🔔 after a result is chosen (the link still navigates; the drawer closes)
  defaultQuery?: string; // 🌱 the query on open (default '')
  recentKey?: string | null; // 🕘 localStorage key (default `ab:search:recent`; null = no recents)
  recentLimit?: number; // 🕘 default 4
  recentWhen?: 'always' | 'empty'; // 🕘 'always' = above the results (John's frames, default); 'empty' = only with no query
  labels?: AbSearchDrawerLabels; // 🌍
  returnFocus?: string; // ↩️
  id?: string; // 🆔
  className?: string; // 🏷️
}

// 🕘 recents in localStorage: newest first, de-duplicated, capped
export const AB_SEARCH_RECENT_KEY = 'ab:search:recent';
const readRecent = (key: string | null): string[] => {
  if (!key || typeof localStorage === 'undefined') return [];
  try { const v = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []; } catch { return []; } // 🧯 bad JSON = none
};
const writeRecent = (key: string | null, list: string[]) => { if (key && typeof localStorage !== 'undefined') try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* 🧯 private mode */ } };
/** 🕘 addAbSearchRecent — the next recents list: `term` first, no duplicates (case-insensitive), at most `limit` */
export function addAbSearchRecent(list: readonly string[], term: string, limit = 4): string[] {
  const t = term.trim(); if (!t) return [...list];
  return [t, ...list.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, limit);
}

/** 🖍️ highlightAbSearch — wrap every case-insensitive match of `q` in `<mark>` (bronze 700 via the kit) */
export function highlightAbSearch(text: string, q: string): ReactNode {
  const needle = q.trim(); if (needle.length < 2) return text;
  const out: ReactNode[] = []; const lower = text.toLowerCase(); const n = needle.toLowerCase();
  let i = 0; let k = 0;
  for (let j = lower.indexOf(n); j >= 0; j = lower.indexOf(n, i)) {
    if (j > i) out.push(text.slice(i, j));
    out.push(<mark key={k++} className={kit.mark}>{text.slice(j, j + n.length)}</mark>); i = j + n.length;
  }
  if (i < text.length) out.push(text.slice(i));
  return out.length ? out : text;
}

/**
 * 🔎 AbSearchDrawer — John's search drawer (drawers v2 §4), a bottom-drawer variant.
 *
 * - 📱 below 768px: straight to full height (no 70% stop: the keyboard is up); a hard swipe down closes
 * - 💻 768px and up: centred in the main pane, min(640px, main width), 70% tall; results scroll inside with a 48px fade
 * - ⌨️ no shortcut key: open it from the Search tab / the search field (AbSearchTrigger `onOpen` + `hotkey={false}`)
 * - 🔤 48px input (2px bronze border), autofocused; a 40px clear button keeps focus in the input
 * - 🕘 up to 4 recent searches (localStorage `ab:search:recent`), saved on Enter or when a result opens; each removable
 * - 📦 results after a 150ms debounce from 2 characters, grouped by package; matches in a bronze `<mark>`
 * - ♿ combobox (aria-expanded / -controls / -autocomplete="list" / -activedescendant) + listbox with labelled groups
 *   and options; ↑/↓ wrap across groups, Enter opens the active (else the first) result, Esc clears then closes;
 *   a polite live region says "4 results" / "No results"
 */
const AbSearchDrawer = ({ open, onClose, search, suggest, onOpenResult, defaultQuery = '', recentKey = AB_SEARCH_RECENT_KEY, recentLimit = 4, recentWhen = 'always', labels = {}, returnFocus, id, className }: AbSearchDrawerProps): ReactElement => {
  const L = {
    title: 'Search', close: 'Close search', placeholder: 'Search packages, components, hooks…', clear: 'Clear search', recent: 'Recent',
    remove: (t: string) => `Remove ${t}`, results: (n: number) => `${n} result${n === 1 ? '' : 's'}`, noResults: 'No results',
    noResultsFor: (q: string) => <>No results for “{q}”</>, didYouMean: 'Did you mean',
    hint: <>Check the spelling or try a package name like <code>components</code> or <code>hooks</code>.</>, ...labels,
  }; // 🌍
  const auto = useId().replace(/[^A-Za-z0-9_-]/g, ''); // 🆔
  const base = id ?? `ab-search-${auto}`;
  const input = useRef<HTMLInputElement>(null); // 🔤
  const list = useRef<HTMLDivElement>(null); // 📜
  const [query, setQuery] = useState(defaultQuery); // 🔤
  const [groups, setGroups] = useState<readonly AbSearchDrawerGroup[] | null>(null); // 📦 null = not searched (or < 2 chars)
  const [active, setActive] = useState(0); // 🎯 index in the flat option list (-1 = none)
  const [recent, setRecent] = useState<string[]>([]); // 🕘
  const latest = useRef(search); // 🔁
  useEffect(() => { latest.current = search; }, [search]);

  // 🌱 each open: the default query, fresh recents
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) { setWasOpen(open); if (open) { setQuery(defaultQuery); setRecent(readRecent(recentKey)); } }

  // ⏱️ 150ms debounce, from 2 characters; stale answers are dropped
  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) { const t = setTimeout(() => setGroups(null), 0); return () => clearTimeout(t); } // 🫥
    let live = true;
    const t = setTimeout(() => { Promise.resolve(latest.current(q)).then((g) => { if (live) { setGroups(g); setActive(g.some((x) => x.items.length) ? 0 : -1); } }); }, 150);
    return () => { live = false; clearTimeout(t); };
  }, [query, open]);

  const flat = useMemo(() => (groups ?? []).flatMap((g) => g.items), [groups]); // 📋 the option order
  const starts = useMemo(() => { const m: Record<string, number> = {}; let n = 0; for (const g of groups ?? []) { m[g.id] = n; n += g.items.length; } return m; }, [groups]); // 🔢 each group's first option index
  const optId = (i: number) => `${base}-opt-${i}`; // 🆔
  const showRecent = recentKey !== null && recent.length > 0 && (recentWhen === 'always' ? !(groups && flat.length === 0) : query.trim() === ''); // 🕘
  const expanded = flat.length > 0; // ♿ the listbox has options
  const saveRecent = (term: string) => { const next = addAbSearchRecent(recent, term, recentLimit); setRecent(next); writeRecent(recentKey, next); }; // 🕘
  const removeRecent = (term: string) => { const next = recent.filter((x) => x !== term); setRecent(next); writeRecent(recentKey, next); input.current?.focus(); };
  const choose = (item: AbSearchDrawerItem) => { saveRecent(query); onOpenResult?.(item); onClose(); }; // 🔗

  // ⌨️ the combobox keys (focus stays in the input)
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!flat.length) return; e.preventDefault();
      const n = e.key === 'ArrowDown' ? (active + 1) % flat.length : (active - 1 + flat.length) % flat.length; // 🔁 wraps across groups
      setActive(n); document.getElementById(optId(n))?.scrollIntoView?.({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault(); if (query.trim()) saveRecent(query); // 🕘
      const i = active >= 0 ? active : 0; if (flat[i]) document.getElementById(optId(i))?.click(); // 🔗 the active, else the first
    } else if (e.key === 'Escape' && query) {
      e.preventDefault(); setQuery(''); // ⎋ first press clears (AbDrawer skips handled Escapes), the second closes
    }
  };

  const none = groups !== null && flat.length === 0; // 🫥
  const tip = suggest && none ? suggest(query.trim()) : null; // 💡
  return (
    <AbDrawer
      open={open} onClose={onClose} id={id} side="bottom" scope="app" tier="sheet"
      snapPoints fullOnly centerIn="main" title={L.title} closeLabel={L.close} closeIcon={<AbIcon name="close" size={24} />}
      initialFocus="input" returnFocus={returnFocus}
      className={clsx('AbSearchDrawer', kit.sheet, kit.searchSheet, className)}
    >
      <div className={kit.searchBody}>
        <div className={kit.field}>
          <AbIcon name="search" size={22} />
          <input
            ref={input} type="search" className={kit.input} value={query} placeholder={L.placeholder} aria-label={L.title}
            role="combobox" aria-expanded={expanded} aria-controls={`${base}-list`} aria-autocomplete="list"
            aria-activedescendant={expanded && active >= 0 ? optId(active) : undefined}
            autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="search"
            onChange={(e) => setQuery(e.target.value)} onKeyDown={onKey}
          />
          {query && <button type="button" className={kit.iconSm} aria-label={L.clear} onClick={() => { setQuery(''); input.current?.focus(); }}><AbIcon name="close" size={20} /></button>}
        </div>
        <div className={kit.resWrap}>
          <div ref={list} className={kit.results} data-ab-part="search-results">
            {showRecent && (
              <>
                <p className={kit.lbl} id={`${base}-recent`}>{L.recent}</p>
                <ul className={kit.list} aria-labelledby={`${base}-recent`}>
                  {recent.map((t) => (
                    <li key={t} className={clsx(kit.row, kit.recent)}>
                      <AbIcon name="history" size={24} />
                      <button type="button" className={kit.recentGo} onClick={() => { setQuery(t); input.current?.focus(); }}>{t}</button>
                      <button type="button" className={kit.iconSm} aria-label={L.remove(t)} onClick={() => removeRecent(t)}><AbIcon name="close" size={20} /></button>
                    </li>
                  ))}
                </ul>
                {flat.length > 0 && <hr className={kit.hr} />}
              </>
            )}
            <div id={`${base}-list`} role="listbox" aria-label={L.title} hidden={!expanded}>
              {(groups ?? []).filter((g) => g.items.length).map((g) => (
                <div key={g.id} role="group" aria-labelledby={`${base}-g-${g.id}`}>
                  <p className={kit.grp2} id={`${base}-g-${g.id}`}><span>{g.label}</span>{g.meta && <code>{g.meta}</code>}</p>
                  {g.items.map((it, j) => {
                    const i = starts[g.id] + j; const on = i === active; // 🎯
                    return (
                      <Link key={it.id} id={optId(i)} href={it.href} role="option" aria-selected={on} tabIndex={-1} className={kit.sr} onClick={() => choose(it)} onMouseMove={() => { if (!on) setActive(i); }}>
                        <span className={kit.pkgIc} aria-hidden="true">{it.icon && <AbIcon name={it.icon} size={20} />}</span>
                        <span className={kit.srText}><b>{highlightAbSearch(it.title, query)}</b>{it.description && <small>{highlightAbSearch(it.description, query)}</small>}</span>
                        {it.meta && <code className={kit.srMeta}>{it.meta}</code>}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
            {none && (
              <div className={kit.nores} data-ab-part="search-empty">
                <span className={kit.pkgIc} aria-hidden="true"><AbIcon name="search" size={28} /></span>
                <b>{L.noResultsFor(query.trim())}</b>
                <p>{L.hint}</p>
                {tip && <button type="button" className={clsx(kit.row, kit.didYouMean)} onClick={() => { setQuery(tip); input.current?.focus(); }}>{L.didYouMean}&nbsp;<mark className={kit.mark}>{tip}</mark>?</button>}
              </div>
            )}
          </div>
          <div className={kit.resFade} aria-hidden="true" />
        </div>
        <p className={kit.srOnly} role="status" aria-live="polite">{groups === null ? '' : none ? L.noResults : L.results(flat.length)}</p>
      </div>
    </AbDrawer>
  );
};

// 📦 exports
export default AbSearchDrawer;
export { AbSearchDrawer };
