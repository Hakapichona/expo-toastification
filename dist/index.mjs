// src/core/configuration.ts
var toastGlobalConfig = {
  fontSize: 14,
  textColor: "#ffffff",
  enterDuration: 250,
  exitDuration: 200
};

// src/core/normalize-options.ts
var DEFAULTS = {
  variant: "default",
  position: "top",
  duration: 3e3,
  fontSize: 14,
  textColor: "#ffffff",
  enterDuration: 250,
  exitDuration: 200
};
function normalizeOptions(options) {
  var _a, _b, _c, _d, _e, _f, _g;
  return {
    variant: (_a = options == null ? void 0 : options.variant) != null ? _a : DEFAULTS.variant,
    position: (_b = options == null ? void 0 : options.position) != null ? _b : DEFAULTS.position,
    duration: (_c = options == null ? void 0 : options.duration) != null ? _c : DEFAULTS.duration,
    fontSize: (_d = options == null ? void 0 : options.fontSize) != null ? _d : toastGlobalConfig.fontSize,
    textColor: (_e = options == null ? void 0 : options.textColor) != null ? _e : toastGlobalConfig.textColor,
    enterDuration: (_f = options == null ? void 0 : options.enterDuration) != null ? _f : toastGlobalConfig.enterDuration,
    exitDuration: (_g = options == null ? void 0 : options.exitDuration) != null ? _g : toastGlobalConfig.exitDuration
  };
}

// src/core/toast-manager.ts
import { v4 as uuidv4 } from "uuid";
var ToastManager = class {
  constructor() {
    this.subscribers = /* @__PURE__ */ new Set();
    this.queue = [];
    this.active = [];
    this.maxToasts = 3;
  }
  subscribe(fn) {
    this.subscribers.add(fn);
    fn(this.active);
    return () => this.subscribers.delete(fn);
  }
  publish(message, options) {
    const toast2 = {
      id: uuidv4(),
      message,
      options: normalizeOptions(options)
    };
    this.queue.push(toast2);
    this.flush();
  }
  remove(id) {
    this.active = this.active.filter((t) => t.id !== id);
    this.flush();
  }
  configure(config) {
    if (typeof config.maxToasts === "number" && config.maxToasts > 0) {
      this.maxToasts = config.maxToasts;
      this.flush();
    }
  }
  flush() {
    const availableSlots = this.maxToasts - this.active.length;
    if (availableSlots <= 0) return;
    if (this.queue.length === 0) return;
    const next = this.queue.splice(0, availableSlots);
    this.active = [...this.active, ...next];
    this.notify();
  }
  notify() {
    const snapshot = [...this.active];
    this.subscribers.forEach((fn) => fn(snapshot));
  }
};
var toastManager = new ToastManager();

// src/api/toast.ts
var toast = Object.assign(
  ((message, options) => toastManager.publish(message, options)),
  {
    success: (msg, opts) => toastManager.publish(msg, { ...opts, variant: "success" }),
    error: (msg, opts) => toastManager.publish(msg, { ...opts, variant: "error" }),
    info: (msg, opts) => toastManager.publish(msg, { ...opts, variant: "info" }),
    warning: (msg, opts) => toastManager.publish(msg, { ...opts, variant: "warning" })
  }
);

// src/api/configure.ts
function configureToasts(config) {
  Object.assign(toastGlobalConfig, config);
}

// src/components/ToastHost.tsx
import { useEffect as useEffect2, useMemo, useState } from "react";
import { StyleSheet as StyleSheet2, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// src/components/ToastItem.tsx
import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  Dimensions
} from "react-native";
import { jsx } from "react/jsx-runtime";
var SCREEN_WIDTH = Dimensions.get("window").width;
function ToastItem(props) {
  const { toast: toast2, onHide } = props;
  const { options } = toast2;
  const translateX = useRef(
    new Animated.Value(SCREEN_WIDTH)
  ).current;
  const opacity = useRef(
    new Animated.Value(0)
  ).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: options.enterDuration,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: options.enterDuration,
        useNativeDriver: true
      })
    ]).start();
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: SCREEN_WIDTH,
          duration: options.exitDuration,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: options.exitDuration,
          useNativeDriver: true
        })
      ]).start(({ finished }) => {
        if (finished) {
          onHide();
        }
      });
    }, options.duration);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    translateX,
    opacity,
    options.duration,
    options.enterDuration,
    options.exitDuration,
    onHide
  ]);
  return /* @__PURE__ */ jsx(
    Animated.View,
    {
      style: [
        styles.toast,
        styles[options.variant],
        {
          opacity,
          transform: [{ translateX }]
        }
      ],
      children: /* @__PURE__ */ jsx(
        Text,
        {
          style: [
            styles.text,
            {
              fontSize: options.fontSize,
              color: options.textColor
            }
          ],
          children: toast2.message
        }
      )
    }
  );
}
var styles = StyleSheet.create({
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
    minWidth: "70%"
  },
  text: {
    textAlign: "center",
    fontWeight: "500"
  },
  default: {
    backgroundColor: "#333"
  },
  success: {
    backgroundColor: "#22c55e"
  },
  error: {
    backgroundColor: "#ef4444"
  },
  info: {
    backgroundColor: "#3b82f6"
  },
  warning: {
    backgroundColor: "#f59e0b"
  }
});

// src/components/ToastHost.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function ToastHost() {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState([]);
  useEffect2(() => {
    return toastManager.subscribe(setToasts);
  }, []);
  const topToasts = useMemo(
    () => toasts.filter((t) => t.options.position === "top"),
    [toasts]
  );
  const bottomToasts = useMemo(
    () => toasts.filter((t) => t.options.position === "bottom"),
    [toasts]
  );
  return /* @__PURE__ */ jsxs(View, { pointerEvents: "box-none", style: StyleSheet2.absoluteFill, children: [
    /* @__PURE__ */ jsx2(
      View,
      {
        pointerEvents: "box-none",
        style: [styles2.stack, { top: insets.top + 12 }],
        children: topToasts.map((toast2) => /* @__PURE__ */ jsx2(
          ToastItem,
          {
            toast: toast2,
            onHide: () => toastManager.remove(toast2.id)
          },
          toast2.id
        ))
      }
    ),
    /* @__PURE__ */ jsx2(
      View,
      {
        pointerEvents: "box-none",
        style: [styles2.stack, { bottom: insets.bottom + 12 }],
        children: bottomToasts.map((toast2) => /* @__PURE__ */ jsx2(
          ToastItem,
          {
            toast: toast2,
            onHide: () => toastManager.remove(toast2.id)
          },
          toast2.id
        ))
      }
    )
  ] });
}
var styles2 = StyleSheet2.create({
  stack: {
    position: "absolute",
    width: "100%",
    alignItems: "center"
  }
});

// src/components/ToastProvider.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function ToastProvider(props) {
  const { children } = props;
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    children,
    /* @__PURE__ */ jsx3(ToastHost, {})
  ] });
}
export {
  ToastProvider,
  configureToasts,
  toast
};
