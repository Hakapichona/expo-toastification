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
    private readonly hostScopes: Map<string, number> = new Map();

    private queue: ToastInternal[] = [];
    private active: ToastInternal[] = [];

    private maxToasts: number = 3;
    private maxQueue: number = 50;

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

        if (this.active.length + this.queue.length >= this.maxToasts + this.maxQueue) {
            warn(
                `Toast queue is full (maxQueue = ${this.maxQueue}); dropping "${toast.title}". ` +
                    `Toasts may be published faster than they are dismissed.`
            );
            return "";
        }

        this.queue.push(toast);
        this.flush();

        return toast.id;
    }

    dismiss(id: string, reason: ToastDismissReason = "programmatic"): void {
        const handler = this.exitHandlers.get(id);
        if (handler) {
            handler(reason);
            return;
        }

        // No mounted item (e.g. the toast is still queued). Fire onDismiss
        // ourselves before detaching, since there is no exit animation to do it.
        const toast =
            this.queue.find((t) => t.id === id) ??
            this.active.find((t) => t.id === id);
        toast?.options.onDismiss?.(reason);
        this.detach(id);
    }

    /**
     * Track a mounted host so we can warn about duplicate providers sharing a
     * scope, which causes duplicated rendering and exit-handler collisions.
     */
    registerHost(scope: string): () => void {
        const count = (this.hostScopes.get(scope) ?? 0) + 1;
        this.hostScopes.set(scope, count);

        if (count > 1) {
            warn(
                `Multiple ToastProvider/ToastHost instances are mounted for scope "${scope}". ` +
                    `Toasts will render duplicated and dismiss handlers may collide. ` +
                    `Mount a single provider per scope.`
            );
        }

        return () => {
            const next = (this.hostScopes.get(scope) ?? 1) - 1;
            if (next <= 0) {
                this.hostScopes.delete(scope);
            } else {
                this.hostScopes.set(scope, next);
            }
        };
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
        // Refill from the queue before notifying so the removal and any
        // promotion are reflected in a single render.
        this.fill();
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

    configure(config: { maxToasts?: number; maxQueue?: number }): void {
        if (config.maxToasts !== undefined) {
            this.maxToasts = resolvePositiveNumber(
                config.maxToasts,
                this.maxToasts,
                "maxToasts"
            );
        }

        if (config.maxQueue !== undefined) {
            this.maxQueue = resolvePositiveNumber(
                config.maxQueue,
                this.maxQueue,
                "maxQueue"
            );
        }

        this.flush();
    }

    /** Promote queued toasts into the active set. Returns true if it changed. */
    private fill(): boolean {
        const availableSlots: number = this.maxToasts - this.active.length;

        if (availableSlots <= 0) return false;
        if (this.queue.length === 0) return false;

        const next: ToastInternal[] = this.queue.splice(0, availableSlots);
        this.active = [...this.active, ...next];
        return true;
    }

    private flush(): void {
        if (this.fill()) this.notify();
    }

    private notify(): void {
        const snapshot: ReadonlyArray<ToastInternal> = [...this.active];
        this.subscribers.forEach((fn) => fn(snapshot));
    }
}

export const toastManager: ToastManager = new ToastManager();
