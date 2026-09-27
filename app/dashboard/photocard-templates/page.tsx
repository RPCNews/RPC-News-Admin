"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy, Image, Layers, Loader2, Plus, Save, Star, Trash2 } from "lucide-react";
import { DashboardPage } from "@/components/DashboardShell";
import { ErrorState, LoadingState } from "@/components/DashboardState";
import { useFeedback } from "@/components/FeedbackProvider";
import NewsPhotoCard from "@/components/NewsPhotoCard";
import { loadPhotocardAds, type PhotocardAd } from "@/app/lib/photocardAds";
import {
  getDefaultPhotocardTemplates,
  loadPhotocardTemplates,
  savePhotocardTemplates,
  type PhotocardFormat,
  type PhotocardTemplate,
  type PhotocardTemplateStyle,
} from "@/app/lib/photocardTemplates";
import { portalConfig } from "@/app/lib/portalConfig";

function createTemplate(): PhotocardTemplate {
  return {
    id: crypto.randomUUID(), name: "New template", enabled: true, isDefault: false,
    style: "editorial", format: "square", accentColor: portalConfig.photocard.accentColor,
    logoPosition: "top-right", headlineAlignment: "left", headlineFontSize: 65,
    footerFontSize: 31, centerTextFontSize: 28, showLogo: true, showCategory: true,
    showDate: true, showComment: true, showWebsite: true,
  };
}

