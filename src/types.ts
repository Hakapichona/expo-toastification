import type { ReactNode } from "react";
import type { TextStyle } from "react-native";

export type ToastVariant = "default" | "success" | "error" | "info" | "warning";
export type ToastPosition = "top" | "bottom";
export type ToastColorScheme = "light" | "dark" | "auto";

/**
 * Direction the toast slides in from on enter (and out on non-swipe exit).
 * - `"top"` / `"bottom"` — pure vertical slide.
 * - `"left"` / `"right"` — pure horizontal slide from the screen edge.
 * - `"vertical"` — position-aware: top toasts slide down, bottom slide up.
 * - `"vertical-right"` / `"vertical-left"` — diagonal from the corner.
 */
export type ToastEntryDirection =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "vertical"
    | "vertical-right"
    | "vertical-left";

/** Why a toast was dismissed. Received by `onDismiss`. */
export type ToastDismissReason = "timeout" | "user" | "programmatic";

/** Subset of TextStyle allowed for the title / description text. */
export interface ToastTextStyle {
    fontSize?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    fontFamily?: string;
    letterSpacing?: number;
    lineHeight?: number;
}

/** Context handed to a custom `render` function. */
export interface ToastRenderContext {
    readonly toast: ToastInternal;
    /** Dismisses this toast with the "user" reason. */
    readonly dismiss: () => void;
}

/** Public options (user input). */
export interface ToastOptions {
    variant?: ToastVariant;
    duration?: number;
    position?: ToastPosition;

    /** Optional secondary line rendered under the title. */
    description?: string;

    /** Custom icon node rendered to the left of the text. */
    icon?: ReactNode;

    /** If true, no icon is rendered (overrides `icon`). */
    noIcon?: boolean;

    /** Per-toast style overrides. Merged over variant + global defaults at render time. */
    titleStyle?: ToastTextStyle;
    descriptionStyle?: ToastTextStyle;

    /** Background color override. */
    backgroundColor?: string;

    /**
     * If true, the background color is rendered translucent (alpha ≈ 0.75)
     * so whatever is behind the toast shows through. The hue comes from
     * `backgroundColor` or the variant theme; only the opacity is reduced.
     */
    transparent?: boolean;

    /** Animation durations (ms). */
    enterDuration?: number;
    exitDuration?: number;

    /** Screen-reader label override. Auto-built from title + description otherwise. */
    accessibilityLabel?: string;

    /**
     * If false, tap and swipe-to-dismiss are disabled. Defaults to `true`.
     * Auto-dismiss via `duration` is unaffected.
     */
    dismissible?: boolean;

    /**
     * Scope the toast belongs to. Only `<ToastProvider scope="..." />` hosts
     * matching this scope will render it. Defaults to `"default"`.
     */
    scope?: string;

    /** Fires once the enter animation completes. */
    onShow?: () => void;

    /** Fires when the user taps the toast (before any automatic dismiss). */
    onPress?: () => void;

    /** Fires after the exit animation completes, with the reason. */
    onDismiss?: (reason: ToastDismissReason) => void;

    /**
     * Custom renderer. If provided, replaces the built-in layout entirely.
     * The wrapper still handles positioning, animation, tap and swipe.
     */
    render?: (ctx: ToastRenderContext) => ReactNode;
}

/**
 * Internal, resolved options handed to the renderer.
 *
 * Style-related fields (titleStyle, descriptionStyle, backgroundColor) carry
 * **only user + global overrides** — the variant theme is applied by the
 * renderer at paint time so dark / light mode can switch on the fly.
 */
export interface ToastResolvedOptions {
    readonly variant: ToastVariant;
    readonly duration: number;
    readonly position: ToastPosition;

    readonly description: string | null;
    readonly icon: ReactNode | null;
    readonly noIcon: boolean;

    readonly titleStyle: ToastTextStyle;
    readonly descriptionStyle: ToastTextStyle;

    /** `null` means "fall back to the active variant theme". */
    readonly backgroundColor: string | null;

    readonly transparent: boolean;

    readonly enterDuration: number;
    readonly exitDuration: number;

    readonly accessibilityLabel: string | null;

    readonly dismissible: boolean;
    readonly scope: string;

    readonly onShow: (() => void) | null;
    readonly onPress: (() => void) | null;
    readonly onDismiss: ((reason: ToastDismissReason) => void) | null;

    readonly render: ((ctx: ToastRenderContext) => ReactNode) | null;
}

/** Internal entity stored in the queue. */
export interface ToastInternal {
    readonly id: string;
    readonly title: string;
    readonly options: ToastResolvedOptions;
}
