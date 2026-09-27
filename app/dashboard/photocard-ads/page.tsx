"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ImagePlus, Loader2, Megaphone, Plus, Save, Star, Trash2 } from "lucide-react";
import { api } from "@/app/lib/api";
import { DashboardPage } from "@/components/DashboardShell";
import { ErrorState, LoadingState } from "@/components/DashboardState";
import { useFeedback } from "@/components/FeedbackProvider";
import NewsPhotoCard from "@/components/NewsPhotoCard";
import { portalConfig } from "@/app/lib/portalConfig";
import {
  getDefaultPhotocardAds,
  loadPhotocardAds,
  savePhotocardAds,
  type PhotocardAd,
  type PhotocardAdLayout,
} from "@/app/lib/photocardAds";
import { getDefaultPhotocardTemplates, loadPhotocardTemplates, type PhotocardTemplate } from "@/app/lib/photocardTemplates";

const newAd = (): PhotocardAd => ({
  id: crypto.randomUUID(),
  name: "New sponsor",
  enabled: true,
  isDefault: false,
  layout: "band",
  logoUrl: "",
  tagline: "",
  body: "",
  contact: "",
  primaryColor: "#174b3c",
  backgroundColor: "#d9f0df",
});

export default function PhotocardAdsPage() {
  const [ads, setAds] = useState<PhotocardAd[]>([]);
  const [templates, setTemplates] = useState<PhotocardTemplate[]>(getDefaultPhotocardTemplates);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useFeedback();

  const selectedAd = useMemo(() => ads.find((ad) => ad.id === selectedId) ?? null, [ads, selectedId]);
  const previewTemplate = templates.find((template) => template.enabled && template.isDefault) ?? templates.find((template) => template.enabled) ?? getDefaultPhotocardTemplates()[0];

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [storedAds, storedTemplates] = await Promise.all([loadPhotocardAds(), loadPhotocardTemplates()]);
      setAds(storedAds);
      setTemplates(storedTemplates);
      setSelectedId(storedAds[0]?.id ?? "");
      setDirty(false);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load photocard ads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const updateAd = (patch: Partial<PhotocardAd>) => {
    setAds((current) => current.map((ad) => ad.id === selectedId ? { ...ad, ...patch } : ad));
    setDirty(true);
  };

  const handleAdd = () => {
    const ad = newAd();
    if (!ads.some((existing) => existing.isDefault && existing.enabled)) ad.isDefault = true;
    setAds((current) => [...current, ad]);
    setSelectedId(ad.id);
    setDirty(true);
  };

  const handleDelete = () => {
    if (!selectedAd) return;
    const remaining = ads.filter((ad) => ad.id !== selectedAd.id);
    if (selectedAd.isDefault && remaining.length) {
      const nextDefault = remaining.find((ad) => ad.enabled) ?? remaining[0];
      nextDefault.isDefault = true;
    }
    setAds(remaining);
    setSelectedId(remaining[0]?.id ?? "");
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const enabledAds = ads.filter((ad) => ad.enabled);
      const hasDefault = enabledAds.some((ad) => ad.isDefault);
      const nextAds = ads.map((ad) => ({ ...ad, isDefault: ad.enabled && ad.isDefault }));
      if (enabledAds.length && !hasDefault) {
        const firstEnabled = nextAds.find((ad) => ad.enabled);
        if (firstEnabled) firstEnabled.isDefault = true;
      }
      await savePhotocardAds(nextAds);
      setAds(nextAds);
      setDirty(false);
      showToast({ title: "Photocard ads saved", description: "Saved ad options are now available in the card generator.", variant: "success" });
    } catch (saveError) {
      showToast({ title: "Could not save ads", description: saveError instanceof Error ? saveError.message : "Please try again.", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file?: File) => {
    if (!file || !selectedAd) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await api<{ secure_url?: string; url?: string; data?: { secure_url?: string } }>("/upload", "POST", formData);
      const logoUrl = result.secure_url || result.url || result.data?.secure_url;
      if (!logoUrl) throw new Error("The upload response did not include an image URL.");
      updateAd({ logoUrl });
      showToast({ title: "Logo uploaded", variant: "success" });
    } catch (uploadError) {
      showToast({ title: "Logo upload failed", description: uploadError instanceof Error ? uploadError.message : "Please try again.", variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <DashboardPage><LoadingState label="Loading photocard ads..." /></DashboardPage>;
  if (error) return <DashboardPage><ErrorState title="Could not load photocard ads" description={error} onRetry={() => void refresh()} /></DashboardPage>;

  return (
    <DashboardPage className="text-gray-900">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500"><Megaphone size={16} /> Photocard tools</div>
          <h1 className="text-3xl font-bold text-gray-900">Photocard ads</h1>
          <p className="mt-1 text-sm text-gray-500">Create multiple sponsor options, customize each design, and choose what appears by default.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={!dirty || saving} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <div><h2 className="font-bold">Ad options</h2><p className="text-xs text-gray-500">{ads.length} total · {ads.filter((ad) => ad.enabled).length} active</p></div>
            <button type="button" onClick={handleAdd} title="Add ad" className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"><Plus size={18} /></button>
          </div>
          <div className="max-h-[620px] overflow-y-auto p-2">
            {ads.length ? ads.map((ad) => (
              <button key={ad.id} type="button" onClick={() => setSelectedId(ad.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${selectedId === ad.id ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-gray-50"}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  {ad.logoUrl ? <img src={ad.logoUrl} alt="" className="h-full w-full object-contain" /> : <Megaphone size={17} className="text-gray-400" />}
                </span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{ad.name}</span><span className="mt-0.5 block text-xs text-gray-500">{ad.enabled ? "Active" : "Paused"}{ad.isDefault ? " · Default" : ""}</span></span>
                {ad.isDefault ? <Star size={15} className="fill-amber-400 text-amber-500" /> : null}
              </button>
            )) : <p className="p-4 text-sm text-gray-500">No ads yet. Add one to make it available in the photocard editor.</p>}
          </div>
        </section>

        {selectedAd ? (
          <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div><h2 className="text-lg font-bold">Edit ad option</h2><p className="text-sm text-gray-500">Content and design are saved with this ad.</p></div>
                <button type="button" onClick={handleDelete} title="Delete ad" className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Ad name</span><input value={selectedAd.name} onChange={(e) => updateAd({ name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Tagline</span><input value={selectedAd.tagline} onChange={(e) => updateAd({ tagline: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Description / address</span><textarea rows={2} value={selectedAd.body} onChange={(e) => updateAd({ body: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Contact text</span><input value={selectedAd.contact} onChange={(e) => updateAd({ contact: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Logo URL</span><span className="flex gap-2"><input value={selectedAd.logoUrl} onChange={(e) => updateAd({ logoUrl: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500" placeholder="https://..." /><label className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm font-semibold hover:bg-gray-50">{uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}<span className="sr-only">Upload logo</span><input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void handleLogoUpload(e.target.files?.[0])} /></label></span></label>
                <label><span className="mb-1.5 block text-sm font-semibold">Layout</span><select value={selectedAd.layout} onChange={(e) => updateAd({ layout: e.target.value as PhotocardAdLayout })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"><option value="band">Band</option><option value="stacked">Stacked</option><option value="split">Split footer</option></select></label>
                <div className="flex items-end gap-3"><label className="flex-1"><span className="mb-1.5 block text-sm font-semibold">Text / accent</span><span className="flex gap-2"><input type="color" value={selectedAd.primaryColor} onChange={(e) => updateAd({ primaryColor: e.target.value })} className="h-11 w-14 cursor-pointer rounded-lg border border-gray-300 p-1" /><input value={selectedAd.primaryColor} onChange={(e) => updateAd({ primaryColor: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm" /></span></label></div>
                <label><span className="mb-1.5 block text-sm font-semibold">Background color</span><span className="flex gap-2"><input type="color" value={selectedAd.backgroundColor} onChange={(e) => updateAd({ backgroundColor: e.target.value })} className="h-11 w-14 cursor-pointer rounded-lg border border-gray-300 p-1" /><input value={selectedAd.backgroundColor} onChange={(e) => updateAd({ backgroundColor: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm" /></span></label>
              </div>

              <div className="mt-6 flex flex-wrap gap-5 border-t border-gray-100 pt-5">
                <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={selectedAd.enabled} onChange={(e) => updateAd({ enabled: e.target.checked, isDefault: e.target.checked ? selectedAd.isDefault : false })} className="h-4 w-4 accent-blue-600" />Available in card editor</label>
                <label className="flex items-center gap-2 text-sm font-medium"><input type="radio" name="defaultAd" checked={selectedAd.isDefault} disabled={!selectedAd.enabled} onChange={() => { setAds((current) => current.map((ad) => ({ ...ad, isDefault: ad.id === selectedAd.id }))); setDirty(true); }} className="h-4 w-4 accent-blue-600" />Default ad</label>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Live photocard preview</h2><p className="text-xs text-gray-500">Sample story · updates as you edit</p></div><span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">{selectedAd.enabled ? "Active" : "Paused"}</span></div>
              <NewsPhotoCard
                headline="আপনার সংবাদের শিরোনাম এখানে দেখুন"
                category="জাতীয়"
                imageSrc="/images/photocard-preview-placeholder.svg"
                logoUrl={portalConfig.logoUrl}
                date="২৬ সেপ্টেম্বর ২০২৬"
                commentText={portalConfig.photocard.commentText}
                accentColor={portalConfig.photocard.accentColor}
                headlineFontSize={portalConfig.photocard.headlineFontSize}
                footerBarFontSize={portalConfig.photocard.footerFontSize}
                centerTextFontSize={portalConfig.photocard.centerTextFontSize}
                ad={selectedAd}
                template={previewTemplate}
                isPreview
              />
              <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600"><div className="mb-2 flex items-center gap-2 font-semibold text-gray-800"><Check size={16} className="text-green-600" /> Card editor behavior</div>{selectedAd.isDefault ? "This ad is selected by default when a photocard is opened." : "Editors can select this ad from the ad options list."} Disabled ads stay saved but are hidden from the photocard editor.</div>
            </section>
          </div>
        ) : (
          <section className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center"><div><Megaphone className="mx-auto mb-3 text-gray-400" size={30} /><h2 className="font-bold">Select or add an ad</h2><p className="mt-1 text-sm text-gray-500">Create a sponsor card and customize its content and appearance.</p><button type="button" onClick={handleAdd} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Add ad option</button></div></section>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Changes stay in this browser until saved to portal settings.</p>
        <div className="flex gap-2"><button type="button" onClick={() => { const defaults = getDefaultPhotocardAds(); setAds(defaults); setSelectedId(defaults[0]?.id ?? ""); setDirty(true); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50">Restore defaults</button><button type="button" onClick={handleSave} disabled={!dirty || saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save ads"}</button></div>
      </div>
    </DashboardPage>
  );
}
