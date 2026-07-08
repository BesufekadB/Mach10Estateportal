/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Layers, ShieldAlert } from "lucide-react";
import LoginScreen from "./components/LoginScreen";
import MarketingLandingPage from "./components/MarketingLandingPage";
import PasswordResetScreen from "./components/PasswordResetScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import TopNavBar from "./components/TopNavBar";
import { getLocaleFromLanguage, I18nProvider, useI18n } from "./lib/i18n";
import {
  authenticatePortalUser,
  completeRecoveryCodeFromUrl,
  subscribeToPortalAuthChanges,
  getAuthenticatedEmail,
  getAuthenticatedSessionEmail,
  getCurrentPortalUser,
  loadPortalProjects,
  registerPortalUser,
  savePortalUserProfile,
  signOutPortalUser,
  updatePortalUserPassword,
} from "./lib/portalData";
import { allowMockAuth, isSupabaseConfigured } from "./lib/supabase";
import type { DataSourceMode, Project, UserProfile } from "./types";

type ClientTab = "dashboard" | "projects" | "profile";
type RouteMode = "client" | "admin";

const DashboardView = lazy(() => import("./components/DashboardView"));
const ProjectDetailView = lazy(() => import("./components/ProjectDetailView"));
const ProfileView = lazy(() => import("./components/ProfileView"));
const AdminPortal = lazy(() => import("./components/AdminPortal"));

const getRouteMode = (): RouteMode => (window.location.pathname.startsWith("/admin") ? "admin" : "client");
const isMarketingPath = () => {
  const path = window.location.pathname;
  return path === "/";
};
const isRecoveryPath = () => window.location.pathname === "/reset-password";

