## 0.2.0 (Unreleased, proposed)

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
- ⚠️ Known limit: edge swipes don't open drawers in Chromium touch (`pointercancel` from the default `touch-action`; checked with Chromium 156 emulation). WebKit/iOS works. Keep a visible menu/TOC button.

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

* 🎯 **AbThemeToggle icon shows the target (John, 20:57):** `variant="icon"` + `appearance="thumb"` now shows the mode a click switches to (moon in light, sun in dark). New `iconShows?: 'current' | 'target'` (default `target` for thumb, `current` otherwise, so fill is unchanged) and `labels.switchTo` for names like "Switch to dark theme". Segmented toggles are unchanged.
* 🌿 **Sage chip AA (John):** the `tone="sage"` fallback text is now #566a58 (theme 0.3.5 value), ≥ 4.5:1 on the unchanged tint. Tested.
* ♿ **AA fallbacks and the sidebar badge (James):** `AbBreadcrumbs` and `AbList` now fall back to the AA faint #807062 (was the mock's #9c8c80). On the active `--tint` row, the `badgeVariant="text"` sidebar badge inherits `--accent-text`, because faint on tint is only 3.9:1. Tested.
* 🏠 **Home fidelity components (spec §5, approved by God 2026-10-20):**
  * `AbList` + `AbListItem` (P13): bordered row lists with a media tile or badge, title, meta and chevron. A row with `href` is a single link.
  * `AbBreadcrumbs` (P2): the tablet main bar crumb.
  * `AbVersionSwitcher` (P9): the sidebar "Docs **v0.2.x** ▾", which opens an AbMenu, with a no-JS `<details>` fallback.
  * `AbBottomDrawer`: the mobile bottom drawer (D40), which `AbLocaleSwitcher` / `AbAppBar` now use for `side="bottom"`. `AbDrawerList` gains `as`.
  * They read the `ab-nextjs-theme` 0.3.5 Home tokens (`--ab-color-card`, `--ab-color-faint`, …), with the light mock values as fallbacks.
