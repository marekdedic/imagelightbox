# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Commands

- `npm start` — Vite dev server for the docs/demo page (`src/index.html`) at http://127.0.0.1:5173
- `npm run build` — builds docs (`docs/`) in parallel with the library bundles and type declarations (`dist/`)
- `npm run lint` — everything: eslint (JS/TS/JSON/MD/CSS), stylelint, `tsc --noEmit`, `attw --pack`
- `npm test` — Playwright (chromium, firefox, webkit) with nyc/istanbul coverage; auto-starts the dev server
- `npm run playwright-interactive` — Playwright UI mode
- Single test: `npx playwright test tests/history.spec.ts --project=chromium -g "test name"`

Codecov expects ~95% project coverage and 90% patch coverage, so new code needs tests.

## Architecture

Vanilla-TS lightbox with two published entry points built from one core:

- `src/lib/imagelightbox.ts` — the public `ImageLightbox` class. A thin facade: it fills in default options, creates exactly one `State` (its set name is taken from the first anchor's `data-imagelightbox`), and forwards every call to it.
- `src/lib/State.ts` — the heart of the library. One instance per gallery set; owns `targetImages`, `currentImage` (index or `null` when closed), the current `ImageView`, and the `VideoCache`. It orchestrates the transition lifecycle documented in the comment block inside the file (remove old image → start loading → add to DOM invisible → transition in), and drives every optional UI piece by option flag.
- `src/lib/ImageView.ts` — one displayed image/video: creates the element, handles load/error, swipe and click handlers, and its own in/out transitions. `PreloadedVideo.ts` / `VideoCache.ts` back the video path.
- The decoration modules (`arrows`, `close-button`, `fullscreen-button`, `navigation`, `caption`, `activity-indicator`, `container`, `keyboard-navigation`, `history`) are **module-level singletons with `addXToDOM` / `removeXFromDOM` functions**, not per-instance objects. They are shared across all galleries on the page, so they may only be mutated while their gallery is the open one (see the note in `State.addImages`).
- `src/lib/container.ts` — the container is a single `<dialog>` created at import time and shown with `showModal()`. Its `cancel` event is suppressed so Escape is handled by the lightbox's own keyboard navigation rather than the browser. Because the dialog is modal, the page behind it is inert — tests use `clickThroughModal` in `tests/helpers.ts` to drive app buttons while it is open.
- `src/lib/imagelightbox.jquery.ts` — thin legacy adapter mapping the core onto `$.fn.imageLightbox` and re-emitting the `ilb:*` events as jQuery events. Behaviour changes belong in the core, not here.
- Events (`ilb:start`, `ilb:quit`, `ilb:loaded`, `ilb:previous`, `ilb:next`, `ilb:error`) are plain bubbling DOM events dispatched from the container or the anchor.
- CSS lives next to the module that injects it (`arrows.css` beside `arrows.ts`) and is imported from the TS; `src/lib/css.d.ts` declares `*.css` (it must stay inside `src/lib`, the `entryRoot` of the declaration build).
- Public types are **generated** into `dist/` by `unplugin-dts` (api-extractor rollup), so adding an option means editing `src/lib/interfaces/ILBOptions.ts` and the README option table — nothing else. `ILBOptions` is an ordinary exported interface, re-exported from `src/lib/imagelightbox.ts`. The `.d.cts` variants are plain copies made by `build:lib:cjs-types`.
- Genuine global augmentations (`Document` for the `ilb:error` overload, `JQuery` for the jQuery methods) live in `declare global` blocks **inside their entry module** — api-extractor only carries an ambient block into the rollup if it is in the entry file itself.

### Builds

Three separate Vite configs, all with `root: "src"`: `native.vite.config.ts` and `jquery.vite.config.ts` produce the ESM + UMD library bundles in `dist/` (jQuery external), `docs.vite.config.ts` builds the demo page into `docs/` and adds `vite-plugin-istanbul` so Playwright can collect coverage.

Both lib configs also run `unplugin-dts`, which makes their ordering load-bearing — `build:lib` uses `run-s`, not `run-p`:

- The jQuery build runs **first**. Its declaration pass emits `imagelightbox.d.ts` as an intermediate and then deletes it, which would wipe the native build's finished output if the native build ran earlier or concurrently. `build:lib:jquery` renames its own rollup afterwards, because the plugin takes the type-entry filename from the top-level `"types"` field (which has to keep pointing at the native entry so node10 resolution works).
- The native config needs `exclude: ["src/lib/imagelightbox.jquery.ts"]`, otherwise the `JQuery` augmentation leaks into the native rollup and non-jQuery consumers fail with `TS2315: Type 'JQuery' is not generic`.

`npm run lint`'s `attw --pack` covers all of this: it resolves both entry points under node10, node16 (CJS and ESM) and bundler, so a broken declaration or a stale `types`/`style` pointer fails the lint job.

Only `dist/`, `jquery/` and the README ship to npm — `docs/` is built for GitHub Pages but excluded from `files`, since the demo images and video are several megabytes.

### Tests

Playwright drives the real demo pages, not a unit harness. Two pages: `src/index.html` (+ `src/index.ts`) is the public demo; `src/fixtures.html` (+ `src/fixtures.ts`) holds galleries that only exist for tests, so keep test-only setup out of the docs page. Both check a global `TEST` flag and set `animationSpeed: 0`; specs inject it via `page.addInitScript({ path: "tests/init.ts" })` in `beforeEach`. Use the `tests/helpers.ts` helpers (`expectImage`, `currentImage` — `#ilb-image` briefly matches two elements mid-transition — `settle`, `clickThroughModal`) instead of re-deriving those workarounds.

## Conventions

The eslint config is unusually strict (`strictTypeChecked`, `perfectionist` sorting, `strict-boolean-expressions`, explicit return types and member accessibility, `typedef`). Notable consequences: arrow functions are preferred except for named functions, `Array<T>` generic syntax over `T[]`, index-signature access uses brackets (`dataset["ilb2Srcset"]`), every `eslint-disable` needs a `-- description`, and comments must be capitalized. State-holding modules use the factory-function-returning-interface pattern (`export interface State` + `export function State(...)`) rather than classes.
