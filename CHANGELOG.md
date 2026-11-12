# Changelog

All notable changes to this project will be documented in this file.

## [0.7.1](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.7.0...v0.7.1) (2026-11-12)

* Normalize the changelog format and backfill missing entries.

## [0.7.0](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.6.0...v0.7.0) (2026-11-06)

* 📋 **AbPropsTable (server component):** accessible, responsive docs prop tables from build-time structured data. Export it from the package root or `ab-nextjs-components/ab-props-table`; row/default/column/label types are exported too. An omitted default (or `{ kind: 'none' }`) means "No default", `{ kind: 'unknown' }` is explicitly unknown, and `{ kind: 'value', value }` renders a code value. All input is escaped text: no introspection, evaluation or raw HTML. Configurable captions/labels/column order, required/deprecated annotations, one keyboard-scrollable region, wrapping long types and light/dark token fallbacks are included.

## [0.6.0](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.5.0...v0.6.0) (2026-11-04)

* ⚠️ **Breaking: `html` is now `trustedHtml`** on AbCodeBlock, AbDemoCode and AbPreviewCode. The string goes into `dangerouslySetInnerHTML` **without sanitizing**, so pass only HTML you render yourself (e.g. Shiki `codeToHtml`), never user input. Prefer `highlighted` / children. Rename the prop to upgrade.
* ⚠️ **Breaking (markup): code-block focus moved.** The focusable, named element is now the scroll wrapper (`[data-ab-part="code-block-code"]`, `role="group"`), not the `<pre>`. The old regex that patched `tabindex` / `aria-label` into the `<pre>` HTML (it broke on `>` inside attributes) is removed; it was internal, so no export changes.
* 🔐 **`warnAbRiskyHtml`:** a dev-only `console.warn` when `trustedHtml` contains `<script`, an `on…=` handler, `javascript:`, `<iframe` or `srcdoc`. Silent in production. It is not a sanitizer.
* ✨ **AbPreviewCode (server component):** a docs Preview / Code pair. AbContentTabs over an AbDemoBox preview and an AbDemoCode source block; both panels are in the server HTML. Nothing is parsed or evaluated from `code`.
* 🧰 **Preview toolbar (`AbPreviewStage`, a small client island):** a `role="toolbar"` with one tab stop (←/→/Home/End), a light/dark toggle (`aria-pressed`) for that preview only, a reload button that remounts the preview, and an open-in-new-tab link with `href` (`target="_blank" rel="noopener noreferrer"`). 44px targets; names via `labels.toolbar`, `labels.dark`, `labels.reload`, `labels.open`. New AbPreviewCode props: `toolbar` (default `true`) and `href`. Exported: `AbPreviewStage`, `AbPreviewStageProps`, `AbPreviewStageLabels`.
* 🧪 **AbDemoBox:** server-safe, with `scheme` (`'inherit' | 'light' | 'dark'`), a scoped `align` and an optional `label` (a named region).
* 🗄️ **Drawers inside the preview scope:** AbDrawer hosts its layer in the nearest `[data-ab-preview-scope]`, so a drawer demo stays inside its box. The selector is exported as `AB_PREVIEW_SCOPE_SELECTOR`.
* 💻 **AbDemoCode is built on AbCodeBlock:** escaped `<pre>`, SVG copy button, polite "Copied".
* 🔣 **Icons:** `refresh` and `open_in_new` (ab-nextjs-icons) join `AB_ICON_BUILTINS`.
* ⌨️ **One tab stop per code block:** the scroll wrapper is the stop, so arrow keys scroll long lines. A Shiki `<pre tabindex="0">` from children is dropped; inside a `trustedHtml` string it is set to `-1` after hydration (the string is never edited, so before hydration it is still a second stop).
* 📋 **Copy-button gutter:** the code scroller ends 48px short of the copy button, so long lines never run under it (390px phones too).
* ♿ **AbContentTabs:** a tabpanel is a tab stop only when it has no focusable content (checked after mount and on changes). The server render keeps `tabIndex 0` on every panel, so hydration matches. `AB_FOCUSABLE_SELECTOR` is exported.

## [0.5.0](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.4.2...v0.5.0) (2026-11-04)

* ⚠️ **Heads-up (default change, not breaking):** AbSidebar and AbNavDrawer now light only the **deepest** matching item, so `/docs` no longer lights up alongside `/docs/x` on `/docs/x`. A parent still lights on routes that have no listed child (`/docs/y`). Pass `activeMatch="prefix"` for the old look.
* 🐛 **One active item in AbSidebar and AbNavDrawer:** new `activeMatch?: 'best' | 'prefix' | 'exact'` (default `'best'`) on both, plus a per-item `exact?: boolean` override (`true` = never a parent match, `false` = parent matching allowed under `'exact'`). Query strings, hashes and trailing slashes are ignored. AbNavDrawer also gets `locales`, and both share one helper.
* ✨ **Exports:** `getAbActiveHrefs`, `matchAbHref`, `normalizeAbHref`, `flattenAbNavItems`, and the types `AbActiveMatch`, `AbActiveMatchable` and `AbActiveMatchOptions`. `isAbSidebarActive` stays, and it now ignores query strings, hashes and trailing slashes too.
* 📝 **Neutral wording:** comments, test names, the README and this changelog no longer name reviewers. The AbProgressChips demo data uses a neutral step name ("Simmer").
* ✅ **G59, stacked drawers and Escape (confirmed, regression test added):** with two drawers open, Escape closes only the topmost one, and focus returns to that drawer's trigger. A second Escape closes the next one. This works across scopes (app, main, aside). An Escape an inner widget already handled closes nothing. The shared open-drawer stack in `AbDrawer` already did this, so there is no runtime change.

## [0.4.2](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.4.1...v0.4.2) (2026-11-04)

