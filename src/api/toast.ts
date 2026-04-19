import { toastManager, type ToastUpdatePayload } from "../core/toast-manager";
import type { ToastOptions } from "../types";

type ToastFn = (title: string, options?: ToastOptions) => string;
type VariantFn = (title: string, options?: Omit<ToastOptions, "variant">) => string;
type CustomFn = (title: string, options: ToastOptions) => string;

export type PromiseMessage<T = unknown> =
    | string
    | { title: string; description?: string }
    | ((value: T) => string | { title: string; description?: string });

export interface ToastPromiseMessages<T> {
    loading: string | { title: string; description?: string };
    success: PromiseMessage<T>;
    error: PromiseMessage<unknown>;
}

export interface ScopedToast {
    (title: string, options?: Omit<ToastOptions, "scope">): string;
    success: (title: string, options?: Omit<ToastOptions, "scope" | "variant">) => string;
    error: (title: string, options?: Omit<ToastOptions, "scope" | "variant">) => string;
    info: (title: string, options?: Omit<ToastOptions, "scope" | "variant">) => string;
    warning: (title: string, options?: Omit<ToastOptions, "scope" | "variant">) => string;
    custom: (title: string, options: Omit<ToastOptions, "scope">) => string;
}

interface ToastApi extends ToastFn {
    success: VariantFn;
    error: VariantFn;
    info: VariantFn;
    warning: VariantFn;
    custom: CustomFn;
    dismiss: (id: string) => void;
    update: (id: string, updates: ToastUpdatePayload) => boolean;
    promise: <T>(
        promise: Promise<T>,
        messages: ToastPromiseMessages<T>,
        options?: Omit<ToastOptions, "variant">
    ) => Promise<T>;
    scope: (name: string) => ScopedToast;
}

const base: ToastFn = (title, options) => toastManager.publish(title, options);

function resolveMessage<T>(
    msg: PromiseMessage<T>,
    value: T
): { title: string; description?: string } {
    const picked = typeof msg === "function" ? msg(value) : msg;
    return typeof picked === "string" ? { title: picked } : picked;
}

function createScopedToast(scope: string): ScopedToast {
    const scoped = ((title: string, options?: Omit<ToastOptions, "scope">): string =>
        toastManager.publish(title, { ...options, scope })) as ScopedToast;

    scoped.success = (title, options) =>
        toastManager.publish(title, { ...options, scope, variant: "success" });

    scoped.error = (title, options) =>
        toastManager.publish(title, { ...options, scope, variant: "error" });

    scoped.info = (title, options) =>
        toastManager.publish(title, { ...options, scope, variant: "info" });

    scoped.warning = (title, options) =>
        toastManager.publish(title, { ...options, scope, variant: "warning" });

    scoped.custom = (title, options) =>
        toastManager.publish(title, { ...options, scope });

    return scoped;
}

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

    dismiss: (id: string): void => {
        toastManager.dismiss(id, "programmatic");
    },

    update: (id: string, updates: ToastUpdatePayload): boolean =>
        toastManager.update(id, updates),

    promise: <T>(
        promise: Promise<T>,
        messages: ToastPromiseMessages<T>,
        options?: Omit<ToastOptions, "variant">
    ): Promise<T> => {
        const loading =
            typeof messages.loading === "string"
                ? { title: messages.loading }
                : messages.loading;

        const id = toastManager.publish(loading.title, {
            ...options,
            variant: "default",
            description: loading.description,
            duration: 0,
        });

        return promise.then(
            (value) => {
                const resolved = resolveMessage(messages.success, value);
                toastManager.update(id, {
                    title: resolved.title,
                    description: resolved.description ?? "",
                    variant: "success",
                    duration: options?.duration,
                });
                return value;
            },
            (err) => {
                const resolved = resolveMessage(messages.error, err);
                toastManager.update(id, {
                    title: resolved.title,
                    description: resolved.description ?? "",
                    variant: "error",
                    duration: options?.duration,
                });
                throw err;
            }
        );
    },

    scope: (name: string): ScopedToast => createScopedToast(name),
});
