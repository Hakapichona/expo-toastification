// components/ToastItem.tsx
import {JSX, useEffect, useRef} from "react";
import { Animated, StyleSheet, Text } from "react-native";

import type { ToastInternal } from "../types.ts";

export interface ToastItemProps {
    toast: ToastInternal;
    onHide: () => void;
}

export function ToastItem(props: ToastItemProps): JSX.Element {
    const { toast, onHide } = props;

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(10)).current;

    useEffect((): (() => void) => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start();

        const timeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 160,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 10,
                    duration: 160,
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (finished) onHide();
            });
        }, toast.options.duration);

        return () => clearTimeout(timeout);
    }, [opacity, translateY, toast.options.duration, onHide]);

    return (
        <Animated.View
            style={[
                styles.toast,
                styles[toast.options.variant],
                { opacity, transform: [{ translateY }] },
            ]}
        >
            <Text style={styles.text}>{toast.message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 8,
        minWidth: "70%",
    },
    text: {
        color: "#fff",
        textAlign: "center",
    },
    default: { backgroundColor: "#333" },
    success: { backgroundColor: "#22c55e" },
    error: { backgroundColor: "#ef4444" },
    info: { backgroundColor: "#3b82f6" },
    warning: { backgroundColor: "#f59e0b" },
});
