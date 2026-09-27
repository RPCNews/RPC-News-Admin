# Per-deployment portal configuration

This app uses one codebase with a separate deployment for each portal. Portal identity, theme and photocard defaults are supplied by that deployment's environment. There is no in-app tenant switcher or super-admin tenant manager in this model.

## Configure a deployment

Set the following variables in the hosting provider's build environment. `NEXT_PUBLIC_` values are intentionally public and are embedded into the browser bundle by Next.js at build time. Set them before building each portal; changing them requires a new build and deployment. Never put credentials, tokens, or private API keys in these variables.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_PORTAL_NAME` | `Jubotara News` | Admin name and page title |
| `NEXT_PUBLIC_PORTAL_TAGLINE` | Existing Jubotara tagline | Description and portal tagline |
| `NEXT_PUBLIC_PORTAL_DOMAIN` | `jubotaranews.com` | Displayed portal domain |
| `NEXT_PUBLIC_PORTAL_CONTACT_EMAIL` | Empty | Portal contact address |
| `NEXT_PUBLIC_PORTAL_FOOTER_TEXT` | Empty | Portal footer copy |
| `NEXT_PUBLIC_PORTAL_FACEBOOK_URL` | Empty | Facebook page URL |
| `NEXT_PUBLIC_PORTAL_YOUTUBE_URL` | Empty | YouTube channel URL |
| `NEXT_PUBLIC_PORTAL_X_URL` | Empty | X profile URL |
| `NEXT_PUBLIC_PORTAL_LOGO_URL` | `/images/logo4.png` | Sidebar and photocard logo |
| `NEXT_PUBLIC_PORTAL_FAVICON_URL` | `/favicon.ico` | Browser favicon |
| `NEXT_PUBLIC_PORTAL_PRIMARY_COLOR` | `#2563eb` | Admin interface accent color |
| `NEXT_PUBLIC_PHOTOCARD_DEFAULT_AD` | `none` | `custom`, `kaniz`, `prime`, or `none` |
| `NEXT_PUBLIC_PHOTOCARD_AVAILABLE_ADS` | All built-in and custom options | Comma-separated enabled options (`custom`, `kaniz`, `prime`, `none`) |
| `NEXT_PUBLIC_PHOTOCARD_ACCENT_COLOR` | `#D9232D` | Photocard accent color |
| `NEXT_PUBLIC_PHOTOCARD_WEBSITE` | `jubotaranews.com` | Website printed on photocards |
| `NEXT_PUBLIC_PHOTOCARD_LOGO_POSITION` | `top-right` | `top-left` or `top-right` |
| `NEXT_PUBLIC_PHOTOCARD_HEADLINE_ALIGNMENT` | `left` | `left` or `center` |
| `NEXT_PUBLIC_PHOTOCARD_COMMENT_TEXT` | `বিস্তারিত কমেন্টে` | Center footer text |
| `NEXT_PUBLIC_PHOTOCARD_HEADLINE_SIZE` | `65` | Headline size, bounded to 45–100 |
| `NEXT_PUBLIC_PHOTOCARD_FOOTER_SIZE` | `31` | Footer size, bounded to 20–37 |
| `NEXT_PUBLIC_PHOTOCARD_CENTER_TEXT_SIZE` | `28` | Center footer size, bounded to 16–40 |
| `NEXT_PUBLIC_PHOTOCARD_AD_NAME` | `Sponsored message` | Custom ad option label and heading |
| `NEXT_PUBLIC_PHOTOCARD_AD_LOGO_URL` | Empty | Optional sponsor logo URL |
| `NEXT_PUBLIC_PHOTOCARD_AD_TAGLINE` | Empty | Optional sponsor tagline |
| `NEXT_PUBLIC_PHOTOCARD_AD_BODY` | Empty | Optional sponsor detail line |
| `NEXT_PUBLIC_PHOTOCARD_AD_CONTACT` | Empty | Optional contact text or phone number |
| `NEXT_PUBLIC_PHOTOCARD_AD_STYLE` | `band` | `band` or `stacked` custom ad layout |
| `NEXT_PUBLIC_PHOTOCARD_AD_PRIMARY_COLOR` | `#006a4e` | Main custom-ad text and contact color |
| `NEXT_PUBLIC_PHOTOCARD_AD_SECONDARY_COLOR` | `#8cc63f` | Custom-ad background color |