* 🏠 **Home variants on existing components (Joseph's P4–P19; everything is opt-in, defaults unchanged):**
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
  * `AbBottomDrawer` (John): the sheet takes focus on open, the ✕ is 44px with an 8px hover tint and a `:focus-visible`-only ring, plus 16px + safe-area bottom padding and the 36×4 handle. It reads the theme 0.3.5 scrim, handle and sheet-edge tokens. `AbDrawer` gains `initialFocus`.
* 🎨 **Home tokens first:** borders, hovers, active rows and focus rings read `--ab-color-border` / `-hover` / `-tint` / `-accent-text` / `-accent` (theme 0.3.5) before the M3 tokens. On theme 0.3.5 the rings turn bronze and active rows turn `--tint`.
* 🗄️ **AbDrawer + `useAbDrawer` (new, G53, D38).** The drawer is scoped to `app`, `main` or `aside`. It renders into a layer inside that layout box and never scrolls the document. Sides are `top`, `bottom`, `left` and `right`, plus logical `start` and `end`.
  * Accessibility: `role="dialog"`, `aria-modal`, a labelled panel, a focus trap that restores focus to the opener, Escape and scrim close, and the rest of the scope is `inert`.
  * It uses the 240ms `ab-nextjs-animations` slide, which reduced motion turns off.
  * Without JS it renders as an in-flow `<section>` (D41).
* 📋 **`AbDrawerList` + `AbConfirmDrawer` presets (new, D38/D40).**
* 🌍 **`presentation="menu" | "drawer" | "auto"` (G56)** on `AbLocaleSwitcher` and on the `AbAppBar` More menu. The drawer is an app-scope bottom sheet, and `auto` uses it below 768px. The default stays `menu`.

## 0.1.13 — 2026-10-16

* 🔗 **`AbLinkProvider` (new, `ab-nextjs-components/ab-link`)**: every component link now renders through `AbLink`, so an app can inject a locale-aware `Link` once. `useAbLink`, `AbLink`, `AbLinkComponent` and `AbLinkProps` are exported. It's the only `next/link` import (test-guarded)
* 🔣 **AbIcon (G2): SVG first, non-breaking fallback.** Registered / explicit / built-in names render AbIcons SVGs. An unregistered name still renders the Material Symbols ligature (`data-ab-icon-fallback="font"`, as before) and warns once in development, so nothing goes blank in a patch; register every name before the app drops the font. **`AbIconRegistrar`** (`ab-nextjs-components/ab-icon/registrar`) is the server-safe way to register icons from a Server Component layout. 7 more built-ins: `chevron_left`, `chevron_right`, `menu`, `more_vert`, `search`, `close`, `expand_more`. AbMenu icons are AbIcons now (filled when selected)
* 🧭 **AbSidebar v2 (G40)**: sections, `activeHref`, filled active icon, `aria-current`, badges, one child level, a 72px rail with balloon tooltips, and a collapse button (`aria-expanded`, `aria-controls`, hidden without JS). Client and server twins share `ab-sidebar/view`. Legacy `links` / `page` / `brandLabel` still work
* 📱 **AbNavbar v2 (G41)**: link and button items, filled active icon, `aria-current`, safe-area padding. The server twin takes link items only
* 🧱 **AbAppBar (new, G43)**: brand, search, nav, actions, sticky with a hairline, and a "More" overflow `AbMenu` below 1180px (Escape and outside click close it, focus goes back to the trigger). The nav stays inline without JS
* 🔎 **AbSearchTrigger + AbKbd (new, G44)**: an `href` always renders a real `<a>` (works without JS, D24a: `/docs`); with `onOpen` too, JS intercepts plain clicks and opens the dialog. The ⌘K / Ctrl K hint and `aria-keyshortcuts` appear only while a hotkey is listening. `shortcut` (alias of `hotkey`), `compact` (icon-only, label for screen readers), `comingSoon` with `aria-disabled`. The hotkey is a local listener because `useAbHotkey` (G48) is not in hooks 0.1.7
* 🃏 **AbCard + AbPackageCard (new, G45)**: one link per card, `ab-motion-interactive` timing, a 2px hover lift on laptop and up with a real pointer, and no lift under reduced motion
* 📑 **AbToc (new, G46)**: plain `#id` anchors, `aria-current="location"`, and an optional `onNavigate` (for `scrollToAbSection`)
* 📜 **Panes scrolling (D35/G55):** with core 0.1.6 the page never scrolls, the main pane does. `getAbMainScroller()` / `AB_MAIN_SCROLLER_SELECTOR` (`[data-ab-part="main-content"]`) from `ab-nextjs-components/ab-toc` give the `root` for `useAbScrollSpy` (call it in an effect or handler, never during render; `import { getAbMainScroller } from 'ab-nextjs-components/ab-toc'`, also on the root barrel with `AbToc`) and the `container` for `scrollToAbSection`; a plain `#id` jump scrolls the pane on its own. In panes the AbAppBar is the header row outside the scroller, so it stays put without the document scrolling
* 🌍 **AbAppBar active link (Joseph):** without `activeHref` it uses the pathname minus the AbLinkProvider `locales` (or its own `locales` prop), like AbSidebar / AbNavbar, so `/fr/docs` marks Docs
* 🧩 **AbPackageCard names wrap at hyphens (Joseph):** a `<wbr>` after each `-` (`toAbPackageNameParts`), so narrow cards show `ab-nextjs-` / `components` on two lines instead of an ellipsis; `overflow-wrap: anywhere` splits a part only when it alone is wider than the card. Checked in WebKit at 1280 (no clipping, no overflow)
* 🔑 **AbSidebar item `id`:** optional, used as the React key (`id ?? href`) so two items may share an href
* 🆔 **AbIcon per-instance ids (Joseph):** every render suffixes the SVG ids and `url(#…)` refs with `useId()` (`scopeAbIconIds`), so two filled Homes never share a mask and a hidden twin can't turn the active Home into a solid square
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

## 0.1.12 — 2026-10-16

* ♿ **AbInstallSnippet tabs pass AA in every state.** Each state now paints an explicit text/background pair from the live palette instead of a transparent tab and a 12% bronze tint: inactive `on-surface-variant` on `surface-container` (8.04:1 light / 9.67:1 dark), hover `on-surface` on an 8% `on-surface` state layer (12.63:1 / 10.39:1), active and active + hover `on-primary-container` on `primary-container` (13.28:1 / 7.22:1). Fallbacks are the light bronze palette, so it also passes without the theme
* 🥉 **New `AbButton type="filled"`** (client + server): solid bronze `--md-sys-color-primary` with `on-primary` label and icon. Sets `data-type="filled"`, styled with hover / focus / disabled by `ab-nextjs-theme@^0.3.3`; a `.isFilled` fallback paints the rest state on older themes. `AbButtonType` gains `'filled'`
* ⬆️ **`ab-nextjs-theme ^0.3.3`** (peer + dev, was `^0.3.1`) for the filled hover / focus / disabled states and the button icon-colour fix. The `.isFilled` fallback stays for apps still on an older theme
* Tests: contrast computed from the theme palette (light + dark, every state, plus the no-theme fallbacks); filled type on client + server twins. Checked in WebKit (ratios above; filled 6.47:1 light / 7.74:1 dark)

## 0.1.11 — 2026-10-15

* 🐛 **AbFlowDiagram: nodes no longer cover the header in small boxes.** At 390px wide the Live Playground's top node ("core") sat under the "Live Playground" header. With a header (title, live dot or caption) the root now gets `data-ab-header="true"`, and nodes + wires live in a stage that starts below the header band: `--ab-flow-diagram-inset-top` (default `2.75rem`, tunable). Node `x` / `y` stay 0–100 but now map onto that stage, and the wires share the same box so they still meet the nodes. Without a header the stage is the full card (unchanged)
* 📏 **AbFlowDiagram nodes scale with the card:** `container-type: inline-size` on the root; node text, padding, radius and the hub glow use clamped `cqi` sizes (13px on a 760px card, 11px at 390px)
* 🪐 **AbFlowDiagram: side nodes are never clipped** (Joseph: s04's `--ab-color-bronze` and s07's `reduced motion` were cut off at the card edge in a 390px box). The orbit now scales with the box. Each node is anchored at the same fraction of its own box as its position (`translate(-x%, -y%)` via `--ab-flow-node-x` / `-y`; `x = y = 50` is the old centring), so the outer ring pulls in by exactly the node's width, and the wire end stays inside the pill. Nodes + wires also sit inside a side margin, `--ab-flow-diagram-inset-x` (default `0.5rem`), and an over-long label ellipsises (`max-width: 100%`). Positions are clamped to 0–100 like the wires
* Tests: header flag, stage insets shared by nodes + wires, 390px geometry, clamped scaling, proportional anchoring + side margin, s04 / s07 orbit geometry at 390 / 760px × 276 / 380px. Checked in WebKit at 390px: "core" top 9px → 53px (header ends at 33px); no node overlaps the header or is clipped at 390 / 760px. After the orbit fix: s04 + s07 have no node clipped (x or y) or over the header at 390 / 760px wide × 276px / 380px / default-ratio heights (before: 5 nodes clipped at 390px, 2 at 760px)

## 0.1.10 — 2026-10-14

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
* **AbCarousel:** prev / next arrows now render through AbIcon (weight 300); `--ab-carousel-icon-stroke` removed (unreleased)
* **AbFlowDiagram (G38, new, server component):** `figure role="img"` scenes, CSS-only draw + pulse, paused while inactive, 3 loops on mobile, reduced motion shows the poster frame; `getAbFlowEdgePath` helper
* Dev: `happy-dom` + `@testing-library/react` for DOM tests

## 0.1.9 — 2026-10-14

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

## 0.1.8 — 2026-10-05

- **Chrome styles:** dialog, toast, logo (`span.app-logo`), spinner, and empty-state doodle CSS + SVG assets now ship here via `@import "ab-nextjs-components/styles.css"` (import after `ab-nextjs-theme/styles.css`)
- **AbLogo:** comments corrected — mask fallback `--app-logo-url` is owned by this package’s chrome CSS, not the theme

## 0.1.7 — 2026-10-05

- **AbNavbar:** root `<nav>` sets `data-ab-part="bottomBar"` (client + server)

## 0.1.6 — 2026-10-05

- **AbSidebar:** renders `<nav data-ab-part="sidebar">` (was `<aside>`) so aside dialogs/menus never hit the sidebar
- **AbMenu:** sets `data-id={id}` (keeps `id`) and `data-id` / `menu-item` on items so `useAbMenu` can open it; cancel is `li[role=close-menu]`
- **AbLogo:** ships `ab-logo/ab-logo.svg` and defaults `src` to an inlined data URI of that asset; mask types without `src`/`mask` defer to `ab-nextjs-theme` `--app-logo-url`

## 0.1.5 — 2026-10-03

- Publish to npm automatically from GitHub Actions with Trusted Publishing (OIDC + provenance, no NPM_TOKEN)
- `next` peer is now `^16.3.4`; dev dependency on ab-nextjs-hooks comes from the registry

### Unreleased (chore/upgrade-next-16 — Skip-override / Phase 5 components)

## 0.1.4 — 2026-09-23

- Release from `main` after merge of PR #1 (Next 16.3.4 + Phase 1–5 ports).


* **Port (client):** AbBrand, AbName, AbNavbar, AbSidebar, AbText, AbTestHello, AbKeyFeature, AbMainHeadline, AbPreview, AbProduct, AbProductItem, AbSwitchBack, AbDemoBox, AbDemoCode
* **Port (server):** AbBrand, AbName, AbNavbar, AbSidebar, AbNavLink, AbText, AbTestHello, AbKeyFeature, AbSwitchBack
* Select/MenuItem skipped — empty on Projects (GitHub-only historically)
* Product/Preview adapted (Dexie/providers/i18n stripped); usable props API kept
* Catalog **51 Done** (36 client / 15 server). Local only — no push.

# Changelog

### Unreleased (chore/upgrade-next-16 — Phase 4 Port)

* **Port:** AbSearchbar, AbSearchResult, AbPagePaginator, AbPageSwitcher, AbProgressChips, AbPrice, AbPriceTag
* **Adapt:** AbImage (Dexie / offline / background-removal stripped; next/image + optional fallback)
* **Port (server):** AbPolygon
* Catalog 28 Done (22 client / 6 server). Plain CSS modules. Local only — no push.

### Unreleased (chore/upgrade-next-16 — Phase 2 Adapt + Phase 3 Port)

* **Adapt:** **AbBalloon** (`title=` locked) — Input now uses real AbBalloon
* **Port:** AbAvatar (client + server), AbBadge (server), AbTab, AbTabs, AbMenu, AbCollapsible, AbColor, AbInfo, AbLikeButton
* Plain CSS modules; LYD brand/nav/i18n stripped; Select/MenuItem skipped (not on Projects)

### Unreleased (chore/upgrade-next-16 — Phase 2)

* Ported **AbIcon** (client + server) — Material Symbols ligatures
* Ported **AbLogo** (client + server) — contained | outlined | hollow | naked; defaults from `ab-nextjs-icons` logos (`#a67c52`), optional `src` / `mask`
* Ported **AbButton** client from lyd-button; invented server (href → `<a>`, else submit/button; no onClick)
* Added minimal **AbIconButton** (Input dependency)
* Ported **AbInput** client — `useAbToggle` from `ab-nextjs-hooks/helpers/useAbToggle`; Balloon stub via `title=`; no console.logs
* Hard peers: next 16.3.4, react^19, clsx; soft optional peers: theme / icons / hooks / animations
* Plain CSS modules (no `@apply`); theme `data-*` attrs preserved on buttons

### Unreleased (Phase 1)

* Next.js **16.3.4** / React 19 tooling scaffold + Pending catalog

### 0.1.2

* Stub package version bump
