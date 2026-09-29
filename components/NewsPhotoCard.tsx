"use client";

import { useEffect, useRef, useState } from "react";
import { portalConfig } from "@/app/lib/portalConfig";
import type { PhotocardAd } from "@/app/lib/photocardAds";
import type { PhotocardTemplate } from "@/app/lib/photocardTemplates";

interface NewsPhotoCardProps {
  headline: string;
  category: string;
  imageSrc: string;
  logoUrl?: string;
  date: string;
  commentText?: string;
  accentColor?: string;
  imageScale?: number;
  imageHeight?: number;
  headlineFontSize?: number;
  footerBarFontSize?: number;
  centerTextFontSize?: number;
  isPreview?: boolean;
  ad?: PhotocardAd | null;
  template?: PhotocardTemplate;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export default function NewsPhotoCard({
  headline,
  imageSrc,
  logoUrl,
  date,
  commentText = "বিস্তারিত কমেন্টে",
  imageScale = 1,
  imageHeight = 760,
  headlineFontSize = 65,
  isPreview = false,
  cardRef,
  category,
}: NewsPhotoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isPreview) {
      return;
    }

    const updateScale = () => {
      if (containerRef.current) {
        setScale(containerRef.current.offsetWidth / 1080);
      }
    };

    const observer = new ResizeObserver(updateScale);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    updateScale();

    return () => observer.disconnect();
  }, [isPreview]);

  const proxiedImageSrc = imageSrc?.startsWith("http")
    ? `/api/proxy-image?url=${encodeURIComponent(imageSrc)}`
    : imageSrc;

  const proxiedLogoUrl = logoUrl?.startsWith("http")
    ? `/api/proxy-image?url=${encodeURIComponent(logoUrl)}`
    : logoUrl || portalConfig.logoUrl;

  const canvasHeight = 1280;

  const content = (
    <div
      ref={isPreview ? undefined : cardRef}
      style={{
        width: "1080px",
        height: `${canvasHeight}px`,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-solaiman-lipi), Arial, Helvetica, sans-serif",
        background:
          "linear-gradient(180deg, #f7f5f2 0%, #eef6f1 38%, #efe9e1 100%)",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 22px 40px rgba(15, 23, 42, 0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(12,115,81,0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(217,45,45,0.06), transparent 30%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f5f3f0",
          height: "118px",
          padding: "72px 0 18px 50px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
            src={proxiedLogoUrl}
            alt={portalConfig.name}
            crossOrigin="anonymous"
            style={{ width: "170px", height: "150px", objectFit: "contain" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "220px",
            height: "68px",
            background: "#0c7351",
            borderRadius: "18px 0 0 18px",
            color: "#fff",
            fontWeight: 900,
            fontSize: "40px",
            padding: "0 26px",
            boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.12)",
          }}
        >
          {category}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "95%",
          height: `${imageHeight}px`,
          overflow: "hidden",
          marginTop: "60px",
          alignSelf: "center",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          borderRadius: "12px",
          background: "#f3f4f6",
        }}
      >
        <img
          src={proxiedImageSrc}
          alt="Background"
          crossOrigin="anonymous"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            transform: `scale(${imageScale})`,
            transition: "transform 0.2s ease-out",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          padding: "25px 30px 0",
          background: "transparent",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-10px 0 auto auto",
            width: "440px",
            height: "260px",
            opacity: 0.12,
            backgroundImage: `url('/images/dotted-world-map.png')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            pointerEvents: "none",
            transform: "translate(60px, -12px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              borderLeft: "7px solid #d92d2d",
              paddingLeft: "30px",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#0d1d2c",
                fontSize: `${headlineFontSize}px`,
                lineHeight: 1.12,
                fontWeight: 800,
                whiteSpace: "pre-wrap",
                maxWidth: "820px",
              }}
            >
              {headline}
            </h1>
          </div>
        </div>

        <div
          style={{
            marginTop: "18px",
            fontSize: "25px",
            lineHeight: 1.7,
            color: "#1f2937",
            maxWidth: "890px",
            whiteSpace: "pre-wrap",
          }}
        >
          {commentText}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "82px",
          background: "#0c7351",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          color: "#fff",
          fontWeight: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "32px",
          }}
        >
          <span style={{ fontSize: "34px" }}>◌</span>
          <span>{portalConfig.photocard.website}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "28px",
          }}
        >
          <span style={{ fontSize: "30px" }}>🗓</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );

  if (isPreview) {
    return (
      <div
        ref={containerRef}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white"
        style={{ aspectRatio: `1080 / ${canvasHeight}` }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: "1080px",
            height: `${canvasHeight}px`,
            position: "absolute",
            top: 0,
            left: "50%",
            marginLeft: "-540px",
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
      {content}
    </div>
  );
}
