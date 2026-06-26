/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from "react";
import { Layers, ShieldAlert } from "lucide-react";
import LoginScreen from "./components/LoginScreen";
import TopNavBar from "./components/TopNavBar";
import DashboardView from "./components/DashboardView";
import ProjectDetailView from "./components/ProjectDetailView";
import ProfileView from "./components/ProfileView";
import AdminPortal from "./components/AdminPortal";
import { MOCK_PROJECTS } from "./data";
import { getLocaleFromLanguage, I18nProvider, useI18n } from "./lib/i18n";
import {
  authenticatePortalUser,
  getCurrentPortalUser,
  loadPortalProjects,
  registerPortalUser,
  savePortalUserProfile,
  signOutPortalUser,
} from "./lib/portalData";
import { allowMockAuth, isSupabaseConfigured } from "./lib/supabase";
import type { DataSourceMode, Project, UserProfile } from "./types";

type ClientTab = "dashboard" | "projects" | "profile";
type RouteMode = "client" | "admin";

const getRouteMode = (): RouteMode => (window.location.pathname.startsWith("/admin") ? "admin" : "client");

function AppShell({
  preferredLanguage,
  onPreferredLanguageChange,
}: {
  preferredLanguage: "English (International)" | "Amharic";
  onPreferredLanguageChange: (language: "English (International)" | "Amharic") => void;
}) {
  const { t } = useI18n();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [routeMode, setRouteMode] = useState<RouteMode>(getRouteMode);
  const [dataMode, setDataMode] = useState<DataSourceMode>("supabase");
  const [activeTab, setActiveTab] = useState<ClientTab>("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const clientProjects = useMemo(() => {
    if (!currentUser) return [];
    if (dataMode === "mock") {
      return projects;
    }
    return projects.filter((project) => project.assignedClientId === currentUser.id);
  }, [currentUser, dataMode, projects]);

  const navigateTo = (mode: RouteMode) => {
    const path = mode === "admin" ? "/admin" : "/";
    window.history.pushState({}, "", path);
    setRouteMode(mode);
    setSelectedProject(null);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRouteMode(getRouteMode());
      setSelectedProject(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("aurelian_user_session", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("aurelian_user_session");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("aurelian_data_mode", dataMode);
  }, [dataMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("aurelian_theme") as "light" | "dark";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);

    const root = document.documentElement;
    if (initialTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const authResult = await getCurrentPortalUser();
        if (!isMounted) return;

        if (authResult) {
          const projectResult = await loadPortalProjects(authResult.mode, authResult.user);
          if (!isMounted) return;
          setCurrentUser(authResult.user);
          onPreferredLanguageChange(authResult.user.preferredLanguage as "English (International)" | "Amharic");
          setDataMode(authResult.mode);
          setProjects(projectResult.projects);
        } else {
          let parsedUser: UserProfile | null = null;
          let cachedMode: DataSourceMode | null = null;

          try {
            const cachedUser = localStorage.getItem("aurelian_user_session");
            cachedMode = localStorage.getItem("aurelian_data_mode") as DataSourceMode | null;
            parsedUser = cachedUser ? (JSON.parse(cachedUser) as UserProfile) : null;
          } catch {
            parsedUser = null;
            cachedMode = null;
          }

          if (parsedUser && cachedMode === "mock" && allowMockAuth) {
            const mockProjectResult = await loadPortalProjects("mock", parsedUser);
            if (!isMounted) return;
            setCurrentUser(parsedUser);
            onPreferredLanguageChange(parsedUser.preferredLanguage as "English (International)" | "Amharic");
            setDataMode("mock");
            setProjects(mockProjectResult.projects);
          } else {
            setCurrentUser(null);
            onPreferredLanguageChange("English (International)");
            setDataMode(isSupabaseConfigured ? "supabase" : "mock");
            setProjects(allowMockAuth ? MOCK_PROJECTS : []);
          }
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" || theme === null ? "light" : "dark";
    setTheme(nextTheme);
    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("aurelian_theme", nextTheme);
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    const authResult = await authenticatePortalUser(email, password);
    if (!authResult) {
      throw new Error("Invalid login");
    }

    const projectResult = await loadPortalProjects(authResult.mode, authResult.user);
    setCurrentUser(authResult.user);
    onPreferredLanguageChange(authResult.user.preferredLanguage as "English (International)" | "Amharic");
    setDataMode(authResult.mode);
    setProjects(projectResult.projects);
    localStorage.setItem("aurelian_user_session", JSON.stringify(authResult.user));
    localStorage.setItem("aurelian_data_mode", authResult.mode);
    setActiveTab("dashboard");
    setSelectedProject(null);
  };

  const handleSignUp = async (email: string, password: string, phoneNumber: string, company: string) => {
    const result = await registerPortalUser({
      email,
      password,
      phoneNumber,
      company,
    });

    if (result.status === "signed_in" && result.user) {
      const projectResult = await loadPortalProjects("supabase", result.user);
      setCurrentUser(result.user);
      onPreferredLanguageChange(result.user.preferredLanguage as "English (International)" | "Amharic");
      setDataMode("supabase");
      setProjects(projectResult.projects);
      localStorage.setItem("aurelian_user_session", JSON.stringify(result.user));
      localStorage.setItem("aurelian_data_mode", "supabase");
      setActiveTab("dashboard");
      setSelectedProject(null);
      navigateTo("client");
    }

    return result;
  };

  const handleLogout = async () => {
    await signOutPortalUser();
    setCurrentUser(null);
    onPreferredLanguageChange("English (International)");
    setDataMode(isSupabaseConfigured ? "supabase" : "mock");
    setProjects(allowMockAuth ? MOCK_PROJECTS : []);
    setSelectedProject(null);
    localStorage.removeItem("aurelian_user_session");
    localStorage.removeItem("aurelian_data_mode");
  };

  const handleUpdateUserProfile = async (updated: UserProfile) => {
    const saved = await savePortalUserProfile(updated);
    setCurrentUser({
      ...saved,
      preferredLanguage: updated.preferredLanguage,
    });
    onPreferredLanguageChange(updated.preferredLanguage as "English (International)" | "Amharic");
  };

  const handlePreferredLanguageChange = async (language: "English (International)" | "Amharic") => {
    onPreferredLanguageChange(language);

    if (!currentUser || currentUser.preferredLanguage === language) {
      return;
    }

    const optimisticUser: UserProfile = {
      ...currentUser,
      preferredLanguage: language,
    };

    setCurrentUser(optimisticUser);
    localStorage.setItem("aurelian_user_session", JSON.stringify(optimisticUser));

    try {
      const saved = await savePortalUserProfile(optimisticUser);
      setCurrentUser({
        ...saved,
        preferredLanguage: language,
      });
      localStorage.setItem(
        "aurelian_user_session",
        JSON.stringify({
          ...saved,
          preferredLanguage: language,
        })
      );
    } catch {
      setCurrentUser(optimisticUser);
    }
  };

  const handleTabChange = (tab: ClientTab) => {
    setActiveTab(tab);
    if (tab === "dashboard" || tab === "projects") {
      setSelectedProject(null);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setActiveTab("projects");
  };

  if (isBootstrapping || theme === null) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 flex items-center justify-center text-neutral-stone uppercase tracking-[0.24em] text-xs">
        {t("common.loading")}
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 p-1 sm:p-2.5 transition-colors duration-300 flex flex-col justify-center">
        <div className="flex-1 flex flex-col justify-center items-center rounded-[1.75rem] border border-outline-lucid/15 dark:border-outline-lucid/10 shadow-xl overflow-hidden text-onyx bg-background-luxury transition-all duration-350 relative">
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onSignUp={handleSignUp}
            theme={theme}
            onToggleTheme={toggleTheme}
            authMode={isSupabaseConfigured ? "supabase" : "mock"}
            portalVariant={routeMode}
          />
        </div>
      </div>
    );
  }

  if (routeMode === "admin") {
    if (currentUser.role !== "admin") {
      return (
        <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 p-1 sm:p-2.5 transition-colors duration-300 flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-background-luxury rounded-[1.75rem] border border-outline-lucid/15 dark:border-outline-lucid/10 shadow-xl px-6">
            <div className="max-w-lg w-full bg-white dark:bg-card-bg border border-outline-lucid/40 dark:border-outline-lucid/15 rounded-[var(--radius-ui)] p-8 text-center space-y-5">
              <ShieldAlert className="w-10 h-10 text-primary mx-auto" />
              <div>
                <h1 className="font-display text-xl font-semibold uppercase tracking-wider text-onyx">Admin Access Required</h1>
                <p className="text-sm text-neutral-stone mt-2">
                  {t("app.adminRouteReserved")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigateTo("client")}
                  className="px-5 py-3 rounded-[var(--radius-ui-sm)] bg-onyx text-white text-xs uppercase tracking-[0.2em]"
                >
                  {t("app.goToClientPortal")}
                </button>
                <button
                  onClick={() => void handleLogout()}
                  className="px-5 py-3 rounded-[var(--radius-ui-sm)] border border-outline-lucid/40 text-xs uppercase tracking-[0.2em]"
                >
                  {t("common.signOut")}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminPortal
        user={currentUser}
        onLogout={() => void handleLogout()}
        theme={theme}
        onToggleTheme={toggleTheme}
        dataMode={dataMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 p-0 sm:p-2.5 transition-colors duration-300 flex flex-col">
      <div className="flex-1 flex flex-col bg-background-luxury rounded-none sm:rounded-[1.75rem] border-0 sm:border border-outline-lucid/15 dark:border-outline-lucid/10 shadow-none sm:shadow-xl overflow-hidden text-onyx transition-all duration-350 relative">
        <TopNavBar
          user={currentUser}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={() => void handleLogout()}
          theme={theme}
          onToggleTheme={toggleTheme}
          preferredLanguage={preferredLanguage}
          onPreferredLanguageChange={(language) => void handlePreferredLanguageChange(language)}
        />

        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 pt-8 md:pt-10 pb-20 z-10">
          {activeTab === "dashboard" && !selectedProject && (
            <div className="animate-fade-in duration-500">
              <DashboardView
                user={currentUser}
                projects={clientProjects}
                onSelectProject={handleSelectProject}
                showHero
              />
            </div>
          )}

          {activeTab === "projects" && selectedProject && (
            <div className="animate-fade-in duration-500">
              <ProjectDetailView
                project={selectedProject}
                onBack={() => {
                  setSelectedProject(null);
                  setActiveTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}

          {activeTab === "projects" && !selectedProject && (
            <div className="animate-fade-in duration-500">
              <div className="space-y-5">
                <div className="text-left pt-1 pb-4 border-b border-outline-lucid/30">
                  <span className="font-sans text-[10px] text-primary uppercase tracking-[0.2em] font-medium">{t("app.collectionLabel")}</span>
                  <h2 className="font-display text-lg uppercase tracking-wider text-onyx font-semibold">{t("app.portfolioArchive")}</h2>
                  <p className="text-xs text-neutral-stone mt-1">{t("app.portfolioArchiveLead")}</p>
                </div>

                <DashboardView
                  user={currentUser}
                  projects={clientProjects}
                  onSelectProject={handleSelectProject}
                  showHero={false}
                />
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="animate-fade-in duration-500">
              <ProfileView
                user={currentUser}
                onUpdateUser={handleUpdateUserProfile}
              />
            </div>
          )}
        </main>

        <footer className="w-full border-t border-outline-lucid/20 dark:border-outline-lucid/10 py-10 bg-white dark:bg-card-bg transition-colors duration-300 mt-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-stone uppercase tracking-widest font-sans">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>{t("footer.brand")}</span>
            </div>

            <div>
              <span>{t("footer.middle")}</span>
            </div>

            <div>
              <span>© {new Date().getFullYear()} {t("footer.copy")}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const cachedUser = (() => {
    try {
      const raw = localStorage.getItem("aurelian_user_session");
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  })();
  const [preferredLanguage, setPreferredLanguage] = useState<"English (International)" | "Amharic">(
    (cachedUser?.preferredLanguage as "English (International)" | "Amharic") || "English (International)"
  );

  return (
    <I18nProvider locale={getLocaleFromLanguage(preferredLanguage)}>
      <AppShell
        preferredLanguage={preferredLanguage}
        onPreferredLanguageChange={setPreferredLanguage}
      />
    </I18nProvider>
  );
}
