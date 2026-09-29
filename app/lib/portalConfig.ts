export type PhotocardAdStyle = "band" | "stacked";
export type PhotocardAdVariant = "custom" | "kaniz" | "prime" | "none";
export type PhotocardLogoPosition = "top-left" | "top-right";
export type PhotocardHeadlineAlignment = "left" | "center";

export interface PortalConfig {
  name: string;
  tagline: string;
  domain: string;
  contactEmail: string;
  footerText: string;
  social: { facebook: string; youtube: string; x: string };
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  photocard: {
    defaultAd: PhotocardAdVariant;
    availableAds: PhotocardAdVariant[];
    accentColor: string;
    commentText: string;
    website: string;
    logoPosition: PhotocardLogoPosition;
    headlineAlignment: PhotocardHeadlineAlignment;
    headlineFontSize: number;
    footerFontSize: number;
    centerTextFontSize: number;
    ad: {
      name: string;
      logoUrl: string;
      tagline: string;
      body: string;
      contact: string;
      primaryColor: string;
      secondaryColor: string;
      style: PhotocardAdStyle;
    };
  };
}

function readNumber(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.min(max, Math.max(min, parsed))
    : fallback;
}

function readColor(value: string | undefined, fallback: string) {
  return value && /^#[\da-f]{6}$/i.test(value) ? value : fallback;
}

const adStyle = process.env.NEXT_PUBLIC_PHOTOCARD_AD_STYLE;
const adVariant = process.env.NEXT_PUBLIC_PHOTOCARD_DEFAULT_AD;
const supportedAdVariants: PhotocardAdVariant[] = [
  "custom",
  "kaniz",
  "prime",
  "none",
];
const configuredAds = process.env.NEXT_PUBLIC_PHOTOCARD_AVAILABLE_ADS?.split(
  ",",
)
  .map((value) => value.trim())
  .filter((value): value is PhotocardAdVariant =>
    supportedAdVariants.includes(value as PhotocardAdVariant),
  );
const defaultPhotocardAd: PhotocardAdVariant =
  adVariant === "kaniz" || adVariant === "prime" || adVariant === "custom"
    ? adVariant
    : "none";

/** Public, non-secret configuration. NEXT_PUBLIC_ values are embedded at build time. */
export const portalConfig: PortalConfig = {
  name: process.env.NEXT_PUBLIC_PORTAL_NAME || "RPC News",
  tagline:
    process.env.NEXT_PUBLIC_PORTAL_TAGLINE ||
    "Independent reporting for the public good",
  domain: process.env.NEXT_PUBLIC_PORTAL_DOMAIN || "rpcnews.com",
  contactEmail: process.env.NEXT_PUBLIC_PORTAL_CONTACT_EMAIL || "",
  footerText: process.env.NEXT_PUBLIC_PORTAL_FOOTER_TEXT || "",
  social: {
    facebook: process.env.NEXT_PUBLIC_PORTAL_FACEBOOK_URL || "",
    youtube: process.env.NEXT_PUBLIC_PORTAL_YOUTUBE_URL || "",
    x: process.env.NEXT_PUBLIC_PORTAL_X_URL || "",
  },
  logoUrl: process.env.NEXT_PUBLIC_PORTAL_LOGO_URL || "/images/logo4.png",
  faviconUrl: process.env.NEXT_PUBLIC_PORTAL_FAVICON_URL || "/favicon.ico",
  primaryColor: readColor(
    process.env.NEXT_PUBLIC_PORTAL_PRIMARY_COLOR,
    "#2563eb",
  ),
  photocard: {
    defaultAd: defaultPhotocardAd,
    availableAds: configuredAds?.length
      ? Array.from(new Set([defaultPhotocardAd, ...configuredAds]))
      : supportedAdVariants,
    accentColor: readColor(
      process.env.NEXT_PUBLIC_PHOTOCARD_ACCENT_COLOR,
      "#D9232D",
    ),
    commentText:
      process.env.NEXT_PUBLIC_PHOTOCARD_COMMENT_TEXT ||
      "Read more in the comments",
    website: process.env.NEXT_PUBLIC_PHOTOCARD_WEBSITE || "rpcnews.com",
    logoPosition:
      process.env.NEXT_PUBLIC_PHOTOCARD_LOGO_POSITION === "top-left"
        ? "top-left"
        : "top-right",
    headlineAlignment:
      process.env.NEXT_PUBLIC_PHOTOCARD_HEADLINE_ALIGNMENT === "center"
        ? "center"
        : "left",
    headlineFontSize: readNumber(
      process.env.NEXT_PUBLIC_PHOTOCARD_HEADLINE_SIZE,
      65,
      45,
      100,
    ),
    footerFontSize: readNumber(
      process.env.NEXT_PUBLIC_PHOTOCARD_FOOTER_SIZE,
      31,
      20,
      37,
    ),
    centerTextFontSize: readNumber(
      process.env.NEXT_PUBLIC_PHOTOCARD_CENTER_TEXT_SIZE,
      28,
      16,
      40,
    ),
    ad: {
      name: process.env.NEXT_PUBLIC_PHOTOCARD_AD_NAME || "Sponsored message",
      logoUrl: process.env.NEXT_PUBLIC_PHOTOCARD_AD_LOGO_URL || "",
      tagline: process.env.NEXT_PUBLIC_PHOTOCARD_AD_TAGLINE || "",
      body: process.env.NEXT_PUBLIC_PHOTOCARD_AD_BODY || "",
      contact: process.env.NEXT_PUBLIC_PHOTOCARD_AD_CONTACT || "",
      primaryColor: readColor(
        process.env.NEXT_PUBLIC_PHOTOCARD_AD_PRIMARY_COLOR,
        "#006a4e",
      ),
      secondaryColor: readColor(
        process.env.NEXT_PUBLIC_PHOTOCARD_AD_SECONDARY_COLOR,
        "#8cc63f",
      ),
      style: adStyle === "stacked" ? "stacked" : "band",
    },
  },
};
