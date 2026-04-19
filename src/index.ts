export { toast } from "./api/toast";
export type {
    PromiseMessage,
    ToastPromiseMessages,
    ScopedToast,
} from "./api/toast";

export { configureToasts } from "./api/configure";
export type { ToastUserConfig } from "./api/configure";

export { ToastProvider } from "./components/ToastProvider";
export type { ToastProviderProps } from "./components/ToastProvider";

export {
    SuccessIcon,
    ErrorIcon,
    InfoIcon,
    WarningIcon,
} from "./components/icons/DefaultIcons";

export { VARIANT_THEMES } from "./theme/variants";
export type { ToastVariantTheme, ToastResolvedScheme } from "./theme/variants";

export type { ToastUpdatePayload } from "./core/toast-manager";

export * from "./types";
