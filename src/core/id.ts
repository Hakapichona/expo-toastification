let counter = 0;

export function createToastId(): string {
    counter += 1;
    return `toast-${counter.toString(36)}-${Date.now().toString(36)}`;
}
