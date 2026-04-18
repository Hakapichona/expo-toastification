// api/configure.ts
import { toastGlobalConfig, type ToastGlobalConfig } from "../core/configuration";
import { toastManager } from "../core/toast-manager";

export interface ToastUserConfig extends Partial<ToastGlobalConfig> {
    /** Max number of toasts that can be displayed simultaneously. */
    maxToasts?: number;
}

export function configureToasts(config: ToastUserConfig): void {
    const { maxToasts, ...visual } = config;

    const defined: Partial<ToastGlobalConfig> = {};
    (Object.keys(visual) as Array<keyof ToastGlobalConfig>).forEach((key) => {
        const value = visual[key];
        if (value !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (defined as any)[key] = value;
        }
    });

    Object.assign(toastGlobalConfig, defined);

    if (typeof maxToasts === "number" && maxToasts > 0) {
        toastManager.configure({ maxToasts });
    }
}
