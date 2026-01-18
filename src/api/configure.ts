import { toastGlobalConfig } from "../core/configuration";

export type ToastUserConfig = Partial<
    typeof toastGlobalConfig
>;

export function configureToasts(
    config: ToastUserConfig
): void {
    Object.assign(toastGlobalConfig, config);
}
