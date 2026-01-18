# 🍞 expo-toastification

A simple, elegant and lightweight toast notification library for **Expo** and **React Native**.

Inspired by the developer experience of `vue-toastification`, built with **modern React Native and TypeScript best practices**.

# 📦 Installation
- pnpm add expo-toastification.

- npm install expo-toastification

- yarn add expo-toastification

# 🚀 Quick Start

### Wrap your app
```
import { ToastProvider } from "expo-toastification";

export default function App() {
  return (
    <ToastProvider>
      {/* your app */}
    </ToastProvider>
  );
}
```
### Trigger toasts anywhere
```
import { toast } from "expo-toastification";

toast("Hello world!");

toast.success("Saved successfully");
toast.error("Something went wrong");
toast.info("New update available");
toast.warning("Be careful!");

```

# ⚙️ Configuration
Configure maximum visible toasts

By default, 3 toasts can be visible at the same time. Extra toasts are queued using FIFO order.

```
import { configureToasts } from "expo-toastification";

configureToasts({
  maxToasts: 4,
});
```

# 🧩 Toast Options
```
toast("Custom toast", {
  duration: 5000,
  position: "bottom",
  variant: "info",
});
```


# 🛣 Roadmap

Planned features:

- Swipe to dismiss

- Custom renderers

- Theming support

- Toast groups / scopes

- Web support improvements

PRs and discussions are welcome.