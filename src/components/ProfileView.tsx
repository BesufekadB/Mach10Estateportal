/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from "react";
import { User, Bell, Shield, Coins, Globe, Save, CheckCircle, ShieldAlert } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { UserProfile } from "../types";

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export default function ProfileView({ user, onUpdateUser }: ProfileViewProps) {
  const { t } = useI18n();
  const [name, setName] = useState(user.name);
  const [professionalTitle, setProfessionalTitle] = useState(user.professionalTitle);
  const [preferredLanguage, setPreferredLanguage] = useState(user.preferredLanguage);
  const [country, setCountry] = useState(user.country);
  const [city, setCity] = useState(user.city);
  const [currency, setCurrency] = useState(user.currency);
  const [emailNotifications, setEmailNotifications] = useState(user.emailNotifications);
  const [marketInsights, setMarketInsights] = useState(user.marketInsights);

  // Password modification state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name);
    setProfessionalTitle(user.professionalTitle);
    setPreferredLanguage(user.preferredLanguage);
    setCountry(user.country);
    setCity(user.city);
    setCurrency(user.currency);
    setEmailNotifications(user.emailNotifications);
    setMarketInsights(user.marketInsights);
  }, [user]);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErrorFeedback(null);

    const updated: UserProfile = {
      ...user,
      name,
      professionalTitle,
      preferredLanguage,
      country,
      city,
      currency,
      emailNotifications,
      marketInsights
    };

    onUpdateUser(updated);
    setFeedback(t("profilePage.saveSuccess"));
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErrorFeedback(null);

    if (!currentPassword) {
      setErrorFeedback(t("profilePage.currentPasswordRequired"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorFeedback(t("profilePage.passwordMismatch"));
      return;
    }

    if (newPassword.length < 5) {
      setErrorFeedback(t("profilePage.passwordTooShort"));
      return;
    }

    setFeedback(t("profilePage.passwordUpdated"));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setFeedback(null), 4200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 text-left">
      
      {/* Visual Title Header */}
      <header className="border-b border-outline-lucid/30 pb-5">
        <h2 className="font-display text-xl font-semibold tracking-wider text-onyx uppercase">
          {t("profilePage.title")}
        </h2>
        <p className="text-xs text-neutral-stone mt-1">{t("profilePage.subtitle")}</p>
      </header>

      {/* Dynamic Action Alerts */}
      {feedback && (
        <div className="bg-stone-50 border-l-2 border-primary p-4 text-xs text-primary font-medium uppercase tracking-wider">
          {feedback}
        </div>
      )}
      {errorFeedback && (
        <div className="bg-red-50 border-l-2 border-red-800 p-4 text-xs text-red-950">
          ⚠️ {errorFeedback}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: General Profile Card Info & Form (7 Columns) */}
        <form onSubmit={handleSaveProfile} className="md:col-span-7 bg-white dark:bg-card-bg border border-outline-lucid/50 dark:border-outline-lucid/15 p-6 md:p-8 space-y-6 rounded-[var(--radius-ui)] transition-colors duration-300">
          <div className="flex items-center gap-4 border-b border-stone-50 pb-5">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-onyx">{user.name}</h3>
              <p className="text-[10px] text-[#775a19] uppercase tracking-widest font-semibold">{user.professionalTitle}</p>
              <p className="text-[10px] text-neutral-stone mt-1 font-mono">{user.email}</p>
            </div>
          </div>

          <h4 className="font-display text-[10px] uppercase tracking-[0.2em] text-neutral-stone font-bold">
            {t("profilePage.adminCredentials")}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="client-name">{t("profilePage.registryName")}</label>
              <input
                id="client-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2.5 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="client-title">{t("profilePage.advisoryTitle")}</label>
              <input
                id="client-title"
                type="text"
                required
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2.5 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="pref-lang">{t("profilePage.language")}</label>
              <select
                id="pref-lang"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2.5 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
              >
                <option value="English (International)">{t("profilePage.english")}</option>
                <option value="Amharic">{t("profilePage.amharic")}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="client-country">{t("profilePage.country")}</label>
              <input
                id="client-country"
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2.5 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="client-city">{t("profilePage.city")}</label>
              <input
                id="client-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2.5 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="pref-currency">{t("profilePage.currency")}</label>
              <select
                id="pref-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2.5 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>CHF (Fr)</option>
              </select>
            </div>
          </div>

          <hr className="border-stone-100 dark:border-outline-lucid/10" />

          {/* Alert Toggles */}
          <div className="space-y-3">
            <h5 className="font-display text-[10px] uppercase tracking-[0.2em] text-[#775a19] font-bold flex items-center gap-1.5 mb-1">
              <Bell className="w-3.5 h-3.5" /> Notification conduits
            </h5>
            
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <div>
                <span className="block text-[11px] font-semibold text-onyx group-hover:text-primary transition-colors">{t("profilePage.emailAlerts")}</span>
                <span className="block text-[10px] text-neutral-stone">{t("profilePage.alertLead")}</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group pt-1">
              <input
                type="checkbox"
                checked={marketInsights}
                onChange={(e) => setMarketInsights(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <div>
                <span className="block text-[11px] font-semibold text-onyx group-hover:text-primary transition-colors">{t("profilePage.marketAlerts")}</span>
                <span className="block text-[10px] text-neutral-stone">{t("profilePage.marketLead")}</span>
              </div>
            </label>
          </div>

          {/* Action Trigger button */}
              <button
            type="submit"
            className="w-full bg-onyx hover:bg-neutral-stone text-white text-xs py-3.5 font-sans uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 rounded-[var(--radius-ui-sm)]"
          >
            <Save className="w-4 h-4" /> {t("profilePage.savePreferences")}
          </button>
        </form>

        {/* Right Side: Security Password Modifier (5 Columns) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Quick Metrics stats */}
          <div className="bg-[#775a19]/5 border border-primary/20 p-5 rounded-[var(--radius-ui)] text-left">
            <h4 className="font-display text-[10px] uppercase tracking-[0.25em] text-[#775a19] font-bold">{t("profilePage.investedCapital")}</h4>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold font-display text-onyx">{user.totalAssets}</span>
              <span className="text-[9px] text-neutral-stone uppercase font-mono tracking-widest">Aggregate Val</span>
            </div>
            <p className="text-[10px] text-neutral-stone leading-relaxed mt-2 border-t border-[#775a19]/10 pt-2 font-light">
              {t("profilePage.capitalLead", { count: user.activeBuildCount })}
            </p>
          </div>

          {/* Change password section */}
          <form onSubmit={handleChangePassword} className="bg-white dark:bg-card-bg border border-outline-lucid/50 dark:border-outline-lucid/15 p-6 space-y-4 rounded-[var(--radius-ui)] text-left transition-colors duration-300">
            <h4 className="font-display text-[10px] uppercase tracking-[0.2em] text-[#7c5800] dark:text-[#c5a059] font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> {t("profilePage.securityCredentials")}
            </h4>
            <p className="text-[10px] text-neutral-stone leading-relaxed font-light">
              {t("profilePage.securityLead")}
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="curr-pwd">Old Code</label>
                <input
                  id="curr-pwd"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2 text-xs outline-none text-onyx"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="new-pwd">New Code</label>
                <input
                  id="new-pwd"
                  type="password"
                  placeholder={t("profilePage.minFiveChars")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2 text-xs outline-none text-onyx"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="conf-pwd">Confirm New Code</label>
                <input
                  id="conf-pwd"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#faf9f9] dark:bg-cream-low border border-stone-200 dark:border-outline-lucid/15 focus:border-primary px-3 py-2 text-xs outline-none text-onyx"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#775a19] hover:bg-[#c5a059] text-white text-[10px] font-sans py-3 uppercase tracking-widest transition-colors font-medium text-center"
            >
              {t("profilePage.updateSecurity")}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
