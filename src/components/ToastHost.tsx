import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    UIManager,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { toastManager } from "../core/toast-manager";
import type { ToastInternal } from "../types";
import { ToastItem } from "./ToastItem";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface ToastHostProps {
    scope?: string;
}

export function ToastHost(props: ToastHostProps): JSX.Element {
    const { scope = "default" } = props;
    const insets = useSafeAreaInsets();

    const [toasts, setToasts] = useState<ReadonlyArray<ToastInternal>>([]);

    useEffect(() => {
        const unregisterHost = toastManager.registerHost(scope);
        // The first emission fires synchronously on subscribe with the current
        // state; don't animate that initial paint.
        let isFirstEmission = true;
        const unsubscribe = toastManager.subscribe((next) => {
            if (!isFirstEmission) {
                LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                );
            }
            isFirstEmission = false;
            setToasts(next.filter((t) => t.options.scope === scope));
        });
        return () => {
            unsubscribe();
            unregisterHost();
        };
    }, [scope]);

    const topToasts = useMemo(
        (): ReadonlyArray<ToastInternal> =>
            toasts.filter((t) => t.options.position === "top"),
        [toasts]
    );

    const bottomToasts = useMemo(
        (): ReadonlyArray<ToastInternal> =>
            toasts.filter((t) => t.options.position === "bottom"),
        [toasts]
    );

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <View
                pointerEvents="box-none"
                style={[styles.stack, { top: insets.top + 12 }]}
            >
                {topToasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </View>

            <View
                pointerEvents="box-none"
                style={[styles.stack, { bottom: insets.bottom + 12 }]}
            >
                {bottomToasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
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
        paddingHorizontal: 16,
    },
});
