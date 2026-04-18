# 🍞 expo-toastification

[![npm version](https://img.shields.io/npm/v/expo-toastification.svg)](https://www.npmjs.com/package/expo-toastification)
[![license](https://img.shields.io/npm/l/expo-toastification.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Hakapichona%2Fexpo--toastification-181717?logo=github)](https://github.com/Hakapichona/expo-toastification)

A simple, elegant and lightweight toast notification library for **Expo** and **React Native**, built with a modern TypeScript API.

- 🎨 Pastel palette + SVG icons per variant (success / error / info / warning)
- 🧩 Title + optional description with independently styleable text
- 🖼️ Custom icons (any `ReactNode`) or `noIcon`
- ⚙️ Global defaults + per-toast overrides (deep-merged)
- 📚 Queue with configurable `maxToasts`
- ↩️ Programmatic `dismiss(id)` — every call returns an id
- 🪶 ~4 KB gzipped, zero runtime dependencies beyond peer deps
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
npx expo install react-native-safe-area-context react-native-svg react-native-get-random-values
pnpm add uuid
```

> 💡 `react-native-get-random-values` must be imported **once** at the top of your app entry (see setup below) so `uuid` works on native.

### Requirements

| Dep                              | Version       |
| -------------------------------- | ------------- |
| Expo SDK                         | ≥ 49          |
| React                            | ≥ 18          |
| React Native                     | ≥ 0.71        |
| `uuid`                           | ≥ 8.3.2       |
| `react-native-get-random-values` | any           |
| `react-native-safe-area-context` | any           |
| `react-native-svg`               | any           |

---

## 🚀 Quick start

Wrap your app with `<ToastProvider>` and (optionally) set global defaults with `configureToasts`.

### Expo Router

```tsx
// app/_layout.tsx
import "react-native-get-random-values";

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
import "react-native-get-random-values";

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
| `toast.dismiss(id)`              | `void`    | Dismisses a toast by id.                                        |
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

### 6. Position / duration overrides

```tsx
toast.info("I'm at the bottom", { position: "bottom" });
toast.warning("A longer-lasting toast", { duration: 8000 });
```

### 7. Programmatic dismiss

`toast()` and its variants return the id of the created toast.

```tsx
const id = toast.info("Syncing…", { duration: 10000 });

await syncWithServer();
toast.dismiss(id);
toast.success("Synced");
```

### 8. `toast.custom` — options required

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
});
```

---

## 🎨 Built-in variant palette

| Variant   | Background | Title color | Icon color |
| --------- | ---------- | ----------- | ---------- |
| `default` | `#EDEEF0`  | `#1C1F24`   | —          |
| `success` | `#D1F2CF`  | `#0F3D2E`   | `#70D15C`  |
| `error`   | `#F7D1D1`  | `#7A1C1C`   | `#DD201D`  |
| `info`    | `#E0D6F8`  | `#2B1858`   | `#6D4AFF`  |
| `warning` | `#FCEBB8`  | `#6B3F07`   | `#D97706`  |

Need something different? Override `backgroundColor`, `titleStyle.color`, `descriptionStyle.color` or pass a custom `icon`.

You can also import the raw theme map:

```ts
import { VARIANT_THEMES } from "expo-toastification";
```

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

- [ ] Swipe to dismiss (gesture handler + Reanimated)
- [ ] Custom renderers (full `render(toast)` override)
- [ ] Light / dark theming API
- [ ] Toast groups / scopes
- [ ] `toast.update(id, options)` and `toast.promise(...)`
- [ ] Position-aware entry animation
- [ ] Accessibility announcements (`announceForAccessibility`)
- [ ] Web support polish

---

## 🤝 Contributing

PRs, issues and discussions are welcome at
[github.com/Hakapichona/expo-toastification](https://github.com/Hakapichona/expo-toastification).

## 📄 License

MIT © [Hakapichona](https://github.com/Hakapichona)
