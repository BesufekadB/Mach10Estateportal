/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, MapPin, Building2, Calendar, Compass, Clock3, ArrowRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { UserProfile, Project } from "../types";

interface DashboardViewProps {
  user: UserProfile;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  showHero?: boolean;
}

export default function DashboardView({ user, projects, onSelectProject, showHero = true }: DashboardViewProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Residential" | "Commercial">("All");
  const [showAllCatalog, setShowAllCatalog] = useState(false); // Legendary toggle to view full catalog vs client registry

  // 1. Filter based on Client ID assignment (unless showAllCatalog toggled for testing)
  const clientAssigned = projects.filter(
    (proj) => proj.assignedClientId === user.email || proj.assignedClientId === user.id
  );

  const displayPool = showAllCatalog ? projects : clientAssigned;

  // 2. Perform search and category filtering
  const filteredProjects = displayPool.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All" || proj.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const latestProject = filteredProjects[0] ?? clientAssigned[0] ?? projects[0] ?? null;
  const statusToStage = (status: Project["status"]) => {
    switch (status) {
      case "Design Phase":
        return t("dashboardPage.designReview");
      case "Excavation":
        return t("dashboardPage.constructionMobilization");
      case "In Progress":
        return t("dashboardPage.activeExecution");
      case "Finalized":
        return t("dashboardPage.clientApprovalComplete");
      case "Occupied":
        return t("dashboardPage.deliveredOccupied");
      default:
        return t("dashboardPage.portfolioPending");
    }
  };

  return (
    <div className={showHero ? "space-y-8" : "space-y-6"}>
      
      {showHero && (
        <section className="bg-white/95 dark:bg-card-bg border border-outline-lucid/50 dark:border-outline-lucid/15 relative overflow-hidden rounded-[var(--radius-ui)] transition-colors duration-300 p-4 md:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(250,249,249,0.78))] dark:bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.18),transparent_28%),linear-gradient(135deg,rgba(20,17,10,0.98),rgba(15,12,7,0.96))] pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1.5">
              <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#775a19] font-semibold">
                {t("dashboardPage.overview")}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3">
                <h2 className="font-display text-lg md:text-xl font-semibold text-onyx tracking-wide">
                  {t("dashboardPage.welcomeBack", { name: user.name })}
                </h2>
                <p className="text-[11px] text-neutral-stone">
                  {t("dashboardPage.portfolioReady")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:min-w-[36rem]">
              <div className="bg-stone-50/90 dark:bg-cream-low/80 border border-stone-100 dark:border-outline-lucid/10 rounded-[var(--radius-ui-sm)] px-3.5 py-3">
                <p className="text-[8px] uppercase tracking-[0.22em] text-neutral-stone">{t("dashboardPage.assignedAssets")}</p>
                <p className="mt-1 font-display text-sm font-semibold text-onyx">{user.totalAssets}</p>
              </div>
              <div className="bg-stone-50/90 dark:bg-cream-low/80 border border-stone-100 dark:border-outline-lucid/10 rounded-[var(--radius-ui-sm)] px-3.5 py-3">
                <p className="text-[8px] uppercase tracking-[0.22em] text-neutral-stone">{t("dashboardPage.estates")}</p>
                <p className="mt-1 font-display text-sm font-semibold text-onyx">
                  {clientAssigned.length} {clientAssigned.length === 1 ? t("dashboardPage.estateSingle") : t("dashboardPage.estatePlural")}
                </p>
              </div>
              <div className="bg-[#775a19]/6 dark:bg-primary/10 border border-primary/15 rounded-[var(--radius-ui-sm)] px-3.5 py-3">
                <p className="text-[8px] uppercase tracking-[0.22em] text-neutral-stone">{t("dashboardPage.partnerRank")}</p>
                <p className="mt-1 font-display text-sm font-semibold text-[#775a19] dark:text-primary uppercase tracking-[0.16em]">
                  {user.professionalTitle.split(" ")[0]}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Custom Filter and Search Bar */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-outline-lucid/40">
        
        {/* Toggle selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Residential", "Commercial"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-[10px] uppercase font-label-sm tracking-wider border rounded-[var(--radius-ui-sm)] transition-colors ${
                selectedCategory === cat
                  ? "bg-onyx text-white border-onyx font-semibold"
                  : "bg-white dark:bg-card-bg hover:bg-stone-50 dark:hover:bg-cream-low text-neutral-stone hover:text-onyx border-outline-lucid/45 dark:border-outline-lucid/15"
              }`}
            >
              {cat === "All" ? t("dashboardPage.all") : cat === "Residential" ? t("dashboardPage.residential") : t("dashboardPage.commercial")}
            </button>
          ))}

          {/* Catalog view switcher */}
          <button
            onClick={() => setShowAllCatalog(!showAllCatalog)}
            className={`ml-0 md:ml-4 px-4 py-2.5 text-[10px] uppercase font-semibold tracking-wider flex items-center gap-2 border rounded-[var(--radius-ui-sm)] transition-transform hover:scale-102 ${
              showAllCatalog 
                ? "bg-primary text-white border-primary" 
                : "bg-[#775a19]/10 text-[#775a19] border-transparent"
            }`}
          >
            <Compass className="w-3.5 h-3.5 animate-pulse" />
            <span>{showAllCatalog ? t("dashboardPage.showingGlobalRegistry") : t("dashboardPage.showAllTours")}</span>
          </button>
        </div>

        {/* Input box */}
        <div className="relative w-full xl:w-[28rem]">
          <input
            type="text"
            placeholder={t("dashboardPage.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-card-bg border border-outline-lucid/70 dark:border-outline-lucid/15 focus:border-primary px-4 py-3 pl-10 text-xs rounded-[var(--radius-ui-sm)] outline-none text-onyx placeholder-neutral-stone/50 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-neutral-stone/40 absolute left-4 top-3.5" />
        </div>

      </section>

      {showHero && latestProject ? (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-left">
          <div className="xl:col-span-8 bg-white dark:bg-card-bg border border-outline-lucid/60 dark:border-outline-lucid/15 rounded-[var(--radius-ui)] p-6">
            <div className="flex items-center justify-between gap-4 border-b border-outline-lucid/20 pb-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-[#775a19] font-semibold">{t("dashboardPage.priorityProject")}</p>
                <h3 className="font-display text-xl text-onyx uppercase tracking-wider mt-1">{latestProject.name}</h3>
                <p className="text-xs text-neutral-stone mt-2 max-w-2xl">
                  {latestProject.description}
                </p>
              </div>
              <button
                onClick={() => onSelectProject(latestProject)}
                className="shrink-0 inline-flex items-center gap-2 bg-onyx hover:bg-primary text-white px-4 py-2.5 text-[10px] uppercase tracking-widest rounded-[var(--radius-ui-sm)]"
              >
                {t("dashboardPage.openProject")}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="rounded-[var(--radius-ui-sm)] border border-outline-lucid/20 p-4 bg-stone-50/70 dark:bg-cream-low/70">
                <p className="text-[8px] uppercase tracking-[0.22em] text-neutral-stone">{t("dashboardPage.currentStage")}</p>
                <p className="mt-2 font-display text-sm text-onyx">{statusToStage(latestProject.status)}</p>
              </div>
              <div className="rounded-[var(--radius-ui-sm)] border border-outline-lucid/20 p-4 bg-stone-50/70 dark:bg-cream-low/70">
                <p className="text-[8px] uppercase tracking-[0.22em] text-neutral-stone">{t("dashboardPage.location")}</p>
                <p className="mt-2 font-display text-sm text-onyx">{latestProject.location}</p>
              </div>
              <div className="rounded-[var(--radius-ui-sm)] border border-outline-lucid/20 p-4 bg-stone-50/70 dark:bg-cream-low/70">
                <p className="text-[8px] uppercase tracking-[0.22em] text-neutral-stone">{t("dashboardPage.lastRegistryDate")}</p>
                <p className="mt-2 font-display text-sm text-onyx">{latestProject.dateAdded}</p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 bg-white dark:bg-card-bg border border-outline-lucid/60 dark:border-outline-lucid/15 rounded-[var(--radius-ui)] p-6 space-y-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#775a19] font-semibold">{t("dashboardPage.recentUpdates")}</p>
              <h3 className="font-display text-sm uppercase tracking-widest text-onyx mt-1">{t("dashboardPage.clientCommandCenter")}</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: Clock3, title: t("dashboardPage.timelineReviewed"), copy: `${latestProject.name} is currently at ${latestProject.status}.` },
                { icon: CheckCircle2, title: t("dashboardPage.documentsReady"), copy: latestProject.specs.brochureUrl ? t("dashboardPage.floorPlanAvailable") : t("dashboardPage.floorPlanMissing") },
                { icon: MapPin, title: t("dashboardPage.neighborhoodContext"), copy: t("dashboardPage.locationContextPrepared", { location: latestProject.location }) },
              ].map((item) => (
                <div key={item.title} className="rounded-[var(--radius-ui-sm)] border border-outline-lucid/20 p-3 bg-stone-50/60 dark:bg-cream-low/60">
                  <div className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-onyx font-semibold">{item.title}</p>
                      <p className="text-[11px] text-neutral-stone mt-1 leading-relaxed">{item.copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. Grid representation */}
      <section className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-onyx">
            {showAllCatalog ? "Consolidated Architectural Registry" : "Portfolio Snapshot"}
            {showAllCatalog ? t("dashboardPage.allRegistry") : t("dashboardPage.portfolioSnapshot")}
          </h3>
          <span className="text-[10px] text-neutral-stone uppercase tracking-widest">
            {filteredProjects.length} {filteredProjects.length === 1 ? t("dashboardPage.resultSingle") : t("dashboardPage.resultPlural")} {t("dashboardPage.listed")}
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-card-bg border border-neutral-stone/10 dark:border-outline-lucid/10 p-12 text-center rounded-[var(--radius-ui)] max-w-xl mx-auto space-y-4">
            <Building2 className="w-8 h-8 mx-auto text-neutral-stone/40" />
            <p className="font-display text-xs uppercase tracking-wider text-onyx">{t("dashboardPage.noAssets")}</p>
            <p className="text-[11px] text-neutral-stone leading-relaxed">
              {t("dashboardPage.noAssetsLead")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              // Status Badge color mapping
              const getStatusColor = (status: Project["status"]) => {
                switch (status) {
                  case "In Progress":
                    return "bg-[#775a19] text-[#ffdea5] border-[#775a19]/30";
                  case "Finalized":
                    return "bg-[#386a20] text-emerald-50 border-emerald-800/20";
                  case "Design Phase":
                    return "bg-slate-800 text-slate-100 border-slate-700/30";
                  case "Excavation":
                    return "bg-[#7c5800] text-yellow-50 border-yellow-800/30";
                  default:
                    return "bg-neutral-850 text-neutral-200";
                }
              };

              return (
                <article
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="bg-white dark:bg-card-bg border border-outline-lucid/60 dark:border-outline-lucid/15 p-4 rounded-[var(--radius-ui)] cursor-pointer group hover:shadow-[0px_20px_35px_rgba(119,90,25,0.03)] transition-all duration-400 flex flex-col justify-between"
                >
                  
                  {/* Image space with hover zoom */}
                  <div className="relative overflow-hidden aspect-video bg-stone-100 dark:bg-cream-low mb-5 rounded-[calc(var(--radius-ui)-0.2rem)]">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Left overlay badge category */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                      <span className="bg-black/85 backdrop-blur-md px-3 py-1 text-[8px] uppercase tracking-widest text-[#ffdea5] font-semibold">
                        {project.category}
                      </span>
                      <span className={`px-2.5 py-1 text-[8px] uppercase tracking-widest font-semibold border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    {/* View overlay action trigger */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center justify-items-center">
                      <span className="bg-white/95 px-5 py-2.5 text-[9px] uppercase tracking-widest text-onyx font-semibold shadow-2xl transition-transform translate-y-2 group-hover:translate-y-0">
                        {t("dashboardPage.exploreTour")}
                      </span>
                    </div>
                  </div>

                  {/* Body elements */}
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-onyx group-hover:text-primary transition-colors">
                        {project.name}
                      </h4>
                      
                      <div className="flex items-center gap-1.5 text-neutral-stone text-xs mt-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-stone/50" />
                        <span>{project.location}</span>
                      </div>
                    </div>

                    {/* Property Specs preview bar */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-stone-100 dark:border-outline-lucid/10 text-center text-[10px] text-neutral-stone">
                      <div>
                        <span className="block font-medium text-onyx">{project.specs.beds || "—"}</span>
                        <span className="text-[8px] uppercase tracking-wider text-neutral-stone opacity-60">{t("dashboardPage.beds")}</span>
                      </div>
                      <div>
                        <span className="block font-medium text-onyx">{project.specs.livingArea.split(" ")[0]}</span>
                        <span className="text-[8px] uppercase tracking-wider text-neutral-stone opacity-60">{t("dashboardPage.area")}</span>
                      </div>
                      <div>
                        <span className="block font-medium text-[#775a19]">{project.specs.price.includes("$") ? project.specs.price.split(".")[0] : t("dashboardPage.byRegister")}</span>
                        <span className="text-[8px] uppercase tracking-wider text-[#775a19] opacity-70">{t("dashboardPage.valuation")}</span>
                      </div>
                    </div>

                    {/* Mini stats row */}
                    <div className="flex items-center justify-between pt-1 text-[9px] text-neutral-stone uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-stone/40" />
                        {t("dashboardPage.registered")}: {project.dateAdded}
                      </span>
                      
                      <span className="text-primary font-bold group-hover:underline flex items-center gap-0.5">
                        {t("dashboardPage.openProject")} &rarr;
                      </span>
                    </div>

                  </div>

                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Bottom concierge block */}
      <section className="bg-stone-50 dark:bg-cream-low border border-outline-lucid/50 dark:border-outline-lucid/15 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left transition-colors duration-300 rounded-[var(--radius-ui)]">
        <div className="space-y-1 max-w-lg">
          <h4 className="font-display text-xs uppercase tracking-widest text-[#775a19] font-bold">{t("dashboardPage.concierge")}</h4>
          <p className="text-[11px] text-stone-variant leading-relaxed">
            {t("dashboardPage.conciergeLead")}
          </p>
        </div>
        <a 
          href={`mailto:expert@aurelianreserve.com?subject=Enquiry on Reserve portfolios`}
          className="bg-onyx hover:bg-[#775a19] text-white px-6 py-3 uppercase tracking-widest text-[10px] font-semibold transition-colors duration-300 shadow-sm"
        >
          {t("dashboardPage.contactDesk")}
        </a>
      </section>

    </div>
  );
}
