/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbDemoBox (port of lyd-demo-box; 0.6.0: the G16 preview scope)
* @file: ab-demo-box/index.tsx
* @type: Server-safe component (no 'use client', no hooks)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbDemoBox label="Button preview" scheme="dark"><AbButton label="Save" /></AbDemoBox>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React (forwardRef works in server components too)
import type { ReactElement, ReactNode } from 'react';
import { forwardRef } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🎨 styles
import styles from './styles.module.css';

/** 🌗 the preview's colour scheme: follow the page, or force one (theme `[data-theme]` tokens re-apply inside) */
export type AbDemoBoxScheme = 'inherit' | 'light' | 'dark';

/** ⚙️ props */
export interface AbDemoBoxProps {
  className?: string; // 🏷️
  hidden?: boolean; // 🙈
  children?: ReactNode; // 🧪 the live preview: real JSX (package components), never eval'd strings
  label?: string; // ♿ 0.6.0: names the preview as a region, e.g. "AbButton preview" (no role without it)
  scheme?: AbDemoBoxScheme; // 🌗 0.6.0: default 'inherit'
  align?: 'center' | 'start' | 'stretch'; // 📐 0.6.0: how the content sits in the box (default 'center')
}

/**
 * 🧪 AbDemoBox — the G16 **preview scope**: an isolated surface for a live component preview.
 *
 * - 🌗 `scheme` forces light / dark through the theme's `[data-theme]` tokens, with matching `color-scheme`.
 * - 📦 `contain: layout paint` + `isolation: isolate`: fixed / absolute children (balloons, drawers) are positioned
 *   and clipped by the box, and z-indexes can't climb over the page. AbDrawer hosts its layer here (any scope).
 * - 🧱 its own text + background from the theme tokens, so the page's prose styles don't leak in (`ab-prose-none`).
 * - ♿ with `label` it is a named `role="region"`. No motion (all motion lives in ab-nextjs-animations).
 */
const AbDemoBox = forwardRef<HTMLDivElement, AbDemoBoxProps>(function AbDemoBox(
  { className, hidden = false, children, label, scheme = 'inherit', align = 'center' },
  ref,
): ReactElement {
  return (
    <div
      ref={ref}
      hidden={hidden}
      className={clsx('AbDemoBox', 'ab-prose-none', styles.abDemoBox, className)} // 🎨 + opt out of theme prose
      data-ab-part="demo-box" // 🗂️
      data-ab-preview-scope="" // 📦 drawers + portals inside stay inside (AbDrawer reads it)
      data-theme={scheme === 'inherit' ? undefined : scheme} // 🌗 theme tokens re-declared on this box
      data-align={align === 'center' ? undefined : align} // 📐
      role={label ? 'region' : undefined} // ♿ a landmark only when it has a name
      aria-label={label} // 🏷️
    >
      {children}
    </div>
  );
});

// 📦 exports
export default AbDemoBox;
export { AbDemoBox };