* 📌 **Theme pin dropped ([#23](https://github.com/abraham-ukachi/ab-nextjs-components/pull/23)):** the D33 release-age pin for `ab-nextjs-theme@0.3.9` expired, so it's removed. The range stays `^0.3.9`.

## [0.4.1](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.4.0...v0.4.1) (2026-11-03)

* 🌙 **AbCodeBlock ([#22](https://github.com/abraham-ukachi/ab-nextjs-components/pull/22)):** the dark surface sets `color-scheme: dark`, so scrollbars and form controls match.
* 📱 **Breadcrumbs at 768px:** the trail gets a real width and is clipped before the search field, so the search field no longer covers it and the Docs crumb stays clear (24px target).
* ✂️ **Current crumb:** it ellipsizes on its own box ("Insta…") instead of being clipped at both ends.
* 🔤 **AbCallout:** the callout text size no longer follows global `body, p` font sizes.
* ⬆️ **Theme:** `ab-nextjs-theme` **^0.3.9**.

## [0.4.0](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.3.3...v0.4.0) (2026-11-03)

* ✨ **MDX docs components ([#21](https://github.com/abraham-ukachi/ab-nextjs-components/pull/21)):** `AbCallout`, `AbCodeBlock` + `AbCodeBlockCopy`, `AbContentTabs` and `AbDocPager`.
* 🎯 **Breadcrumbs:** 24px crumb targets.
* ♿ **Code blocks:** the `pre` is focusable, so keyboard users can scroll it.
* ⬆️ **Theme:** `ab-nextjs-theme` **^0.3.8**.

## [0.3.3](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.3.2...v0.3.3) (2026-11-02)

* 📌 **Icons pin dropped ([#20](https://github.com/abraham-ukachi/ab-nextjs-components/pull/20)):** the release-age pin for `ab-nextjs-icons` is removed.
* 🎯 **AbSearchTrigger:** the small size is 46px.

## [0.3.2](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.3.1...v0.3.2) (2026-11-01)

* 🎯 **44px tap targets ([#19](https://github.com/abraham-ukachi/ab-nextjs-components/pull/19))** across the touch controls.
* ♿ **AbTocPromo:** renders as a `div` with a label.
* 🔍 **AbMobileHeader:** a `search` slot.
* ✨ **`AB_THEME_MODE_ICONS`:** the theme mode glyphs, with `brightness_auto` for system mode.
* 🎯 **AbThemeToggle:** `iconShows` target fix.
* ⬆️ **Icons:** `ab-nextjs-icons` **^0.2.7**.

## [0.3.1](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.3.0...v0.3.1) (2026-10-30)

* 🧱 **404 gaps ([#18](https://github.com/abraham-ukachi/ab-nextjs-components/pull/18)):** new `AbErrorHero`, plus the other 404 page fixes.

## [0.3.0](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.2.3...v0.3.0) (2026-10-30)

* 🔥 **Prune ([#17](https://github.com/abraham-ukachi/ab-nextjs-components/pull/17)):** 5 unused components are removed: `AbKeyFeature`, `AbMainHeadline`, `AbPreview`, `AbSwitchBack` and `AbTestHello` (and their server twins). ⚠️ Breaking if you imported them.

## [0.2.3](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.2.2...v0.2.3) (2026-10-29)

* 🎪 **AbPlaygroundScene:** v6 scenes (welcome, all, `variant="auto"`), real export names in captions, a CSS locale cycle with stills, frame-card ratio, and the v6 card token
* 🔶 **AbButton:** owns per-type padding/size via `--ab-button-*` tokens; `size="lg"`, `color="bronze"` and opt-in `color="card"`; the server twin uses the client CSS (single source, twin guard)
* 🎠 **AbCarousel:** `autoHeight`, headless `AbCarouselProvider` with a region hook, `useAbCarouselKeys` (default scope `'main'`, `'document'` opt-in); each part resolves its own accent
* 📱 **AbMobileHeader:** extra row and 3-state theme, globe wiring, link fallback, compact mode, no-JS `<details>` language list, `barAt` to hide the bar from 768px
* 🧩 **AbThemeModeProvider** (`./ab-theme-mode`) so every theme toggle shares one mode; export map guarded
* 🔀 **AbFlowDiagram:** frame mode, rich nodes and dots
* 📥 **AbBottomDrawer:** close on swipe down and refocus its trigger
* ⬆️ `ab-nextjs-animations` `^0.2.5` and `ab-nextjs-theme` `^0.3.7` (with D33 pins at release time)

## [0.2.2](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.2.1...v0.2.2) (2026-10-21)

- 🌍 AbPackagePreviewComponents `labels` ({ button, chip, switch }); English defaults unchanged, the 0.2.1 `button` / `chip` props still work

## [0.2.1](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.2.0...v0.2.1) (2026-10-21)

### Sidebar profile
- ✨ AbSidebar `profile` prop (opt-in): a 40px profile button at the bottom left opens AbSettingsDrawer. Signed out it shows the profile glyph; signed in the initials ("AU") on the container colour, or the photo masked to a circle, plus the name when expanded. Rendered on the server and hidden by CSS below 1180px (no flash); the collapsed rail names it with an AbBalloon tooltip. Label via `labels.profile` (default "Profile and settings")
- ✨ New `AbSidebarProfileButton` (standalone) and `AbProfileAvatar` + `getAbInitials` (client + server)
- ✨ AbSidebar `footer` slot (bottom left, sticky)
- ✨ AbBalloon `strategy="fixed"`: the tip is placed in the viewport, so the collapsed sidebar rail (a scroller) can't clip it; rail items + the profile button use it
- ✨ AbTocPromo: the aside "New" card (mock .toc-card: 12px radius + padding, card colour, 13px title, 11.5px subtitle)
- ✨ Home preview tiles for AbPackageCard `preview`: `AbPackagePreviewCurve` (ease-out), `AbPackagePreviewCode` (`*kw*` / `~dim` lines), `AbPackagePreviewComponents` (button · switch · pill chip); preview children no longer stretch
- ✨ `useAbEdgeSwipe({ maxWidth })` + `AB_ASIDE_DRAWER_MAX_WIDTH` (1179): the right drawer swipes on mobile and tablet only
- 🐛 Drawers: a swipe-opened drawer returns focus to the header / brand logo by default (`AB_DRAWER_RETURN_FOCUS`; AbAppBar's brand gets `data-ab-part="app-bar-brand"`)
- 🐛 Drawer rows: hover tints only on hover-capable pointers, so the nav drawer opens with no highlighted row
- ✨ AbSettingsDrawer: the Account section is back on top (`account`, `onAccount`, `onSignIn`), plus `onHelp` / `onAbout` rows after Language (labels `account`, `signIn`, `help`, `about`)

## [0.2.0](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.1.14...v0.2.0) (2026-10-21)

Includes everything planned for 0.1.15, which is not released separately.

### ⚠️ Heads-up (default changes, not breaking)

* ⚠️ **AbVersionSwitcher `label`** now defaults to `''` (it was `'Docs'`), so the control shows just "v0.2.x ▾". Its accessible name is then `Version v0.2.x`. Pass `label="Docs"` for the old look.
* ⚠️ **AbAppBar compact bars** (`density="compact"`) now show the search **pill** below 768px by default (it used to be a 40px icon circle). Pass `compactSearch="icon"` for the old look.

### Drawers v2
- ✨ AbDrawer: `tier`, `swipe`, `snapPoints`/`defaultSnap`/`fullOnly`/`onSnapChange`, `handleLabels`, `centerIn="main"`, `initialFocus` selector, `returnFocus`, `closeIcon`, `headerStart` (all additive)
- ✨ Gesture kit: `AB_SWIPE`, `resolveAbSheetRelease`, `resolveAbSideRelease`, `isInAbEdgeZone`, `createAbVelocityTracker`, `useAbEdgeSwipe`
- ✨ New: AbSettingsDrawer, AbNavDrawer, AbTocDrawer, AbSearchDrawer (combobox/listbox, recents, grouped results), AbMobileHeader
- 🔥 Docs removed from examples; AbVersionSwitcher `label` defaults to ''
- 🐛 Initial focus no longer scrolls the layer; returnFocus takes the first visible match
- ♿ AbVersionSwitcher: with no `label`, the accessible name is `Version <version>`
- 🧯 AbSearchDrawer: a rejected or throwing `search` clears to "no results"; no stale results, no unhandled rejection
- 🆔 AbSearchDrawer: group heading ids are sanitised (`[A-Za-z0-9_-]`) and indexed, so they stay valid and unique
- 📌 AbMobileHeader needs ab-nextjs-core ≥ 0.2.1 with `mobileHeader="main"`
- 🤖 Edge swipes work on Android Chrome: touches are read from touch events, and `touchmove` is non-passive only during an edge press, with `preventDefault` only once the move is sideways. Vertical scrolling from the edge zone and sideways code blocks are unaffected; checked in WebKit and Chromium touch emulation.

### From 0.1.15

* 🔎 **AbAppBar `compactSearch`** (`'pill'` | `'icon'`): below 768px, a `density="compact"` bar now shows its `variant="field"` search as the mock's 34px "Search ⌘K" pill, not a 40px icon circle. It is the same element, styled by CSS, so there's still one hotkey listener. The default is `'pill'` for compact bars; comfortable bars keep the icon, as before.
  * ⚠️ **Heads-up:** `density="compact"` bars now show the search pill below 768px by default (they used to show a 40px icon circle). Pass `compactSearch="icon"` to keep the old look.
* 🏷️ **AbSearchTrigger `compactLabel`:** an optional short label (e.g. "Search") that the compact bar shows on mobile instead of `label` ("Search docs…"). Only one is ever displayed. The key cap's space is now its own span, so the pill shows "⌘K".
* 🏷️ **AbSidebar `logo`:** a 60px (`--ab-header-height`) logo row above `header`, like mock 06's `.sb-logo`. With core ≥ 0.2.1 panes it only shows where the app header is hidden (`tabletHeader="main"` at 768–1179px).
* 🧩 **AbLocaleSwitcher `presentation="inline"`:** no trigger and no popover; it renders a labelled group of 48px rows (`--tint` + `--accent-text` when active, a check mark, `lang` / `hreflang`) in place. Put it inside the mobile app drawer. Link rows mark the current locale with `aria-current`, button rows with `aria-pressed`. Rows are exactly 48px (44px minimum), 8px apart, with an 18px bronze 2px-stroke check (`--ab-color-btn` light, `--ab-color-accent` dark). Use `divider` when it goes last after nav / theme items, and `showLabel={false}` when it's the drawer's only content (title the drawer "Language"). See the snippet in `ab-locale-switcher/index.tsx`. The inline list is its own component (`AbLocaleSwitcherInline`, also exported), so changing `presentation` at runtime remounts cleanly.
* 🏷️ **AbBottomDrawer title:** Mulish (`--ab-font-title`) 16/**800** (was 700). The bottom padding stays 16px + the safe area.
* 🔗 **AbAppBar `searchCompact`:** a node shown instead of `search` below 768px (both rendered, CSS picks). Pass `<AbSearchTrigger size="sm" href="/docs" label="Search" />` for the mock's mobile pill: a plain link to /docs, 114px wide (`--ab-app-bar-compact-search-width`) in a compact bar, with no ⌘K cap and no hotkey (no `onOpen` means no shortcut; `hotkey={false}` also turns both off).
* ♿ **Inline AbLocaleSwitcher `ariaLabel`:** the group's accessible name. It defaults to `label`, whether the label is visible or hidden.
* 📱 **No globe on the mobile bar:** pass the bar's actions without the locale switcher as `compactActions` (from 0.1.13), and render the inline switcher in the app drawer.
* 📝 **AbAppBar `searchCompact` docs:** a hotkey trigger passed to both `search` and `searchCompact` registers ⌘K twice; give only one `onOpen` (or `hotkey={false}` on the other).
* ✂️ **AbAppBar compact pill:** a longer (translated) label ends in an ellipsis inside the 114px pill.

## [0.1.14](https://github.com/abraham-ukachi/ab-nextjs-components/compare/v0.1.13...v0.1.14) (2026-10-20)

* ⬆️ **Peer + dev range:** `ab-nextjs-theme` **^0.3.5** (was ^0.3.4), for the Home tokens. It has a D33 release-age pin that expires 2026-10-21T20:40:07Z. Components doesn't depend on `ab-nextjs-core`, so no core range changed.

* 🎯 **AbThemeToggle icon shows the target (20:57):** `variant="icon"` + `appearance="thumb"` now shows the mode a click switches to (moon in light, sun in dark). New `iconShows?: 'current' | 'target'` (default `target` for thumb, `current` otherwise, so fill is unchanged) and `labels.switchTo` for names like "Switch to dark theme". Segmented toggles are unchanged.
* 🌿 **Sage chip AA:** the `tone="sage"` fallback text is now #566a58 (theme 0.3.5 value), ≥ 4.5:1 on the unchanged tint. Tested.
* ♿ **AA fallbacks and the sidebar badge:** `AbBreadcrumbs` and `AbList` now fall back to the AA faint #807062 (was the mock's #9c8c80). On the active `--tint` row, the `badgeVariant="text"` sidebar badge inherits `--accent-text`, because faint on tint is only 3.9:1. Tested.
* 🏠 **Home fidelity components (spec §5, approved):**
  * `AbList` + `AbListItem` (P13): bordered row lists with a media tile or badge, title, meta and chevron. A row with `href` is a single link.
  * `AbBreadcrumbs` (P2): the tablet main bar crumb.
  * `AbVersionSwitcher` (P9): the sidebar "Docs **v0.2.x** ▾", which opens an AbMenu, with a no-JS `<details>` fallback.
  * `AbBottomDrawer`: the mobile bottom drawer (D40), which `AbLocaleSwitcher` / `AbAppBar` now use for `side="bottom"`. `AbDrawerList` gains `as`.
  * They read the `ab-nextjs-theme` 0.3.5 Home tokens (`--ab-color-card`, `--ab-color-faint`, …), with the light mock values as fallbacks.
* 🏠 **Home variants on existing components (the P4–P19 items; everything is opt-in, defaults unchanged):**
  * `AbAppBar`: `density="compact"` (height from core's `--ab-header-height`, 13.5px links, brand column `--ab-app-bar-brand-width` 236/270), `divider`, `moreMenu={false}` (P4/P5/P19).
  * `AbSearchTrigger`: `variant="field"` (300×36, one `⌘ K` cap, "coming soon" only in the tooltip and SR text) and `size="sm"` (the 34px mobile pill) (P6).
  * `AbThemeToggle`: `appearance="thumb"` (28px segments, raised thumb, filled active glyph) (P7).
  * `AbSidebar`: `density="compact"`, `activeShape="rounded"`, `badgeVariant="text"`, section `itemSize="sm"`, and `collapseButtonVariant="outlined"` (32px `<<`/`>>`) (P8/P9).
  * `AbPackageCard`: the Home layout with `preview`, `title` and `descriptionLines`, version and tag chips and a trailing arrow (P10). P11 `variant="all"` was not built (dropped by D1).
  * `AbInstallSnippet`: `variant="terminal"` (underline tabs, copy button in the tab row, horizontal scroll instead of clipping) (P12).
  * `AbToc`: a `footer` slot (P14). The TOC now uses the Home sizes: 11px heading, 13px links on 30px rows.
  * `AbButton`: `shape="rounded"`, `size="md"` (40px, 44px below 768px), `type="secondary"`. `AbChip`: `size="sm"`, `shape="rounded"`, `mono`, `tone="accent" | "sage"` (P16).
  * `AbNavbar`: `indicator="none"` and `blur` (P18).
  * `AbIconButton`: `aria-expanded` / `aria-controls` pass through, and a new `iconSize`.
  * `AbVersionSwitcher`: the accessible name is `"{label} {version}"`, so it contains the visible text (WCAG 2.5.3).
  * AbList rows are 59/60px, like the mock.
  * `AbBottomDrawer`: the sheet takes focus on open, the ✕ is 44px with an 8px hover tint and a `:focus-visible`-only ring, plus 16px + safe-area bottom padding and the 36×4 handle. It reads the theme 0.3.5 scrim, handle and sheet-edge tokens. `AbDrawer` gains `initialFocus`.
* 🎨 **Home tokens first:** borders, hovers, active rows and focus rings read `--ab-color-border` / `-hover` / `-tint` / `-accent-text` / `-accent` (theme 0.3.5) before the M3 tokens. On theme 0.3.5 the rings turn bronze and active rows turn `--tint`.
* 🗄️ **AbDrawer + `useAbDrawer` (new, G53, D38).** The drawer is scoped to `app`, `main` or `aside`. It renders into a layer inside that layout box and never scrolls the document. Sides are `top`, `bottom`, `left` and `right`, plus logical `start` and `end`.
  * Accessibility: `role="dialog"`, `aria-modal`, a labelled panel, a focus trap that restores focus to the opener, Escape and scrim close, and the rest of the scope is `inert`.
  * It uses the 240ms `ab-nextjs-animations` slide, which reduced motion turns off.
  * Without JS it renders as an in-flow `<section>` (D41).
* 📋 **`AbDrawerList` + `AbConfirmDrawer` presets (new, D38/D40).**
* 🌍 **`presentation="menu" | "drawer" | "auto"` (G56)** on `AbLocaleSwitcher` and on the `AbAppBar` More menu. The drawer is an app-scope bottom sheet, and `auto` uses it below 768px. The default stays `menu`.

## [0.1.13](https://github.com/abraham-ukachi/ab-nextjs-components/compare/eba68a9f33aae456803645b145ed26a6a230ef92...v0.1.13) (2026-10-20)

* 🔗 **`AbLinkProvider` (new, `ab-nextjs-components/ab-link`)**: every component link now renders through `AbLink`, so an app can inject a locale-aware `Link` once. `useAbLink`, `AbLink`, `AbLinkComponent` and `AbLinkProps` are exported. It's the only `next/link` import (test-guarded)
* 🔣 **AbIcon (G2): SVG first, non-breaking fallback.** Registered / explicit / built-in names render AbIcons SVGs. An unregistered name still renders the Material Symbols ligature (`data-ab-icon-fallback="font"`, as before) and warns once in development, so nothing goes blank in a patch; register every name before the app drops the font. **`AbIconRegistrar`** (`ab-nextjs-components/ab-icon/registrar`) is the server-safe way to register icons from a Server Component layout. 7 more built-ins: `chevron_left`, `chevron_right`, `menu`, `more_vert`, `search`, `close`, `expand_more`. AbMenu icons are AbIcons now (filled when selected)
* 🧭 **AbSidebar v2 (G40)**: sections, `activeHref`, filled active icon, `aria-current`, badges, one child level, a 72px rail with balloon tooltips, and a collapse button (`aria-expanded`, `aria-controls`, hidden without JS). Client and server twins share `ab-sidebar/view`. Legacy `links` / `page` / `brandLabel` still work
* 📱 **AbNavbar v2 (G41)**: link and button items, filled active icon, `aria-current`, safe-area padding. The server twin takes link items only
* 🧱 **AbAppBar (new, G43)**: brand, search, nav, actions, sticky with a hairline, and a "More" overflow `AbMenu` below 1180px (Escape and outside click close it, focus goes back to the trigger). The nav stays inline without JS
* 🔎 **AbSearchTrigger + AbKbd (new, G44)**: an `href` always renders a real `<a>` (works without JS, D24a: `/docs`); with `onOpen` too, JS intercepts plain clicks and opens the dialog. The ⌘K / Ctrl K hint and `aria-keyshortcuts` appear only while a hotkey is listening. `shortcut` (alias of `hotkey`), `compact` (icon-only, label for screen readers), `comingSoon` with `aria-disabled`. The hotkey is a local listener because `useAbHotkey` (G48) is not in hooks 0.1.7
* 🃏 **AbCard + AbPackageCard (new, G45)**: one link per card, `ab-motion-interactive` timing, a 2px hover lift on laptop and up with a real pointer, and no lift under reduced motion
* 📑 **AbToc (new, G46)**: plain `#id` anchors, `aria-current="location"`, and an optional `onNavigate` (for `scrollToAbSection`)
* 📜 **Panes scrolling (D35/G55):** with core 0.1.6 the page never scrolls, the main pane does. `getAbMainScroller()` / `AB_MAIN_SCROLLER_SELECTOR` (`[data-ab-part="main-content"]`) from `ab-nextjs-components/ab-toc` give the `root` for `useAbScrollSpy` (call it in an effect or handler, never during render; `import { getAbMainScroller } from 'ab-nextjs-components/ab-toc'`, also on the root barrel with `AbToc`) and the `container` for `scrollToAbSection`; a plain `#id` jump scrolls the pane on its own. In panes the AbAppBar is the header row outside the scroller, so it stays put without the document scrolling
* 🌍 **AbAppBar active link:** without `activeHref` it uses the pathname minus the AbLinkProvider `locales` (or its own `locales` prop), like AbSidebar / AbNavbar, so `/fr/docs` marks Docs
* 🧩 **AbPackageCard names wrap at hyphens:** a `<wbr>` after each `-` (`toAbPackageNameParts`), so narrow cards show `ab-nextjs-` / `components` on two lines instead of an ellipsis; `overflow-wrap: anywhere` splits a part only when it alone is wider than the card. Checked in WebKit at 1280 (no clipping, no overflow)
* 🔑 **AbSidebar item `id`:** optional, used as the React key (`id ?? href`) so two items may share an href
* 🆔 **AbIcon per-instance ids:** every render suffixes the SVG ids and `url(#…)` refs with `useId()` (`scopeAbIconIds`), so two filled Homes never share a mask and a hidden twin can't turn the active Home into a solid square
* 🎈 **AbBalloon a11y**: `role="tooltip"`, `aria-describedby` on the trigger, shows on focus, a 300ms hover delay (`AB_BALLOON_HOVER_DELAY`), Escape dismisses, `popIn` skipped under reduced motion. Without JS, CSS shows it on focus or hover. New `placement` and `delay` props
* 🚫 **JS-off fallbacks**: AbInstallSnippet hides copy (the command shows the pnpm default). AbLocaleSwitcher with `getHref` renders a `<details>` list of `hreflang` links
* 📱 **AbAppBar compact phone layout (< 768px):** tighter gaps, a shrinkable brand, an icon-only search pill and `compactActions` (shown instead of `actions`), so nothing overflows at 390px
* 🔘 **AbButton** forwards any `aria-*` / `data-*` prop (e.g. `useAbAsideToggle().props`), and the `href` variant gets the theme's padding and colours (it rendered 20px tall with none). **AbIconButton** draws its glyph with AbIcon (filled while `active`, or `iconFilled`)
* 🚧 **AbNavbar** button items take `disabled` and `comingSoon` (inert, `aria-disabled`, a "Coming soon" tag)
* 🌍 **Locale-aware active state:** `AbLinkProvider` takes `locales`; AbSidebar / AbNavbar strip `/fr` from the pathname (or `activeHref` on the server twins, via a `locales` prop). `stripAbLocalePrefix` is exported. `AbLinkProvider` is generic over the link's props, so next-intl's `Link` needs no cast
* 🃏 **AbCard / AbPackageCard** take `id`; AbPackageCard takes `media`, and names never wrap mid-name (ellipsis + `title`). **AbToc** takes `label` (alias of `title`). **AbSidebar** labels accept any node (`labelText` names the rail) and use M3 label-large
* 💻 **AbInstallSnippet** puts the command on `--ab-color-code-surface` / `--ab-color-on-code-surface` with `--ab-font-code` (theme 0.3.4, with fallbacks)
* 🛡️ **Release age:** the expired `ab-nextjs-theme@0.3.3` exclude is gone, `.npmrc` no longer sets `minimumReleaseAge` (pnpm 11 ignores it there), and `minimumReleaseAgeStrict: true` is on. Tests guard all three; the per-entry expiry allowlist stays ready for scoped D33 exemptions
* 📝 Every code file carries the full house header with `@authors`; the npm author email is abrahamukachi@gmail.com
* 🧪 The release-age guard moved to `__tests__/release-age.test.ts`: excludes must be our own exact `ab-nextjs-*` versions and fail once expired
* ⬆️ Peers + dev: `ab-nextjs-theme ^0.3.4`, `ab-nextjs-icons ^0.2.4` (the filled `search` tab icon), `ab-nextjs-hooks ^0.1.7`
* ⏳ **D33:** exact `minimumReleaseAgeExclude` pins for the three siblings in the lockfile that are < 24h old: `ab-nextjs-icons@0.2.4`, `ab-nextjs-theme@0.3.4`, `ab-nextjs-hooks@0.1.7`, each until publish + 24h (2026-10-21 17:15 / 17:25 / 17:28 UTC). `release-age.test.ts` fails after that and rejects pins that aren't in the lockfile

## [0.1.12](https://github.com/abraham-ukachi/ab-nextjs-components/compare/5ba7d20bf57a602b68cd323c66ebe432424025b8...eba68a9f33aae456803645b145ed26a6a230ef92) (2026-10-16)

* ♿ **AbInstallSnippet tabs pass AA in every state.** Each state now paints an explicit text/background pair from the live palette instead of a transparent tab and a 12% bronze tint: inactive `on-surface-variant` on `surface-container` (8.04:1 light / 9.67:1 dark), hover `on-surface` on an 8% `on-surface` state layer (12.63:1 / 10.39:1), active and active + hover `on-primary-container` on `primary-container` (13.28:1 / 7.22:1). Fallbacks are the light bronze palette, so it also passes without the theme
* 🥉 **New `AbButton type="filled"`** (client + server): solid bronze `--md-sys-color-primary` with `on-primary` label and icon. Sets `data-type="filled"`, styled with hover / focus / disabled by `ab-nextjs-theme@^0.3.3`; a `.isFilled` fallback paints the rest state on older themes. `AbButtonType` gains `'filled'`
* ⬆️ **`ab-nextjs-theme ^0.3.3`** (peer + dev, was `^0.3.1`) for the filled hover / focus / disabled states and the button icon-colour fix. The `.isFilled` fallback stays for apps still on an older theme
* Tests: contrast computed from the theme palette (light + dark, every state, plus the no-theme fallbacks); filled type on client + server twins. Checked in WebKit (ratios above; filled 6.47:1 light / 7.74:1 dark)

## [0.1.11](https://github.com/abraham-ukachi/ab-nextjs-components/compare/f6fd1fa600e9c52d469bee9dfb5f042636d3aae3...5ba7d20bf57a602b68cd323c66ebe432424025b8) (2026-10-15)

* 🐛 **AbFlowDiagram: nodes no longer cover the header in small boxes.** At 390px wide the Live Playground's top node ("core") sat under the "Live Playground" header. With a header (title, live dot or caption) the root now gets `data-ab-header="true"`, and nodes + wires live in a stage that starts below the header band: `--ab-flow-diagram-inset-top` (default `2.75rem`, tunable). Node `x` / `y` stay 0–100 but now map onto that stage, and the wires share the same box so they still meet the nodes. Without a header the stage is the full card (unchanged)
* 📏 **AbFlowDiagram nodes scale with the card:** `container-type: inline-size` on the root; node text, padding, radius and the hub glow use clamped `cqi` sizes (13px on a 760px card, 11px at 390px)
* 🪐 **AbFlowDiagram: side nodes are never clipped** (s04's `--ab-color-bronze` and s07's `reduced motion` were cut off at the card edge in a 390px box). The orbit now scales with the box. Each node is anchored at the same fraction of its own box as its position (`translate(-x%, -y%)` via `--ab-flow-node-x` / `-y`; `x = y = 50` is the old centring), so the outer ring pulls in by exactly the node's width, and the wire end stays inside the pill. Nodes + wires also sit inside a side margin, `--ab-flow-diagram-inset-x` (default `0.5rem`), and an over-long label ellipsises (`max-width: 100%`). Positions are clamped to 0–100 like the wires
* Tests: header flag, stage insets shared by nodes + wires, 390px geometry, clamped scaling, proportional anchoring + side margin, s04 / s07 orbit geometry at 390 / 760px × 276 / 380px. Checked in WebKit at 390px: "core" top 9px → 53px (header ends at 33px); no node overlaps the header or is clipped at 390 / 760px. After the orbit fix: s04 + s07 have no node clipped (x or y) or over the header at 390 / 760px wide × 276px / 380px / default-ratio heights (before: 5 nodes clipped at 390px, 2 at 760px)

## [0.1.10](https://github.com/abraham-ukachi/ab-nextjs-components/compare/5e8d9e84398714e47ac947cc405009850eef2398...f6fd1fa600e9c52d469bee9dfb5f042636d3aae3) (2026-10-15)

* **Motion comes from ab-nextjs-animations (>= 0.2.4, now a required peer):** no component CSS declares its own `transition`, `animation` or `@keyframes` any more. Each component imports the package stylesheet it needs:
  * AbCarousel: `slide-step` (direction-aware enter / leave via `data-ab-direction`) + `motion` (buttons, dots)
  * AbFlowDiagram: `wire` (`--ab-wire-*` tokens; `data-ab-paused`; 3 loops on phones unless `loops` is set)
  * AbThemeToggle, AbSearchbar, AbSplash fade: `motion` colours
  * AbIconButton: `motion` (`expands` → `ab-motion-lift`, `shrinks` → `ab-motion-press`)
  * AbProgressChips: `motion` size
  * AbLinearProgress: `motion` transform + `progress-sweep`
  * AbCollapsible, AbBrand: `motion` transform
  * AbLikeButton / AbSearchbar spinners: `spin`
  * Reduced motion (OS, or `reducedMotion="always"` via `data-ab-reduced-motion`) is handled by the package
* **AbCarousel:** context gains `direction` + `previousIndex`; `--ab-carousel-duration` / `-ease` / `-shift` map onto `--ab-slide-step-*`; the old positional slide offsets are gone
* **Peers:** `ab-nextjs-icons` and `ab-nextjs-animations` are no longer optional. All four Welcome peers (and devDependencies) use caret ranges: `ab-nextjs-hooks ^0.1.6`, `ab-nextjs-theme ^0.3.1`, `ab-nextjs-icons ^0.2.3`, `ab-nextjs-animations ^0.2.4`
* **Motion exceptions (named, test-guarded):** the dialog list-item transition (`css/dialog.css`) and the self-animating spinner SVGs stay local
* **Lockfile:** refreshed against the published hooks 0.1.6, theme 0.3.1, icons 0.2.3 and animations 0.2.4 (`pnpm install --frozen-lockfile` verified on a fresh `node_modules`). `pnpm-workspace.yaml` exempts exactly the five Welcome releases (fonts 0.2.5 included) from pnpm 11's 1-day `minimumReleaseAge`, and that block should be removed once they are a day old

* **AbCarousel (G31):** new subpath `ab-nextjs-components/ab-carousel` (+ server-safe `ab-carousel/helpers`). Compound parts `AbCarousel`, `AbCarouselTrack`, `AbCarouselSlide`, `AbCarouselPrev`, `AbCarouselNext`, `AbCarouselDots`, `AbCarouselCounter` + `useAbCarousel()`. APG carousel semantics (`aria-roledescription` carousel/slide, "n of total" labels, polite live region, inactive slides `inert` + `aria-hidden` after hydration), RTL-aware ←/→ + Home/End scoped to the region, swipe via `useAbSwipe`, reduced motion via `useAbReducedMotion` + CSS, controlled / uncontrolled, i18n labels on every control, `AB_CAROUSEL_NOSCRIPT_CSS` for the no-JS stack
* **AbIconButton (G6):** `aria-label` + `title` now sit on the interactive element (never the wrapper span); new `label` prop (falls back to `title`); the `href` variant is named and no longer has `role="button"`; the ligature glyph is `aria-hidden`; disabled links leave the tab order; loading sets `aria-busy`
* **AbButton (G22):** `startIcon` / `endIcon`, `badge` + `badgeTone` (e.g. "Coming soon"), `disabledReason` (visually hidden text appended to the accessible name), `focusableWhenDisabled`; with a badge / reason the button uses `aria-disabled` (stays focusable, clicks guarded) instead of native `disabled`; disabled links render as `span role="link" aria-disabled`; links no longer get `role="button"`; server twin matches
* **AbThemeToggle (G34, new, `ab-nextjs-components/ab-theme-toggle`):** light / dark / system radiogroup (roving focus, RTL arrows, icon-only variant, i18n labels), driven by `useAbThemeMode()`; `getNextAbThemeMode` helper
* **AbChip / AbPill (G36, new, server components):** `ab-chip`, `ab-pill`
* **AbInstallSnippet (G35, new):** pnpm / npm / yarn / bun tabs (APG tablist), choice shared via `useAbLocalStorage`, copy button with polite status, `data-ab-swipe-ignore`; `getAbInstallCommand` helper
* **AbLocaleSwitcher (G7, new):** menu button + `menuitemradio`, typeahead, `onSelect` or `getHref` (+ `hrefLang`)
* **AbIcon (G2, new, `ab-nextjs-components/ab-icon`):** AbIcons as inline SVG; client twin resolves `svg` prop → `registerAbIcons` registry → Material Symbols font (never imports the full map); server twin renders any icon; weights 100–700 map to the icons package stroke table; 8 built-ins (arrows, theme, language, copy / check) imported per icon from `ab-nextjs-icons/ab-icons/icons/*` (needs icons >= 0.2.3)
* **AbCarousel:** prev / next arrows now render through AbIcon (weight 300); `--ab-carousel-icon-stroke` removed
* **AbFlowDiagram (G38, new, server component):** `figure role="img"` scenes, CSS-only draw + pulse, paused while inactive, 3 loops on mobile, reduced motion shows the poster frame; `getAbFlowEdgePath` helper
* Dev: `happy-dom` + `@testing-library/react` for DOM tests

## [0.1.9](https://github.com/abraham-ukachi/ab-nextjs-components/compare/9d443f2ac9944d16951eb613f7a4bd1feab82712...5e8d9e84398714e47ac947cc405009850eef2398) (2026-10-14)

- **AbLogo:** `wordmark` prop (`true` → "Elements", or any string) renders a mark + Quicksand Bold lockup (`font-quicksand-bold` from ab-nextjs-fonts); `color` prop (`--ab-logo-color`); light / dark (`html.dark`)
- **AbLogo fix:** `naked` with no `src` now masks with the shipped Ab mark (via `--app-logo-url` fallback) instead of a bronze square when the chrome CSS isn't loaded
- **AbSplash (new, `ab-nextjs-components/ab-splash`):** brand overlay + `abSplashGateScript` / `buildAbSplashGateScript({ locales, defaultLocale })`; root-path RegExp built from locales minus the default and JSON-injected; skips `navigator.webdriver` / bot UAs; standalone via `matchMedia` OR `navigator.standalone`; each storage get/set in its own try (failed get = seen); `data-ab-splash` set last; page behind is `inert` while shown; track `min(18rem, 28vw)`
- **CSP:** `ab-nextjs-components/ab-splash/csp` → `getAbSplashGateSha256(script)`, `buildAbSplashGate(options)`, `AB_SPLASH_GATE_SHA256`
- **AbLinearProgress (new here, `ab-nextjs-components/ab-linear-progress`):** ported from the reviewed core work — determinate / indeterminate, `color`, reduced motion, dark, RTL sweep, empty `aria-label` dropped; shipped CSS module. AbSplash uses it, so **no `ab-nextjs-core` peer is needed**
- **CSP (P1):** `ab-nextjs-components/ab-splash/csp` now ships compiled `csp.mjs` + `csp.d.ts` (Node-loadable from `next.config.*`); `build:csp` script, `check:publish` / `prepublishOnly` fail when it's stale
- **AbSplash:** unmount removes `data-ab-splash` + `inert`; scroll lock gets the same 1.2 s CSS failsafe; surfaces `#FFF8F3` / `#1A1310` (mocks)
- **Tooling:** `esbuild ^0.28.2` is now an explicit devDependency (direct in `pnpm-lock.yaml`; frozen install verified)
- **AbSplash:** StrictMode-safe teardown (`scheduleAbSplashFinish` / `cancelAbSplashFinish`); overflow failsafe verified in Chromium + WebKit
- **Tooling:** `typecheck` script, `types/css.d.ts`, vitest automatic JSX, `scripts/build-demo.mjs`

## [0.1.8](https://github.com/abraham-ukachi/ab-nextjs-components/compare/bb3a452d8cd89d57d6a3951b2f640a58ecdeb775...9d443f2ac9944d16951eb613f7a4bd1feab82712) (2026-10-05)

- **Chrome styles:** dialog, toast, logo (`span.app-logo`), spinner, and empty-state doodle CSS + SVG assets now ship here via `@import "ab-nextjs-components/styles.css"` (import after `ab-nextjs-theme/styles.css`)
- **AbLogo:** comments corrected — mask fallback `--app-logo-url` is owned by this package’s chrome CSS, not the theme

## [0.1.7](https://github.com/abraham-ukachi/ab-nextjs-components/compare/e67e89dbeba6055e608d3fb1aa6aa2fb511ab6fc...bb3a452d8cd89d57d6a3951b2f640a58ecdeb775) (2026-10-05)

- **AbNavbar:** root `<nav>` sets `data-ab-part="bottomBar"` (client + server)

## [0.1.6](https://github.com/abraham-ukachi/ab-nextjs-components/compare/1ede72f33ca1e6910c793454098ad9889a303bb2...e67e89dbeba6055e608d3fb1aa6aa2fb511ab6fc) (2026-10-05)

- **AbSidebar:** renders `<nav data-ab-part="sidebar">` (was `<aside>`) so aside dialogs/menus never hit the sidebar
- **AbMenu:** sets `data-id={id}` (keeps `id`) and `data-id` / `menu-item` on items so `useAbMenu` can open it; cancel is `li[role=close-menu]`
- **AbLogo:** ships `ab-logo/ab-logo.svg` and defaults `src` to an inlined data URI of that asset; mask types without `src`/`mask` defer to `ab-nextjs-theme` `--app-logo-url`

## [0.1.5](https://github.com/abraham-ukachi/ab-nextjs-components/compare/fd3e776be781ea8ad0d7aa4d6ca56b31c0ae1a4a...1ede72f33ca1e6910c793454098ad9889a303bb2) (2026-10-03)

- Publish to npm automatically from GitHub Actions with Trusted Publishing (OIDC + provenance, no NPM_TOKEN)
- `next` peer is now `^16.3.4`; dev dependency on ab-nextjs-hooks comes from the registry

## [0.1.4](https://github.com/abraham-ukachi/ab-nextjs-components/compare/8fcbcaa9e4d5dd35e63d6c9b84cb682f5f04d1c8...fd3e776be781ea8ad0d7aa4d6ca56b31c0ae1a4a) (2026-09-23)

- Release from `main` after merge of PR #1 (Next 16.3.4 + Phase 1–5 ports).

* **Port (client):** AbBrand, AbName, AbNavbar, AbSidebar, AbText, AbTestHello, AbKeyFeature, AbMainHeadline, AbPreview, AbProduct, AbProductItem, AbSwitchBack, AbDemoBox, AbDemoCode
* **Port (server):** AbBrand, AbName, AbNavbar, AbSidebar, AbNavLink, AbText, AbTestHello, AbKeyFeature, AbSwitchBack
* Select/MenuItem skipped — empty on Projects (GitHub-only historically)
* Product/Preview adapted (Dexie/providers/i18n stripped); usable props API kept
* Catalog **51 Done** (36 client / 15 server).

### Phase 4 Port

* **Port:** AbSearchbar, AbSearchResult, AbPagePaginator, AbPageSwitcher, AbProgressChips, AbPrice, AbPriceTag
* **Adapt:** AbImage (Dexie / offline / background-removal stripped; next/image + optional fallback)
* **Port (server):** AbPolygon
* Catalog 28 Done (22 client / 6 server). Plain CSS modules.

### Phase 2 Adapt + Phase 3 Port

* **Adapt:** **AbBalloon** (`title=` locked) — Input now uses real AbBalloon
* **Port:** AbAvatar (client + server), AbBadge (server), AbTab, AbTabs, AbMenu, AbCollapsible, AbColor, AbInfo, AbLikeButton
* Plain CSS modules; LYD brand/nav/i18n stripped; Select/MenuItem skipped (not on Projects)

### Phase 2

* Ported **AbIcon** (client + server) — Material Symbols ligatures
* Ported **AbLogo** (client + server) — contained | outlined | hollow | naked; defaults from `ab-nextjs-icons` logos (`#a67c52`), optional `src` / `mask`
* Ported **AbButton** client from lyd-button; invented server (href → `<a>`, else submit/button; no onClick)
* Added minimal **AbIconButton** (Input dependency)
* Ported **AbInput** client — `useAbToggle` from `ab-nextjs-hooks/helpers/useAbToggle`; Balloon stub via `title=`; no console.logs
* Hard peers: next 16.3.4, react^19, clsx; soft optional peers: theme / icons / hooks / animations
* Plain CSS modules (no `@apply`); theme `data-*` attrs preserved on buttons

### Phase 1

* Next.js **16.3.4** / React 19 tooling scaffold + Pending catalog

## [0.1.3](https://github.com/abraham-ukachi/ab-nextjs-components/compare/9169fe98d2519db14aa68e2b00ebab83e5d88b59...8fcbcaa9e4d5dd35e63d6c9b84cb682f5f04d1c8) (2026-09-23)

* Staged Phase 5 publish ahead of the 0.1.4 release from main

## [0.1.2](https://github.com/abraham-ukachi/ab-nextjs-components/compare/7131423436c545ae706725da0801decdb12ef055...9169fe98d2519db14aa68e2b00ebab83e5d88b59) (2024-06-01)

* Stub package version bump

## [0.1.1](https://github.com/abraham-ukachi/ab-nextjs-components/compare/6d7c433915135e537aebcf1fea69b2d932bef075...7131423436c545ae706725da0801decdb12ef055) (2024-06-01)

* Version bump to 0.1.1

## 0.1.0 (2024-06-01)

* Initial release
