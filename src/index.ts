import {toastManager} from "./core/toast-manager";
export { toast } from "./api/toast";
export * from "./types";
export { ToastProvider } from "./components/ToastProvider"

toastManager.configure({ maxToasts: 4 });
