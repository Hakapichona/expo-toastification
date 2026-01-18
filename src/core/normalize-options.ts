import type {
    ToastOptions,
    ToastResolvedOptions,
} from "../types";
import { toastGlobalConfig } from "./configuration";

const DEFAULTS: ToastResolvedOptions = {
    variant: "default",
    position: "top",
    duration: 3000,

    fontSize: 14,
    textColor: "#ffffff",

    enterDuration: 250,
    exitDuration: 200,
};

export function normalizeOptions(
    options?: ToastOptions
): ToastResolvedOptions {
    return {
        variant: options?.variant ?? DEFAULTS.variant,
        position: options?.position ?? DEFAULTS.position,
        duration: options?.duration ?? DEFAULTS.duration,

        fontSize:
            options?.fontSize ??
            toastGlobalConfig.fontSize,

        textColor:
            options?.textColor ??
            toastGlobalConfig.textColor,

        enterDuration:
            options?.enterDuration ??
            toastGlobalConfig.enterDuration,

        exitDuration:
            options?.exitDuration ??
            toastGlobalConfig.exitDuration,
    };
}
