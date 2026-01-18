// core/toast-manager.ts
import { ToastInternal, ToastOptions } from "../types";
import { normalizeOptions } from "./normalize-options";

type Subscriber = (toasts: ReadonlyArray<ToastInternal>) => void;

class ToastManager {
    private readonly subscribers: Set<Subscriber> = new Set();

    private queue: ToastInternal[] = [];
    private active: ToastInternal[] = [];

    private maxToasts: number = 3;

    /* =======================
       Subscription
    ======================= */

    subscribe(fn: Subscriber): () => void {
        this.subscribers.add(fn);
        fn(this.active);
        return () => this.subscribers.delete(fn);
    }

    /* =======================
       Public API
    ======================= */

    publish(message: string, options?: ToastOptions): void {
        const toast: ToastInternal = {
            id: crypto.randomUUID(),
            message,
            options: normalizeOptions(options),
        };

        this.queue.push(toast);
        this.flush();
    }

    remove(id: string): void {
        this.active = this.active.filter((t) => t.id !== id);
        this.flush();
    }

    configure(config: { maxToasts?: number }): void {
        if (
            typeof config.maxToasts === "number" &&
            config.maxToasts > 0
        ) {
            this.maxToasts = config.maxToasts;
            this.flush();
        }
    }

    /* =======================
       Internal mechanics
    ======================= */

    private flush(): void {
        const availableSlots: number =
            this.maxToasts - this.active.length;

        if (availableSlots <= 0) return;
        if (this.queue.length === 0) return;

        const next: ToastInternal[] =
            this.queue.splice(0, availableSlots);

        this.active = [...this.active, ...next];
        this.notify();
    }

    private notify(): void {
        const snapshot: ReadonlyArray<ToastInternal> = [...this.active];
        this.subscribers.forEach((fn) => fn(snapshot));
    }
}

export const toastManager: ToastManager = new ToastManager();
