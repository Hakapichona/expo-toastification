// example/App.tsx
//
// Minimal end-to-end usage demo for expo-toastification.
// Drop this into any Expo app (or use it as the root of a fresh one) to
// explore every feature the library exposes.
//
// Peer deps expected in the host app:
//   expo, react, react-native,
//   react-native-get-random-values, react-native-safe-area-context,
//   react-native-svg, uuid
//
// Make sure `import "react-native-get-random-values"` is imported once at the
// top of your app entry for the uuid v4 generator to work on native.

import "react-native-get-random-values";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import {
    ToastProvider,
    configureToasts,
    toast,
} from "expo-toastification";

// 1) Configure global defaults once at app init.
configureToasts({
    duration: 3500,
    position: "top",
    enterDuration: 300,
    exitDuration: 220,
    maxToasts: 4,
    titleStyle: { fontFamily: undefined, fontWeight: "700" },
    descriptionStyle: { fontFamily: undefined },
});

// Example of a custom icon (any React node works).
function HeartIcon() {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
                d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10h-4z"
                fill="#EC4899"
            />
        </Svg>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <ToastProvider>
                <ScrollView contentContainerStyle={styles.screen}>
                    <Text style={styles.h1}>expo-toastification demo</Text>

                    <Section title="Variants (title only)">
                        <DemoButton
                            label="toast.success"
                            onPress={() => toast.success("Guardado con éxito")}
                        />
                        <DemoButton
                            label="toast.error"
                            onPress={() => toast.error("Algo salió mal. Intenta de nuevo.")}
                        />
                        <DemoButton
                            label="toast.info"
                            onPress={() => toast.info("Perfil actualizado")}
                        />
                        <DemoButton
                            label="toast.warning"
                            onPress={() => toast.warning("Revisá tu conexión")}
                        />
                        <DemoButton
                            label="toast (default)"
                            onPress={() => toast("Mensaje neutro")}
                        />
                    </Section>

                    <Section title="Title + description">
                        <DemoButton
                            label="Success with description"
                            onPress={() =>
                                toast.success("Preocupación agendada", {
                                    description: "Preocupación agendada correctamente.",
                                })
                            }
                        />
                        <DemoButton
                            label="Info with description"
                            onPress={() =>
                                toast.info("Perfil actualizado", {
                                    description: "Tus cambios han sido guardados.",
                                })
                            }
                        />
                        <DemoButton
                            label="Long error"
                            onPress={() =>
                                toast.error("Ops!", {
                                    description:
                                        "No hay suficientes fondos en la tarjeta para completar la transacción. Por favor, use otra tarjeta o contacte a su banco.",
                                    duration: 6000,
                                })
                            }
                        />
                    </Section>

                    <Section title="Icons">
                        <DemoButton
                            label="Custom icon (heart)"
                            onPress={() =>
                                toast("Te quiero", {
                                    description: "Este toast tiene un ícono custom.",
                                    icon: <HeartIcon />,
                                    backgroundColor: "#FCE7F3",
                                    titleStyle: { color: "#831843" },
                                    descriptionStyle: { color: "#9D174D" },
                                })
                            }
                        />
                        <DemoButton
                            label="No icon"
                            onPress={() =>
                                toast.error("Algo salió mal. Intenta de nuevo.", {
                                    noIcon: true,
                                })
                            }
                        />
                    </Section>

                    <Section title="Style overrides">
                        <DemoButton
                            label="Custom styles"
                            onPress={() =>
                                toast.success("Rutina creada", {
                                    description: "La rutina fue creada de forma exitosa.",
                                    titleStyle: { fontSize: 17, fontWeight: "800" },
                                    descriptionStyle: { fontSize: 13, letterSpacing: 0.2 },
                                    backgroundColor: "#D1F2CF",
                                })
                            }
                        />
                        <DemoButton
                            label="Bottom position"
                            onPress={() =>
                                toast.info("Estoy abajo", {
                                    description: "Aparece en la parte inferior.",
                                    position: "bottom",
                                })
                            }
                        />
                    </Section>

                    <Section title="toast.custom (options required)">
                        <DemoButton
                            label="Custom fully branded"
                            onPress={() =>
                                toast.custom("Brand message", {
                                    description: "Totalmente custom — options es obligatorio.",
                                    backgroundColor: "#0F172A",
                                    titleStyle: { color: "#F8FAFC", fontSize: 15 },
                                    descriptionStyle: { color: "#CBD5E1" },
                                    icon: <HeartIcon />,
                                    duration: 4000,
                                })
                            }
                        />
                    </Section>

                    <Section title="Programmatic dismiss">
                        <DemoButton
                            label="Show 10s toast, dismiss after 1.5s"
                            onPress={() => {
                                const id = toast.info("Sincronizando…", {
                                    description: "Esto debería cerrarse antes de tiempo.",
                                    duration: 10000,
                                });
                                setTimeout(() => toast.dismiss(id), 1500);
                            }}
                        />
                    </Section>
                </ScrollView>
            </ToastProvider>
        </SafeAreaProvider>
    );
}

function Section(props: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.h2}>{props.title}</Text>
            <View style={styles.row}>{props.children}</View>
        </View>
    );
}

function DemoButton(props: { label: string; onPress: () => void }) {
    return (
        <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
        >
            <Text style={styles.buttonLabel}>{props.label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        paddingTop: 60,
        gap: 20,
    },
    h1: {
        fontSize: 24,
        fontWeight: "800",
        color: "#0F172A",
    },
    h2: {
        fontSize: 14,
        fontWeight: "700",
        color: "#475569",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    section: {
        gap: 4,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    button: {
        backgroundColor: "#111827",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonPressed: {
        opacity: 0.75,
    },
    buttonLabel: {
        color: "#F8FAFC",
        fontWeight: "600",
        fontSize: 13,
    },
});
