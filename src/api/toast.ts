// api/toast.ts
import { toastManager } from "../core/toast-manager";
import { ToastOptions } from "../types";

type ToastFn = (message: string, options?: ToastOptions) => void;

export const toast = Object.assign(
    ((message, options) =>
        toastManager.publish(message, options)) as ToastFn,
    {
        success: (msg: string, opts?: ToastOptions) =>
            toastManager.publish(msg, { ...opts, variant: "success" }),

        error: (msg: string, opts?: ToastOptions) =>
            toastManager.publish(msg, { ...opts, variant: "error" }),

        info: (msg: string, opts?: ToastOptions) =>
            toastManager.publish(msg, { ...opts, variant: "info" }),

        warning: (msg: string, opts?: ToastOptions) =>
            toastManager.publish(msg, { ...opts, variant: "warning" }),
    }
);
