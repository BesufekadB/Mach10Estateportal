/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useEffect, useState } from "react";
import { Building2, FileUp, FolderKanban, Layers, LayoutGrid, LogOut, Moon, Pencil, Sun, UploadCloud, UserRound } from "lucide-react";
import { listAdminClients, listAdminProjects, createAdminProject, normalizeTourEmbedUrl, updateAdminProject } from "../lib/portalData";
import { useI18n } from "../lib/i18n";
import type { AdminClientSummary, AdminProjectRecord, CreateProjectInput, DataSourceMode, ProjectAssetType, UserProfile } from "../types";

interface AdminPortalProps {
  user: UserProfile;
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  dataMode: DataSourceMode;
}

type ProjectFormState = Omit<CreateProjectInput, "files">;

const builtYearOptions = Array.from({ length: 10 }, (_, index) => String(new Date().getFullYear() - index));

const createInitialForm = (t: (key: string, vars?: Record<string, string | number>) => string): ProjectFormState => ({
  clientUserId: "",
  companyName: "",
  projectName: "",
  location: "",
  category: "Residential",
  status: "Design Phase",
  units: 1,
  description: "",
  architecturalNarrative: "",
  notes: "",
  beds: "—",
  baths: "—",
  livingArea: t("common.na"),
  acreage: t("common.na"),
  builtYear: t("common.na"),
  garage: t("common.na"),
  amenities: t("common.na"),
  price: t("common.priceUponRequest"),
  tourEmbedUrl: "",
  showcaseSceneName: t("adminPage.defaultSceneName"),
  showcaseSceneCategory: t("adminPage.defaultSceneCategory"),
  showcaseSceneDescription: t("adminPage.defaultSceneDescription"),
});

