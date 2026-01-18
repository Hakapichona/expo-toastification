// components/ToastHost.tsx
import {JSX, useEffect, useMemo, useState} from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { toastManager } from "../core/toast-manager";
import type { ToastInternal } from "../types.ts";
import { ToastItem } from "./ToastItem.tsx";

export function ToastHost(): JSX.Element {
    const insets = useSafeAreaInsets();

    const [toasts, setToasts] = useState<ReadonlyArray<ToastInternal>>([]);

    useEffect((): (() => void) => {
        return toastManager.subscribe(setToasts);
    }, []);

    const topToasts = useMemo(
        (): ReadonlyArray<ToastInternal> =>
            toasts.filter(t => t.options.position === "top"),
        [toasts]
    );

    const bottomToasts = useMemo(
        (): ReadonlyArray<ToastInternal> =>
            toasts.filter(t => t.options.position === "bottom"),
        [toasts]
    );

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <View
                pointerEvents="box-none"
                style={[styles.stack, { top: insets.top + 12 }]}
            >
                {topToasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onHide={() => toastManager.remove(toast.id)}
                    />
                ))}
            </View>

            <View
                pointerEvents="box-none"
                style={[styles.stack, { bottom: insets.bottom + 12 }]}
            >
                {bottomToasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onHide={() => toastManager.remove(toast.id)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    stack: {
        position: "absolute",
        width: "100%",
        alignItems: "center",
    },
});
