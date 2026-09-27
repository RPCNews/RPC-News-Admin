import { api } from "@/app/lib/api";
import { portalConfig } from "@/app/lib/portalConfig";

export type PhotocardAdLayout = "band" | "stacked" | "split";

export interface PhotocardAd {
  id: string;
  name: string;
  enabled: boolean;
  isDefault: boolean;
  layout: PhotocardAdLayout;
  logoUrl: string;
  tagline: string;
  body: string;
  contact: string;
  primaryColor: string;
  backgroundColor: string;
}

const defaultPortalAd: PhotocardAd = {
  id: "portal-custom",
  name: portalConfig.photocard.ad.name,
  enabled: true,
  isDefault: portalConfig.photocard.defaultAd === "custom",
  layout: portalConfig.photocard.ad.style,
  logoUrl: portalConfig.photocard.ad.logoUrl,
  tagline: portalConfig.photocard.ad.tagline,
  body: portalConfig.photocard.ad.body,
  contact: portalConfig.photocard.ad.contact,
  primaryColor: portalConfig.photocard.ad.primaryColor,
  backgroundColor: portalConfig.photocard.ad.secondaryColor,
};

const legacyAds: Record<"kaniz" | "prime", PhotocardAd> = {
  kaniz: {
    id: "legacy-kaniz",
    name: "কানিজ হসপিটাল এন্ড ল্যাব",
    enabled: true,
    isDefault: portalConfig.photocard.defaultAd === "kaniz",
    layout: "split",
    logoUrl: "/images/kaniz-logo.png",
    tagline: "মানসম্মত স্বাস্থ্য সেবায় অনন্য",
    body: "ডি.বি. রোড, শাপলা পাড়া, সদর, গাইবান্ধা।",
    contact: "সিরিয়ালঃ ০১৩২১-০৪৭৪৭৪",
    primaryColor: "#2E3192",
    backgroundColor: "#FFFFFF",
  },
  prime: {
    id: "legacy-prime",
    name: "প্রাইম হাসপাতাল এন্ড ডায়াগনস্টিক সেন্টার",
    enabled: true,
    isDefault: portalConfig.photocard.defaultAd === "prime",
    layout: "stacked",
    logoUrl: "/images/prime-logo.png",
    tagline: "সর্বোত্তম চিকিৎসা সেবার প্রত্যয়ে...",
    body: "জেলা সদর হাসপাতাল রোড, গাইবান্ধা।",
    contact: "সিরিয়ালের জন্য যোগাযোগ: ০১৭০৪-২১৫৪৫৫",
    primaryColor: "#006a4e",
    backgroundColor: "#8cc63f",
  },
};

export function getDefaultPhotocardAds(): PhotocardAd[] {
  const configured = portalConfig.photocard.availableAds
    .filter((variant) => variant !== "none")
    .flatMap((variant) => {
      if (variant === "custom") return [defaultPortalAd];
      if (variant === "kaniz") return [legacyAds.kaniz];
      if (variant === "prime") return [legacyAds.prime];
      return [];
    });

  return configured;
}

function isPhotocardAd(value: unknown): value is PhotocardAd {
  if (!value || typeof value !== "object") return false;
  const ad = value as Partial<PhotocardAd>;
  return (
    typeof ad.id === "string" &&
    typeof ad.name === "string" &&
    typeof ad.enabled === "boolean" &&
    typeof ad.isDefault === "boolean" &&
    typeof ad.logoUrl === "string" &&
    typeof ad.tagline === "string" &&
    typeof ad.body === "string" &&
    typeof ad.contact === "string" &&
    typeof ad.primaryColor === "string" && /^#[\da-f]{6}$/i.test(ad.primaryColor) &&
    typeof ad.backgroundColor === "string" && /^#[\da-f]{6}$/i.test(ad.backgroundColor) &&
    (ad.layout === "band" || ad.layout === "stacked" || ad.layout === "split")
  );
}

export function parsePhotocardAds(value: unknown): PhotocardAd[] | null {
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }
  return Array.isArray(parsed) && parsed.every(isPhotocardAd) ? parsed : null;
}

export function getPhotocardAdsSettingKey() {
  const portalKey = portalConfig.domain
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `photocardAds.${portalKey || "default"}`;
}

export async function loadPhotocardAds(): Promise<PhotocardAd[]> {
  const response = await api<{ data?: Record<string, unknown> }>("/admin/settings");
  const stored = response?.data?.[getPhotocardAdsSettingKey()];
  return parsePhotocardAds(stored) ?? getDefaultPhotocardAds();
}

export async function savePhotocardAds(ads: PhotocardAd[]): Promise<void> {
  await api("/admin/settings", "POST", {
    key: getPhotocardAdsSettingKey(),
    value: JSON.stringify(ads),
    description: `Photocard advertisement options for ${portalConfig.domain}`,
  });
}
