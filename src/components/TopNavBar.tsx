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
      <header className="sticky top-0 z-45 border-b border-outline-lucid/80 bg-card-bg backdrop-blur-xl transition-all duration-300">
        <div className="flex justify-between items-center h-16 px-5 md:px-8 max-w-[1740px] mx-auto gap-5">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onTabChange("dashboard")}
            className="cursor-pointer font-display text-sm font-semibold tracking-[0.18em] text-primary flex items-center gap-2 uppercase select-none"
          >
            <Layers className="w-4 h-4 stroke-[1.6] text-primary" />
            <span className="flex flex-col leading-none">
              <span className="text-[0.8rem] tracking-[0.22em] text-onyx dark:text-[#f4efe6]">ESTATE PORTAL</span>
              <span className="text-[0.42rem] tracking-[0.38em] text-neutral-stone">BY MACH10</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-10 flex-1 max-w-md mx-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative inline-flex h-16 min-w-[5.25rem] items-center justify-center font-sans text-[10px] tracking-[0.22em] uppercase font-medium transition-all duration-300 ${
                    isActive ? "text-onyx dark:text-[#f1e7d5]" : "text-stone-variant dark:text-neutral-stone hover:text-onyx dark:hover:text-[#f1e7d5]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute left-1/2 top-[calc(100%-0.9rem)] h-[2px] -translate-x-1/2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-10 bg-primary shadow-[0_0_12px_rgba(202,161,95,0.8)]"
                        : "w-0 bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* User Widget */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="interactive-press h-9 w-9 text-neutral-stone hover:text-onyx rounded-xl border border-outline-lucid/80 bg-card-bg hover:bg-cream-low transition-colors duration-300 cursor-pointer flex items-center justify-center focus:outline-none"
              title={theme === "dark" ? t("topnav.switchToLight") : t("topnav.switchToDark")}
              aria-label={t("topnav.toggleTheme")}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-primary stroke-[1.8]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-primary stroke-[1.8]" />
              )}
            </button>

            <div 
              onClick={() => onTabChange("profile")}
              className="hidden sm:flex h-10 min-w-[11.5rem] items-center gap-3 bg-card-bg hover:bg-cream-low cursor-pointer border border-outline-lucid/80 px-3 rounded-xl transition-colors"
            >
              <div className="h-6 w-6 rounded-full border border-primary/70 text-[9px] font-semibold text-[#f3e7d3] flex items-center justify-center">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-display text-[9px] uppercase font-semibold text-onyx tracking-[0.16em] leading-none">{user.name}</p>
                <p className="text-[7px] font-sans tracking-[0.18em] text-neutral-stone mt-0.5 uppercase">{t("topnav.premiumClient")}</p>
              </div>
            </div>

            <div className="hidden sm:inline-flex h-9 items-center rounded-xl border border-outline-lucid/80 bg-card-bg p-0.5">
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
                    className={`min-w-[2.2rem] rounded-lg px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                      active
                        ? "bg-primary text-[#16120b]"
                        : "text-stone-variant dark:text-neutral-stone hover:text-onyx dark:hover:text-[#f1e7d5]"
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
              className="interactive-press hidden md:flex h-10 items-center justify-center gap-2 bg-card-bg border border-outline-lucid/80 px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-semibold text-onyx hover:border-primary rounded-xl transition-colors"
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
        <div className="absolute inset-x-0 top-16 min-h-[calc(100vh-4rem)] bg-white/96 dark:bg-[#0c1015] z-40 md:hidden animate-fade-in flex flex-col justify-between p-8 border-t border-outline-lucid/80 transition-colors duration-300">
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
                    isActive ? "text-primary border-primary font-semibold" : "text-stone-variant dark:text-neutral-stone border-outline-lucid/40"
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
                        : "border-outline-lucid/25 bg-stone-50 dark:bg-[#13181e] text-stone-variant dark:text-neutral-stone"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-outline-lucid/40 pt-6">
              <div className="h-10 w-10 rounded-full border border-primary/70 text-xs font-semibold text-[#f4efe6] flex items-center justify-center">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
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
