# RPC News single-site configuration

This project is a standalone RPC News admin app. It is not shared across sites, and there is no site switcher, tenant switcher, or shared deployment model in this codebase.

## Configure the site

Set the following variables in the hosting provider's build environment. `NEXT_PUBLIC_` values are intentionally public and are embedded into the browser bundle by Next.js at build time. Changing them requires a rebuild and redeploy of this single app. Never put credentials, tokens, or private API keys in these variables.

| Variable                                   | Default                                     | Purpose                                                              |
| ------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_PORTAL_NAME`                  | `RPC News`                                  | Admin name and page title                                            |
| `NEXT_PUBLIC_PORTAL_TAGLINE`               | `Independent reporting for the public good` | Description and site tagline                                         |
| `NEXT_PUBLIC_PORTAL_DOMAIN`                | `rpcnews.com`                               | Displayed site domain                                                |
| `NEXT_PUBLIC_PORTAL_CONTACT_EMAIL`         | Empty                                       | Contact address                                                      |
| `NEXT_PUBLIC_PORTAL_FOOTER_TEXT`           | Empty                                       | Footer copy                                                          |
| `NEXT_PUBLIC_PORTAL_FACEBOOK_URL`          | Empty                                       | Facebook page URL                                                    |
| `NEXT_PUBLIC_PORTAL_YOUTUBE_URL`           | Empty                                       | YouTube channel URL                                                  |
| `NEXT_PUBLIC_PORTAL_X_URL`                 | Empty                                       | X profile URL                                                        |
| `NEXT_PUBLIC_PORTAL_LOGO_URL`              | `/images/logo4.png`                         | Sidebar and photocard logo                                           |
| `NEXT_PUBLIC_PORTAL_FAVICON_URL`           | `/favicon.ico`                              | Browser favicon                                                      |
| `NEXT_PUBLIC_PORTAL_PRIMARY_COLOR`         | `#2563eb`                                   | Admin interface accent color                                         |
| `NEXT_PUBLIC_PHOTOCARD_DEFAULT_AD`         | `none`                                      | `custom`, `kaniz`, `prime`, or `none`                                |
| `NEXT_PUBLIC_PHOTOCARD_AVAILABLE_ADS`      | All built-in and custom options             | Comma-separated enabled options (`custom`, `kaniz`, `prime`, `none`) |
| `NEXT_PUBLIC_PHOTOCARD_ACCENT_COLOR`       | `#D9232D`                                   | Photocard accent color                                               |
| `NEXT_PUBLIC_PHOTOCARD_WEBSITE`            | `rpcnews.com`                               | Website printed on photocards                                        |
| `NEXT_PUBLIC_PHOTOCARD_LOGO_POSITION`      | `top-right`                                 | `top-left` or `top-right`                                            |
| `NEXT_PUBLIC_PHOTOCARD_HEADLINE_ALIGNMENT` | `left`                                      | `left` or `center`                                                   |
| `NEXT_PUBLIC_PHOTOCARD_COMMENT_TEXT`       | `Read more in the comments`                 | Center footer text                                                   |
| `NEXT_PUBLIC_PHOTOCARD_HEADLINE_SIZE`      | `65`                                        | Headline size, bounded to 45–100                                     |
| `NEXT_PUBLIC_PHOTOCARD_FOOTER_SIZE`        | `31`                                        | Footer size, bounded to 20–37                                        |
| `NEXT_PUBLIC_PHOTOCARD_CENTER_TEXT_SIZE`   | `28`                                        | Center footer size, bounded to 16–40                                 |
| `NEXT_PUBLIC_PHOTOCARD_AD_NAME`            | `Sponsored message`                         | Custom ad option label and heading                                   |
| `NEXT_PUBLIC_PHOTOCARD_AD_LOGO_URL`        | Empty                                       | Optional sponsor logo URL                                            |
| `NEXT_PUBLIC_PHOTOCARD_AD_TAGLINE`         | Empty                                       | Optional sponsor tagline                                             |
| `NEXT_PUBLIC_PHOTOCARD_AD_BODY`            | Empty                                       | Optional sponsor detail line                                         |
| `NEXT_PUBLIC_PHOTOCARD_AD_CONTACT`         | Empty                                       | Optional contact text or phone number                                |
| `NEXT_PUBLIC_PHOTOCARD_AD_STYLE`           | `band`                                      | `band` or `stacked` custom ad layout                                 |
| `NEXT_PUBLIC_PHOTOCARD_AD_PRIMARY_COLOR`   | `#006a4e`                                   | Main custom-ad text and contact color                                |
| `NEXT_PUBLIC_PHOTOCARD_AD_SECONDARY_COLOR` | `#8cc63f`                                   | Custom-ad background color                                           |

