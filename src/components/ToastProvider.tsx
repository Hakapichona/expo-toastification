import type { PropsWithChildren, JSX } from "react";

import { ToastHost } from "./ToastHost";

export interface ToastProviderProps extends PropsWithChildren {
    /**
     * Restrict this host to toasts published with a matching `scope`.
     * Defaults to `"default"`.
     */
    scope?: string;
}

export function ToastProvider(props: ToastProviderProps): JSX.Element {
    const { children, scope = "default" } = props;

    return (
        <>
            {children}
            <ToastHost scope={scope} />
        </>
    );
}
