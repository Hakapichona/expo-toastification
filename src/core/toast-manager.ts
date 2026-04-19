import type { ToastDismissReason, ToastInternal, ToastOptions } from "../types";
import { createToastId } from "./id";
import { applyResolvedUpdates, normalizeOptions } from "./normalize-options";
import { isNonEmptyString, resolvePositiveNumber, warn } from "./validation";

type Subscriber = (toasts: ReadonlyArray<ToastInternal>) => void;
type ExitHandler = (reason: ToastDismissReason) => void;

export interface ToastUpdatePayload extends ToastOptions {
    title?: string;
}

class ToastManager {
    private readonly subscribers: Set<Subscriber> = new Set();
    private readonly exitHandlers: Map<string, ExitHandler> = new Map();

    private queue: ToastInternal[] = [];
    private active: ToastInternal[] = [];

    private maxToasts: number = 3;

    subscribe(fn: Subscriber): () => void {
        this.subscribers.add(fn);
        fn(this.active);
        return () => {
            this.subscribers.delete(fn);
        };
    }

    publish(title: string, options?: ToastOptions): string {
        if (!isNonEmptyString(title)) {
            warn(`toast() called with an empty or non-string title; skipped.`);
            return "";
        }

        const toast: ToastInternal = {
            id: createToastId(),
            title: title.trim(),
            options: normalizeOptions(options),
        };

        this.queue.push(toast);
        this.flush();

        return toast.id;
    }

    dismiss(id: string, reason: ToastDismissReason = "programmatic"): void {
        const handler = this.exitHandlers.get(id);
        if (handler) {
            handler(reason);
        } else {
            this.detach(id);
        }
    }

    registerExit(id: string, handler: ExitHandler): () => void {
        this.exitHandlers.set(id, handler);
        return () => {
            this.exitHandlers.delete(id);
        };
    }

    detach(id: string): void {
        this.active = this.active.filter((t) => t.id !== id);
        this.queue = this.queue.filter((t) => t.id !== id);
        this.exitHandlers.delete(id);
        this.flush();
        this.notify();
    }

    update(id: string, updates: ToastUpdatePayload): boolean {
        const transform = (existing: ToastInternal): ToastInternal => {
            const { title: newTitle, ...optionUpdates } = updates;

            const resolvedTitle =
                newTitle !== undefined && isNonEmptyString(newTitle)
                    ? newTitle.trim()
                    : existing.title;

            return {
                id: existing.id,
                title: resolvedTitle,
                options: applyResolvedUpdates(existing.options, optionUpdates),
            };
        };

        const activeIdx = this.active.findIndex((t) => t.id === id);
        if (activeIdx >= 0) {
            const next = [...this.active];
            next[activeIdx] = transform(next[activeIdx]);
            this.active = next;
            this.notify();
            return true;
        }

        const queueIdx = this.queue.findIndex((t) => t.id === id);
        if (queueIdx >= 0) {
            this.queue[queueIdx] = transform(this.queue[queueIdx]);
            return true;
        }

        return false;
    }

    configure(config: { maxToasts?: number }): void {
        if (config.maxToasts !== undefined) {
            this.maxToasts = resolvePositiveNumber(
                config.maxToasts,
                this.maxToasts,
                "maxToasts"
            );
            this.flush();
        }
    }

    private flush(): void {
        const availableSlots: number = this.maxToasts - this.active.length;

        if (availableSlots <= 0) return;
        if (this.queue.length === 0) return;

        const next: ToastInternal[] = this.queue.splice(0, availableSlots);

        this.active = [...this.active, ...next];
        this.notify();
    }

    private notify(): void {
        const snapshot: ReadonlyArray<ToastInternal> = [...this.active];
        this.subscribers.forEach((fn) => fn(snapshot));
    }
}

export const toastManager: ToastManager = new ToastManager();
