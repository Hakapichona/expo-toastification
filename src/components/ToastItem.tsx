import { memo, useEffect, useMemo, useRef } from "react";
import type { JSX } from "react";
import {
    AccessibilityInfo,
    Animated,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme,
    useWindowDimensions,
    type AccessibilityRole,
    type PanResponderInstance,
} from "react-native";

import { toastGlobalConfig } from "../core/configuration";
import { toastManager } from "../core/toast-manager";
import { VARIANT_THEMES, type ToastResolvedScheme } from "../theme/variants";
import type {
    ToastDismissReason,
    ToastEntryDirection,
    ToastInternal,
    ToastPosition,
    ToastVariant,
} from "../types";
import { getDefaultIconForVariant } from "./icons/DefaultIcons";

export interface ToastItemProps {
    toast: ToastInternal;
}

const VERTICAL_OFFSET = 80;
const DIAGONAL_HORIZONTAL_OFFSET = 80;
const PAN_ACTIVATION_DX = 5;
const TRANSLUCENT_ALPHA = 0.75;

function withAlpha(color: string, alpha: number): string {
    const a = Math.max(0, Math.min(1, alpha));
    const trimmed = color.trim();

    if (trimmed.startsWith("#")) {
        let hex = trimmed;
        if (hex.length === 4) {
            hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        if (hex.length === 7) {
            const alphaHex = Math.round(a * 255).toString(16).padStart(2, "0");
            return `${hex}${alphaHex}`;
        }
        if (hex.length === 9) {
            const alphaHex = Math.round(a * 255).toString(16).padStart(2, "0");
            return `${hex.slice(0, 7)}${alphaHex}`;
        }
    }

    const rgbMatch = trimmed.match(
        /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i
    );
    if (rgbMatch) {
        return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${a})`;
    }

    return trimmed;
}

function accessibilityRoleFor(variant: ToastVariant): AccessibilityRole | undefined {
    if (variant === "error" || variant === "warning") return "alert";
    return undefined;
}

function liveRegionFor(variant: ToastVariant): "none" | "polite" | "assertive" {
    if (variant === "error" || variant === "warning") return "assertive";
    return "polite";
}

function buildAccessibilityLabel(
    title: string,
    description: string | null,
    variant: ToastVariant
): string {
    const role = variant === "default" ? "" : `${variant}. `;
    return description != null ? `${role}${title}. ${description}` : `${role}${title}`;
}

function resolveActiveScheme(
    systemScheme: "light" | "dark" | "unspecified" | null | undefined
): ToastResolvedScheme {
    const config = toastGlobalConfig.colorScheme;
    if (config === "light" || config === "dark") return config;
    return systemScheme === "dark" ? "dark" : "light";
}

interface EntryOffset {
    x: number;
    y: number;
}

function computeEntryOffset(
    direction: ToastEntryDirection,
    position: ToastPosition,
    windowWidth: number
): EntryOffset {
    const verticalForPosition = position === "top" ? -VERTICAL_OFFSET : VERTICAL_OFFSET;

    switch (direction) {
        case "top":
            return { x: 0, y: -VERTICAL_OFFSET };
        case "bottom":
            return { x: 0, y: VERTICAL_OFFSET };
        case "left":
            return { x: -windowWidth, y: 0 };
        case "vertical":
            return { x: 0, y: verticalForPosition };
        case "vertical-right":
            return { x: DIAGONAL_HORIZONTAL_OFFSET, y: verticalForPosition };
        case "vertical-left":
            return { x: -DIAGONAL_HORIZONTAL_OFFSET, y: verticalForPosition };
        case "right":
        default:
            return { x: windowWidth, y: 0 };
    }
}

function ToastItemImpl(props: ToastItemProps): JSX.Element {
    const { toast } = props;
    const { options } = toast;

    const { width: windowWidth } = useWindowDimensions();
    const systemScheme = useColorScheme();
    const activeScheme = resolveActiveScheme(systemScheme);
    const theme = VARIANT_THEMES[activeScheme][options.variant];

    const initialOffset = useMemo(
        () =>
            computeEntryOffset(
                toastGlobalConfig.entryDirection,
                options.position,
                windowWidth
            ),
        [options.position, windowWidth]
    );

    const translateX = useRef(new Animated.Value(initialOffset.x)).current;
    const translateY = useRef(new Animated.Value(initialOffset.y)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const exitingRef = useRef(false);

    const stateRef = useRef({
        dismissible: options.dismissible,
        exitDuration: options.exitDuration,
        swipeThreshold: toastGlobalConfig.swipeThreshold,
        windowWidth,
        entryOffset: initialOffset,
        onShow: options.onShow,
        onPress: options.onPress,
        onDismiss: options.onDismiss,
    });
    stateRef.current = {
        dismissible: options.dismissible,
        exitDuration: options.exitDuration,
        swipeThreshold: toastGlobalConfig.swipeThreshold,
        windowWidth,
        entryOffset: initialOffset,
        onShow: options.onShow,
        onPress: options.onPress,
        onDismiss: options.onDismiss,
    };

    const playDirectionalExit = (reason: ToastDismissReason): void => {
        if (exitingRef.current) return;
        exitingRef.current = true;

        const { x, y } = stateRef.current.entryOffset;

        Animated.parallel([
            Animated.timing(translateX, {
                toValue: x,
                duration: stateRef.current.exitDuration,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: y,
                duration: stateRef.current.exitDuration,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: stateRef.current.exitDuration,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) {
                stateRef.current.onDismiss?.(reason);
                toastManager.detach(toast.id);
            }
        });
    };

    const playHorizontalExit = (direction: 1 | -1): void => {
        if (exitingRef.current) return;
        exitingRef.current = true;

        Animated.parallel([
            Animated.timing(translateX, {
                toValue: direction * stateRef.current.windowWidth,
                duration: stateRef.current.exitDuration,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: stateRef.current.exitDuration,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) {
                stateRef.current.onDismiss?.("user");
                toastManager.detach(toast.id);
            }
        });
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: 0,
                duration: options.enterDuration,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: options.enterDuration,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: options.enterDuration,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) stateRef.current.onShow?.();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (options.duration <= 0) return;
        const timer = setTimeout(() => {
            toastManager.dismiss(toast.id, "timeout");
        }, options.duration);
        return () => clearTimeout(timer);
    }, [options.duration, toast.id]);

    useEffect(() => {
        return toastManager.registerExit(toast.id, playDirectionalExit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toast.id]);

    const panResponder = useRef<PanResponderInstance | null>(null);
    if (panResponder.current == null) {
        panResponder.current = PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_evt, gestureState) => {
                if (!stateRef.current.dismissible) return false;
                return (
                    Math.abs(gestureState.dx) > PAN_ACTIVATION_DX &&
                    Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
                );
            },
            onPanResponderMove: (_evt, gestureState) => {
                if (exitingRef.current) return;
                translateX.setValue(gestureState.dx);
                const fade =
                    1 -
                    Math.min(
                        1,
                        Math.abs(gestureState.dx) / (stateRef.current.windowWidth * 0.6)
                    );
                opacity.setValue(fade);
            },
            onPanResponderRelease: (_evt, gestureState) => {
                if (exitingRef.current) return;

                const threshold = stateRef.current.swipeThreshold;
                const shouldDismiss =
                    Math.abs(gestureState.dx) > threshold ||
                    Math.abs(gestureState.vx) > 0.5;

                if (shouldDismiss) {
                    const direction: 1 | -1 = gestureState.dx >= 0 ? 1 : -1;
                    playHorizontalExit(direction);
                } else {
                    Animated.parallel([
                        Animated.spring(translateX, {
                            toValue: 0,
                            useNativeDriver: true,
                        }),
                        Animated.spring(opacity, {
                            toValue: 1,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            },
            onPanResponderTerminate: () => {
                if (exitingRef.current) return;
                Animated.parallel([
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }),
                    Animated.spring(opacity, {
                        toValue: 1,
                        useNativeDriver: true,
                    }),
                ]).start();
            },
        });
    }

    const handlePress = (): void => {
        stateRef.current.onPress?.();
        if (stateRef.current.dismissible) {
            toastManager.dismiss(toast.id, "user");
        }
    };

    const label = useMemo(
        () =>
            options.accessibilityLabel ??
            buildAccessibilityLabel(toast.title, options.description, options.variant),
        [options.accessibilityLabel, options.description, options.variant, toast.title]
    );

    useEffect(() => {
        let cancelled = false;
        AccessibilityInfo.isScreenReaderEnabled()
            .then((enabled) => {
                if (!cancelled && enabled) {
                    AccessibilityInfo.announceForAccessibility(label);
                }
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [label]);

    const baseBackgroundColor = options.backgroundColor ?? theme.backgroundColor;
    const resolvedBackgroundColor = options.transparent
        ? withAlpha(baseBackgroundColor, TRANSLUCENT_ALPHA)
        : baseBackgroundColor;

    const titleStyle = useMemo(
        () => ({ ...theme.titleStyle, ...options.titleStyle }),
        [theme.titleStyle, options.titleStyle]
    );

    const descriptionStyle = useMemo(
        () => ({ ...theme.descriptionStyle, ...options.descriptionStyle }),
        [theme.descriptionStyle, options.descriptionStyle]
    );

    const animatedStyle = {
        opacity,
        transform: [{ translateX }, { translateY }],
    };

    if (options.render != null) {
        return (
            <Animated.View
                accessible
                accessibilityRole={accessibilityRoleFor(options.variant)}
                accessibilityLiveRegion={liveRegionFor(options.variant)}
                accessibilityLabel={label}
                style={[styles.customWrapper, animatedStyle]}
                {...(panResponder.current?.panHandlers ?? {})}
            >
                {options.render({
                    toast,
                    dismiss: () => toastManager.dismiss(toast.id, "user"),
                })}
            </Animated.View>
        );
    }

    const iconNode = options.noIcon
        ? null
        : (options.icon ?? getDefaultIconForVariant(options.variant, theme.iconColor));

    const hasDescription = options.description != null && options.description.length > 0;

    return (
        <Animated.View
            style={[
                styles.toast,
                { backgroundColor: resolvedBackgroundColor },
                animatedStyle,
            ]}
            {...(panResponder.current?.panHandlers ?? {})}
        >
            <Pressable
                accessible
                accessibilityRole={accessibilityRoleFor(options.variant)}
                accessibilityLiveRegion={liveRegionFor(options.variant)}
                accessibilityLabel={label}
                onPress={handlePress}
                style={styles.pressable}
            >
                {iconNode != null && (
                    <View style={styles.iconContainer}>{iconNode}</View>
                )}

                <View style={styles.textContainer}>
                    <Text style={[styles.title, titleStyle]}>{toast.title}</Text>

                    {hasDescription && (
                        <Text style={[styles.description, descriptionStyle]}>
                            {options.description}
                        </Text>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
}

export const ToastItem = memo(ToastItemImpl);

const styles = StyleSheet.create({
    toast: {
        borderRadius: 10,
        marginBottom: 8,
        minWidth: "80%",
        maxWidth: 480,
        overflow: "hidden",
    },
    customWrapper: {
        marginBottom: 8,
        minWidth: "80%",
        maxWidth: 480,
    },
    pressable: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    iconContainer: {
        marginRight: 10,
        marginTop: 1,
    },
    textContainer: {
        flex: 1,
        flexShrink: 1,
    },
    title: {
        textAlign: "left",
    },
    description: {
        marginTop: 2,
        textAlign: "left",
    },
});
