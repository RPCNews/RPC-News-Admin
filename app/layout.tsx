import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import { FeedbackProvider } from "@/components/FeedbackProvider";
import { portalConfig } from "@/app/lib/portalConfig";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const solaimanLipi = localFont({
  src: "../public/fonts/SolaimanLipi.ttf",
  variable: "--font-solaiman-lipi",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${portalConfig.name} Admin`,
  description: portalConfig.tagline,
  icons: { icon: portalConfig.faviconUrl },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${solaimanLipi.variable} h-full antialiased`}
      style={{ "--portal-primary": portalConfig.primaryColor } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">
        <FeedbackProvider>{children}</FeedbackProvider>
      </body>
    </html>
  );
}
