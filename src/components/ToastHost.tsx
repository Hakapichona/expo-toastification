// components/ToastHost.tsx
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { toastManager } from "../core/toast-manager";
import type { ToastInternal } from "../types";
import { ToastItem } from "./ToastItem";

export const ToastHost: React.FC = () => {
    const insets = useSafeAreaInsets();

    const [toasts, setToasts] = useState<ReadonlyArray<ToastInternal>>([]);

    useEffect((): (() => void) => {
        return toastManager.subscribe(setToasts);
    }, []);

    const topToasts: ReadonlyArray<ToastInternal> = useMemo(
        () => toasts.filter((toast) => toast.options.position === "top"),
        [toasts]
    );

    const bottomToasts: ReadonlyArray<ToastInternal> = useMemo(
        () => toasts.filter((toast) => toast.options.position === "bottom"),
        [toasts]
    );

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {/* TOP STACK */}
            <View
                pointerEvents="box-none"
                style={[styles.stack, { top: insets.top + 12 }]}
            >
                {topToasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onHide={() => toastManager.remove(toast.id)}
                    />
                ))}
            </View>

            {/* BOTTOM STACK */}
            <View
                pointerEvents="box-none"
                style={[styles.stack, { bottom: insets.bottom + 12 }]}
            >
                {bottomToasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onHide={() => toastManager.remove(toast.id)}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    stack: {
        position: "absolute",
        width: "100%",
        alignItems: "center",
    },
});
