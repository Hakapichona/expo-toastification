export type ToastVariant = "default" | "success" | "error" | "info" | "warning";
export type ToastPosition = "top" | "bottom";

/** Opciones públicas (input del usuario) */
export interface ToastOptions {
    variant?: ToastVariant;
    duration?: number;
    position?: ToastPosition;

    /** Visual */
    fontSize?: number;
    textColor?: string;

    /** Animation */
    enterDuration?: number;
    exitDuration?: number;
}

/** Opciones internas ya normalizadas */
export interface ToastResolvedOptions {
    readonly variant: ToastVariant;
    readonly duration: number;
    readonly position: ToastPosition;

    readonly fontSize: number;
    readonly textColor: string;

    readonly enterDuration: number;
    readonly exitDuration: number;
}

/** Entidad interna del sistema */
export interface ToastInternal {
    readonly id: string;
    readonly message: string;
    readonly options: ToastResolvedOptions;
}
