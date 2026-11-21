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
  /** 🏷️ 0.7.2: a short visible badge after the text, e.g. "EN" on a page that falls back to English */
  badge?: string;
  /** ♿ 0.7.2: what the badge means for screen readers (e.g. "English only"); without it the badge text is read */
  badgeLabel?: string;
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
  // ⏳ 0.7.2: async states (a failed search() is no longer shown as "No results")
  loading?: string; // "Searching…" (shown + announced while an async search() is pending)
  offlineTitle?: string; // "You're offline"
  offlineHint?: ReactNode; // "Search needs a connection the first time. Reconnect and try again."
  errorTitle?: string; // "Search isn't available right now"
  errorHint?: ReactNode; // "Something went wrong while searching. Try again in a moment."
  retry?: string; // "Try again"
}

/** ⏳ 0.7.2: where a search stands — 'idle' (under 2 characters), 'loading', 'done', 'offline' or 'error' */
export type AbSearchDrawerStatus = 'idle' | 'loading' | 'done' | 'offline' | 'error';

/** 📴 0.7.2: throw (or reject with) this from `search()` when the index can't be fetched offline */
export class AbSearchOfflineError extends Error {
  constructor(message = 'Search is offline') { super(message); this.name = 'AbSearchOfflineError'; } // 🏷️ the name is what we check
}

/** 📴 0.7.2: isAbSearchOffline — is this search failure "offline"? An AbSearchOfflineError (by name, so it survives
 *  bundling twice), an error with `offline: true`, or any failure while `navigator.onLine` is false. */
