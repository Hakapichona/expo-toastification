// components/ToastItem.tsx
import { useEffect, useRef } from "react";
import type { JSX } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { ToastInternal } from "../types";
import { VARIANT_THEMES } from "../theme/variants";
import { getDefaultIconForVariant } from "./icons/DefaultIcons";

export interface ToastItemProps {
    toast: ToastInternal;
    onHide: () => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

export function ToastItem(props: ToastItemProps): JSX.Element {
    const { toast, onHide } = props;
    const { options } = toast;

    const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: 0,
                duration: options.enterDuration,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: options.enterDuration,
                useNativeDriver: true,
            }),
        ]).start();

        const timeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: SCREEN_WIDTH,
                    duration: options.exitDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: options.exitDuration,
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (finished) {
                    onHide();
                }
            });
        }, options.duration);

        return () => {
            clearTimeout(timeout);
        };
    }, [
        translateX,
        opacity,
        options.duration,
        options.enterDuration,
        options.exitDuration,
        onHide,
    ]);

    const theme = VARIANT_THEMES[options.variant];

    const iconNode = options.noIcon
        ? null
        : (options.icon ?? getDefaultIconForVariant(options.variant, theme.iconColor));

    const hasDescription = options.description != null && options.description.length > 0;

    return (
        <Animated.View
            style={[
                styles.toast,
                { backgroundColor: options.backgroundColor },
                {
                    opacity,
                    transform: [{ translateX }],
                },
            ]}
        >
            {iconNode != null && (
                <View style={styles.iconContainer}>{iconNode}</View>
            )}

            <View style={styles.textContainer}>
                <Text style={[styles.title, options.titleStyle]}>
                    {toast.title}
                </Text>

                {hasDescription && (
                    <Text style={[styles.description, options.descriptionStyle]}>
                        {options.description}
                    </Text>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 8,
        minWidth: "80%",
        maxWidth: "92%",
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
