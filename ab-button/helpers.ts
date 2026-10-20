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
* @name: AbButton - Shared helpers (G22)
* @file: ab-button/helpers.ts
* @type: TypeScript (pure, server-safe)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🎨 visual types shared by the client + server twins
// 🥉 'filled' (0.1.12): solid bronze, painted by ab-nextjs-theme ≥ 0.3.3's
//    `button[data-type="filled"]` rule (fallback in styles.module.css → .isFilled)
// ⚪ 'secondary' (0.1.14, P16): the Home "Browse packages" button: --card bg, 1px --border hairline, --text
export type AbButtonType = 'contained' | 'filled' | 'outlined' | 'text' | 'secondary';
// 🔷 0.1.14 (P16): 'pill' = the legacy 999px look (default) · 'rounded' = the Home 10px button
export type AbButtonShape = 'pill' | 'rounded';
// 📏 0.1.14 (P16): 'md' = 40px (44px under 768px, the touch CTA); undefined keeps the legacy sizing
export type AbButtonSize = 'md';
// 🎨 colour roles
export type AbButtonColor = 'primary' | 'secondary' | 'tertiary' | 'white' | 'black';
// 🏷️ badge tones (G22): neutral grey or bronze accent
export type AbButtonBadgeTone = 'neutral' | 'accent';

/**
 * 🚦 How a button is disabled:
 *  - 'none'   → interactive
 *  - 'native' → `disabled` attribute (pre-G22 behaviour, skipped by Tab)
 *  - 'aria'   → `aria-disabled="true"`: stays focusable so screen-reader users can
 *               discover it and hear *why* (badge / reason); activation is suppressed
 */
export type AbButtonDisabledMode = 'none' | 'native' | 'aria';

// ⚙️ inputs that decide the mode
export interface AbButtonDisabledInput {
  disabled?: boolean; // 🚫
  isLoading?: boolean; // ⏳ loading also blocks activation
  badge?: unknown; // 🏷️ a visible "Coming soon"-style badge
  disabledReason?: string; // 💬 SR-only reason
  focusableWhenDisabled?: boolean; // ⌨️ explicit override
}

/**
 * @name getAbButtonDisabledMode
 * @description 🚦 Pick the disabled mode. Explaining a disabled button (badge or
 *   reason) only helps if it can be focused, so those switch to 'aria' by default.
 */
export function getAbButtonDisabledMode(input: AbButtonDisabledInput): AbButtonDisabledMode {
  const blocked = Boolean(input.disabled || input.isLoading); // 🚫 anything blocking?
  if (!blocked) return 'none'; // ✅ interactive
  // 🧭 explicit choice wins; otherwise explainable buttons stay focusable
  const focusable = input.focusableWhenDisabled ?? Boolean(input.disabledReason || (input.disabled && hasBadge(input.badge)));
  return focusable ? 'aria' : 'native'; // 🎯
}

// 🔍 does the badge render anything?
function hasBadge(badge: unknown): boolean {
  return badge !== undefined && badge !== null && badge !== false && badge !== ''; // 🧮
}

/**
 * @name getAbButtonSrReason
 * @description 💬 Text appended (visually hidden) to the accessible name when blocked:
 *   explicit `disabledReason`, else nothing (a visible badge is already in the name).
 */
export function getAbButtonSrReason(input: AbButtonDisabledInput): string | undefined {
  if (!(input.disabled || input.isLoading)) return undefined; // ✅ nothing to explain
  return input.disabledReason?.trim() || undefined; // 💬
}
