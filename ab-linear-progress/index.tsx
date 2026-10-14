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
* @name: AB Linear Progress
* @file: ab-linear-progress/index.tsx
* @type: Component (server-safe, no hooks) — ported from the reviewed ab-nextjs-core version
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧩 React types only (no runtime hooks → works in server components too)
import type { CSSProperties, ReactElement } from 'react';
// 🧵 tiny class-name joiner
import clsx from 'clsx';
// 🎨 package-shipped CSS module (no Tailwind scanning of node_modules needed)
import styles from './styles.module.css';

// 📐 public props of <AbLinearProgress />
export interface AbLinearProgressProps {
  // 🏷️ extra class names from the consumer
  className?: string;
  // 🎨 bar color (any CSS color); defaults to the bronze brand color
  color?: string;
  // 🙈 hide the whole bar (kept for API parity with LYD chrome)
  hidden?: boolean;
  // 🔁 indeterminate mode: no known value, bar sweeps back and forth
  isIndeterminate?: boolean;
  // 📊 determinate value from 0 to 100
  progress?: number;
  // 🗣️ accessible name for screen readers
  label?: string;
}

// 🔒 clamp any number into the 0..100 range (NaN → 0)
export const clampAbProgress = (value: number): number => {
  // 🚫 non-finite values become 0
  if (!Number.isFinite(value)) return 0;
  // ✂️ clamp and return
  return Math.min(100, Math.max(0, value));
};

/**
 * 📊 AbLinearProgress — determinate (`progress`) or indeterminate (`isIndeterminate`)
 * linear progress bar. Respects prefers-reduced-motion and html.dark.
 */
const AbLinearProgress = ({
  className, // 🏷️ consumer classes
  color, // 🎨 optional custom color
  hidden = false, // 👀 visible by default
  isIndeterminate = false, // 🔁 determinate by default
  progress = 0, // 📊 start empty
  label = 'Loading', // 🗣️ default accessible name
}: AbLinearProgressProps): ReactElement => {
  // ✂️ safe 0..100 value
  const value = clampAbProgress(progress);
  // 🎨 expose the color as a CSS custom property (only when provided)
  const rootStyle = (color ? { '--ab-linear-progress-color': color } : undefined) as CSSProperties | undefined;

  // 🧱 render the track + bar
  return (
    <div
      // 🏷️ stable public class + module class + consumer class
      className={clsx('AbLinearProgress', styles.abLinearProgress, className)}
      // 🎨 custom color, if any
      style={rootStyle}
      // 🙈 native hidden attribute
      hidden={hidden}
      // ♿ ARIA progressbar role
      role="progressbar"
      // 🗣️ accessible name (dropped when empty, e.g. inside an aria-hidden overlay)
      aria-label={label ? label : undefined}
      // 📏 range lower bound
      aria-valuemin={0}
      // 📏 range upper bound
      aria-valuemax={100}
      // 📊 current value only in determinate mode (omitted = indeterminate per ARIA)
      aria-valuenow={isIndeterminate ? undefined : value}
      // ⏳ tell AT we're busy while indeterminate
      aria-busy={isIndeterminate ? true : undefined}
      // 🙈 hide from AT when hidden
      aria-hidden={hidden ? true : undefined}
      // 🔖 mode hook for styling/tests
      data-ab-mode={isIndeterminate ? 'indeterminate' : 'determinate'}
    >
      {/* 🟫 the moving / filling bar */}
      <div
        // 🏷️ bar class (indeterminate gets the sweep class)
        className={clsx(styles.abLinearProgress__bar, isIndeterminate && styles.abLinearProgress__bar_indeterminate)}
        // 📐 determinate width via transform (GPU friendly) — none in indeterminate
        style={isIndeterminate ? undefined : { transform: `scaleX(${value / 100})` }}
      />
    </div>
  );
};

// 📦 default export
export default AbLinearProgress;
