"use client";

import { ExternalLink, Globe, Image, Palette, Settings2 } from "lucide-react";
import { DashboardPage } from "@/components/DashboardShell";
import { portalConfig } from "@/app/lib/portalConfig";

function ConfigValue({ name, value }: { name: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-gray-100 py-3 last:border-b-0 sm:grid-cols-[minmax(210px,0.8fr)_1.2fr] sm:items-center sm:gap-4">
      <code className="text-xs font-semibold text-gray-500">{name}</code>
      <span className="break-all text-sm text-gray-900">{value || "Not set"}</span>
    </div>
  );
}

function ConfigSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Globe;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-gray-900">
        <Icon size={18} className="text-blue-600" /> {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <DashboardPage className="text-gray-900">
      <div className="mb-7 flex items-center gap-3">
        <Settings2 className="text-blue-600" size={30} />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Portal configuration</h1>
          <p className="mt-1 text-sm text-gray-500">This deployment is configured for {portalConfig.name}.</p>
        </div>
      </div>

      <div className="mb-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
        <ExternalLink size={19} className="mt-0.5 shrink-0 text-blue-700" />
        <p>
          Portal identity, colors, and photocard defaults come from this deployment&apos;s environment variables.
          Update them in the hosting environment and rebuild/redeploy to apply changes. Values prefixed with
          <code className="mx-1 rounded bg-white/70 px-1">NEXT_PUBLIC_</code> are public and must not contain secrets.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ConfigSection title="Identity" icon={Globe}>
          <ConfigValue name="NEXT_PUBLIC_PORTAL_NAME" value={portalConfig.name} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_TAGLINE" value={portalConfig.tagline} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_DOMAIN" value={portalConfig.domain} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_CONTACT_EMAIL" value={portalConfig.contactEmail} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_FOOTER_TEXT" value={portalConfig.footerText} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_FACEBOOK_URL" value={portalConfig.social.facebook} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_YOUTUBE_URL" value={portalConfig.social.youtube} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_X_URL" value={portalConfig.social.x} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_LOGO_URL" value={portalConfig.logoUrl} />
          <ConfigValue name="NEXT_PUBLIC_PORTAL_FAVICON_URL" value={portalConfig.faviconUrl} />
        </ConfigSection>

        <ConfigSection title="Theme" icon={Palette}>
          <div className="flex items-center gap-3 border-b border-gray-100 py-3">
            <span className="h-8 w-8 rounded-lg border border-black/10" style={{ backgroundColor: portalConfig.primaryColor }} />
            <div><code className="text-xs font-semibold text-gray-500">NEXT_PUBLIC_PORTAL_PRIMARY_COLOR</code><div className="text-sm text-gray-900">{portalConfig.primaryColor}</div></div>
          </div>
        </ConfigSection>

        <ConfigSection title="Photocard defaults" icon={Image}>
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_DEFAULT_AD" value={portalConfig.photocard.defaultAd} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AVAILABLE_ADS" value={portalConfig.photocard.availableAds.join(", ")} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_ACCENT_COLOR" value={portalConfig.photocard.accentColor} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_WEBSITE" value={portalConfig.photocard.website} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_LOGO_POSITION" value={portalConfig.photocard.logoPosition} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_HEADLINE_ALIGNMENT" value={portalConfig.photocard.headlineAlignment} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_COMMENT_TEXT" value={portalConfig.photocard.commentText} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_HEADLINE_SIZE" value={String(portalConfig.photocard.headlineFontSize)} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_FOOTER_SIZE" value={String(portalConfig.photocard.footerFontSize)} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_CENTER_TEXT_SIZE" value={String(portalConfig.photocard.centerTextFontSize)} />
        </ConfigSection>

        <ConfigSection title="Photocard ad" icon={Image}>
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AD_NAME" value={portalConfig.photocard.ad.name} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AD_LOGO_URL" value={portalConfig.photocard.ad.logoUrl} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AD_TAGLINE" value={portalConfig.photocard.ad.tagline} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AD_BODY" value={portalConfig.photocard.ad.body} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AD_CONTACT" value={portalConfig.photocard.ad.contact} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AD_STYLE" value={portalConfig.photocard.ad.style} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AD_PRIMARY_COLOR" value={portalConfig.photocard.ad.primaryColor} />
          <ConfigValue name="NEXT_PUBLIC_PHOTOCARD_AD_SECONDARY_COLOR" value={portalConfig.photocard.ad.secondaryColor} />
        </ConfigSection>
      </div>
    </DashboardPage>
  );
}
