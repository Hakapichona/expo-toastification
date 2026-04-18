// core/configuration.ts
import type { ToastPosition, ToastTextStyle } from "../types";

/**
 * Global defaults applied to every toast.
 * These sit between built-in variant defaults (lowest priority)
 * and per-toast options (highest priority).
 */
export interface ToastGlobalConfig {
    duration: number;
    position: ToastPosition;

    enterDuration: number;
    exitDuration: number;

    /** Overrides applied on top of the variant theme's title style. */
    titleStyle: ToastTextStyle;
    /** Overrides applied on top of the variant theme's description style. */
    descriptionStyle: ToastTextStyle;

    /** If set, overrides the variant theme background color. */
    backgroundColor: string | null;
}

export const toastGlobalConfig: ToastGlobalConfig = {
    duration: 3000,
    position: "top",

    enterDuration: 250,
    exitDuration: 200,

    titleStyle: {},
    descriptionStyle: {},

    backgroundColor: null,
};