const isProfileSetupIncomplete = (user: UserProfile) =>
  !user.phoneNumber ||
  !user.company ||
  user.company === "Private Client" ||
  !user.country ||
  !user.city ||
  !user.professionalTitle ||
  user.professionalTitle === "Client Account";

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
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [dataMode, setDataMode] = useState<DataSourceMode>("supabase");
  const [activeTab, setActiveTab] = useState<ClientTab>("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [appError, setAppError] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [onboardingUser, setOnboardingUser] = useState<UserProfile | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(
    isRecoveryPath() || window.location.hash.includes("type=recovery") || new URLSearchParams(window.location.search).get("recovery") === "1"
  );
  const [recoveryEmail, setRecoveryEmail] = useState<string | null>(null);
  const [isRecoverySessionReady, setIsRecoverySessionReady] = useState<boolean | null>(null);

  const clientProjects = useMemo(() => {
    if (!currentUser) return [];
    if (dataMode === "mock") {
      return projects;
    }
    return projects.filter((project) => project.assignedClientId === currentUser.id);
  }, [currentUser, dataMode, projects]);

  const viewFallback = (
    <div className="min-h-[18rem] flex items-center justify-center text-neutral-stone uppercase tracking-[0.24em] text-xs">
      {t("common.loading")}
    </div>
  );

  const navigateTo = (mode: RouteMode, action?: "signin" | "signup", plan?: string) => {
    const path = mode === "admin" ? "/admin" : "/portal";
    const params = new URLSearchParams();
    if (action) params.set("action", action);
    if (plan) params.set("plan", plan);
    const query = params.toString();
    const finalPath = query ? `${path}?${query}` : path;
    window.history.pushState({}, "", finalPath);
    setRouteMode(mode);
    setCurrentPath(path);
    setSelectedProject(null);
  };

  const navigateToRecovery = () => {
    window.history.pushState({}, "", "/reset-password");
    setRouteMode("client");
    setCurrentPath("/reset-password");
    setSelectedProject(null);
    setIsPasswordRecovery(true);
  };

  const navigateToSignIn = () => {
    window.history.pushState({}, "", routeMode === "admin" ? "/admin" : "/portal");
    setRouteMode(getRouteMode());
    setCurrentPath(window.location.pathname);
    setSelectedProject(null);
    setIsPasswordRecovery(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRouteMode(getRouteMode());
      setCurrentPath(window.location.pathname);
      setSelectedProject(null);
      setIsPasswordRecovery(isRecoveryPath() || window.location.hash.includes("type=recovery") || new URLSearchParams(window.location.search).get("recovery") === "1");
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
        setBootstrapError(null);
        if (isRecoveryPath() || window.location.search.includes("code=")) {
          try {
            await completeRecoveryCodeFromUrl();
          } catch (error) {
            setBootstrapError(error instanceof Error ? error.message : "Unable to complete password recovery.");
          }
        }
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
            setDataMode(isSupabaseConfigured ? "supabase" : allowMockAuth ? "mock" : "supabase");
            setProjects([]);
            if (!isSupabaseConfigured && !allowMockAuth) {
              setBootstrapError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before launching.");
            }
          }
        }
      } catch (error) {
        if (!isMounted) return;
        setCurrentUser(null);
        setProjects([]);
        setDataMode(isSupabaseConfigured ? "supabase" : allowMockAuth ? "mock" : "supabase");
        setBootstrapError(error instanceof Error ? error.message : "Unable to start the portal.");
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

  useEffect(() => {
    const unsubscribe = subscribeToPortalAuthChanges((event, session) => {
      const recoveryFromPath = isRecoveryPath() || window.location.hash.includes("type=recovery");
      const isRecoveryEvent =
        event === "PASSWORD_RECOVERY" ||
        ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && recoveryFromPath);

      if (isRecoveryEvent) {
        setIsPasswordRecovery(true);
        setRecoveryEmail(session?.user?.email ?? null);
        setIsRecoverySessionReady(session?.user?.email ? true : null);
        window.history.replaceState({}, "", "/reset-password");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let active = true;

    const hydrateRecoverySession = async () => {
      if (!isPasswordRecovery || !isSupabaseConfigured) {
        if (active) {
          setRecoveryEmail(null);
          setIsRecoverySessionReady(null);
        }
        return;
      }

      setIsRecoverySessionReady(null);
      let email: string | null = null;

      for (let attempt = 0; attempt < 6; attempt += 1) {
        email =
          (await getAuthenticatedSessionEmail().catch(() => null)) ??
          (await getAuthenticatedEmail().catch(() => null));

        if (email) {
          break;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 400));
      }

      if (!active) return;

      setRecoveryEmail(email);
      setIsRecoverySessionReady(Boolean(email));
    };

    void hydrateRecoverySession();

    return () => {
      active = false;
    };
  }, [isPasswordRecovery]);

  useEffect(() => {
    if (!currentUser || routeMode !== "client") {
      return;
    }

    const oauthIntent = localStorage.getItem("aurelian_oauth_intent");
    if (!oauthIntent) {
      return;
    }

    localStorage.removeItem("aurelian_oauth_intent");

    if (oauthIntent === "signup" || isProfileSetupIncomplete(currentUser)) {
      setNeedsOnboarding(true);
      setOnboardingUser(currentUser);
      setSelectedProject(null);
    } else {
      setActiveTab("dashboard");
      setSelectedProject(null);
    }
  }, [currentUser, routeMode]);

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
      throw new Error(t("auth.invalidCredentials"));
    }

    const projectResult = await loadPortalProjects(authResult.mode, authResult.user);
    setCurrentUser(authResult.user);
    onPreferredLanguageChange(authResult.user.preferredLanguage as "English (International)" | "Amharic");
    setDataMode(authResult.mode);
    setProjects(projectResult.projects);
    setBootstrapError(null);
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
      setCurrentUser(result.user);
      onPreferredLanguageChange(result.user.preferredLanguage as "English (International)" | "Amharic");
      setDataMode("supabase");
      setProjects([]);
      setBootstrapError(null);
      localStorage.setItem("aurelian_user_session", JSON.stringify(result.user));
      localStorage.setItem("aurelian_data_mode", "supabase");
      setNeedsOnboarding(true);
      setOnboardingUser(result.user);
      setSelectedProject(null);
    }

    return result;
  };

  const handleLogout = async () => {
    await signOutPortalUser();
    setCurrentUser(null);
    onPreferredLanguageChange("English (International)");
    setDataMode(isSupabaseConfigured ? "supabase" : allowMockAuth ? "mock" : "supabase");
    setProjects([]);
    setSelectedProject(null);
    setIsPasswordRecovery(false);
    setBootstrapError(!isSupabaseConfigured && !allowMockAuth ? "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before launching." : null);
    localStorage.removeItem("aurelian_user_session");
    localStorage.removeItem("aurelian_data_mode");
    if (window.location.search.includes("recovery=1")) {
      window.history.replaceState({}, "", "/");
    }
  };

  const requestLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await handleLogout();
  };

  const handleUpdateUserProfile = async (updated: UserProfile) => {
    setAppError(null);
    const saved = await savePortalUserProfile(updated);
    setCurrentUser({
      ...saved,
      preferredLanguage: updated.preferredLanguage,
    });
    onPreferredLanguageChange(updated.preferredLanguage as "English (International)" | "Amharic");
    setOnboardingUser(null);
    setNeedsOnboarding(false);
    setActiveTab("dashboard");
    navigateTo("client");
    try {
      const projectResult = await loadPortalProjects(dataMode, saved);
      setProjects(projectResult.projects);
    } catch {
      setProjects([]);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) {
      throw new Error("No active user session.");
    }

    await updatePortalUserPassword({
      email: currentUser.email,
      currentPassword,
      newPassword,
      requireCurrentPassword: !isPasswordRecovery,
    });

    if (isPasswordRecovery) {
      setIsPasswordRecovery(false);
      window.history.replaceState({}, "", "/");
    }
  };

  const handlePreferredLanguageChange = async (language: "English (International)" | "Amharic") => {
    setAppError(null);
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
    } catch (error) {
      setCurrentUser(currentUser);
      onPreferredLanguageChange(currentUser.preferredLanguage as "English (International)" | "Amharic");
      localStorage.setItem("aurelian_user_session", JSON.stringify(currentUser));
      setAppError(error instanceof Error ? error.message : "Unable to save your language preference.");
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
    if (!isPasswordRecovery && !currentPath.startsWith("/admin") && currentPath === "/") {
      return (
        <MarketingLandingPage
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenPortal={(action, plan) => navigateTo("client", action, plan)}
        />
      );
    }

    if (isPasswordRecovery) {
      return (
        <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 p-1 sm:p-2.5 transition-colors duration-300 flex flex-col justify-center">
          <div className="flex-1 flex flex-col justify-center items-center rounded-[1.75rem] border border-outline-lucid/15 dark:border-outline-lucid/10 shadow-xl overflow-hidden text-onyx bg-background-luxury transition-all duration-350 relative">
            <PasswordResetScreen
              theme={theme}
              onToggleTheme={toggleTheme}
              onSubmit={async (newPassword) => {
                await updatePortalUserPassword({
                  email: recoveryEmail ?? "",
                  newPassword,
                  requireCurrentPassword: false,
                });
                setIsPasswordRecovery(false);
                setRecoveryEmail(null);
                setIsRecoverySessionReady(null);
                window.history.replaceState({}, "", "/");
              }}
              onBackToLogin={navigateToSignIn}
              recoveryEmail={recoveryEmail}
              isSessionReady={isRecoverySessionReady}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 p-1 sm:p-2.5 transition-colors duration-300 flex flex-col justify-center">
        <div className="flex-1 flex flex-col justify-center items-center rounded-[1.75rem] border border-outline-lucid/15 dark:border-outline-lucid/10 shadow-xl overflow-hidden text-onyx bg-background-luxury transition-all duration-350 relative">
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onSignUp={handleSignUp}
            theme={theme}
            onToggleTheme={toggleTheme}
            authMode={allowMockAuth && !isSupabaseConfigured ? "mock" : "supabase"}
            portalVariant={routeMode}
            systemError={bootstrapError}
          />
        </div>
      </div>
    );
  }

  if (needsOnboarding && onboardingUser) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 p-1 sm:p-2.5 transition-colors duration-300 flex flex-col justify-center">
        <div className="flex-1 flex flex-col justify-center items-center rounded-[1.75rem] border border-outline-lucid/15 dark:border-outline-lucid/10 shadow-xl overflow-hidden text-onyx bg-background-luxury transition-all duration-350 relative">
          <OnboardingScreen
            user={onboardingUser}
            theme={theme}
            onToggleTheme={toggleTheme}
            onComplete={handleUpdateUserProfile}
          />
        </div>
      </div>
    );
  }

  if (isPasswordRecovery) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 p-1 sm:p-2.5 transition-colors duration-300 flex flex-col justify-center">
        <div className="flex-1 flex flex-col justify-center items-center rounded-[1.75rem] border border-outline-lucid/15 dark:border-outline-lucid/10 shadow-xl overflow-hidden text-onyx bg-background-luxury transition-all duration-350 relative">
          <PasswordResetScreen
            theme={theme}
            onToggleTheme={toggleTheme}
            onSubmit={async (newPassword) => {
              await updatePortalUserPassword({
                email: currentUser.email,
                newPassword,
                requireCurrentPassword: false,
              });
              setIsPasswordRecovery(false);
              setRecoveryEmail(null);
              setIsRecoverySessionReady(null);
              window.history.replaceState({}, "", "/");
            }}
            onBackToLogin={async () => {
              await handleLogout();
              navigateToSignIn();
            }}
            recoveryEmail={recoveryEmail}
            isSessionReady={isRecoverySessionReady}
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
                <h1 className="font-display text-xl font-semibold uppercase tracking-wider text-onyx">{t("app.adminAccessRequired")}</h1>
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
      <Suspense fallback={viewFallback}>
        <AdminPortal
          user={currentUser}
          onLogout={requestLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
          dataMode={dataMode}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 p-0 sm:p-2.5 transition-colors duration-300 flex flex-col">
      <div className="flex-1 flex flex-col bg-background-luxury rounded-none sm:rounded-[1.75rem] border-0 sm:border border-outline-lucid/15 dark:border-outline-lucid/10 shadow-none sm:shadow-xl overflow-hidden text-onyx transition-all duration-350 relative">
        <TopNavBar
          user={currentUser}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={requestLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
          preferredLanguage={preferredLanguage}
          onPreferredLanguageChange={(language) => void handlePreferredLanguageChange(language)}
        />

        <main className="flex-1 w-full max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-8 md:pt-10 pb-20 z-10">
          {appError ? (
            <div className="mb-6 rounded-[var(--radius-ui-sm)] border border-red-800/35 bg-red-950/25 px-4 py-3 text-sm text-red-200">
              {appError}
            </div>
          ) : null}
          {activeTab === "dashboard" && !selectedProject && (
            <Suspense fallback={viewFallback}>
              <div className="animate-fade-in duration-500">
                <DashboardView
                  user={currentUser}
                  projects={clientProjects}
                  onSelectProject={handleSelectProject}
                  showHero
                />
              </div>
            </Suspense>
          )}

          {activeTab === "projects" && selectedProject && (
            <Suspense fallback={viewFallback}>
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
            </Suspense>
          )}

          {activeTab === "projects" && !selectedProject && (
            <Suspense fallback={viewFallback}>
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
            </Suspense>
          )}

          {activeTab === "profile" && (
            <Suspense fallback={viewFallback}>
              <div className="animate-fade-in duration-500">
                <ProfileView
                  user={currentUser}
                  onUpdateUser={handleUpdateUserProfile}
                  onChangePassword={handleChangePassword}
                  isPasswordRecovery={isPasswordRecovery}
                  theme={theme}
                />
              </div>
            </Suspense>
          )}
        </main>

        <footer
          className="w-full border-t border-outline-lucid/55 py-8 transition-colors duration-300 mt-auto"
          style={{
            backgroundImage:
              theme === "dark"
                ? "linear-gradient(180deg, rgba(14,18,23,0.94), rgba(9,12,16,0.98))"
                : "linear-gradient(180deg, rgba(248,245,239,0.96), rgba(239,233,223,0.98))",
          }}
        >
          <div className="max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-stone uppercase tracking-[0.18em] font-sans">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className={theme === "dark" ? "text-[#f3ebde]" : "text-onyx"}>{t("footer.brand")}</span>
            </div>

            <div>
              <span className={theme === "dark" ? "text-neutral-stone" : "text-stone-variant"}>{t("footer.middle")}</span>
            </div>

            <div>
              <span className={theme === "dark" ? "text-neutral-stone" : "text-stone-variant"}>© {new Date().getFullYear()} {t("footer.copy")}</span>
            </div>
          </div>
        </footer>

        {showLogoutConfirm ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-[1rem] border border-outline-lucid/75 bg-card-bg p-6 shadow-2xl animate-fade-in-up">
              <h3 className="font-display text-sm uppercase tracking-[0.18em] text-onyx">{t("app.confirmLogout")}</h3>
              <p className="mt-3 text-sm text-neutral-stone leading-relaxed">
                {t("app.confirmLogoutLead")}
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="interactive-press rounded-xl border border-outline-lucid/70 bg-cream-low px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-onyx"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={() => void confirmLogout()}
                  className="interactive-press rounded-xl bg-primary px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#17120b] font-semibold"
                >
                  {t("common.logout")}
                </button>
              </div>
            </div>
          </div>
        ) : null}
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
