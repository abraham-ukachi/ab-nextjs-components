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
* @name: AbPlaygroundScene labels
* @file: ab-playground-scene/labels.ts
* @type: Module
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🌍 every visible WORD in the scenes (code, package names and file names stay as they are, like the mock).
//    Pass `labels={{ ... }}` (e.g. from next-intl / the Welcome messages) to translate; missing keys fall back to English.

/** 🗂️ the 8 scene names (`i18n` is a placeholder until John's scene lands) */
export type AbPlaygroundSceneName = 'core' | 'components' | 'theme' | 'icons' | 'fonts' | 'animations' | 'hooks' | 'i18n';

/** 🇬🇧 English defaults */
export const AB_PLAYGROUND_SCENE_LABELS = {
  title: 'Live Playground', // 🏷️ header
  live: 'live', // 🟢 header
  alt: {
    core: 'Live playground: the AbProvider hub wired to config, Slot, client/server, focus ring, Portal and locale nodes.',
    components: 'Live playground: ab-nextjs-components wired to Button, Switch, Tabs, Sheet, Avatar and BottomNav previews.',
    theme: 'Live playground: the ThemeProvider palette wired to tokens, colour scheme, light and dark, radius, contrast and Tailwind nodes.',
    icons: 'Live playground: an icon set wired to size, variant, Icon, bundle, fill axis and typed import nodes.',
    fonts: 'Live playground: ab-nextjs-fonts wired to Zilla Slab, Inter weights, Inter, Mulish, Quicksand and Roboto samples.',
    animations: 'Live playground: an ease-out curve with a moving dot, wired to spring, duration, preset, reduced motion, Animate and stagger nodes.',
    hooks: 'Live playground: ab-nextjs-hooks wired to useTheme, useMedia, useHotkey, useLocalStorage, useMounted and useClipboard.',
    i18n: 'Live playground: translations wired from message files to the locale switcher.',
  } as Record<AbPlaygroundSceneName, string>,
  // 🧱 core
  providerHub: 'provider hub', primitive: 'primitive', a11y: 'a11y', locale: 'locale', focusRing: 'Focus ring', focus: 'Focus',
  client: 'client', server: 'server', ssrSafe: 'SSR‑safe', config: 'config',
  // 🧩 components
  primary: 'Primary', outline: 'Outline', button: 'Button', dark: 'Dark', preview: 'Preview', code: 'Code', props: 'Props',
  shareSheet: 'Share sheet', tabs: 'Tabs', components: 'Components',
  // 🎨 theme
  lightDark: 'light / dark', contrast: 'contrast', scheme: 'scheme', light: 'Light', darkChip: 'Dark', tokens: 'tokens',
  // 🔣 icons
  iconSet: 'icon set', size: 'size', variant: 'variant', outlined: 'Outlined', rounded: 'Rounded', bundle: 'bundle',
  treeShaken: 'tree‑shaken', fillAxis: 'fill axis', typed: 'typed', import: 'import',
  // 🔤 fonts
  display: 'display', headingsBold: 'headings · bold', interWeights: 'Inter weights', sans: 'sans', uiBody: 'UI · body',
  altSans: 'alt sans', roundedFont: 'rounded', neutral: 'neutral', headings: 'headings',
  // 🎬 animations
  easeOut: 'ease‑out', spring: 'spring', duration: 'duration', preset: 'preset', fade: 'fade', slide: 'slide', scale: 'scale',
  reduceAnimations: 'reduce animations', list: 'list', stagger: 'stagger', transition: 'transition', fadeSlide: 'fade · slide',
  // 🪝 hooks
  keyboard: 'keyboard', storage: 'storage', copy: 'copy', hooks: 'Hooks',
  // 🌍 i18n (placeholder)
  messages: 'messages', switcher: 'switcher', hello: 'Hello', bonjour: 'Bonjour', hallo: 'Hallo', translations: 'translations',
};

/** 🌍 the label dictionary (nested `alt` may be partial too) */
export type AbPlaygroundSceneLabels = typeof AB_PLAYGROUND_SCENE_LABELS;
export type AbPlaygroundSceneLabelsInput = Partial<Omit<AbPlaygroundSceneLabels, 'alt'>> & { alt?: Partial<AbPlaygroundSceneLabels['alt']> };

/** 🔀 merge app labels over the English defaults */
export function resolveAbPlaygroundSceneLabels(labels?: AbPlaygroundSceneLabelsInput): AbPlaygroundSceneLabels {
  return { ...AB_PLAYGROUND_SCENE_LABELS, ...labels, alt: { ...AB_PLAYGROUND_SCENE_LABELS.alt, ...labels?.alt } };
}
