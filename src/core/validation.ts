const PREFIX = "[expo-toastification]";

export function warn(message: string): void {
    // eslint-disable-next-line no-console
    console.warn(`${PREFIX} ${message}`);
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function resolveNonNegativeNumber(
    value: number | undefined,
    fallback: number,
    field: string
): number {
    if (value === undefined) return fallback;

    if (typeof value !== "number" || !isFinite(value) || value < 0) {
        warn(
            `Invalid value for "${field}" (${String(value)}); expected a non-negative finite number. Falling back to ${fallback}.`
        );
        return fallback;
    }

    return value;
}

export function resolvePositiveNumber(
    value: number | undefined,
    fallback: number,
    field: string
): number {
    if (value === undefined) return fallback;

    if (typeof value !== "number" || !isFinite(value) || value <= 0) {
        warn(
            `Invalid value for "${field}" (${String(value)}); expected a finite number greater than 0. Falling back to ${fallback}.`
        );
        return fallback;
    }

    return value;
}
