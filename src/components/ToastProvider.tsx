// ToastProvider.tsx
import type { PropsWithChildren, JSX } from "react";
import {ToastHost} from "./ToastHost.tsx";

export function ToastProvider(
    props: PropsWithChildren
): JSX.Element {
    const { children } = props;

    return (
        <>
            {children}
            <ToastHost />
        </>
    );
}
