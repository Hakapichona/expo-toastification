// api/toast.ts
import { toastManager } from "../core/toast-manager";
import type { ToastOptions } from "../types";

type ToastFn = (title: string, options?: ToastOptions) => string;

type VariantFn = (title: string, options?: Omit<ToastOptions, "variant">) => string;

/**
 * `options` is required — every field inside remains optional.
 * Use this when you want to signal explicit customization at the call site.
 */
type CustomFn = (title: string, options: ToastOptions) => string;

interface ToastApi extends ToastFn {
    success: VariantFn;
    error: VariantFn;
    info: VariantFn;
    warning: VariantFn;
    custom: CustomFn;
    dismiss: (id: string) => void;
}

const base: ToastFn = (title, options) => toastManager.publish(title, options);

export const toast: ToastApi = Object.assign(base, {
    success: (title: string, options?: Omit<ToastOptions, "variant">): string =>
        toastManager.publish(title, { ...options, variant: "success" }),

    error: (title: string, options?: Omit<ToastOptions, "variant">): string =>
        toastManager.publish(title, { ...options, variant: "error" }),

    info: (title: string, options?: Omit<ToastOptions, "variant">): string =>
        toastManager.publish(title, { ...options, variant: "info" }),

    warning: (title: string, options?: Omit<ToastOptions, "variant">): string =>
        toastManager.publish(title, { ...options, variant: "warning" }),

    custom: (title: string, options: ToastOptions): string =>
        toastManager.publish(title, options),

    dismiss: (id: string): void => toastManager.remove(id),
});
