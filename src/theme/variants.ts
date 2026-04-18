// theme/variants.ts
import type { ToastTextStyle, ToastVariant } from "../types";

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

export const VARIANT_THEMES: Readonly<Record<ToastVariant, ToastVariantTheme>> = {
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
