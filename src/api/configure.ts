import { toastGlobalConfig, type ToastGlobalConfig } from "../core/configuration";
import { toastManager } from "../core/toast-manager";
import { resolveNonNegativeNumber, warn } from "../core/validation";
import type { ToastColorScheme, ToastEntryDirection } from "../types";

export interface ToastUserConfig extends Partial<ToastGlobalConfig> {
    /** Max number of toasts that can be displayed simultaneously. */
    maxToasts?: number;
}

const NUMERIC_FIELDS = [
    "duration",
    "enterDuration",
    "exitDuration",
    "swipeThreshold",
] as const;

const VALID_COLOR_SCHEMES: ReadonlyArray<ToastColorScheme> = [
    "light",
    "dark",
    "auto",
];

const VALID_ENTRY_DIRECTIONS: ReadonlyArray<ToastEntryDirection> = [
    "top",
    "bottom",
    "left",
    "right",
    "vertical",
    "vertical-right",
    "vertical-left",
];

function isNumericField(
    key: string
): key is (typeof NUMERIC_FIELDS)[number] {
    return (NUMERIC_FIELDS as ReadonlyArray<string>).includes(key);
}

export function configureToasts(config: ToastUserConfig): void {
    const { maxToasts, ...visual } = config;

    const defined: Partial<ToastGlobalConfig> = {};

    (Object.keys(visual) as Array<keyof ToastGlobalConfig>).forEach((key) => {
        const value = visual[key];
        if (value === undefined) return;

        if (isNumericField(key)) {
            defined[key] = resolveNonNegativeNumber(
                value as number,
                toastGlobalConfig[key],
                key
            );
            return;
        }

        if (key === "colorScheme") {
            const scheme = value as ToastColorScheme;
            if (!VALID_COLOR_SCHEMES.includes(scheme)) {
                warn(
                    `Invalid colorScheme "${String(scheme)}"; expected "light" | "dark" | "auto". Keeping "${toastGlobalConfig.colorScheme}".`
                );
                return;
            }
            defined.colorScheme = scheme;
            return;
        }

        if (key === "dismissible") {
            if (typeof value !== "boolean") {
                warn(
                    `Invalid dismissible "${String(value)}"; expected boolean. Keeping ${toastGlobalConfig.dismissible}.`
                );
                return;
            }
            defined.dismissible = value;
            return;
        }

        if (key === "entryDirection") {
            const direction = value as ToastEntryDirection;
            if (!VALID_ENTRY_DIRECTIONS.includes(direction)) {
                warn(
                    `Invalid entryDirection "${String(direction)}"; expected one of ${VALID_ENTRY_DIRECTIONS.join(" | ")}. Keeping "${toastGlobalConfig.entryDirection}".`
                );
                return;
            }
            defined.entryDirection = direction;
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (defined as any)[key] = value;
    });

    Object.assign(toastGlobalConfig, defined);

    if (maxToasts !== undefined) {
        toastManager.configure({ maxToasts });
    }
}
