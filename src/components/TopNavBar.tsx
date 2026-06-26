/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Menu, X, LogOut, Layers, Sun, Moon } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { UserProfile } from "../types";

interface TopNavBarProps {
  user: UserProfile;
  activeTab: "dashboard" | "projects" | "profile";
  onTabChange: (tab: "dashboard" | "projects" | "profile") => void;
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  preferredLanguage: "English (International)" | "Amharic";
  onPreferredLanguageChange: (language: "English (International)" | "Amharic") => void;
}

export default function TopNavBar({
  user,
  activeTab,
  onTabChange,
  onLogout,
  theme,
  onToggleTheme,
  preferredLanguage,
  onPreferredLanguageChange,
}: TopNavBarProps) {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: t("common.dashboard") },
    { id: "projects", label: t("common.projects") }
  ] as const;

  return (
    <>
      <header className="sticky top-0 w-full z-45 bg-background-luxury/80 dark:bg-card-bg/80 backdrop-blur-xl border-b border-outline-lucid/30 dark:border-outline-lucid/10 shadow-xs transition-all duration-300">
        <div className="flex justify-between items-center h-20 px-6 md:px-16 max-w-7xl mx-auto gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onTabChange("dashboard")}
            className="cursor-pointer font-display text-lg font-bold tracking-[0.2em] text-[#775a19] flex items-center gap-2 uppercase select-none"
          >
            <Layers className="w-5 h-5 stroke-[1.5] text-[#775a19]" />
            <span className="flex flex-col leading-none">
              <span>ESTATE PORTAL</span>
              <span className="text-[8px] tracking-[0.35em] text-neutral-stone">BY MACH10</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1 max-w-md mx-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`inline-flex h-10 min-w-[7.5rem] items-center justify-center font-sans text-[11px] tracking-[0.18em] uppercase font-medium border-b transition-all duration-300 ${
                    isActive
                      ? "text-[#775a19] border-[#775a19]"
                      : "text-neutral-stone hover:text-onyx border-transparent"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Widget */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="h-11 w-11 text-[#7f7667] hover:text-onyx dark:text-[#9e9380] dark:hover:text-onyx rounded-[var(--radius-ui-sm)] border border-outline-lucid/25 dark:border-outline-lucid/12 bg-white/70 dark:bg-card-bg/70 hover:bg-stone-50 dark:hover:bg-cream-low transition-colors duration-300 cursor-pointer flex items-center justify-center focus:outline-none"
              title={theme === "dark" ? t("topnav.switchToLight") : t("topnav.switchToDark")}
              aria-label={t("topnav.toggleTheme")}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-300 stroke-[1.75]" />
              ) : (
                <Moon className="w-4 h-4 text-[#775a19] stroke-[1.75]" />
              )}
            </button>

            <div 
              onClick={() => onTabChange("profile")}
              className="hidden sm:flex h-11 min-w-[13rem] items-center gap-3 bg-stone-50 hover:bg-stone-100/80 dark:bg-cream-low/50 dark:hover:bg-cream-low cursor-pointer border border-[#d1c5b4]/20 px-3.5 rounded-[var(--radius-ui-sm)] transition-colors"
            >
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-6 h-6 rounded-full object-cover border border-[#775a19]/30"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <p className="font-display text-[10px] uppercase font-semibold text-onyx tracking-wider leading-none">{user.name}</p>
                <p className="text-[8px] font-sans tracking-widest text-[#7f7667] mt-0.5 uppercase">{t("topnav.premiumClient")}</p>
              </div>
            </div>

            <div className="hidden sm:inline-flex h-9 items-center rounded-full border border-outline-lucid/25 dark:border-outline-lucid/12 bg-white/75 dark:bg-card-bg/75 p-0.5">
              {[
                { value: "English (International)" as const, label: "EN" },
                { value: "Amharic" as const, label: "አማ" },
              ].map((option) => {
                const active = preferredLanguage === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onPreferredLanguageChange(option.value)}
                    className={`min-w-[2.4rem] rounded-full px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      active
                        ? "bg-onyx text-white dark:bg-primary dark:text-neutral-950"
                        : "text-neutral-stone hover:text-onyx dark:hover:text-onyx"
                    }`}
                    aria-pressed={active}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onLogout}
              className="hidden md:flex items-center justify-center gap-2 bg-white/85 dark:bg-card-bg border border-outline-lucid/30 dark:border-outline-lucid/15 px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-stone hover:text-red-700 hover:border-red-200 dark:hover:border-red-900/40 rounded-[var(--radius-ui-sm)] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("common.logout")}</span>
            </button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-variant transition-colors"
              aria-label={t("topnav.mobileMenu")}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-20 min-h-[calc(100vh-5rem)] bg-white dark:bg-card-bg z-40 md:hidden animate-fade-in flex flex-col justify-between p-8 border-t border-outline-lucid/30 dark:border-outline-lucid/10">
          <nav className="flex flex-col gap-6 text-left">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-sm uppercase tracking-widest font-display pb-2 border-b text-left ${
                    isActive ? "text-[#775a19] border-[#775a19] font-semibold" : "text-neutral-stone border-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {[
                { value: "English (International)" as const, label: "EN" },
                { value: "Amharic" as const, label: "አማ" },
              ].map((option) => {
                const active = preferredLanguage === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onPreferredLanguageChange(option.value)}
                    className={`flex-1 rounded-[var(--radius-ui-sm)] border px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                      active
                        ? "border-primary bg-primary text-neutral-950"
                        : "border-outline-lucid/25 bg-white/80 dark:bg-card-bg text-neutral-stone"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-stone-100 pt-6">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover border border-primary/30"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-display text-xs uppercase font-semibold text-onyx tracking-wider">{user.name}</p>
                <p className="text-[10px] text-neutral-stone uppercase tracking-widest">{user.professionalTitle}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full bg-[#ba1a1a]/5 hover:bg-[#ba1a1a]/10 border border-[#ba1a1a]/25 text-[#ba1a1a] py-3 uppercase tracking-widest text-xs font-semibold flex items-center justify-center gap-2 rounded-[var(--radius-ui-sm)]"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("common.signOut")}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
