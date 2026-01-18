import {toastManager} from "./core/toast-manager";
export { toast } from "./api/toast";
export * from "./types";

toastManager.configure({ maxToasts: 4 });