Logo and favicon values can be a path under `public/` or a public HTTPS URL. When using URLs, make sure the image host permits loading from this app and that the image is available to the browser-side photocard exporter.

## Photocard ad management

Admins can manage ad options from **Dashboard → Photocard Ads**. Each saved option has its own copy, optional logo, contact line, colors, and layout (`band`, `stacked`, or `split footer`). The card generator loads enabled options and marks the selected default. Ad changes are stored through the existing `POST /api/v1/admin/settings` key/value endpoint for this single site.

## Photocard template management

Admins can manage reusable designs from **Dashboard → Photocard Templates**. The starter set includes editorial overlay, clean frame, and breaking banner styles in square or portrait formats. Each template can independently set its accent color, logo position, headline alignment and sizes, plus whether the logo, category, date, comment, and website appear. Saved templates use the same admin settings endpoint for this site only.

## Example site values

```dotenv
NEXT_PUBLIC_PORTAL_NAME=RPC News
NEXT_PUBLIC_PORTAL_TAGLINE=Independent reporting for the public good
NEXT_PUBLIC_PORTAL_DOMAIN=rpcnews.com
NEXT_PUBLIC_PORTAL_CONTACT_EMAIL=desk@rpcnews.com
NEXT_PUBLIC_PORTAL_FOOTER_TEXT=© RPC News
NEXT_PUBLIC_PORTAL_FACEBOOK_URL=https://facebook.com/rpcnews
NEXT_PUBLIC_PORTAL_YOUTUBE_URL=https://youtube.com/@rpcnews
NEXT_PUBLIC_PORTAL_X_URL=https://x.com/rpcnews
NEXT_PUBLIC_PORTAL_LOGO_URL=/images/rpc-news-logo.png
NEXT_PUBLIC_PORTAL_FAVICON_URL=/images/rpc-news-icon.png
NEXT_PUBLIC_PORTAL_PRIMARY_COLOR=#176c62
NEXT_PUBLIC_PHOTOCARD_DEFAULT_AD=custom
NEXT_PUBLIC_PHOTOCARD_AVAILABLE_ADS=custom,none
NEXT_PUBLIC_PHOTOCARD_ACCENT_COLOR=#176c62
NEXT_PUBLIC_PHOTOCARD_WEBSITE=rpcnews.com
NEXT_PUBLIC_PHOTOCARD_LOGO_POSITION=top-left
NEXT_PUBLIC_PHOTOCARD_HEADLINE_ALIGNMENT=center
NEXT_PUBLIC_PHOTOCARD_COMMENT_TEXT=Read more in the comments
NEXT_PUBLIC_PHOTOCARD_AD_NAME=Community Partner
NEXT_PUBLIC_PHOTOCARD_AD_LOGO_URL=/images/community-partner-logo.png
NEXT_PUBLIC_PHOTOCARD_AD_TAGLINE=News that matters
NEXT_PUBLIC_PHOTOCARD_AD_BODY=Updated daily with trusted coverage
NEXT_PUBLIC_PHOTOCARD_AD_CONTACT=Call 01234-567890
NEXT_PUBLIC_PHOTOCARD_AD_STYLE=band
NEXT_PUBLIC_PHOTOCARD_AD_PRIMARY_COLOR=#174b3c
NEXT_PUBLIC_PHOTOCARD_AD_SECONDARY_COLOR=#d9f0df
```

## API and project scope

This repository is the admin frontend for one independent news site. The app uses one set of site branding and settings for a single project. Any backend used by this app should be scoped to this project and its own data set.