export function isAbSearchOffline(error: unknown): boolean {
  const e = error as { name?: unknown; offline?: unknown } | null | undefined; // 🔍 duck-typed
  if (e && (e.name === 'AbSearchOfflineError' || e.offline === true)) return true; // 📴 said so
  return typeof navigator !== 'undefined' && navigator.onLine === false; // 🌐 the browser says so
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
  recentWhen?: 'always' | 'empty'; // 🕘 'always' = above the results (the frames, default); 'empty' = only with no query
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
 * 🔎 AbSearchDrawer — the search drawer (drawers v2 §4), a bottom-drawer variant.
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
 * - ⏳ 0.7.2: an async `search()` sets `aria-busy` + "Searching…"; a failure shows an offline (AbSearchOfflineError /
 *   `navigator.onLine === false`) or error panel with "Try again" — never "No results"; offline retries on `online`
 */
const AbSearchDrawer = ({ open, onClose, search, suggest, onOpenResult, defaultQuery = '', recentKey = AB_SEARCH_RECENT_KEY, recentLimit = 4, recentWhen = 'always', labels = {}, returnFocus, id, className }: AbSearchDrawerProps): ReactElement => {
  const L = {
    title: 'Search', close: 'Close search', placeholder: 'Search packages, components, hooks…', clear: 'Clear search', recent: 'Recent',
    remove: (t: string) => `Remove ${t}`, results: (n: number) => `${n} result${n === 1 ? '' : 's'}`, noResults: 'No results',
    noResultsFor: (q: string) => <>No results for “{q}”</>, didYouMean: 'Did you mean',
    hint: <>Check the spelling or try a package name like <code>components</code> or <code>hooks</code>.</>,
    loading: 'Searching…', offlineTitle: 'You’re offline', offlineHint: 'Search needs a connection the first time. Reconnect and try again.', // ⏳ 📴 0.7.2
    errorTitle: 'Search isn’t available right now', errorHint: 'Something went wrong while searching. Try again in a moment.', retry: 'Try again', // 🛑 0.7.2
    ...labels,
  }; // 🌍
  const auto = useId().replace(/[^A-Za-z0-9_-]/g, ''); // 🆔
  const base = id ?? `ab-search-${auto}`;
  // 🆔 review P2: group ids come from app data ("@scope/pkg", "a b"); keep only id-safe characters, and the index keeps them unique
  const groupId = (g: AbSearchDrawerGroup, i: number) => `${base}-g-${i}-${String(g.id).replace(/[^A-Za-z0-9_-]/g, '_')}`;
  const input = useRef<HTMLInputElement>(null); // 🔤
  const list = useRef<HTMLDivElement>(null); // 📜
  const [query, setQuery] = useState(defaultQuery); // 🔤
  const [groups, setGroups] = useState<readonly AbSearchDrawerGroup[] | null>(null); // 📦 null = not searched (or < 2 chars)
  const [active, setActive] = useState(0); // 🎯 index in the flat option list (-1 = none)
  const [recent, setRecent] = useState<string[]>([]); // 🕘
  const [status, setStatus] = useState<AbSearchDrawerStatus>('idle'); // ⏳ 0.7.2: loading / offline / error
  const [attempt, setAttempt] = useState(0); // 🔁 0.7.2: bumped by "Try again" (and on reconnect) to re-run the search
  const latest = useRef(search); // 🔁
  useEffect(() => { latest.current = search; }, [search]);

  // 🌱 each open: the default query, fresh recents
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) { setWasOpen(open); if (open) { setQuery(defaultQuery); setRecent(readRecent(recentKey)); } }

  // ⏱️ 150ms debounce, from 2 characters; stale answers are dropped
  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) { const t = setTimeout(() => { setGroups(null); setStatus('idle'); }, 0); return () => clearTimeout(t); } // 🫥
    let live = true;
    // 🧯 0.7.2: a failure is "offline" or "error" (never "No results", and never the previous query's results)
    const fail = (err: unknown) => { if (live) { setGroups(null); setActive(-1); setStatus(isAbSearchOffline(err) ? 'offline' : 'error'); } };
    const t = setTimeout(() => {
      let out: ReturnType<AbSearchDrawerProps['search']>; // 📦 sync groups or a promise
      try { out = latest.current(q); } catch (err) { fail(err); return; } // 🧯 a sync throw fails the same way
      // ⏳ 0.7.2: only an async search() shows "Searching…" (aria-busy); a sync one never flashes it
      if (out && typeof (out as PromiseLike<unknown>).then === 'function') setStatus('loading');
      Promise.resolve(out)
        .then((g) => { if (live) { setGroups(g); setActive(g.some((x) => x.items.length) ? 0 : -1); setStatus('done'); } }) // ✅
        .catch(fail); // 📴 / 🛑
    }, 150);
    return () => { live = false; clearTimeout(t); };
  }, [query, open, attempt]);

  // 🌐 0.7.2: offline → back online: retry by itself (the visitor already typed the query)
  useEffect(() => {
    if (status !== 'offline' || typeof window === 'undefined') return; // 🙅 only while offline
    const back = () => setAttempt((n) => n + 1); // 🔁
    window.addEventListener('online', back); // 👂
    return () => window.removeEventListener('online', back); // 🧹
  }, [status]);

  // 🧹 G60 (0.7.2): only groups with items are rendered, so the option order, the start offsets and the ids all
  //    come from THIS list, by position — never from the raw `g.id`, which apps may repeat (two "components" groups)
  const shown = useMemo(() => (groups ?? []).filter((g) => g.items.length), [groups]); // 📦 rendered groups
  const flat = useMemo(() => shown.flatMap((g) => g.items), [shown]); // 📋 the option order
  const starts = useMemo(() => { const m: number[] = []; let n = 0; for (const g of shown) { m.push(n); n += g.items.length; } return m; }, [shown]); // 🔢 G60: each group's first option index, BY GROUP INDEX
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
      setActive(n);
      const el = document.getElementById(optId(n)); const box = list.current; // 👀 keep it in view, scrolling only the results
      if (el && box) { const b = box.getBoundingClientRect(); const r = el.getBoundingClientRect(); if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom; else if (r.top < b.top) box.scrollTop -= b.top - r.top; }
    } else if (e.key === 'Enter') {
      e.preventDefault(); if (query.trim()) saveRecent(query); // 🕘
      const i = active >= 0 ? active : 0; if (flat[i]) document.getElementById(optId(i))?.click(); // 🔗 the active, else the first
    } else if (e.key === 'Escape' && query) {
      e.preventDefault(); setQuery(''); // ⎋ first press clears (AbDrawer skips handled Escapes), the second closes
    }
  };

  const busy = status === 'loading'; // ⏳ 0.7.2
  const failed = status === 'offline' || status === 'error'; // 📴 🛑 0.7.2
  const none = !busy && !failed && groups !== null && flat.length === 0; // 🫥 0.7.2: never while loading / failed
  const retry = () => { setAttempt((n) => n + 1); input.current?.focus(); }; // 🔁 0.7.2: re-run, focus stays in the input
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
          <div ref={list} className={kit.results} data-ab-part="search-results" aria-busy={busy || undefined} data-status={status} /* ⏳ 0.7.2 */>
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
            {busy && !expanded && <p className={kit.lbl} data-ab-part="search-loading">{L.loading}</p> /* ⏳ 0.7.2: first answer still on its way */}
            <div id={`${base}-list`} role="listbox" aria-label={L.title} aria-busy={busy || undefined} hidden={!expanded}>
              {shown.map((g, gi) => (
                <div key={`${gi}-${g.id}`} role="group" aria-labelledby={groupId(g, gi)} /* 🧹 G60: keyed by index too, so a repeated id never collides */>
                  <p className={kit.grp2} id={groupId(g, gi)}><span>{g.label}</span>{g.meta && <code>{g.meta}</code>}</p>
                  {g.items.map((it, j) => {
                    const i = starts[gi] + j; const on = i === active; // 🎯 G60: the start of THIS group (by index)
                    return (
                      <Link key={`${i}-${it.id}`} /* 🧹 G60: item ids may repeat across groups too */ id={optId(i)} href={it.href} role="option" aria-selected={on} tabIndex={-1} className={kit.sr} onClick={() => choose(it)} onMouseMove={() => { if (!on) setActive(i); }}>
                        <span className={kit.pkgIc} aria-hidden="true">{it.icon && <AbIcon name={it.icon} size={20} />}</span>
                        <span className={kit.srText}><b>{highlightAbSearch(it.title, query)}</b>{it.description && <small>{highlightAbSearch(it.description, query)}</small>}</span>
                        {it.badge && <span className={kit.srBadge} data-ab-part="search-badge" title={it.badgeLabel} aria-hidden={it.badgeLabel ? true : undefined}>{it.badge}</span> /* 🏷️ 0.7.2: e.g. EN */}
                        {it.badge && it.badgeLabel && <span className={kit.srOnly}>, {it.badgeLabel}</span> /* ♿ 0.7.2: the meaning, not "E N" */}
                        {it.meta && <code className={kit.srMeta}>{it.meta}</code>}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
            {failed && (
              <div className={kit.nores} data-ab-part={status === 'offline' ? 'search-offline' : 'search-error'} /* 📴 🛑 0.7.2 */>
                <span className={kit.pkgIc} aria-hidden="true"><AbIcon name="error" size={28} /></span>
                <b>{status === 'offline' ? L.offlineTitle : L.errorTitle}</b>
                <p>{status === 'offline' ? L.offlineHint : L.errorHint}</p>
                <button type="button" className={clsx(kit.row, kit.didYouMean)} onClick={retry}><AbIcon name="refresh" size={20} />&nbsp;{L.retry}</button>
              </div>
            )}
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
        <p className={kit.srOnly} role="status" aria-live="polite">{busy && !expanded ? L.loading : status === 'offline' ? L.offlineTitle : status === 'error' ? L.errorTitle : groups === null ? '' : none ? L.noResults : L.results(flat.length)}</p>
      </div>
    </AbDrawer>
  );
};

// 📦 exports
export default AbSearchDrawer;
export { AbSearchDrawer };
