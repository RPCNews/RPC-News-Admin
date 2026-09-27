import type { PhotocardAd } from "@/app/lib/photocardAds";

export default function PhotocardAdRenderer({ ad }: { ad: PhotocardAd }) {
  const content = (
    <div style={{ display: "flex", minWidth: 0, flex: 1, flexDirection: "column", justifyContent: "center" }}>
      <strong style={{ color: ad.primaryColor, fontSize: "30px", lineHeight: 1.1 }}>{ad.name}</strong>
      {ad.tagline ? <span style={{ color: ad.primaryColor, fontSize: "17px", fontWeight: 700 }}>{ad.tagline}</span> : null}
      {ad.body ? <span style={{ color: ad.primaryColor, fontSize: "14px" }}>{ad.body}</span> : null}
    </div>
  );
  const logo = ad.logoUrl ? (
    <img src={ad.logoUrl} alt={`${ad.name} logo`} crossOrigin="anonymous" style={{ maxWidth: "90px", maxHeight: "76px", objectFit: "contain" }} />
  ) : null;
  const contact = ad.contact ? (
    <span style={{ flexShrink: 0, borderRadius: "8px", padding: "9px 16px", background: ad.primaryColor, color: "#fff", fontSize: "19px", fontWeight: 800 }}>
      {ad.contact}
    </span>
  ) : null;

  if (ad.layout === "stacked") {
    return (
      <div style={{ width: "100%", height: "140px", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "var(--font-solaiman-lipi), Arial, sans-serif" }}>
        <div style={{ height: "32px", display: "grid", placeItems: "center", padding: "0 20px", background: ad.primaryColor, color: "#fff", fontSize: "15px", fontWeight: 700 }}>{ad.tagline || ad.name}</div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "20px", padding: "5px 28px", background: ad.backgroundColor }}>
          {logo}{content}{contact}
        </div>
        <div style={{ height: "27px", display: "grid", placeItems: "center", padding: "0 15px", background: ad.primaryColor, color: "#fff", fontSize: "14px", fontWeight: 700 }}>{ad.contact || ad.body || ad.name}</div>
      </div>
    );
  }

  if (ad.layout === "split") {
    return (
      <div style={{ width: "100%", height: "140px", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "var(--font-solaiman-lipi), Arial, sans-serif" }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "22px", padding: "8px 36px", background: ad.backgroundColor }}>
          {logo}{content}{contact}
        </div>
        <div style={{ height: "34px", display: "grid", placeItems: "center", padding: "0 20px", background: ad.primaryColor, color: "#fff", fontSize: "15px", fontWeight: 700 }}>{ad.body || ad.tagline || ad.name}</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "140px", display: "flex", alignItems: "center", gap: "20px", overflow: "hidden", padding: "12px 40px", background: ad.backgroundColor, fontFamily: "var(--font-solaiman-lipi), Arial, sans-serif" }}>
      {logo}{content}{contact}
    </div>
  );
}
