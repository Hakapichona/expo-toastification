// core/normalize-options.ts
import type {
    ToastOptions,
    ToastResolvedOptions,
    ToastTextStyle,
    ToastVariant,
} from "../types";
import { VARIANT_THEMES } from "../theme/variants";
import { toastGlobalConfig } from "./configuration";

function mergeTextStyles(
    ...styles: ReadonlyArray<ToastTextStyle | undefined>
): ToastTextStyle {
    const merged: ToastTextStyle = {};
    for (const style of styles) {
        if (style != null) {
            Object.assign(merged, style);
        }
    }
    return merged;
}

export function normalizeOptions(
    options?: ToastOptions
): ToastResolvedOptions {
    const variant: ToastVariant = options?.variant ?? "default";
    const theme = VARIANT_THEMES[variant];

    const description = options?.description?.trim();

    return {
        variant,
        position: options?.position ?? toastGlobalConfig.position,
        duration: options?.duration ?? toastGlobalConfig.duration,

        description: description != null && description.length > 0 ? description : null,
        icon: options?.icon ?? null,
        noIcon: options?.noIcon ?? false,

        titleStyle: mergeTextStyles(
            theme.titleStyle,
            toastGlobalConfig.titleStyle,
            options?.titleStyle
        ),
        descriptionStyle: mergeTextStyles(
            theme.descriptionStyle,
            toastGlobalConfig.descriptionStyle,
            options?.descriptionStyle
        ),

        backgroundColor:
            options?.backgroundColor ??
            toastGlobalConfig.backgroundColor ??
            theme.backgroundColor,

        enterDuration: options?.enterDuration ?? toastGlobalConfig.enterDuration,
        exitDuration: options?.exitDuration ?? toastGlobalConfig.exitDuration,
    };
}