export default function AdminPortal({ user, onLogout, theme, onToggleTheme, dataMode }: AdminPortalProps) {
  const { t } = useI18n();
  const initialForm = createInitialForm(t);
  const amenityOptions = [
    t("common.na"),
    t("adminPage.amenityInfinityPool"),
    t("adminPage.amenityPrivateSpa"),
    t("adminPage.amenityWineCellar"),
    t("adminPage.amenityHomeTheater"),
    t("adminPage.amenityGym"),
    t("adminPage.amenityOutdoorKitchen"),
    t("adminPage.amenityGuestHouse"),
    t("adminPage.amenitySmartHome"),
    t("adminPage.amenitySolarArray"),
    t("adminPage.amenityPrivateElevator"),
    t("adminPage.amenityTennisCourt"),
    t("adminPage.amenityWaterGarden"),
  ];
  const [clients, setClients] = useState<AdminClientSummary[]>([]);
  const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formState, setFormState] = useState<ProjectFormState>(() => initialForm);
  const [files, setFiles] = useState<Partial<Record<ProjectAssetType, File>>>({});
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const fieldClass = "w-full bg-cream-low border border-outline-lucid/60 px-3 py-3 text-xs text-onyx rounded-[var(--radius-ui-sm)] outline-none";
  const panelClass = "bg-card-bg border border-outline-lucid/55 rounded-[1rem] transition-colors duration-300";
  const insetCardClass = "bg-cream-low border border-outline-lucid/40";

  const refreshAdminData = async () => {
    if (dataMode === "mock") {
      setClients([]);
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [clientRows, projectRows] = await Promise.all([listAdminClients(), listAdminProjects()]);
      setClients(clientRows);
      setProjects(projectRows);
    } catch (adminError) {
      setError(adminError instanceof Error ? adminError.message : t("adminPage.unableToLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshAdminData();
  }, []);

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find((client) => client.id === clientId);
    setFormState((prev) => ({
      ...prev,
      clientUserId: clientId,
      companyName: selectedClient?.company ?? prev.companyName,
    }));
  };

  const handleFileChange = (assetType: ProjectAssetType, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [assetType]: file ?? undefined,
    }));
  };

  const resetForm = () => {
    setEditingProjectId(null);
    setFormState(initialForm);
    setFiles({});
  };

  const startEditProject = (entry: AdminProjectRecord) => {
    setEditingProjectId(entry.project.id);
    setError(null);
    setSuccess(null);
    setFiles({});
    setFormState({
      clientUserId: entry.project.client_user_id,
      companyName: entry.project.company_name,
      projectName: entry.project.project_name,
      location: entry.project.location,
      category: entry.project.category,
      status: entry.project.status,
      units: entry.project.units,
      description: entry.project.description,
      architecturalNarrative: entry.project.architectural_narrative,
      notes: entry.project.notes,
      beds: entry.project.beds,
      baths: entry.project.baths,
      livingArea: entry.project.living_area,
      acreage: entry.project.acreage,
      builtYear: entry.project.built_year,
      garage: entry.project.garage,
      amenities: entry.project.amenities,
      price: entry.project.price,
      tourEmbedUrl: entry.project.tour_embed_url ?? "",
      showcaseSceneName: entry.project.showcase_scene_name,
      showcaseSceneCategory: entry.project.showcase_scene_category,
      showcaseSceneDescription: entry.project.showcase_scene_description,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (dataMode === "mock") {
        throw new Error(t("adminPage.createRequiresSupabase"));
      }

      if (!formState.clientUserId) {
        throw new Error(t("adminPage.chooseClient"));
      }

      const payload: CreateProjectInput = {
        ...formState,
        files,
      };

      if (editingProjectId) {
        await updateAdminProject(editingProjectId, payload);
        setSuccess(t("adminPage.projectUpdated"));
      } else {
        await createAdminProject(payload);
        setSuccess(t("adminPage.projectCreated"));
      }

      resetForm();
      await refreshAdminData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("adminPage.unableToCreate"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-luxury p-0 sm:p-2.5 transition-colors duration-300">
      <div className="min-h-screen bg-background-luxury rounded-none sm:rounded-[1.75rem] border-0 sm:border border-outline-lucid/75 shadow-xl overflow-hidden text-onyx transition-all duration-350 relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              theme === "dark"
                ? "linear-gradient(90deg, rgba(10,13,17,0.92) 0%, rgba(10,13,17,0.72) 28%, rgba(10,13,17,0.96) 55%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDq1pgb7itlk2Bz9OfgHZyq8ttV149xAqSBJ899rckjHl47Tc9cXG-PwbVK4x_9YHwCn1x-Soml4jeOzWX8EmCJgxwGIHQ3kuYNiskuDbez6hholwJzkMDTYUUXfwx7gVkRqL0ecMptJEcGrKSRtTxQIKlFwV5J8_E2vW2k_IrsD8JCYwfdKwLJvzfnwQcnDa6aqMEROIRQbcfHrrLM-8mIIvE47_tn-vT91q8gsPftqUSbRq8wg1M7llhIrGUCs7Vrb7PQRP0jzI')"
                : "linear-gradient(90deg, rgba(245,241,234,0.92) 0%, rgba(245,241,234,0.72) 28%, rgba(245,241,234,0.96) 55%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDq1pgb7itlk2Bz9OfgHZyq8ttV149xAqSBJ899rckjHl47Tc9cXG-PwbVK4x_9YHwCn1x-Soml4jeOzWX8EmCJgxwGIHQ3kuYNiskuDbez6hholwJzkMDTYUUXfwx7gVkRqL0ecMptJEcGrKSRtTxQIKlFwV5J8_E2vW2k_IrsD8JCYwfdKwLJvzfnwQcnDa6aqMEROIRQbcfHrrLM-8mIIvE47_tn-vT91q8gsPftqUSbRq8wg1M7llhIrGUCs7Vrb7PQRP0jzI')",
            backgroundSize: "cover",
            backgroundPosition: "left center",
          }}
        />
        <header className="sticky top-0 z-40 border-b border-outline-lucid/80 bg-card-bg backdrop-blur-xl">
          <div className="max-w-[1740px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-5">
            <div className="flex items-center gap-3 text-primary uppercase">
              <Layers className="w-4 h-4 stroke-[1.6]" />
              <div>
                <p className="font-display text-[0.8rem] font-semibold tracking-[0.22em] text-onyx">ESTATE PORTAL</p>
                <p className="text-[0.42rem] tracking-[0.38em] text-neutral-stone">BY MACH10</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-neutral-stone">
              <button
                onClick={onToggleTheme}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-outline-lucid/80 bg-card-bg hover:bg-cream-low text-neutral-stone transition-colors"
                title={theme === "dark" ? t("topnav.switchToLight") : t("topnav.switchToDark")}
                aria-label={t("topnav.toggleTheme")}
              >
                {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-primary" /> : <Moon className="w-3.5 h-3.5 text-primary" />}
              </button>
              <span className="px-3 py-2 rounded-xl border border-outline-lucid/80 bg-card-bg">
                {t("adminPage.administrator")}
              </span>
              <div className="px-3.5 py-2 rounded-xl border border-outline-lucid/80 bg-card-bg flex items-center gap-3">
                <div className="h-6 w-6 rounded-full border border-primary/70 text-[9px] font-semibold text-[#f3e7d3] flex items-center justify-center">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-onyx">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="interactive-press h-10 px-4 py-2 rounded-xl border border-outline-lucid/80 bg-card-bg hover:border-primary text-onyx transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" />
                  {t("adminPage.logout")}
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="relative max-w-[1740px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card-bg border border-outline-lucid/55 rounded-[1rem] p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-stone">{t("adminPage.clientAccounts")}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-onyx">{clients.length}</p>
            </div>
            <div className="bg-card-bg border border-outline-lucid/55 rounded-[1rem] p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-stone">{t("adminPage.projectsManaged")}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-onyx">{projects.length}</p>
            </div>
            <div className="bg-card-bg border border-outline-lucid/55 rounded-[1rem] p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-stone">{t("adminPage.uploadsReady")}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-onyx">{t("adminPage.uploadSummary")}</p>
            </div>
          </section>

          {error ? (
            <div className="bg-red-950/25 border border-red-800/35 text-red-200 text-sm px-4 py-3 rounded-[var(--radius-ui-sm)]">
              {error}
            </div>
          ) : null}
          {dataMode === "mock" ? (
            <div className="bg-amber-950/20 border border-amber-700/35 text-amber-200 text-sm px-4 py-3 rounded-[var(--radius-ui-sm)]">
              {t("adminPage.mockMode")}
            </div>
          ) : null}
          {success ? (
            <div className="bg-emerald-950/20 border border-emerald-700/35 text-emerald-200 text-sm px-4 py-3 rounded-[var(--radius-ui-sm)]">
              {success}
            </div>
          ) : null}

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <form onSubmit={handleSubmit} className={`xl:col-span-7 ${panelClass} p-6 md:p-8 space-y-6`}>
              <div className="flex items-center gap-3">
                <UploadCloud className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-onyx">
                    {editingProjectId ? t("common.editProject") : t("common.createProject")}
                  </h2>
                  <p className="text-xs text-neutral-stone">{t("adminPage.createProjectLead")}</p>
                </div>
              </div>
              {editingProjectId ? (
                <div className="flex items-center justify-between gap-3 bg-amber-950/20 border border-amber-700/35 text-amber-200 text-xs px-4 py-3 rounded-[var(--radius-ui-sm)]">
                  <span>{t("adminPage.editingProject")}</span>
                  <button type="button" onClick={resetForm} className="uppercase tracking-widest text-[10px] font-semibold">
                    {t("common.cancel")}
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.clientAccount")}</label>
                  <select
                    value={formState.clientUserId}
                    onChange={(event) => handleClientChange(event.target.value)}
                    className={fieldClass}
                  >
                    <option value="">{t("adminPage.selectClient")}</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.company} • {client.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.companyName")}</label>
                  <input
                    value={formState.companyName}
                    onChange={(event) => setFormState((prev) => ({ ...prev, companyName: event.target.value }))}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.projectName")}</label>
                  <input
                    value={formState.projectName}
                    onChange={(event) => setFormState((prev) => ({ ...prev, projectName: event.target.value }))}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("dashboardPage.location")}</label>
                  <input
                    value={formState.location}
                    onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.category")}</label>
                  <select
                    value={formState.category}
                    onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value as CreateProjectInput["category"] }))}
                    className={fieldClass}
                  >
                    <option value="Residential">{t("dashboardPage.residential")}</option>
                    <option value="Commercial">{t("dashboardPage.commercial")}</option>
                    <option value="Acquisitions">{t("dashboardPage.acquisitions")}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.status")}</label>
                  <select
                    value={formState.status}
                    onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value as CreateProjectInput["status"] }))}
                    className={fieldClass}
                  >
                    <option value="Design Phase">{t("projectPage.timeline.design")}</option>
                    <option value="In Progress">{t("dashboardPage.activeExecution")}</option>
                    <option value="Excavation">{t("projectPage.timeline.construction")}</option>
                    <option value="Finalized">{t("projectPage.timeline.delivery")}</option>
                    <option value="Occupied">{t("dashboardPage.deliveredOccupied")}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.units")}</label>
                  <input
                    type="number"
                    min={1}
                    value={formState.units}
                    onChange={(event) => setFormState((prev) => ({ ...prev, units: Number(event.target.value) || 1 }))}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.price")}</label>
                  <input
                    value={formState.price}
                    onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.embedField")}</label>
                  <input
                    value={formState.tourEmbedUrl}
                    onChange={(event) => setFormState((prev) => ({ ...prev, tourEmbedUrl: event.target.value }))}
                    onBlur={(event) => setFormState((prev) => ({ ...prev, tourEmbedUrl: normalizeTourEmbedUrl(event.target.value) }))}
                    placeholder={t("adminPage.embedPlaceholder")}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  [t("adminPage.beds"), "beds"],
                  [t("adminPage.baths"), "baths"],
                  [t("adminPage.livingArea"), "livingArea"],
                  [t("adminPage.acreage"), "acreage"],
                  [t("adminPage.garage"), "garage"],
                  [t("adminPage.sceneName"), "showcaseSceneName"],
                  [t("adminPage.sceneCategory"), "showcaseSceneCategory"],
                ].map(([label, key]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{label}</label>
                    <input
                      value={formState[key as keyof typeof formState] as string | number}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, [key]: event.target.value }))
                      }
                      className={fieldClass}
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.builtYear")}</label>
                  <select
                    value={formState.builtYear}
                    onChange={(event) => setFormState((prev) => ({ ...prev, builtYear: event.target.value }))}
                    className={fieldClass}
                  >
                    <option value="N/A">{t("common.na")}</option>
                    {builtYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.amenities")}</label>
                <select
                  value={formState.amenities}
                  onChange={(event) => setFormState((prev) => ({ ...prev, amenities: event.target.value }))}
                    className={fieldClass}
                >
                  {amenityOptions.map((amenity) => (
                    <option key={amenity} value={amenity}>
                      {amenity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.description")}</label>
                <textarea
                  value={formState.description}
                  onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                  rows={3}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.architecturalNarrative")}</label>
                <textarea
                  value={formState.architecturalNarrative}
                  onChange={(event) => setFormState((prev) => ({ ...prev, architecturalNarrative: event.target.value }))}
                  rows={4}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{t("adminPage.internalNotes")}</label>
                <textarea
                  value={formState.notes}
                  onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={3}
                  className={fieldClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  [t("adminPage.tourUpload"), "tour_360", "image/*"],
                  [t("adminPage.floorPlanUpload"), "floor_plan", "image/*,.pdf"],
                  [t("adminPage.thumbnailImage"), "thumbnail", "image/*"],
                  [t("adminPage.heroImage"), "hero_image", "image/*"],
                  [t("adminPage.attachmentUpload"), "attachment", "image/*,.pdf,.zip,.doc,.docx"],
                ].map(([label, type, accept]) => (
                  <div key={type} className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-stone">{label}</label>
                    <label className={`flex items-center gap-3 border border-dashed px-3 py-3 rounded-[var(--radius-ui-sm)] cursor-pointer ${insetCardClass}`}>
                      <FileUp className="w-4 h-4 text-primary" />
                      <span className="text-xs text-neutral-stone truncate">
                        {files[type as ProjectAssetType]?.name ?? t("adminPage.chooseFile")}
                      </span>
                      <input
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={(event) => handleFileChange(type as ProjectAssetType, event.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving || loading}
                className="interactive-press w-full bg-primary hover:brightness-110 text-[#15110b] text-xs py-3.5 font-sans uppercase tracking-[0.24em] transition-colors flex items-center justify-center gap-2 rounded-[var(--radius-ui-sm)] font-semibold"
              >
                <UploadCloud className="w-4 h-4" />
                {saving ? t("adminPage.creatingProject") : editingProjectId ? t("common.saveChanges") : t("common.createProject")}
              </button>
            </form>

            <div className="xl:col-span-5 space-y-6">
              <section className={`${panelClass} p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <UserRound className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-onyx">{t("adminPage.clientList")}</h3>
                </div>
                <div className="space-y-3 max-h-[18rem] overflow-y-auto pr-1">
                  {clients.map((client) => (
                    <div key={client.id} className={`rounded-[var(--radius-ui-sm)] p-3 ${insetCardClass}`}>
                      <p className="font-display text-[11px] uppercase tracking-widest text-onyx">{client.company}</p>
                      <p className="text-[11px] text-neutral-stone mt-1">{client.email}</p>
                      <p className="text-[10px] text-neutral-stone mt-1">{client.phoneNumber}</p>
                    </div>
                  ))}
                  {!loading && clients.length === 0 ? (
                    <p className="text-xs text-neutral-stone">{t("adminPage.noClients")}</p>
                  ) : null}
                </div>
              </section>

              <section className={`${panelClass} p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <FolderKanban className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-onyx">{t("adminPage.projectRegistry")}</h3>
                </div>
                <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-1">
                  {projects.map((entry) => (
                    <div key={entry.project.id} className={`rounded-[var(--radius-ui-sm)] p-3 space-y-2 ${insetCardClass}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-[11px] uppercase tracking-widest text-onyx">{entry.project.project_name}</p>
                          <p className="text-[11px] text-neutral-stone mt-1">{entry.client?.company ?? entry.project.company_name}</p>
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.18em] text-primary">{entry.project.status}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-neutral-stone">
                        <span className="inline-flex items-center gap-1">
                          <LayoutGrid className="w-3.5 h-3.5" />
                          {entry.project.units} {t("adminPage.unitsLabel")}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {entry.assets.length} {t("adminPage.assets")}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => startEditProject(entry)}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary hover:text-[#f0e6d3]"
                      >
                        <Pencil className="w-3 h-3" />
                        {t("common.editProject")}
                      </button>
                    </div>
                  ))}
                  {!loading && projects.length === 0 ? (
                    <p className="text-xs text-neutral-stone">{t("adminPage.noProjects")}</p>
                  ) : null}
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
