import type { JSX } from "react";
import Svg, { Path } from "react-native-svg";

import type { ToastVariant } from "../../types";

export interface DefaultIconProps {
    color: string;
    size?: number;
}

const DEFAULT_SIZE = 20;

const CIRCLE_RING_PATH =
    "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z";

const SUCCESS_CHECK_PATH =
    "M14.59 5.58L8 12.17L5.41 9.59L4 11L8 15L16 7L14.59 5.58Z";

const ERROR_X_PATH =
    "M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6Z";

const WARNING_BANG_PATH = "M9 5H11V12H9V5ZM9 13.5H11V15.5H9V13.5Z";

export function SuccessIcon(props: DefaultIconProps): JSX.Element {
    const { color, size = DEFAULT_SIZE } = props;
    return (
        <Svg width={size} height={size} viewBox="0 0 20 20">
            <Path d={CIRCLE_RING_PATH} fill={color} />
            <Path d={SUCCESS_CHECK_PATH} fill={color} />
        </Svg>
    );
}

export function ErrorIcon(props: DefaultIconProps): JSX.Element {
    const { color, size = DEFAULT_SIZE } = props;
    return (
        <Svg width={size} height={size} viewBox="0 0 20 20">
            <Path d={CIRCLE_RING_PATH} fill={color} />
            <Path d={ERROR_X_PATH} fill={color} />
        </Svg>
    );
}

export function InfoIcon(props: DefaultIconProps): JSX.Element {
    return <SuccessIcon {...props} />;
}

export function WarningIcon(props: DefaultIconProps): JSX.Element {
    const { color, size = DEFAULT_SIZE } = props;
    return (
        <Svg width={size} height={size} viewBox="0 0 20 20">
            <Path d={CIRCLE_RING_PATH} fill={color} />
            <Path d={WARNING_BANG_PATH} fill={color} />
        </Svg>
    );
}

export function getDefaultIconForVariant(
    variant: ToastVariant,
    color: string
): JSX.Element | null {
    switch (variant) {
        case "success":
            return <SuccessIcon color={color} />;
        case "error":
            return <ErrorIcon color={color} />;
        case "info":
            return <InfoIcon color={color} />;
        case "warning":
            return <WarningIcon color={color} />;
        case "default":
        default:
            return null;
    }
}
