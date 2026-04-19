import type {
    ToastOptions,
    ToastResolvedOptions,
    ToastTextStyle,
    ToastVariant,
} from "../types";
import { toastGlobalConfig } from "./configuration";
import { resolveNonNegativeNumber } from "./validation";

const DEFAULT_SCOPE = "default";

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

function normalizeDescription(raw: string | undefined): string | null {
    if (raw === undefined) return null;
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function normalizeAccessibilityLabel(raw: string | undefined): string | null {
    if (raw === undefined) return null;
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function normalizeScope(raw: string | undefined): string {
    if (raw === undefined) return DEFAULT_SCOPE;
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : DEFAULT_SCOPE;
}

export function normalizeOptions(
    options?: ToastOptions
): ToastResolvedOptions {
    const variant: ToastVariant = options?.variant ?? "default";

    return {
        variant,
        position: options?.position ?? toastGlobalConfig.position,

        duration: resolveNonNegativeNumber(
            options?.duration,
            toastGlobalConfig.duration,
            "duration"
        ),

        description: normalizeDescription(options?.description),
        icon: options?.icon ?? null,
        noIcon: options?.noIcon ?? false,

        titleStyle: mergeTextStyles(
            toastGlobalConfig.titleStyle,
            options?.titleStyle
        ),
        descriptionStyle: mergeTextStyles(
            toastGlobalConfig.descriptionStyle,
            options?.descriptionStyle
        ),

        backgroundColor:
            options?.backgroundColor ??
            toastGlobalConfig.backgroundColor ??
            null,

        transparent: options?.transparent ?? false,

        enterDuration: resolveNonNegativeNumber(
            options?.enterDuration,
            toastGlobalConfig.enterDuration,
            "enterDuration"
        ),
        exitDuration: resolveNonNegativeNumber(
            options?.exitDuration,
            toastGlobalConfig.exitDuration,
            "exitDuration"
        ),

        accessibilityLabel: normalizeAccessibilityLabel(
            options?.accessibilityLabel
        ),

        dismissible: options?.dismissible ?? toastGlobalConfig.dismissible,
        scope: normalizeScope(options?.scope),

        onShow: options?.onShow ?? null,
        onPress: options?.onPress ?? null,
        onDismiss: options?.onDismiss ?? null,

        render: options?.render ?? null,
    };
}

export function applyResolvedUpdates(
    existing: ToastResolvedOptions,
    updates: ToastOptions
): ToastResolvedOptions {
    return {
        variant: updates.variant ?? existing.variant,
        position: updates.position ?? existing.position,

        duration:
            updates.duration !== undefined
                ? resolveNonNegativeNumber(
                      updates.duration,
                      existing.duration,
                      "duration"
                  )
                : existing.duration,

        description:
            updates.description !== undefined
                ? normalizeDescription(updates.description)
                : existing.description,

        icon: updates.icon !== undefined ? updates.icon : existing.icon,
        noIcon: updates.noIcon !== undefined ? updates.noIcon : existing.noIcon,

        titleStyle: updates.titleStyle
            ? { ...existing.titleStyle, ...updates.titleStyle }
            : existing.titleStyle,

        descriptionStyle: updates.descriptionStyle
            ? { ...existing.descriptionStyle, ...updates.descriptionStyle }
            : existing.descriptionStyle,

        backgroundColor:
            updates.backgroundColor !== undefined
                ? updates.backgroundColor
                : existing.backgroundColor,

        transparent:
            updates.transparent !== undefined
                ? updates.transparent
                : existing.transparent,

        enterDuration:
            updates.enterDuration !== undefined
                ? resolveNonNegativeNumber(
                      updates.enterDuration,
                      existing.enterDuration,
                      "enterDuration"
                  )
                : existing.enterDuration,

        exitDuration:
            updates.exitDuration !== undefined
                ? resolveNonNegativeNumber(
                      updates.exitDuration,
                      existing.exitDuration,
                      "exitDuration"
                  )
                : existing.exitDuration,

        accessibilityLabel:
            updates.accessibilityLabel !== undefined
                ? normalizeAccessibilityLabel(updates.accessibilityLabel)
                : existing.accessibilityLabel,

        dismissible:
            updates.dismissible !== undefined
                ? updates.dismissible
                : existing.dismissible,

        scope:
            updates.scope !== undefined
                ? normalizeScope(updates.scope)
                : existing.scope,

        onShow: updates.onShow !== undefined ? updates.onShow : existing.onShow,
        onPress:
            updates.onPress !== undefined ? updates.onPress : existing.onPress,
        onDismiss:
            updates.onDismiss !== undefined
                ? updates.onDismiss
                : existing.onDismiss,

        render:
            updates.render !== undefined ? updates.render : existing.render,
    };
}
