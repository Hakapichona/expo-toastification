export type ToastVariant = "default" | "success" | "error" | "info" | "warning";
export type ToastPosition = "top" | "bottom";

/** Opciones públicas (input del usuario) */
export interface ToastOptions {
    variant?: ToastVariant;
    duration?: number;
    position?: ToastPosition;
}

/** Opciones internas ya normalizadas */
export interface ToastResolvedOptions {
    readonly variant: ToastVariant;
    readonly duration: number;
    readonly position: ToastPosition;
}

/** Entidad interna del sistema */
export interface ToastInternal {
    readonly id: string;
    readonly message: string;
    readonly options: ToastResolvedOptions;
}
