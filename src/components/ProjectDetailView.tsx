/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { ArrowLeft, ExternalLink, FileDown, Sparkles, Send, MapPin, ShieldCheck, Clock3 } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { Project, TourScene } from "../types";
import { normalizeTourEmbedUrl } from "../lib/portalData";
import NeighborhoodMap from "./NeighborhoodMap";
import TourViewer360 from "./TourViewer360";

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  const { t, locale } = useI18n();
  const [activeScene, setActiveScene] = useState<TourScene>(project.scenes[0] || {
    id: "default",
    name: t("projectPage.heroElevation"),
    category: t("projectPage.exterior"),
    imageUrl: project.heroImageUrl,
    description: t("projectPage.heroElevationDescription")
  });
  // Client Chat states
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: t("projectPage.aiWelcome", { name: project.name })
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const embedUrl = normalizeTourEmbedUrl(project.tourEmbedUrl ?? "");
  const hasEmbedTour = Boolean(embedUrl);
  const timelineStages = [
    { id: "design", label: t("projectPage.timeline.design"), active: ["Design Phase", "In Progress", "Finalized", "Occupied"].includes(project.status) },
    { id: "approval", label: t("projectPage.timeline.approval"), active: ["In Progress", "Finalized", "Occupied"].includes(project.status) },
    { id: "construction", label: t("projectPage.timeline.construction"), active: ["Excavation", "In Progress", "Finalized", "Occupied"].includes(project.status) },
    { id: "delivery", label: t("projectPage.timeline.delivery"), active: ["Finalized", "Occupied"].includes(project.status) },
  ];

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setChatLoading(true);

    // Dynamic high-fidelity tailored responses simulating deep architectural awareness
    setTimeout(() => {
      let aiResponse = "";
      const query = userText.toLowerCase();

      if (query.includes("material") || query.includes("finish") || query.includes("wood") || query.includes("marble")) {
        aiResponse = t("projectPage.aiMaterials", { name: project.name });
      } else if (query.includes("pool") || query.includes("infinity") || query.includes("water") || query.includes("deck")) {
        aiResponse = t("projectPage.aiPool");
      } else if (query.includes("price") || query.includes("cost") || query.includes("valuation") || query.includes("buy")) {
        aiResponse = t("projectPage.aiPrice", { name: project.name, price: project.specs.price });
      } else if (query.includes("size") || query.includes("sqft") || query.includes("area") || query.includes("room") || query.includes("bed")) {
        aiResponse = t("projectPage.aiSize", {
          name: project.name,
          area: project.specs.livingArea,
          beds: project.specs.beds,
          baths: project.specs.baths,
        });
      } else if (query.includes("view") || query.includes("360") || query.includes("tour") || query.includes("camera")) {
        aiResponse = t("projectPage.aiTour");
      } else {
        aiResponse = t("projectPage.aiFallback", {
          name: project.name,
          acreage: project.specs.acreage !== "N/A" ? project.specs.acreage : t("projectPage.seclusionPlot").toLowerCase(),
          amenities: project.specs.amenities,
        });
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      setChatLoading(false);
    }, 1200);
  };

  const panelClass = "bg-card-bg border border-outline-lucid/55 rounded-[1rem] transition-colors duration-300";
  const insetCardClass = "bg-cream-low border border-outline-lucid/45";
  const inputClass = "flex-1 bg-cream-low border border-outline-lucid/50 focus:border-primary px-3 py-2.5 text-xs outline-none text-onyx placeholder-neutral-stone/45 rounded-[var(--radius-ui-sm)]";
  const displayStatus = locale === "am"
    ? ({
        "Design Phase": t("projectPage.timeline.design"),
        "In Progress": t("projectPage.timeline.construction"),
        Excavation: t("projectPage.timeline.construction"),
        Finalized: t("projectPage.timeline.delivery"),
        Occupied: t("dashboardPage.deliveredOccupied"),
      }[project.status] ?? project.status)
    : project.status;
  const vaultDownloadUrl = project.specs.attachmentUrl || project.specs.brochureUrl;

  return (
    <div className="space-y-8 pb-12 max-w-[1760px] mx-auto">
      
      {/* Back button and core heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-xs uppercase tracking-widest text-[#7f7667] hover:text-onyx font-semibold transition-colors pb-1 w-max"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t("projectPage.backToGrid")}</span>
        </button>
        
        <span className="text-[10px] text-[#775a19] bg-[#775a19]/10 py-1.5 px-3 uppercase tracking-widest font-semibold font-sans w-max">
          {t("projectPage.registerId")}: {project.id.toUpperCase()}
        </span>
      </div>

      {/* Hero Header Presentation */}
      <section className="relative overflow-hidden aspect-[16/4.4] md:aspect-[16/4] rounded border border-outline-lucid/30">
        <img
          src={project.heroImageUrl}
          alt={project.name}
          className="w-full h-full object-cover filter brightness-90 animate-fade-in"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-12 text-left">
          <div className="space-y-3">
            <span className="bg-[#ffdea5] text-[#775a19] text-[9px] uppercase tracking-[0.2em] px-3.5 py-1.5 font-bold">
              {(project.category === "Residential" ? t("dashboardPage.residential") : project.category === "Commercial" ? t("dashboardPage.commercial") : t("dashboardPage.acquisitions"))} {t("projectPage.categoryRegistrySuffix")}
            </span>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-white uppercase tracking-wider">
              {project.name}
            </h1>
            <p className="flex items-center gap-1.5 text-white/80 text-xs md:text-sm">
              <MapPin className="w-4 h-4 text-[#ffdea5]" />
              <span>{project.location}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Immersive 360 Virtual Tour Panel (First class citizen!) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-left">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-onyx">
              {t("projectPage.immersiveTour")}
            </h3>
            <p className="text-[11px] text-neutral-stone">{t("projectPage.immersiveLead")}</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-stone uppercase font-mono">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse"></span>
            <span>{t("projectPage.rendering")}</span>
          </div>
        </div>

        {hasEmbedTour ? (
          <div className="space-y-3">
            <div className="overflow-hidden rounded border border-outline-lucid/30 bg-black aspect-video">
              <iframe
                src={embedUrl}
                title={`${project.name} virtual tour`}
                className="h-full w-full"
                loading="lazy"
                allow="fullscreen; autoplay; xr-spatial-tracking"
                allowFullScreen
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
              />
            </div>
            <a href={embedUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              {t("projectPage.openExternalTour")}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <TourViewer360
            scene={activeScene}
            scenes={project.scenes}
            onSelectScene={setActiveScene}
          />
        )}
      </section>

      {/* Two column presentation: Specs & Narrative VS AI Q&A Terminal */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Detail & Bento specs (8 Columns) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          {/* Specifications Bento Grid */}
          <div className={`${panelClass} p-6 space-y-4`}>
            <h4 className="font-display text-xs uppercase tracking-widest text-[#775a19] font-bold">
              {t("projectPage.assetSpecifications")}
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className={`${insetCardClass} p-3 rounded-[var(--radius-ui-sm)]`}>
                <span className="block text-xs uppercase tracking-wider text-neutral-stone text-[9px]">{t("projectPage.sovereignBeds")}</span>
                <span className="font-display text-sm font-semibold text-onyx mt-0.5 block">{project.specs.beds}</span>
              </div>
              <div className={`${insetCardClass} p-3 rounded-[var(--radius-ui-sm)]`}>
                <span className="block text-xs uppercase tracking-wider text-neutral-stone text-[9px]">{t("projectPage.sovereignBaths")}</span>
                <span className="font-display text-sm font-semibold text-onyx mt-0.5 block">{project.specs.baths}</span>
              </div>
              <div className={`${insetCardClass} p-3 rounded-[var(--radius-ui-sm)]`}>
                <span className="block text-xs uppercase tracking-wider text-neutral-stone text-[9px]">{t("projectPage.calculatedArea")}</span>
                <span className="font-display text-sm font-semibold text-onyx mt-0.5 block">{project.specs.livingArea}</span>
              </div>
              <div className={`${insetCardClass} p-3 rounded-[var(--radius-ui-sm)]`}>
                <span className="block text-xs uppercase tracking-wider text-neutral-stone text-[9px]">{t("projectPage.seclusionPlot")}</span>
                <span className="font-display text-sm font-semibold text-onyx mt-0.5 block">{project.specs.acreage}</span>
              </div>
              <div className={`${insetCardClass} p-3 rounded-[var(--radius-ui-sm)]`}>
                <span className="block text-xs uppercase tracking-wider text-neutral-stone text-[9px]">{t("projectPage.builtYear")}</span>
                <span className="font-display text-sm font-semibold text-onyx mt-0.5 block">{project.specs.builtYear}</span>
              </div>
              <div className={`${insetCardClass} p-3 rounded-[var(--radius-ui-sm)]`}>
                <span className="block text-xs uppercase tracking-wider text-neutral-stone text-[9px]">{t("projectPage.garagePorts")}</span>
                <span className="font-display text-sm font-semibold text-onyx mt-0.5 block">{project.specs.garage}</span>
              </div>
              <div className={`${insetCardClass} p-3 rounded-[var(--radius-ui-sm)]`}>
                <span className="block text-xs uppercase tracking-wider text-neutral-stone text-[9px]">{t("projectPage.exclusivePrice")}</span>
                <span className="font-display text-sm font-semibold text-[#775a19] mt-0.5 block">{project.specs.price}</span>
              </div>
              <div className={`${insetCardClass} p-3 rounded-[var(--radius-ui-sm)]`}>
                <span className="block text-xs uppercase tracking-wider text-[9px] text-[#775a19] font-medium">{t("projectPage.verificationStatus")}</span>
                <span className="font-display text-[10px] uppercase font-semibold text-[#386a20] tracking-wider mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t("projectPage.checked")}
                </span>
              </div>
            </div>
            
            <div className={`p-3 text-[10px] text-stone-variant uppercase tracking-widest transition-colors rounded-[var(--radius-ui-sm)] ${insetCardClass}`}>
              💼 <span className="font-semibold text-onyx">{t("projectPage.amenityProgram")}:</span> {project.specs.amenities}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`rounded-[var(--radius-ui-sm)] border border-outline-lucid/40 overflow-hidden ${insetCardClass}`}>
                <img src={project.thumbnailUrl} alt={`${project.name} thumbnail`} className="h-36 w-full object-cover" referrerPolicy="no-referrer" />
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("projectPage.thumbnailImage")}</p>
                </div>
              </div>
              <div className={`rounded-[var(--radius-ui-sm)] border border-outline-lucid/40 overflow-hidden ${insetCardClass}`}>
                <img src={project.heroImageUrl} alt={`${project.name} hero`} className="h-36 w-full object-cover" referrerPolicy="no-referrer" />
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("projectPage.heroImage")}</p>
                </div>
              </div>
              <div className={`rounded-[var(--radius-ui-sm)] border border-outline-lucid/40 p-3 flex flex-col justify-between ${insetCardClass}`}>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("projectPage.floorPlan")}</p>
                  <p className="mt-2 text-xs text-onyx">{t("projectPage.floorPlanLead")}</p>
                </div>
                {project.specs.brochureUrl ? (
                  <a
                    href={project.specs.brochureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-[var(--radius-ui-sm)] bg-onyx px-3 py-2 text-[10px] uppercase tracking-widest text-white"
                  >
                    {t("projectPage.viewFloorPlan")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div className="mt-4 text-[10px] uppercase tracking-widest text-neutral-stone">{t("projectPage.noFloorPlan")}</div>
                )}
              </div>
            </div>
          </div>

          {/* Narrative & Description */}
          <div className="space-y-4">
            <h4 className="font-display text-xs uppercase tracking-widest text-onyx font-bold border-b border-outline-lucid/30 pb-2">
              {t("projectPage.architectureEssay")}
            </h4>
            <div className="space-y-4 text-neutral-stone text-xs md:text-sm leading-relaxed font-sans font-light">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left">{project.description}</p>
              <p>{project.architecturalNarrative}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className={`${panelClass} p-6 space-y-4`}>
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-primary" />
                <h4 className="font-display text-xs uppercase tracking-widest text-onyx font-bold">{t("projectPage.projectTimeline")}</h4>
              </div>
              <div className="space-y-3">
                {timelineStages.map((stage) => (
                  <div key={stage.id} className="flex items-center gap-3">
                    <div className={`h-3.5 w-3.5 rounded-full border ${stage.active ? "bg-primary border-primary" : "border-outline-lucid bg-transparent"}`} />
                    <div className="flex-1">
                      <p className={`text-[10px] uppercase tracking-widest ${stage.active ? "text-onyx font-semibold" : "text-neutral-stone"}`}>{stage.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`rounded-[var(--radius-ui-sm)] p-3 text-[11px] text-neutral-stone leading-relaxed ${insetCardClass}`}>
                {t("projectPage.currentStatus")}: <span className="text-onyx font-semibold">{displayStatus}</span>
              </div>
            </div>

            <NeighborhoodMap location={project.location} projectName={project.name} />
          </div>

          {/* Document Vault Downloads */}
          <div className={`${panelClass} p-5 flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 text-primary rounded-[var(--radius-ui-sm)] ${insetCardClass}`}>
                <FileDown className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-display text-[11px] uppercase font-semibold text-onyx tracking-wider">{t("projectPage.acquisitionVault")}</p>
                <p className="text-[9px] text-neutral-stone uppercase tracking-wider">{t("projectPage.acquisitionVaultLead")}</p>
              </div>
            </div>

            {vaultDownloadUrl ? (
              <a
                href={vaultDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-primary/70 text-[#f3e8d2] text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-[var(--radius-ui-sm)] transition-all hover:bg-primary/10 flex items-center gap-1.5"
              >
                <span>{t("projectPage.downloadLedger")}</span>
              </a>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-neutral-stone">
                {t("projectPage.noVaultFile")}
              </span>
            )}
          </div>

        </div>

        {/* Right Side: AI Assistant Chat Module (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className={`${panelClass} flex flex-col h-[510px]`}>
            
            {/* Chat header */}
            <div className="p-4 border-b border-outline-lucid/35 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 text-primary rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-display text-[11px] uppercase font-bold text-onyx tracking-widest">
                    {t("projectPage.advisorDesk")}
                  </h4>
                  <p className="text-[8px] text-neutral-stone uppercase tracking-widest">
                    {t("projectPage.advisorDeskLead")}
                  </p>
                </div>
              </div>

              {/* Status bullet */}
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans text-left">
              {messages.map((msg, idx) => {
                const isAI = msg.sender === "ai";
                return (
                  <div
                    key={idx}
                    className={`flex ${isAI ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 leading-relaxed ${
                        isAI
                          ? "bg-cream-low text-stone-variant border border-outline-lucid/35 rounded-2xl rounded-tl-sm animate-fade-in"
                          : "bg-[#775a19] text-white rounded-2xl rounded-tr-sm animate-fade-in"
                      }`}
                    >
                      {/* Short label header */}
                      <p className={`text-[8px] uppercase tracking-wider font-semibold mb-1 ${isAI ? "text-[#775a19]" : "text-[#ffdea5]"}`}>
                        {isAI ? t("projectPage.advocacy") : t("projectPage.clientBriefing")}
                      </p>
                      <p className="font-light">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-cream-low border border-outline-lucid/35 p-3 rounded-[var(--radius-ui-sm)] max-w-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-220"></span>
                    <span className="text-[9px] text-[#7f7667] uppercase tracking-widest pl-1">{t("projectPage.consulting")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions buttons */}
            <div className="px-4 py-2 bg-cream-low border-t border-b border-outline-lucid/30 flex flex-wrap gap-1.5">
              {[
                { label: t("projectPage.suggestionMaterials"), ask: t("projectPage.askMaterials") },
                { label: t("projectPage.suggestionSizing"), ask: t("projectPage.askSizing") },
                { label: t("projectPage.suggestionPool"), ask: t("projectPage.askPool") }
              ].map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChatInput(sug.ask);
                  }}
                  className="bg-card-bg hover:bg-cream-low border border-outline-lucid/30 hover:border-primary text-neutral-stone hover:text-onyx px-2 py-1 text-[9px] uppercase tracking-wide transition-colors cursor-pointer rounded-[var(--radius-ui-sm)]"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-card-bg border-t border-outline-lucid/30 flex items-center gap-2 rounded-b-[1rem]">
              <input
                type="text"
                placeholder={t("projectPage.queryPlaceholder")}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className={inputClass}
              />
              <button
                type="submit"
                className="p-2.5 bg-onyx text-white hover:bg-primary transition-colors hover:scale-103 cursor-pointer rounded-[var(--radius-ui-sm)]"
                aria-label={t("projectPage.sendQuery")}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>

      </section>
    </div>
  );
}
