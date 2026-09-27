import { api } from "@/app/lib/api";
import { portalConfig } from "@/app/lib/portalConfig";

export type PhotocardTemplateStyle = "editorial" | "framed" | "breaking";
export type PhotocardFormat = "square" | "portrait";

export interface PhotocardTemplate {
  id: string;
  name: string;
  enabled: boolean;
  isDefault: boolean;
  style: PhotocardTemplateStyle;
  format: PhotocardFormat;
  accentColor: string;
  logoPosition: "top-left" | "top-right";
  headlineAlignment: "left" | "center";
  headlineFontSize: number;
  footerFontSize: number;
  centerTextFontSize: number;
  showLogo: boolean;
  showCategory: boolean;
  showDate: boolean;
  showComment: boolean;
  showWebsite: boolean;
}

export function getDefaultPhotocardTemplates(): PhotocardTemplate[] {
  return [
    {
      id: "template-editorial",
      name: "Editorial",
      enabled: true,
      isDefault: true,
      style: "editorial",
      format: "square",
      accentColor: portalConfig.photocard.accentColor,
      logoPosition: portalConfig.photocard.logoPosition,
      headlineAlignment: portalConfig.photocard.headlineAlignment,
      headlineFontSize: portalConfig.photocard.headlineFontSize,
      footerFontSize: portalConfig.photocard.footerFontSize,
      centerTextFontSize: portalConfig.photocard.centerTextFontSize,
      showLogo: true,
      showCategory: true,
      showDate: true,
      showComment: true,
      showWebsite: true,
    },
    {
      id: "template-framed",
      name: "Clean Frame",
      enabled: true,
      isDefault: false,
      style: "framed",
      format: "square",
      accentColor: portalConfig.primaryColor,
      logoPosition: "top-left",
      headlineAlignment: "left",
      headlineFontSize: 58,
      footerFontSize: 28,
      centerTextFontSize: 24,
      showLogo: true,
      showCategory: true,
      showDate: true,
      showComment: false,
      showWebsite: true,
    },
    {
      id: "template-breaking",
      name: "Breaking News",
      enabled: true,
      isDefault: false,
      style: "breaking",
      format: "portrait",
      accentColor: "#B42318",
      logoPosition: "top-right",
      headlineAlignment: "left",
      headlineFontSize: 68,
      footerFontSize: 28,
      centerTextFontSize: 23,
      showLogo: true,
      showCategory: true,
      showDate: true,
      showComment: true,
      showWebsite: true,
    },
  ];
}

function isPhotocardTemplate(value: unknown): value is PhotocardTemplate {
  if (!value || typeof value !== "object") return false;
  const template = value as Partial<PhotocardTemplate>;
  return (
    typeof template.id === "string" && typeof template.name === "string" &&
    typeof template.enabled === "boolean" && typeof template.isDefault === "boolean" &&
    (template.style === "editorial" || template.style === "framed" || template.style === "breaking") &&
    (template.format === "square" || template.format === "portrait") &&
    typeof template.accentColor === "string" && /^#[\da-f]{6}$/i.test(template.accentColor) &&
    (template.logoPosition === "top-left" || template.logoPosition === "top-right") &&
    (template.headlineAlignment === "left" || template.headlineAlignment === "center") &&
    typeof template.headlineFontSize === "number" && typeof template.footerFontSize === "number" &&
    typeof template.centerTextFontSize === "number" && typeof template.showLogo === "boolean" &&
    typeof template.showCategory === "boolean" && typeof template.showDate === "boolean" &&
    typeof template.showComment === "boolean" && typeof template.showWebsite === "boolean"
  );
}

export function parsePhotocardTemplates(value: unknown): PhotocardTemplate[] | null {
  let parsed = value;
  if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch { return null; }
  }
  return Array.isArray(parsed) && parsed.every(isPhotocardTemplate) ? parsed : null;
}

function getSettingKey() {
  const portalKey = portalConfig.domain.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `photocardTemplates.${portalKey || "default"}`;
}

export async function loadPhotocardTemplates(): Promise<PhotocardTemplate[]> {
  const response = await api<{ data?: Record<string, unknown> }>("/admin/settings");
  return parsePhotocardTemplates(response?.data?.[getSettingKey()]) ?? getDefaultPhotocardTemplates();
}

export async function savePhotocardTemplates(templates: PhotocardTemplate[]): Promise<void> {
  await api("/admin/settings", "POST", {
    key: getSettingKey(),
    value: JSON.stringify(templates),
    description: `Photocard templates for ${portalConfig.domain}`,
  });
}
