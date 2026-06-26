/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ArrowRight, Building2, CheckCircle2, Clock3, MapPin, Search } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { Project, UserProfile } from "../types";

interface DashboardViewProps {
  user: UserProfile;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  showHero?: boolean;
}

const dashboardBackdrop =
  "linear-gradient(90deg, rgba(10,13,17,0.94) 0%, rgba(10,13,17,0.74) 32%, rgba(10,13,17,0.94) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDq1pgb7itlk2Bz9OfgHZyq8ttV149xAqSBJ899rckjHl47Tc9cXG-PwbVK4x_9YHwCn1x-Soml4jeOzWX8EmCJgxwGIHQ3kuYNiskuDbez6hholwJzkMDTYUUXfwx7gVkRqL0ecMptJEcGrKSRtTxQIKlFwV5J8_E2vW2k_IrsD8JCYwfdKwLJvzfnwQcnDa6aqMEROIRQbcfHrrLM-8mIIvE47_tn-vT91q8gsPftqUSbRq8wg1M7llhIrGUCs7Vrb7PQRP0jzI')";

export default function DashboardView({
  user,
  projects,
  onSelectProject,
  showHero = true,
}: DashboardViewProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Residential" | "Commercial">("All");

  const clientAssigned = projects.filter(
    (proj) => proj.assignedClientId === user.email || proj.assignedClientId === user.id
  );

  const filteredProjects = clientAssigned.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || proj.category === selectedCategory;
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

  if (!showHero) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Residential", "Commercial"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[9px] uppercase tracking-[0.2em] border rounded-xl transition-colors ${
                  selectedCategory === cat
                    ? "border-primary bg-primary text-[#17120b]"
                    : "border-outline-lucid/50 bg-card-bg text-stone-variant hover:text-onyx"
                }`}
              >
                {cat === "All" ? t("dashboardPage.all") : cat === "Residential" ? t("dashboardPage.residential") : t("dashboardPage.commercial")}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-[20rem]">
            <input
              type="text"
              placeholder={t("dashboardPage.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card-bg border border-outline-lucid/55 focus:border-primary px-4 py-3 pl-10 text-xs rounded-xl outline-none text-onyx placeholder-neutral-stone/50"
            />
            <Search className="w-3.5 h-3.5 text-neutral-stone/40 absolute left-4 top-3.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-card-bg border border-outline-lucid/55 p-4 rounded-[1rem] cursor-pointer group flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[1.32] rounded-[0.85rem]">
                <img
                  src={project.thumbnailUrl}
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="bg-black/65 px-2.5 py-1 text-[7px] uppercase tracking-[0.2em] text-primary rounded-full">
                      {project.category}
                    </span>
                    <span className="bg-black/65 px-2.5 py-1 text-[7px] uppercase tracking-[0.2em] text-[#e5ddd1] rounded-full">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <div>
                  <h4 className="font-display text-xl uppercase tracking-[0.08em] text-onyx">{project.name}</h4>
                  <div className="flex items-center gap-1.5 text-neutral-stone text-xs mt-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{project.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 border-t border-outline-lucid/35 pt-3 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-stone">
                  <div>
                    <span className="block text-onyx font-semibold text-sm">{project.specs.beds || "—"}</span>
                    <span>{t("dashboardPage.beds")}</span>
                  </div>
                  <div>
                    <span className="block text-onyx font-semibold text-sm">{project.specs.livingArea.split(" ")[0]}</span>
                    <span>{t("dashboardPage.area")}</span>
                  </div>
                  <div>
                    <span className="block text-primary font-semibold text-sm">{project.specs.price.includes("$") ? project.specs.price.split(".")[0] : t("dashboardPage.byRegister")}</span>
                    <span>{t("dashboardPage.valuation")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-neutral-stone">
                  <span>{t("dashboardPage.registered")}: {project.dateAdded}</span>
                  <span className="text-primary inline-flex items-center gap-1">
                    {t("dashboardPage.openProject")}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <section
          className="relative overflow-hidden rounded-[1.3rem] border border-outline-lucid/75 min-h-[20rem] lg:min-h-[24rem] px-6 md:px-8 xl:px-10 py-8"
          style={{ backgroundImage: dashboardBackdrop, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_19rem] gap-8 h-full items-stretch">
            <div className="flex flex-col justify-between">
              <div className="max-w-2xl space-y-5 pt-2 md:pt-6">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] text-[#cabdad]">
                  <span className="text-primary">01</span>
                  <span className="h-px w-14 bg-outline-lucid/50" />
                  <span>{t("dashboardPage.overview")}</span>
                </div>
                <h2 className="font-display text-4xl md:text-6xl uppercase tracking-[0.16em] leading-[1.06] text-[#f8f1e7] max-w-[10ch]">
                  {t("dashboardPage.welcomeBack", { name: user.name })}
                </h2>
                <p className="text-sm text-[#d7cdc1] max-w-md">{t("dashboardPage.portfolioReady")}</p>
                {latestProject ? (
                  <button
                    onClick={() => onSelectProject(latestProject)}
                    className="interactive-press inline-flex items-center gap-2 border border-primary/70 text-[#f3e8d4] dark:text-[#f3e8d4] px-5 py-3 text-[10px] uppercase tracking-[0.22em] rounded-xl hover:bg-primary/10"
                  >
                    {t("dashboardPage.viewPortfolio")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="self-stretch grid grid-cols-1 gap-3 content-center">
              <div className="space-y-1 rounded-[1rem] border border-white/12 bg-white/8 backdrop-blur-sm p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#bfb19e]">{t("dashboardPage.assignedAssets")}</p>
                <p className="font-display text-3xl lg:text-4xl text-[#f7f1e8]">{user.totalAssets}</p>
              </div>
              <div className="space-y-1 rounded-[1rem] border border-white/12 bg-white/8 backdrop-blur-sm p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#bfb19e]">{t("dashboardPage.estates")}</p>
                <p className="font-display text-3xl lg:text-4xl text-[#f7f1e8]">{clientAssigned.length} <span className="text-xl lg:text-2xl">{clientAssigned.length === 1 ? t("dashboardPage.estateSingle") : t("dashboardPage.estatePlural")}</span></p>
              </div>
              <div className="space-y-1 rounded-[1rem] border border-white/12 bg-white/8 backdrop-blur-sm p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#bfb19e]">{t("dashboardPage.partnerRank")}</p>
                <p className="font-display text-3xl lg:text-4xl text-[#f7f1e8]">{user.professionalTitle.split(" ")[0]}</p>
              </div>
            </div>
          </div>
        </section>

        {latestProject ? (
          <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_18rem] gap-4">
            <div className="bg-card-bg border border-outline-lucid/55 rounded-[1.1rem] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-primary">{t("dashboardPage.priorityProject")}</p>
                  <h3 className="mt-4 font-display text-[2.1rem] uppercase tracking-[0.1em] text-onyx">{latestProject.name}</h3>
                </div>
                <button
                  onClick={() => onSelectProject(latestProject)}
                  className="interactive-press inline-flex items-center gap-2 border border-primary/60 px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-primary dark:text-[#f2e5ce] rounded-xl"
                >
                  {t("dashboardPage.openProject")}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-outline-lucid/30">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-stone">{t("dashboardPage.currentStage")}</p>
                  <p className="mt-2 text-sm text-onyx">{statusToStage(latestProject.status)}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-stone">{t("dashboardPage.location")}</p>
                  <p className="mt-2 text-sm text-onyx">{latestProject.location}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-stone">{t("dashboardPage.lastRegistryDate")}</p>
                  <p className="mt-2 text-sm text-onyx">{latestProject.dateAdded}</p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-outline-lucid/55 rounded-[1.1rem] p-5 space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-primary">{t("dashboardPage.recentUpdates")}</p>
                <h3 className="mt-2 font-display text-[0.85rem] uppercase tracking-[0.18em] text-onyx">{t("dashboardPage.clientCommandCenter")}</h3>
              </div>
              {[
                { icon: Clock3, title: t("dashboardPage.timelineReviewed"), copy: `${latestProject.name} ${statusToStage(latestProject.status).toLowerCase()}.` },
                { icon: CheckCircle2, title: t("dashboardPage.documentsReady"), copy: latestProject.specs.brochureUrl ? t("dashboardPage.floorPlanAvailable") : t("dashboardPage.floorPlanMissing") },
                { icon: MapPin, title: t("dashboardPage.neighborhoodContext"), copy: t("dashboardPage.locationContextPrepared", { location: latestProject.location }) },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 border-t border-outline-lucid/25 pt-4">
                  <item.icon className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-onyx">{item.title}</p>
                    <p className="text-[11px] text-stone-variant dark:text-neutral-stone mt-1 leading-relaxed">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[0.85rem] uppercase tracking-[0.2em] text-onyx">{t("dashboardPage.portfolioSnapshot")}</h3>
            <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-stone">{filteredProjects.length} {filteredProjects.length === 1 ? t("dashboardPage.resultSingle") : t("dashboardPage.resultPlural")} {t("dashboardPage.listed")}</span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-card-bg border border-outline-lucid/55 rounded-[1rem] p-12 text-center">
              <Building2 className="w-8 h-8 mx-auto text-neutral-stone/40" />
              <p className="mt-4 font-display text-xs uppercase tracking-wider text-onyx">{t("dashboardPage.noAssets")}</p>
              <p className="mt-2 text-[11px] text-neutral-stone">{t("dashboardPage.noAssetsLead")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-6">
              <article
                onClick={() => onSelectProject(filteredProjects[0])}
                className="bg-card-bg border border-outline-lucid/55 rounded-[1rem] p-4 cursor-pointer group interactive-press"
              >
                <div className="overflow-hidden rounded-[0.9rem] aspect-[1.18]">
                  <img src={filteredProjects[0].thumbnailUrl} alt={filteredProjects[0].name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                </div>
                <div className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-display text-[1.7rem] uppercase tracking-[0.08em] text-onyx">{filteredProjects[0].name}</h4>
                    <div className="flex items-center gap-1.5 text-neutral-stone text-xs mt-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{filteredProjects[0].location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 border-t border-outline-lucid/35 pt-4 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-stone">
                    <div>
                      <span className="block text-onyx font-semibold text-lg">{filteredProjects[0].specs.beds || "—"}</span>
                      <span>{t("dashboardPage.beds")}</span>
                    </div>
                    <div>
                      <span className="block text-onyx font-semibold text-lg">{filteredProjects[0].specs.livingArea.split(" ")[0]}</span>
                      <span>{t("dashboardPage.area")}</span>
                    </div>
                    <div>
                      <span className="block text-primary font-semibold text-lg">{t("dashboardPage.byRegister")}</span>
                      <span>{t("dashboardPage.valuation")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-neutral-stone">
                    <span>{t("dashboardPage.registered")}: {filteredProjects[0].dateAdded}</span>
                    <span className="text-primary inline-flex items-center gap-1">
                      {t("dashboardPage.openProject")}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>

              <section className="bg-card-bg border border-outline-lucid/55 rounded-[1rem] p-6 overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-display text-[0.9rem] uppercase tracking-[0.2em] text-onyx">{t("dashboardPage.newProjects")}</h4>
                    <p className="mt-2 text-[12px] text-stone-variant dark:text-[#c8bcaa] leading-relaxed">
                      {t("dashboardPage.newProjectsLead")}
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-stone">
                    {Math.max(filteredProjects.length - 1, 0)} {t("dashboardPage.queued")}
                  </span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  {filteredProjects.slice(1).map((project) => (
                    <article
                      key={project.id}
                      onClick={() => onSelectProject(project)}
                      className="min-w-[18rem] max-w-[18rem] shrink-0 rounded-[0.95rem] border border-outline-lucid/40 bg-cream-low p-3 cursor-pointer group interactive-press"
                    >
                      <div className="overflow-hidden rounded-[0.8rem] aspect-[1.35]">
                        <img
                          src={project.thumbnailUrl}
                          alt={project.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="pt-3">
                        <h5 className="font-display text-[1rem] uppercase tracking-[0.08em] text-onyx">{project.name}</h5>
                        <p className="mt-2 text-[11px] text-neutral-stone">{project.location}</p>
                      </div>
                    </article>
                  ))}

                  {filteredProjects.length <= 1 ? (
                    <div className="min-w-[18rem] max-w-[18rem] shrink-0 rounded-[0.95rem] border border-dashed border-outline-lucid/45 bg-cream-low/80 p-5 flex items-center justify-center text-center">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-stone">
                        {t("dashboardPage.emptyProjectsLead")}
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          )}
        </section>
    </div>
  );
}
