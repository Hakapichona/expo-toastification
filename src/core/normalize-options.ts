import { ToastOptions, ToastResolvedOptions } from "../types";

const DEFAULTS: ToastResolvedOptions = {
    variant: "default",
    duration: 3000,
    position: "top",
};

export function normalizeOptions(
    options?: ToastOptions
): ToastResolvedOptions {
    return {
        variant: options?.variant ?? DEFAULTS.variant,
        duration: options?.duration ?? DEFAULTS.duration,
        position: options?.position ?? DEFAULTS.position,
    };
}
