// core/configuration.ts
import type { ToastResolvedOptions } from "../types";

export type ToastGlobalConfig = Omit<
    ToastResolvedOptions,
    "variant" | "position" | "duration"
>;

export const toastGlobalConfig: ToastGlobalConfig = {
    fontSize: 14,
    textColor: "#ffffff",
    enterDuration: 250,
    exitDuration: 200,
};
