import type {
    ToastColorScheme,
    ToastEntryDirection,
    ToastPosition,
    ToastTextStyle,
} from "../types";

/**
 * Global defaults applied to every toast.
 * Precedence: variant theme (lowest) → global config → per-toast options (highest).
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

    /**
     * Which palette to use. `"auto"` follows the system color scheme via
     * `useColorScheme()` and updates on the fly when the user flips dark mode.
     */
    colorScheme: ToastColorScheme;

    /** Default for `dismissible` (tap + swipe). */
    dismissible: boolean;

    /**
     * Horizontal displacement (in px) required to trigger a swipe dismiss.
     * Below this the toast snaps back.
     */
    swipeThreshold: number;

    /**
     * Direction the toast slides in from on enter. Defaults to `"right"`.
     */
    entryDirection: ToastEntryDirection;
}

export const toastGlobalConfig: ToastGlobalConfig = {
    duration: 3000,
    position: "top",

    enterDuration: 250,
    exitDuration: 200,

    titleStyle: {},
    descriptionStyle: {},

    backgroundColor: null,

    colorScheme: "auto",

    dismissible: true,
    swipeThreshold: 80,

    entryDirection: "right",
};
