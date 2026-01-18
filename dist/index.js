"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ToastProvider: () => ToastProvider,
  configureToasts: () => configureToasts,
  toast: () => toast
});
module.exports = __toCommonJS(index_exports);

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
var import_uuid = require("uuid");
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
      id: (0, import_uuid.v4)(),
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
var import_react2 = require("react");
var import_react_native2 = require("react-native");
var import_react_native_safe_area_context = require("react-native-safe-area-context");

// src/components/ToastItem.tsx
var import_react = require("react");
var import_react_native = require("react-native");
var import_jsx_runtime = require("react/jsx-runtime");
var SCREEN_WIDTH = import_react_native.Dimensions.get("window").width;
function ToastItem(props) {
  const { toast: toast2, onHide } = props;
  const { options } = toast2;
  const translateX = (0, import_react.useRef)(
    new import_react_native.Animated.Value(SCREEN_WIDTH)
  ).current;
  const opacity = (0, import_react.useRef)(
    new import_react_native.Animated.Value(0)
  ).current;
  (0, import_react.useEffect)(() => {
    import_react_native.Animated.parallel([
      import_react_native.Animated.timing(translateX, {
        toValue: 0,
        duration: options.enterDuration,
        useNativeDriver: true
      }),
      import_react_native.Animated.timing(opacity, {
        toValue: 1,
        duration: options.enterDuration,
        useNativeDriver: true
      })
    ]).start();
    const timeout = setTimeout(() => {
      import_react_native.Animated.parallel([
        import_react_native.Animated.timing(translateX, {
          toValue: SCREEN_WIDTH,
          duration: options.exitDuration,
          useNativeDriver: true
        }),
        import_react_native.Animated.timing(opacity, {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_native.Animated.View,
    {
      style: [
        styles.toast,
        styles[options.variant],
        {
          opacity,
          transform: [{ translateX }]
        }
      ],
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react_native.Text,
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
var styles = import_react_native.StyleSheet.create({
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
var import_jsx_runtime2 = require("react/jsx-runtime");
function ToastHost() {
  const insets = (0, import_react_native_safe_area_context.useSafeAreaInsets)();
  const [toasts, setToasts] = (0, import_react2.useState)([]);
  (0, import_react2.useEffect)(() => {
    return toastManager.subscribe(setToasts);
  }, []);
  const topToasts = (0, import_react2.useMemo)(
    () => toasts.filter((t) => t.options.position === "top"),
    [toasts]
  );
  const bottomToasts = (0, import_react2.useMemo)(
    () => toasts.filter((t) => t.options.position === "bottom"),
    [toasts]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.View, { pointerEvents: "box-none", style: import_react_native2.StyleSheet.absoluteFill, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react_native2.View,
      {
        pointerEvents: "box-none",
        style: [styles2.stack, { top: insets.top + 12 }],
        children: topToasts.map((toast2) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          ToastItem,
          {
            toast: toast2,
            onHide: () => toastManager.remove(toast2.id)
          },
          toast2.id
        ))
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react_native2.View,
      {
        pointerEvents: "box-none",
        style: [styles2.stack, { bottom: insets.bottom + 12 }],
        children: bottomToasts.map((toast2) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var styles2 = import_react_native2.StyleSheet.create({
  stack: {
    position: "absolute",
    width: "100%",
    alignItems: "center"
  }
});

// src/components/ToastProvider.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function ToastProvider(props) {
  const { children } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ToastHost, {})
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToastProvider,
  configureToasts,
  toast
});