Logo and favicon values can be a path under `public/` or a public HTTPS URL. When using URLs, make sure the image host permits loading from this app and that the image is available to the browser-side photocard exporter.

## Photocard ad management

Admins can manage ad options from **Dashboard → Photocard Ads**. Each saved option has its own copy, optional logo, contact line, colors, and layout (`band`, `stacked`, or `split footer`). The card generator loads enabled options and marks the selected default. Ad changes are stored through the existing `POST /api/v1/admin/settings` key/value endpoint under a key derived from the portal domain; the configured environment ads seed the list when no saved list exists.

The backend settings endpoint is global in the API docs. A domain-derived setting key prevents different portal deployments from overwriting each other's ad list, but it is not an authorization or data-isolation boundary. If multiple deployments share one backend, that backend must enforce per-portal settings access or use a separate backend/database per deployment.

## Photocard template management

Admins can manage reusable designs from **Dashboard → Photocard Templates**. The starter set includes editorial overlay, clean frame, and breaking banner styles in square or portrait formats. Each template can independently set its accent color, logo position, headline alignment and sizes, plus whether the logo, category, date, comment, and website appear. Saved templates use the same admin settings endpoint, in a separate domain-derived key. The photocard editor loads enabled templates and starts with the saved default.

## Example deployment values

```dotenv
NEXT_PUBLIC_PORTAL_NAME=The Daily Ledger
NEXT_PUBLIC_PORTAL_TAGLINE=Independent news for every day
NEXT_PUBLIC_PORTAL_DOMAIN=dailyledger.example
NEXT_PUBLIC_PORTAL_CONTACT_EMAIL=desk@dailyledger.example
NEXT_PUBLIC_PORTAL_FOOTER_TEXT=© The Daily Ledger
NEXT_PUBLIC_PORTAL_FACEBOOK_URL=https://facebook.com/dailyledger
NEXT_PUBLIC_PORTAL_YOUTUBE_URL=https://youtube.com/@dailyledger
NEXT_PUBLIC_PORTAL_X_URL=https://x.com/dailyledger
NEXT_PUBLIC_PORTAL_LOGO_URL=/images/daily-ledger-logo.png
NEXT_PUBLIC_PORTAL_FAVICON_URL=/images/daily-ledger-icon.png
NEXT_PUBLIC_PORTAL_PRIMARY_COLOR=#176c62
NEXT_PUBLIC_PHOTOCARD_DEFAULT_AD=custom
NEXT_PUBLIC_PHOTOCARD_AVAILABLE_ADS=custom,none
NEXT_PUBLIC_PHOTOCARD_ACCENT_COLOR=#176c62
NEXT_PUBLIC_PHOTOCARD_WEBSITE=dailyledger.example
NEXT_PUBLIC_PHOTOCARD_LOGO_POSITION=top-left
NEXT_PUBLIC_PHOTOCARD_HEADLINE_ALIGNMENT=center
NEXT_PUBLIC_PHOTOCARD_COMMENT_TEXT=Read more in the comments
NEXT_PUBLIC_PHOTOCARD_AD_NAME=Community Health Center
NEXT_PUBLIC_PHOTOCARD_AD_LOGO_URL=/images/community-health-logo.png
NEXT_PUBLIC_PHOTOCARD_AD_TAGLINE=Care close to home
NEXT_PUBLIC_PHOTOCARD_AD_BODY=Open every day, 8:00 AM–10:00 PM
NEXT_PUBLIC_PHOTOCARD_AD_CONTACT=Call 01234-567890
NEXT_PUBLIC_PHOTOCARD_AD_STYLE=band
NEXT_PUBLIC_PHOTOCARD_AD_PRIMARY_COLOR=#174b3c
NEXT_PUBLIC_PHOTOCARD_AD_SECONDARY_COLOR=#d9f0df
```

## API and data boundary

Each admin deployment should use the correct backend for that portal. `BACKEND_ORIGIN` controls the upstream API rewrite in `next.config.ts`. Separate frontend deployments do **not** isolate data if they still call the same unscoped API and database. If portals share a backend, that backend must authenticate portal membership and enforce tenant scope for every record and endpoint; a frontend environment variable is not an authorization boundary.

The current repository contains only the admin frontend. Its documented settings endpoints are global and its records do not expose tenant ownership, so backend-level multi-tenant isolation is outside this codebase.
