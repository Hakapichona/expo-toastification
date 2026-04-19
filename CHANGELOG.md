# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.0.8] — Major revamp (since v1.1.0)

### ⚠️ Breaking

- **`fontSize` and `textColor` options removed** from `ToastOptions` and `configureToasts`. Migrate to:
  ```diff
  - toast.success("Saved", { fontSize: 16, textColor: "#fff" });
  + toast.success("Saved", {
  +   titleStyle: { fontSize: 16, color: "#fff" },
  + });
  ```
  Same for global config:
  ```diff
  - configureToasts({ fontSize: 16, textColor: "#111" });
  + configureToasts({
  +   titleStyle: { fontSize: 16, color: "#111" },
  + });
  ```

- **New required peer dep: `react-native-svg`** (icons now render as SVG). Install with:
  ```bash
  npx expo install react-native-svg
  ```

- **Visual redesign.** Variants now use pastel backgrounds with dark text and SVG icons, instead of solid-colored flat rows. Override via `backgroundColor`, `titleStyle.color`, `icon`, `noIcon` if you want the v1 look back.

- `toast(...)` and variants now return `string` (the toast id) instead of `void`. No runtime effect on existing calls; only matters if you had explicit `: void` annotations.

- Internal type `ToastInternal.message` renamed to `ToastInternal.title`. Only affects code that imported this internal type (uncommon).

### 🧹 Non-breaking removals

- `uuid` and `react-native-get-random-values` are **no longer peer deps**. IDs are now generated with a tiny built-in counter. You can remove these from your `package.json` if nothing else in your app depends on them.

### ✨ Added

- **Title + description** — optional secondary line via `description`, styled independently via `descriptionStyle`.
- **Icon control** — pass any `ReactNode` via `icon`, hide with `noIcon`, or use the built-in SVG per variant.
- **Translucent background** — `transparent: true` renders the toast with ~75% alpha over the variant hue.
- **Background override** — `backgroundColor` both per-toast and globally.
- **Dark mode** — reactive via `useColorScheme()`. Configure with `colorScheme: "auto" | "light" | "dark"`. Both light and dark palettes shipped out of the box.
- **Interaction** — tap-to-dismiss and horizontal swipe-to-dismiss enabled by default. Control via `dismissible` (per-toast or global) and `swipeThreshold` (global, px).
- **Lifecycle callbacks** — `onShow`, `onPress`, `onDismiss(reason)` where `reason` is `"timeout" | "user" | "programmatic"`.
- **Programmatic `dismiss(id)`** — now with animated exit (previously popped out instantly).
- **`toast.update(id, updates)`** — partial update of an existing toast. Returns `boolean`.
- **`toast.promise(promise, messages)`** — shows a loading toast, swaps to success/error when the promise settles. Returns the original promise.
- **`toast.scope(name)`** — scoped helper API (`toast.scope("modal").success(...)`).
- **`toast.custom(title, options)`** — same as `toast(...)` but `options` is required (for explicit-customization call sites).
- **Scoped providers** — `<ToastProvider scope="modal">...</ToastProvider>`. Toasts are routed to the host whose scope matches their `scope` option. Defaults to `"default"` on both sides.
- **Custom renderer** — `render: (ctx) => ReactNode` replaces the built-in layout while keeping positioning, animation, tap and swipe.
- **Configurable entry direction** — `entryDirection: "top" | "bottom" | "left" | "right" | "vertical" | "vertical-right" | "vertical-left"`. Default `"right"` matches the v1 behavior.
- **`maxToasts`** exposed via `configureToasts` (was hardcoded to 3).
- **Accessibility** — auto `accessibilityRole="alert"` for error/warning, `accessibilityLiveRegion` on Android, `AccessibilityInfo.announceForAccessibility` on iOS when a screen reader is active. Override per toast via `accessibilityLabel`.
- **Type exports** — `VARIANT_THEMES`, `SuccessIcon`, `ErrorIcon`, `InfoIcon`, `WarningIcon`, and all public types (`ToastOptions`, `ToastVariant`, `ToastPosition`, `ToastDismissReason`, `ToastEntryDirection`, `ToastColorScheme`, `ToastTextStyle`, `ToastPromiseMessages`, `ToastUpdatePayload`, `ToastProviderProps`, `ToastUserConfig`).
- **Input validation** — invalid `duration`, `enterDuration`, `exitDuration`, `maxToasts`, `colorScheme`, `dismissible`, `entryDirection`, or empty titles emit a `console.warn` and fall back to a sensible default instead of silently breaking.

### 🔧 Fixes & performance

- `toast.dismiss(id)` now plays the exit animation before removing the toast (was instant).
- `useWindowDimensions()` replaces a cached `Dimensions.get()` — reacts to rotation and split-screen.
- `ToastItem` wrapped in `React.memo` — non-updated toasts don't re-render when the queue changes.
- `LayoutAnimation` enabled automatically on Android for smooth stack reflow when toasts appear / leave.
- Stable handlers inside `ToastItem` via `stateRef` pattern — no more animation resets on host re-render.

### 📦 Infrastructure

- Bundle: **~7 KB gzipped** (ESM), zero runtime dependencies.
- Peer deps reduced to 5: `expo`, `react`, `react-native`, `react-native-safe-area-context`, `react-native-svg`.
- No native code of its own — works in Expo Go and EAS Build with no extra setup.

---

## [1.1.0] — Previous stable

First public release on npm.
