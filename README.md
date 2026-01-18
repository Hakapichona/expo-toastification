# 🍞 expo-toastification

A simple, elegant and lightweight toast notification library for **Expo** and **React Native**.

Inspired by the developer experience of `vue-toastification`, built with **modern React Native and TypeScript best practices**.

# 🔧 Requirements

- Expo SDK >= 49
- React >= 18
- React Native >= 0.71
- uuid >= 8.3.2
- react-native-get-random-values
- react-native-safe-area-context

# 📦 Installation
- pnpm add expo-toastification

- npm install expo-toastification

- yarn add expo-toastification

# 🚀 Basic Setup (Minimum)

### 1- Expo Router 
```
import { ToastProvider, configureToasts } from "expo-toastification";
import { Slot } from "expo-router";

configureToasts({
  fontSize: 16,
  textColor: "#0f172a",
  enterDuration: 400,
  exitDuration: 300,
});

export default function RootLayout() {
  return (
    <ToastProvider>
      <Slot />
    </ToastProvider>
  );
}
```

### 2- Classic Expo / React Native 
```
import { ToastProvider, configureToasts } from "expo-toastification";

configureToasts({
  fontSize: 15,
  textColor: "#111",
});

export default function App() {
  return (
    <ToastProvider>
      {/* your app */}
    </ToastProvider>
  );
}
```

# 🧩 Per-Toast Customization

Every toast can override global settings.

```
toast("Custom toast", {
  duration: 5000,
  fontSize: 18,
  textColor: "#facc15",
});
```

# ⚙️ Full Toast Options

```
toast("Example", {
  variant: "success",
  position: "top",
  duration: 4000,
  fontSize: 16,
  textColor: "#ffffff",
  enterDuration: 400,
  exitDuration: 300,
});
```

# 🍞 Toasts
```
import { toast } from "expo-toastification";

toast("Hello world!");

toast.success("Saved successfully");
toast.error("Something went wrong");
toast.info("New update available");
toast.warning("Be careful!");

```

# 🛣 Roadmap

Planned features:

- Swipe to dismiss

- Custom renderers

- Theming support

- Toast groups / scopes

- Web support improvements

PRs and discussions are welcome.