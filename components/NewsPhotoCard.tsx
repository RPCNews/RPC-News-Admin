"use client";

import { useEffect, useRef, useState } from "react";
import PhotocardAdRenderer from "./photocardAds/PhotocardAdRenderer";
import { portalConfig } from "@/app/lib/portalConfig";
import type { PhotocardAd } from "@/app/lib/photocardAds";
import { getDefaultPhotocardTemplates, type PhotocardTemplate } from "@/app/lib/photocardTemplates";

interface NewsPhotoCardProps {
  headline: string;
  category: string;
  imageSrc: string;
  logoUrl?: string;
  date: string;
  commentText?: string;
  accentColor?: string;
  imageScale?: number;
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
  category,
  imageSrc,
  logoUrl,
  date,
  commentText = "বিস্তারিত কমেন্টে",
  accentColor = portalConfig.photocard.accentColor,
  imageScale = 1,
  headlineFontSize = 65,
  footerBarFontSize = 31,
  centerTextFontSize = 28,
  isPreview = false,
  ad = null,
  template = getDefaultPhotocardTemplates()[0],
  cardRef,
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

  const canvasHeight = template.format === "portrait" ? 1350 : 1080;
  const contentHeight = canvasHeight - (ad ? 140 : 0);
  const photoHeight = template.style === "framed" ? contentHeight - 230 : contentHeight;
  const framed = template.style === "framed";
  const breaking = template.style === "breaking";

  const content = (
    <div
      ref={isPreview ? undefined : cardRef}
      style={{
        width: "1080px",
        height: `${canvasHeight}px`,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-solaiman-lipi), Arial, Helvetica, sans-serif",
        backgroundColor: framed ? "#ffffff" : "#000000",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(255, 255, 255, 0.1)", // Very subtle border for dark mode feel
      }}
    >
      <div style={{ position: "relative", width: "1080px", height: `${contentHeight}px` }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${photoHeight}px`,
          zIndex: 1,
          overflow: "hidden",
          transform: "none",
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
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          height: "60%",
          background: framed ? "transparent" : `linear-gradient(to top, ${accentColor} 0%, transparent 100%)`,
          zIndex: 2,
          display: framed ? "none" : "block",
        }}
      />

      {template.showLogo ? <div
        style={{
          position: "absolute",
          top: framed ? "28px" : 0,
          right: template.logoPosition === "top-right" ? "50px" : undefined,
          left: template.logoPosition === "top-left" ? "50px" : undefined,
          zIndex: 10,
          width: framed ? "150px" : "165px",
          height: framed ? "150px" : "240px",
          backgroundColor: framed ? "#ffffff" : accentColor,
          borderRadius: framed ? "18px" : undefined,
          borderBottomLeftRadius: framed ? "18px" : "80px",
          borderBottomRightRadius: framed ? "18px" : "80px",
          display: "flex",
          alignItems: framed ? "center" : "flex-end",
          justifyContent: "center",
          paddingBottom: framed ? 0 : "25px",
          boxShadow: framed ? "0 6px 20px rgba(0,0,0,.18)" : undefined,
        }}
      >
        <div
          style={{
            width: framed ? "122px" : "135px",
            height: framed ? "122px" : "130px",
            borderRadius: "999px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "4px solid white",
          }}
        >
          <img
            src={proxiedLogoUrl}
            alt={portalConfig.name}
            crossOrigin="anonymous"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "10px",
            }}
          />
        </div>
      </div> : null}

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: framed ? "150px" : breaking ? "110px" : "78px",
          width: "100%",
          padding: breaking ? "22px 42px" : "0 60px 30px",
          zIndex: 10,
          backgroundColor: breaking ? accentColor : "transparent",
          borderRadius: breaking ? "14px" : 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: template.headlineAlignment === "center" ? "center" : "stretch",
            justifyContent: template.headlineAlignment === "center" ? "center" : "flex-start",
            flexDirection: template.headlineAlignment === "center" ? "column" : "row",
            gap: template.headlineAlignment === "center" ? "12px" : "25px",
          }}
        >
          {template.style === "editorial" && template.headlineAlignment === "left" ? <div
            style={{
              width: "10px",
              backgroundColor: "#facc15",
              borderRadius: "2px",
              flexShrink: 0,
            }}
          /> : null}
          <h1
            style={{
              fontSize: `${headlineFontSize}px`,
              lineHeight: 1.2,
              fontWeight: 800,
              margin: 0,
              color: framed ? "#17212c" : "#ffffff",
              textAlign: template.headlineAlignment,
              textShadow: framed || breaking ? "none" : "0 4px 12px rgba(0, 0, 0, 0.8)",
              whiteSpace: "pre-wrap",
            }}
          >
            {headline}
          </h1>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "80px",
          backgroundColor: framed ? "#17212c" : accentColor,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: "0 60px",
          fontSize: `${footerBarFontSize}px`,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "15px",
            fontWeight: 600,
          }}
        >
          {template.showCategory ? <span style={{ textTransform: "uppercase" }}>{category}</span> : null}
          {template.showCategory && template.showDate ? <span style={{ opacity: 0.6 }}>|</span> : null}
          {template.showDate ? <span>{date}</span> : null}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: `${centerTextFontSize}px`,
          }}
        >
          {template.showComment ? <span>{commentText}</span> : null}
        </div>

        {template.showWebsite ? <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span>{portalConfig.photocard.website}</span>
        </div> : null}
      </div>
      </div>
      {ad ? <PhotocardAdRenderer ad={ad} /> : null}
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

  return <div className="absolute -left-[9999px] top-0">{content}</div>;
}
