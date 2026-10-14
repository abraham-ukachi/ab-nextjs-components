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
* @name: AbInstallSnippet - Client (G35)
* @file: ab-install-snippet/index.tsx
* @type: Component (client) — package-manager tabs + command + copy
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbInstallSnippet pkg="ab-nextjs-core" storageKey="ab-welcome-pm" labels={{ group: t('install.label', { pkg }), copy: t('install.copy'), copied: t('install.copied') }} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client';

// ⚛️ React
import type { CSSProperties, KeyboardEvent } from 'react';
import { useId, useRef, useState } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 📋 clipboard + 🗄️ persisted choice (hooks ≥ 0.1.6, deep imports)
import { useAbClipboard } from 'ab-nextjs-hooks/useAbClipboard';
import { useAbLocalStorage } from 'ab-nextjs-hooks/useAbLocalStorage';
// 🔘 copy button (G6-fixed)
import AbIconButton from '../ab-icon-button';
// 🧮 pure helpers
import { AB_PACKAGE_MANAGERS, getAbInstallCommand, isAbPackageManager, type AbPackageManager } from './helpers';
// 🎨 styles
import styles from './styles.module.css';

// 📦 re-export helpers for convenience
export * from './helpers';

// 🏷️ i18n labels
export interface AbInstallSnippetLabels {
  group: string; // 🗂️ "Install ab-nextjs-core" (tablist name)
  copy: string; // 📋 "Copy command"
  copied: string; // ✅ "Copied" (announced politely)
}

// ⚙️ props
export interface AbInstallSnippetProps {
  pkg: string; // 📦 package name (not translated)
  labels: AbInstallSnippetLabels; // 🏷️
  managers?: readonly AbPackageManager[]; // 🗂️ default pnpm, npm, yarn, bun
  storageKey?: string; // 🗄️ persist + sync the choice across snippets (e.g. 'ab-welcome-pm')
  defaultManager?: AbPackageManager; // 🌱 default 'pnpm'
  dev?: boolean; // 🛠️ dev dependency flag
  className?: string; // 🏷️
  style?: CSSProperties; // 🎨
}

// 🧠 state source: persisted (shared across instances) or local
type PmState = readonly [AbPackageManager, (pm: AbPackageManager) => void];

/** 🗄️ persisted variant (hooks can't be conditional, so it's its own component) */
function PersistedSnippet(props: AbInstallSnippetProps & { storageKey: string }) {
  const fallback = props.defaultManager ?? 'pnpm'; // 🌱
  const [raw, setRaw] = useAbLocalStorage<string>(props.storageKey, fallback); // 🗄️ syncs every snippet with this key
  const pm = isAbPackageManager(raw) ? raw : fallback; // 🧯 ignore junk in storage
  return <SnippetView {...props} state={[pm, setRaw]} />;
}

/** 🧠 local variant */
function LocalSnippet(props: AbInstallSnippetProps) {
  const [pm, setPm] = useState<AbPackageManager>(props.defaultManager ?? 'pnpm'); // 🧠
  return <SnippetView {...props} state={[pm, setPm]} />;
}

/** 🖼️ the actual UI */
function SnippetView({ pkg, labels, managers = AB_PACKAGE_MANAGERS, dev = false, className, style, state }: AbInstallSnippetProps & { state: PmState }) {
  const [pm, setPm] = state; // 🎚️
  const current = managers.includes(pm) ? pm : managers[0]; // 🧯 stored pm not offered here
  const command = getAbInstallCommand(current, pkg, dev); // 🧾
  const { copy, copied } = useAbClipboard(); // 📋
  const base = useId(); // 🆔 tab/panel ids
  const tabs = useRef<Array<HTMLButtonElement | null>>([]); // 📍 roving focus

  // ⌨️ APG tabs: arrows move + select (automatic activation), Home/End
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const i = managers.indexOf(current); // 📍
    const rtl = event.currentTarget.closest('[dir]')?.getAttribute('dir') === 'rtl'; // 🌍
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight'; // ➡️
    const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft'; // ⬅️
    let j: number | null = null; // 🎯
    if (event.key === nextKey) j = (i + 1) % managers.length; // ⏭️
    else if (event.key === prevKey) j = (i - 1 + managers.length) % managers.length; // ⏮️
    else if (event.key === 'Home') j = 0; // ⏮️⏮️
    else if (event.key === 'End') j = managers.length - 1; // ⏭️⏭️
    if (j === null) return; // 🙅
    event.preventDefault(); // 🛑
    event.stopPropagation(); // 🛑 the carousel must not also move
    setPm(managers[j]); // ✅
    tabs.current[j]?.focus(); // 🎯
  };

  return (
    <div className={clsx('AbInstallSnippet', styles.root, className)} style={style} data-ab-part="install-snippet" data-ab-swipe-ignore="">
      {/* 🗂️ manager tabs */}
      <div role="tablist" aria-label={labels.group} className={styles.tabs} onKeyDown={onKeyDown}>
        {managers.map((m, i) => (
          <button
            key={m} // 🔑
            ref={(el) => { tabs.current[i] = el; }} // 📍
            id={`${base}-tab-${m}`} // 🆔
            type="button" // 🧾
            role="tab" // ♿
            aria-selected={m === current} // ✅
            aria-controls={`${base}-panel`} // 🔗
            tabIndex={m === current ? 0 : -1} // ⌨️ roving
            className={styles.tab} // 🎨
            onClick={() => setPm(m)} // 🖱️
          >
            {m}
          </button>
        ))}
      </div>
      {/* 🧾 command panel */}
      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${current}`} className={styles.panel}>
        <span className={styles.prompt} aria-hidden="true">$</span>{/* 💲 decorative prompt */}
        <code className={styles.code}>{command}</code>
        <AbIconButton
          icon={copied ? 'check' : 'content_copy'} // 📋 / ✅
          label={labels.copy} // ♿ name stays "Copy command"
          naked // 🫥
          className={styles.copy} // 🎨
          onClick={() => { void copy(command); }} // 📋
        />
      </div>
      {/* 📣 own polite live region */}
      <span className={styles.srOnly} aria-live="polite" role="status">{copied ? labels.copied : ''}</span>
    </div>
  );
}

/** 📦 Install box: pnpm / npm / yarn / bun tabs + command + copy + "Copied" announcement. */
export function AbInstallSnippet(props: AbInstallSnippetProps) {
  return props.storageKey ? <PersistedSnippet {...props} storageKey={props.storageKey} /> : <LocalSnippet {...props} />;
}

// 📦 default export
export default AbInstallSnippet;
