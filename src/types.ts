import type { ReactNode } from "react";
import type { TextStyle } from "react-native";

export type ToastVariant = "default" | "success" | "error" | "info" | "warning";
export type ToastPosition = "top" | "bottom";

/** Subset of TextStyle allowed for the title / description text. */
export interface ToastTextStyle {
    fontSize?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    fontFamily?: string;
    letterSpacing?: number;
    lineHeight?: number;
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

    /** Per-toast style overrides. Merged over variant + global defaults. */
    titleStyle?: ToastTextStyle;
    descriptionStyle?: ToastTextStyle;

    /** Background color override. */
    backgroundColor?: string;

    /** Animation durations (ms). */
    enterDuration?: number;
    exitDuration?: number;
}

/** Internal, fully-resolved options handed to the renderer. */
export interface ToastResolvedOptions {
    readonly variant: ToastVariant;
    readonly duration: number;
    readonly position: ToastPosition;

    readonly description: string | null;
    readonly icon: ReactNode | null;
    readonly noIcon: boolean;

    readonly titleStyle: ToastTextStyle;
    readonly descriptionStyle: ToastTextStyle;

    readonly backgroundColor: string;

    readonly enterDuration: number;
    readonly exitDuration: number;
}

/** Internal entity stored in the queue. */
export interface ToastInternal {
    readonly id: string;
    readonly title: string;
    readonly options: ToastResolvedOptions;
}