export default function PhotocardTemplatesPage() {
  const [templates, setTemplates] = useState<PhotocardTemplate[]>([]);
  const [ads, setAds] = useState<PhotocardAd[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useFeedback();
  const selected = useMemo(() => templates.find((template) => template.id === selectedId) ?? null, [templates, selectedId]);
  const previewAd = ads.find((ad) => ad.enabled && ad.isDefault) ?? null;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [savedTemplates, savedAds] = await Promise.all([loadPhotocardTemplates(), loadPhotocardAds()]);
      setTemplates(savedTemplates);
      setAds(savedAds);
      setSelectedId(savedTemplates[0]?.id ?? "");
      setDirty(false);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load photocard templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const update = (changes: Partial<PhotocardTemplate>) => {
    setTemplates((current) => current.map((template) => template.id === selectedId ? { ...template, ...changes } : template));
    setDirty(true);
  };

  const addTemplate = () => {
    const template = createTemplate();
    if (!templates.some((item) => item.enabled && item.isDefault)) template.isDefault = true;
    setTemplates((current) => [...current, template]);
    setSelectedId(template.id);
    setDirty(true);
  };

  const duplicateTemplate = () => {
    if (!selected) return;
    const copy = { ...selected, id: crypto.randomUUID(), name: `${selected.name} copy`, isDefault: false };
    setTemplates((current) => [...current, copy]);
    setSelectedId(copy.id);
    setDirty(true);
  };

  const deleteTemplate = () => {
    if (!selected) return;
    const remaining = templates.filter((template) => template.id !== selected.id).map((template) => ({ ...template }));
    if (selected.isDefault && remaining.length) {
      const nextDefault = remaining.find((template) => template.enabled) ?? remaining[0];
      nextDefault.isDefault = true;
    }
    setTemplates(remaining);
    setSelectedId(remaining[0]?.id ?? "");
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const next = templates.map((template) => ({ ...template, isDefault: template.enabled && template.isDefault }));
      if (!next.some((template) => template.isDefault && template.enabled) && next.some((template) => template.enabled)) {
        const firstEnabled = next.find((template) => template.enabled);
        if (firstEnabled) firstEnabled.isDefault = true;
      }
      await savePhotocardTemplates(next);
      setTemplates(next);
      setDirty(false);
      showToast({ title: "Templates saved", description: "Enabled templates are now available in the photocard editor.", variant: "success" });
    } catch (saveError) {
      showToast({ title: "Could not save templates", description: saveError instanceof Error ? saveError.message : "Please try again.", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardPage><LoadingState label="Loading photocard templates..." /></DashboardPage>;
  if (error) return <DashboardPage><ErrorState title="Could not load photocard templates" description={error} onRetry={() => void refresh()} /></DashboardPage>;

  return (
    <DashboardPage className="text-gray-900">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500"><Layers size={16} /> Photocard tools</div><h1 className="text-3xl font-bold">Photocard templates</h1><p className="mt-1 text-sm text-gray-500">Build reusable card designs, then choose a template each time you create a photocard.</p></div>
        <button type="button" onClick={save} disabled={!dirty || saving} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}{saving ? "Saving..." : "Save changes"}</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4"><div><h2 className="font-bold">Templates</h2><p className="text-xs text-gray-500">{templates.length} saved</p></div><button type="button" onClick={addTemplate} title="Add template" className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"><Plus size={18} /></button></div>
          <div className="max-h-[620px] overflow-y-auto p-2">
            {templates.map((template) => <button key={template.id} type="button" onClick={() => setSelectedId(template.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${selectedId === template.id ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-gray-50"}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gray-200" style={{ backgroundColor: template.accentColor }}><Image size={18} className="text-white" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{template.name}</span><span className="mt-0.5 block text-xs capitalize text-gray-500">{template.style} · {template.format}{template.enabled ? "" : " · paused"}</span></span>{template.isDefault ? <Star size={15} className="fill-amber-400 text-amber-500" /> : null}</button>)}
            {!templates.length ? <p className="p-4 text-sm text-gray-500">No templates yet. Create one to get started.</p> : null}
          </div>
        </section>

        {selected ? <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(350px,0.85fr)]">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold">Template design</h2><p className="text-sm text-gray-500">Changes are reflected in the preview immediately.</p></div><div className="flex gap-2"><button type="button" onClick={duplicateTemplate} title="Duplicate template" className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"><Copy size={17} /></button><button type="button" onClick={deleteTemplate} title="Delete template" className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Template name</span><input value={selected.name} onChange={(e) => update({ name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Design style</span><select value={selected.style} onChange={(e) => update({ style: e.target.value as PhotocardTemplateStyle })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"><option value="editorial">Editorial overlay</option><option value="framed">Clean frame</option><option value="breaking">Breaking banner</option></select></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Canvas format</span><select value={selected.format} onChange={(e) => update({ format: e.target.value as PhotocardFormat })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"><option value="square">Square · 1080 × 1080</option><option value="portrait">Portrait · 1080 × 1350</option></select></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Logo position</span><select value={selected.logoPosition} onChange={(e) => update({ logoPosition: e.target.value as PhotocardTemplate["logoPosition"] })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"><option value="top-right">Top right</option><option value="top-left">Top left</option></select></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Headline alignment</span><select value={selected.headlineAlignment} onChange={(e) => update({ headlineAlignment: e.target.value as PhotocardTemplate["headlineAlignment"] })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"><option value="left">Left</option><option value="center">Center</option></select></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Accent color</span><span className="flex gap-2"><input type="color" value={selected.accentColor} onChange={(e) => update({ accentColor: e.target.value })} className="h-11 w-14 rounded-lg border border-gray-300 p-1" /><input value={selected.accentColor} onChange={(e) => update({ accentColor: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" /></span></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Headline size · {selected.headlineFontSize}px</span><input type="range" min="45" max="100" step="1" value={selected.headlineFontSize} onChange={(e) => update({ headlineFontSize: Number(e.target.value) })} className="w-full accent-blue-600" /></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Footer size · {selected.footerFontSize}px</span><input type="range" min="20" max="37" step="1" value={selected.footerFontSize} onChange={(e) => update({ footerFontSize: Number(e.target.value) })} className="w-full accent-blue-600" /></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Center text size · {selected.centerTextFontSize}px</span><input type="range" min="16" max="40" step="1" value={selected.centerTextFontSize} onChange={(e) => update({ centerTextFontSize: Number(e.target.value) })} className="w-full accent-blue-600" /></label>
            </div>
            <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
              {([["showLogo", "Portal logo"], ["showCategory", "Category"], ["showDate", "Date"], ["showComment", "Footer comment"], ["showWebsite", "Website"]] as const).map(([key, label]) => <label key={key} className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={selected[key]} onChange={(e) => update({ [key]: e.target.checked } as Partial<PhotocardTemplate>)} className="h-4 w-4 accent-blue-600" />Show {label.toLowerCase()}</label>)}
            </div>
            <div className="mt-5 flex flex-wrap gap-5 border-t border-gray-100 pt-5"><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={selected.enabled} onChange={(e) => update({ enabled: e.target.checked, isDefault: e.target.checked ? selected.isDefault : false })} className="h-4 w-4 accent-blue-600" />Available in card editor</label><label className="flex items-center gap-2 text-sm font-medium"><input type="radio" name="defaultTemplate" checked={selected.isDefault} disabled={!selected.enabled} onChange={() => { setTemplates((current) => current.map((template) => ({ ...template, isDefault: template.id === selected.id }))); setDirty(true); }} className="h-4 w-4 accent-blue-600" />Default template</label></div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Live photocard preview</h2><p className="text-xs text-gray-500">Sample story · {selected.format} format</p></div><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-600">{selected.style}</span></div><NewsPhotoCard headline="আপনার সংবাদের শিরোনাম এখানে দেখুন" category="জাতীয়" imageSrc="/images/photocard-preview-placeholder.svg" logoUrl={portalConfig.logoUrl} date="২৬ সেপ্টেম্বর ২০২৬" commentText={portalConfig.photocard.commentText} accentColor={selected.accentColor} headlineFontSize={selected.headlineFontSize} footerBarFontSize={selected.footerFontSize} centerTextFontSize={selected.centerTextFontSize} ad={previewAd} template={selected} isPreview /><div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">{selected.isDefault ? "This template is used when a photocard is first opened." : "Editors can select this template from the card editor."} {selected.enabled ? "It is available to editors." : "It is paused and hidden from the card editor."}</div></section>
        </div> : <section className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center"><div><Layers className="mx-auto mb-3 text-gray-400" size={30} /><h2 className="font-bold">Select or add a template</h2><button type="button" onClick={addTemplate} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Add template</button></div></section>}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"><p className="text-sm text-gray-500">Changes stay in this browser until saved.</p><div className="flex gap-2"><button type="button" onClick={() => { const defaults = getDefaultPhotocardTemplates(); setTemplates(defaults); setSelectedId(defaults[0]?.id ?? ""); setDirty(true); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50">Restore defaults</button><button type="button" onClick={save} disabled={!dirty || saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save templates"}</button></div></div>
    </DashboardPage>
  );
}
