import type { ToastTextStyle, ToastVariant } from "../types";

export type ToastResolvedScheme = "light" | "dark";

export interface ToastVariantTheme {
    readonly backgroundColor: string;
    readonly iconColor: string;
    readonly titleStyle: Required<Pick<ToastTextStyle, "color" | "fontSize" | "fontWeight">>;
    readonly descriptionStyle: Required<Pick<ToastTextStyle, "color" | "fontSize" | "fontWeight">>;
}

const TITLE_BASE = {
    fontSize: 15,
    fontWeight: "700" as const,
};

const DESCRIPTION_BASE = {
    fontSize: 13,
    fontWeight: "400" as const,
};

const LIGHT: Readonly<Record<ToastVariant, ToastVariantTheme>> = {
    default: {
        backgroundColor: "#EDEEF0",
        iconColor: "#3C4250",
        titleStyle: { ...TITLE_BASE, color: "#1C1F24" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#3C4250" },
    },
    success: {
        backgroundColor: "#D1F2CF",
        iconColor: "#70D15C",
        titleStyle: { ...TITLE_BASE, color: "#0F3D2E" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#1F5A43" },
    },
    error: {
        backgroundColor: "#F7D1D1",
        iconColor: "#DD201D",
        titleStyle: { ...TITLE_BASE, color: "#7A1C1C" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#932626" },
    },
    info: {
        backgroundColor: "#E0D6F8",
        iconColor: "#6D4AFF",
        titleStyle: { ...TITLE_BASE, color: "#2B1858" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#3F276F" },
    },
    warning: {
        backgroundColor: "#FCEBB8",
        iconColor: "#D97706",
        titleStyle: { ...TITLE_BASE, color: "#6B3F07" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#8A5410" },
    },
};

const DARK: Readonly<Record<ToastVariant, ToastVariantTheme>> = {
    default: {
        backgroundColor: "#1F2228",
        iconColor: "#9CA3AF",
        titleStyle: { ...TITLE_BASE, color: "#E5E7EB" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#9CA3AF" },
    },
    success: {
        backgroundColor: "#14301F",
        iconColor: "#70D15C",
        titleStyle: { ...TITLE_BASE, color: "#B9F0B0" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#8BDB79" },
    },
    error: {
        backgroundColor: "#3A1717",
        iconColor: "#FF4A47",
        titleStyle: { ...TITLE_BASE, color: "#F5B0B0" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#E58484" },
    },
    info: {
        backgroundColor: "#221540",
        iconColor: "#8B6EFF",
        titleStyle: { ...TITLE_BASE, color: "#C7B6F5" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#9E85E6" },
    },
    warning: {
        backgroundColor: "#3A2A0E",
        iconColor: "#F59E0B",
        titleStyle: { ...TITLE_BASE, color: "#F7D58E" },
        descriptionStyle: { ...DESCRIPTION_BASE, color: "#E0B86C" },
    },
};

export const VARIANT_THEMES: Readonly<
    Record<ToastResolvedScheme, Readonly<Record<ToastVariant, ToastVariantTheme>>>
> = {
    light: LIGHT,
    dark: DARK,
};
