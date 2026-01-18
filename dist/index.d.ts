import { PropsWithChildren, JSX } from 'react';

type ToastVariant = "default" | "success" | "error" | "info" | "warning";
type ToastPosition = "top" | "bottom";
/** Opciones públicas (input del usuario) */
interface ToastOptions {
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
interface ToastResolvedOptions {
    readonly variant: ToastVariant;
    readonly duration: number;
    readonly position: ToastPosition;
    readonly fontSize: number;
    readonly textColor: string;
    readonly enterDuration: number;
    readonly exitDuration: number;
}
/** Entidad interna del sistema */
interface ToastInternal {
    readonly id: string;
    readonly message: string;
    readonly options: ToastResolvedOptions;
}

type ToastFn = (message: string, options?: ToastOptions) => void;
declare const toast: ToastFn & {
    success: (msg: string, opts?: ToastOptions) => void;
    error: (msg: string, opts?: ToastOptions) => void;
    info: (msg: string, opts?: ToastOptions) => void;
    warning: (msg: string, opts?: ToastOptions) => void;
};

type ToastGlobalConfig = Omit<ToastResolvedOptions, "variant" | "position" | "duration">;
declare const toastGlobalConfig: ToastGlobalConfig;

type ToastUserConfig = Partial<typeof toastGlobalConfig>;
declare function configureToasts(config: ToastUserConfig): void;

declare function ToastProvider(props: PropsWithChildren): JSX.Element;

export { type ToastInternal, type ToastOptions, type ToastPosition, ToastProvider, type ToastResolvedOptions, type ToastVariant, configureToasts, toast };
