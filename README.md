# 🍞 expo-toastification

[![npm version](https://img.shields.io/npm/v/expo-toastification.svg)](https://www.npmjs.com/package/expo-toastification)
[![license](https://img.shields.io/npm/l/expo-toastification.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Hakapichona%2Fexpo--toastification-181717?logo=github)](https://github.com/Hakapichona/expo-toastification)

A simple, elegant and lightweight toast notification library for **Expo** and **React Native**, built with a modern TypeScript API.

- 🎨 Pastel palette + SVG icons per variant (`success` / `error` / `info` / `warning`)
- 🌗 Reactive light / dark mode (follows `useColorScheme()` or force manually)
- 🧩 Title + optional description with independently styleable text
- 🖼️ Custom icons (any `ReactNode`), `noIcon`, or translucent background
- 👆 Tap-to-dismiss, swipe-to-dismiss + lifecycle callbacks (`onShow` / `onPress` / `onDismiss`)
- 🔄 `toast.update(id, ...)`, `toast.promise(p, ...)` and `toast.dismiss(id)` — animated exit included
- 🪟 Named scopes via `<ToastProvider scope="modal" />` — isolate toasts per surface
- 🧰 Full custom renderer (`render: (ctx) => ReactNode`) with built-in gestures preserved
- ⚙️ Global defaults + per-toast overrides, deep-merged by field
- 🪶 **~7 KB gzipped**, zero runtime deps, **no native code of its own**
- 📱 Works on **iOS, Android, Expo Go and EAS Build** out of the box
- ✅ 100 % TypeScript, fully typed public API

> Inspired by the DX of `vue-toastification`, rebuilt from scratch for React Native.

---

## 📦 Installation

Install the package:

```bash
pnpm add expo-toastification
# or
npm install expo-toastification
# or
yarn add expo-toastification
```

Then install the peer dependencies (skip the ones you already have):

```bash
npx expo install react-native-safe-area-context react-native-svg
```

### Requirements

| Dep                              | Minimum version |
| -------------------------------- | --------------- |
| Expo SDK                         | ≥ 49            |
| React                            | ≥ 18            |
| React Native                     | ≥ 0.71          |
| `react-native-safe-area-context` | any             |
| `react-native-svg`               | any             |
| iOS                              | 13.0            |
| Android                          | 6.0 (API 23)    |

---

## 🚀 Quick start

Wrap your app with `<ToastProvider>` and (optionally) set global defaults with `configureToasts`.

### Expo Router

```tsx
// app/_layout.tsx
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { ToastProvider, configureToasts } from "expo-toastification";

configureToasts({
  duration: 3500,
  position: "top",
  maxToasts: 3,
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <Slot />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
```

### Classic React Native / Expo

```tsx
// App.tsx
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "expo-toastification";

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        {/* your app */}
      </ToastProvider>
    </SafeAreaProvider>
  );
}
```

Now you can call `toast(...)` from anywhere:

```tsx
import { toast } from "expo-toastification";

toast.success("Saved successfully");
```

---

## 📖 API overview

| Method                           | Returns   | Description                                                     |
| -------------------------------- | --------- | --------------------------------------------------------------- |
| `toast(title, options?)`         | `string`  | Default variant.                                                |
| `toast.success(title, options?)` | `string`  | Green variant with check icon.                                  |
| `toast.error(title, options?)`   | `string`  | Red variant with X icon.                                        |
| `toast.info(title, options?)`    | `string`  | Purple variant with check icon.                                 |
| `toast.warning(title, options?)` | `string`  | Amber variant with `!` icon.                                    |
| `toast.custom(title, options)`   | `string`  | `options` is **required** — signals explicit customization.     |
| `toast.dismiss(id)`              | `void`    | Animated dismiss of a toast by id.                              |
| `toast.update(id, updates)`      | `boolean` | Partially updates an existing toast. `true` if found.           |
| `toast.promise(p, messages)`     | `Promise` | Shows loading → success/error when the promise settles.         |
| `toast.scope(name)`              | `ScopedToast` | Returns a scoped toast helper (`toast.scope("modal").success(...)`). |
| `configureToasts(config)`        | `void`    | Sets global defaults (deep-merged over variant theme).          |

> ⚠️ **Every toast creator returns the toast id** (`string`) — `toast(...)`, `toast.success`, `toast.error`, `toast.info`, `toast.warning` and `toast.custom`. Capture it if you want to dismiss the toast programmatically via `toast.dismiss(id)`.

---

## 🎯 Usage recipes

### 1. Basic call (title only)

```tsx
toast("Hello world!");
toast.success("Saved successfully");
toast.error("Something went wrong");
toast.info("New update available");
toast.warning("Be careful!");
```

### 2. Title + description

Description is optional — if omitted, only the title is rendered.

```tsx
toast.success("Reminder scheduled", {
  description: "Your reminder was scheduled successfully.",
});

toast.error("Oops!", {
  description:
    "Not enough funds on this card to complete the transaction.",
});
```

### 3. Style overrides

`titleStyle` and `descriptionStyle` are **merged on top** of the variant defaults — you only set what you want to change.

```tsx
toast.info("Profile updated", {
  description: "Your changes have been saved.",
  titleStyle: { fontSize: 16, fontWeight: "800" },
  descriptionStyle: { fontSize: 13, color: "#3F276F" },
  backgroundColor: "#E0D6F8",
});
```

### 4. Custom icon

Any `ReactNode` works — an SVG, a `lucide-react-native` component, an `<Image />`, an emoji in `<Text>`…

```tsx
import Svg, { Path } from "react-native-svg";

function HeartIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10h-4z" fill="#EC4899" />
    </Svg>
  );
}

toast("Love you", {
  icon: <HeartIcon />,
  backgroundColor: "#FCE7F3",
  titleStyle: { color: "#831843" },
});
```

### 5. No icon

```tsx
toast.error("Something went wrong. Try again.", { noIcon: true });
```

### 6. Translucent background

```tsx
// Uses the variant theme color at 75% alpha.
toast.info("Subtle notice", { transparent: true });

// Custom hue, still translucent.
toast("Floating", {
  transparent: true,
  backgroundColor: "#0F172A",
});
```

### 7. Position / duration overrides

```tsx
toast.info("I'm at the bottom", { position: "bottom" });
toast.warning("A longer-lasting toast", { duration: 8000 });
```

### 8. Programmatic dismiss

`toast()` and its variants return the id of the created toast.

```tsx
const id = toast.info("Syncing…", { duration: 10000 });

await syncWithServer();
toast.dismiss(id);
toast.success("Synced");
```

### 9. Partial update

```tsx
const id = toast("Uploading…", { duration: 0 }); // 0 = never auto-dismiss

onProgress(50);
toast.update(id, { description: "50%" });

onProgress(100);
toast.update(id, {
  title: "Done",
  description: "Upload complete",
  variant: "success",
  duration: 3000,
});
```

### 10. Promise helper

Shows a loading toast immediately, swaps it to success / error when the promise settles.

```tsx
await toast.promise(
  fetch("/api/save").then((r) => r.json()),
  {
    loading: "Saving…",
    success: (data) => `Saved item #${data.id}`,
    error: (err) => ({
      title: "Couldn't save",
      description: (err as Error).message,
    }),
  }
);
```

`toast.promise` returns the **original** promise — use it with `await` or `.then` as you would without the toast.

### 11. Interaction (tap, swipe, callbacks)

Every toast is tap-to-dismiss and swipe-to-dismiss by default. All three lifecycle callbacks are optional:

```tsx
toast.success("Uploaded", {
  description: "Tap to view details.",
  onShow: () => console.log("toast visible"),
  onPress: () => router.push("/upload/12"),  // fires on tap
  onDismiss: (reason) => console.log("dismissed:", reason), // "timeout" | "user" | "programmatic"
});

// Disable interaction (auto-dismiss still works):
toast("Persistent notice", { dismissible: false });
```

Swipe horizontally past `swipeThreshold` (default 80px) to dismiss. Configure globally:

```tsx
configureToasts({ dismissible: true, swipeThreshold: 120 });
```

### 12. Custom renderer

Pass a `render` function to replace the built-in layout entirely. The library still handles positioning, animation, tap and swipe.

```tsx
toast("Upload complete", {
  render: ({ toast, dismiss }) => (
    <View style={{ flexDirection: "row", padding: 16, backgroundColor: "#0F172A", borderRadius: 12 }}>
      <Text style={{ color: "#F8FAFC", flex: 1 }}>{toast.title}</Text>
      <Pressable onPress={dismiss}>
        <Text style={{ color: "#60A5FA" }}>Dismiss</Text>
      </Pressable>
    </View>
  ),
});
```

### 13. Scopes (multiple hosts)

Isolate toasts to a specific surface (e.g. inside a modal) with named scopes:

```tsx
// App root
<ToastProvider>{/* default scope */}</ToastProvider>

// Modal
<ToastProvider scope="modal">
  <MyModalContent />
</ToastProvider>

// Publish into the modal scope
toast.scope("modal").success("Saved inside the modal");

// Or explicitly per call:
toast.success("...", { scope: "modal" });
```

### 14. `toast.custom` — options required

Same semantics as `toast(...)` but `options` is mandatory. Every field inside remains optional. Useful when you want a forgotten options object to surface as a TypeScript error rather than a silent fallback to defaults.

```tsx
toast.custom("Brand message", {
  description: "Fully custom.",
  backgroundColor: "#0F172A",
  titleStyle: { color: "#F8FAFC" },
  descriptionStyle: { color: "#CBD5E1" },
  icon: <MyIcon />,
  duration: 4000,
});

toast.custom("Nope"); // ❌ TS error: Expected 2 arguments, got 1
```

---

## ⚙️ Options reference

Every field on `ToastOptions` is optional unless noted.

| Field              | Type                                      | Default (from variant)          | Description                                                                 |
| ------------------ | ----------------------------------------- | ------------------------------- | --------------------------------------------------------------------------- |
| `variant`          | `"default" \| "success" \| "error" \| "info" \| "warning"` | `"default"`                     | Picks the built-in theme + icon.                                            |
| `position`         | `"top" \| "bottom"`                       | `"top"`                         | Where the toast appears.                                                    |
| `duration`         | `number` (ms)                             | `3000`                          | How long it stays on screen.                                                |
| `description`      | `string`                                  | —                               | Optional secondary line under the title.                                    |
| `icon`             | `ReactNode`                               | variant icon                    | Overrides the built-in icon.                                                |
| `noIcon`           | `boolean`                                 | `false`                         | Hides the icon entirely. Takes precedence over `icon`.                      |
| `titleStyle`       | `ToastTextStyle`                          | variant title style             | Merged over variant + global defaults.                                      |
| `descriptionStyle` | `ToastTextStyle`                          | variant description style       | Merged over variant + global defaults.                                      |
| `backgroundColor`  | `string`                                  | variant background              | Hex / rgba / any RN-valid color.                                            |
| `enterDuration`    | `number` (ms)                             | `250`                           | Enter animation duration.                                                   |
| `exitDuration`     | `number` (ms)                             | `200`                           | Exit animation duration.                                                    |
| `accessibilityLabel` | `string`                                | auto from title + description   | Overrides the announcement sent to screen readers.                          |
| `transparent`      | `boolean`                                 | `false`                         | Renders the background translucent (alpha ≈ 0.75) while keeping the hue.    |
| `dismissible`      | `boolean`                                 | `true`                          | If false, disables tap and swipe-to-dismiss.                                |
| `scope`            | `string`                                  | `"default"`                     | Route the toast to a specific `<ToastProvider scope="..." />`.              |
| `onShow`           | `() => void`                              | —                               | Fires after the enter animation completes.                                  |
| `onPress`          | `() => void`                              | —                               | Fires on tap. Dismiss still happens if `dismissible` is true.               |
| `onDismiss`        | `(reason) => void`                        | —                               | Fires after exit animation. `reason`: `"timeout" \| "user" \| "programmatic"`. |
| `render`           | `(ctx) => ReactNode`                      | —                               | Custom renderer — replaces the built-in layout.                             |

> 💡 `duration: 0` means **no auto-dismiss** — the toast stays until you call `toast.dismiss(id)`, tap it or swipe it. Used internally by `toast.promise(...)`.

`ToastTextStyle` is a subset of `TextStyle`:

```ts
type ToastTextStyle = {
  fontSize?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  fontFamily?: string;
  letterSpacing?: number;
  lineHeight?: number;
};
```

### Precedence (low → high)

```
variant theme  <  configureToasts(...)  <  options passed to toast(...)
```

Example: `configureToasts({ titleStyle: { fontFamily: "Inter" } })` + `toast.success("x", { titleStyle: { fontSize: 18 } })` produces a title with the **success** color, `fontFamily: "Inter"` and `fontSize: 18`.

---

## 🔧 Global configuration

Call `configureToasts` once at app init. Every field is optional.

```tsx
configureToasts({
  duration: 3000,
  position: "top",
  maxToasts: 3,

  enterDuration: 300,
  exitDuration: 200,

  titleStyle: { fontFamily: "Inter-Bold" },
  descriptionStyle: { fontFamily: "Inter" },

  backgroundColor: null, // set to override every variant

  // "auto" (default) follows the system via useColorScheme.
  // "light" / "dark" force a palette regardless of the OS.
  colorScheme: "auto",

  dismissible: true,        // tap + swipe enabled by default
  swipeThreshold: 80,       // px of horizontal drag required to dismiss

  // Direction the toast slides in from on enter.
  // "top" | "bottom" | "left" | "right" (default) | "vertical"
  // | "vertical-right" | "vertical-left"
  entryDirection: "right",
});
```

---

## 🎨 Built-in variant palette

Ships with both a light and a dark palette. Switching between them is reactive — `useColorScheme()` is read at render time, so toggling the OS dark mode updates live toasts without extra work.

**Light**

| Variant   | Background | Title color | Icon color |
| --------- | ---------- | ----------- | ---------- |
| `default` | `#EDEEF0`  | `#1C1F24`   | —          |
| `success` | `#D1F2CF`  | `#0F3D2E`   | `#70D15C`  |
| `error`   | `#F7D1D1`  | `#7A1C1C`   | `#DD201D`  |
| `info`    | `#E0D6F8`  | `#2B1858`   | `#6D4AFF`  |
| `warning` | `#FCEBB8`  | `#6B3F07`   | `#D97706`  |

**Dark**

| Variant   | Background | Title color | Icon color |
| --------- | ---------- | ----------- | ---------- |
| `default` | `#1F2228`  | `#E5E7EB`   | —          |
| `success` | `#14301F`  | `#B9F0B0`   | `#70D15C`  |
| `error`   | `#3A1717`  | `#F5B0B0`   | `#FF4A47`  |
| `info`    | `#221540`  | `#C7B6F5`   | `#8B6EFF`  |
| `warning` | `#3A2A0E`  | `#F7D58E`   | `#F59E0B`  |

Need something different? Override `backgroundColor`, `titleStyle.color`, `descriptionStyle.color` or pass a custom `icon`. You can also import the raw theme map:

```ts
import { VARIANT_THEMES } from "expo-toastification";
// VARIANT_THEMES.light.success, VARIANT_THEMES.dark.error, …
```

---

## 📱 Compatibility

Zero native code of its own — every feature sits on top of React Native core APIs + the two peer deps you already have in any modern Expo app.

### Platform support

| Feature / API            | iOS  | Android | Web (react-native-web) |
| ------------------------ | :--: | :-----: | :--------------------: |
| Enter / exit animation   |  ✅  |   ✅    | ⚠️ (functional, not polished) |
| Tap-to-dismiss           |  ✅  |   ✅    |           ✅           |
| Swipe-to-dismiss         |  ✅  |   ✅    | ⚠️ (pointer edge cases) |
| Stack reflow animation   |  ✅  |   ✅ *  |           —            |
| Dark mode auto-switch    |  ✅  |   ✅    |           ✅           |
| Safe-area insets         |  ✅  |   ✅    |           ✅           |
| SVG icons                |  ✅  |   ✅    |           ✅           |
| Screen-reader announce   |  ✅  |   ✅    |           —            |
| `accessibilityRole=alert`|  ✅  |   ✅    |           —            |
| `accessibilityLiveRegion`|  —   |   ✅    |           —            |

<sub>*Android reflow is enabled for you automatically via `UIManager.setLayoutAnimationEnabledExperimental(true)` at module load — no setup required.</sub>

### Build & runtime

- ✅ **Expo Go** — no `prebuild` / `dev-client` needed.
- ✅ **EAS Build** — no pods, no Gradle plugins, no `app.config` entries.
- ✅ **New Architecture (Fabric / TurboModules)** — compatible (no native modules of our own).
- ✅ **Hermes / JSC** — pure JS, both engines supported.
- ⚠️ **Web** — functional but not polished (see roadmap).

### What doesn't need setup

- No changes to `Info.plist` or `AndroidManifest.xml`.
- No extra babel plugins.
- No `metro.config.js` tweaks.

---

## ♿ Accessibility

Out of the box, every toast sets:

- `accessibilityRole="alert"` for `error` / `warning`, default role for the rest.
- `accessibilityLiveRegion="assertive"` for `error` / `warning`, `"polite"` for the rest (Android).
- Manual `AccessibilityInfo.announceForAccessibility(...)` on mount when a screen reader is active (iOS fallback).
- An auto-built `accessibilityLabel` combining variant + title + description. Override per toast via the `accessibilityLabel` option.

---

## 💡 Tips & gotchas

- **`toast()` before `<ToastProvider />` mounts?** Calls made before the host mounts are queued and flush once the host subscribes. Safe to call from any top-level effect or service singleton.
- **Nested `ScrollView` or `FlatList`?** The host sits in `pointerEvents="box-none"` absolute overlay — it doesn't block scroll. Swipe-to-dismiss only claims horizontal drags, so vertical scrolling beneath the toast keeps working.
- **Hot reload / Fast Refresh** — queue and config are held in module-level singletons; reload wipes them naturally.
- **`onPress` + `dismissible`** — the tap callback always fires first; the toast then dismisses **only if** `dismissible: true` (default). For a pure action toast without dismiss, pass `dismissible: false`.
- **`duration: 0`** — disables auto-dismiss. Toast stays until you call `toast.dismiss(id)`, the user taps it, or swipes it.
- **Multiple `<ToastProvider />`** — fine, but scope them. Toasts without an explicit scope go to `"default"`; only the provider with the matching scope renders them.
- **Type-only imports** — full type surface is exported: `ToastOptions`, `ToastVariant`, `ToastPosition`, `ToastDismissReason`, `ToastEntryDirection`, `ToastColorScheme`, `ToastTextStyle`, `ToastPromiseMessages`, etc.

---

## 🧪 Full example

A ready-to-drop-in demo screen with buttons for every feature lives at [`example/App.tsx`](./example/App.tsx). Paste it into any Expo project to explore the library.

---

## 🧵 Local development

```bash
pnpm install
pnpm build         # tsup → dist/
pnpm pack          # expo-toastification-<version>.tgz
```

To test the built package in another app:

```bash
# from the consumer app
pnpm add /absolute/path/to/expo-toastification-<version>.tgz
npx expo start -c
```

---

## 🛣 Roadmap

- [ ] Per-scope `maxToasts` (today it's global)
- [ ] Web support polish
- [ ] Optional `react-native-reanimated` + `react-native-gesture-handler` backend for ultra-smooth swipe

---

## 🤝 Contributing

PRs, issues and discussions are welcome at
[github.com/Hakapichona/expo-toastification](https://github.com/Hakapichona/expo-toastification).

## 📄 License

MIT © [Hakapichona](https://github.com/Hakapichona)
