// components/ToastItem.tsx
import { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    Dimensions,
} from "react-native";

import type { ToastInternal } from "../types";

export interface ToastItemProps {
    toast: ToastInternal;
    onHide: () => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

export function ToastItem(props: ToastItemProps) {
    const { toast, onHide } = props;
    const { options } = toast;

    // Start outside the screen (right)
    const translateX = useRef(
        new Animated.Value(SCREEN_WIDTH)
    ).current;

    const opacity = useRef(
        new Animated.Value(0)
    ).current;

    useEffect(() => {
        // ENTER: slide from right to center
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
            // EXIT: slide back to right
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

    return (
        <Animated.View
            style={[
                styles.toast,
                styles[options.variant],
                {
                    opacity,
                    transform: [{ translateX }],
                },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        fontSize: options.fontSize,
                        color: options.textColor,
                    },
                ]}
            >
                {toast.message}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 8,
        minWidth: "70%",
    },
    text: {
        textAlign: "center",
        fontWeight: "500",
    },
    default: {
        backgroundColor: "#333",
    },
    success: {
        backgroundColor: "#22c55e",
    },
    error: {
        backgroundColor: "#ef4444",
    },
    info: {
        backgroundColor: "#3b82f6",
    },
    warning: {
        backgroundColor: "#f59e0b",
    },
});
