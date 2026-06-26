/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from "react";
import { Bell, Shield, Save } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { UserProfile } from "../types";

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => Promise<void>;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isPasswordRecovery?: boolean;
  theme: "light" | "dark";
}

export default function ProfileView({
  user,
  onUpdateUser,
  onChangePassword,
  isPasswordRecovery = false,
  theme,
}: ProfileViewProps) {
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
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fieldClass = "w-full bg-cream-low border border-outline-lucid/60 focus:border-primary px-3 py-2.5 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]";

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

  const handleSaveProfile = async (e: FormEvent) => {
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

    setIsSavingProfile(true);

    try {
      await onUpdateUser(updated);
      setFeedback(t("profilePage.saveSuccess"));
      setTimeout(() => setFeedback(null), 4000);
    } catch (profileError) {
      setErrorFeedback(profileError instanceof Error ? profileError.message : t("profilePage.saveFailed"));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErrorFeedback(null);

    if (!isPasswordRecovery && !currentPassword) {
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

    setIsUpdatingPassword(true);

    try {
      await onChangePassword(currentPassword, newPassword);
      setFeedback(t("profilePage.passwordUpdated"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setFeedback(null), 4200);
    } catch (passwordError) {
      setErrorFeedback(passwordError instanceof Error ? passwordError.message : t("profilePage.passwordUpdateFailed"));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-[1460px] mx-auto space-y-8 text-left">
      
      {/* Visual Title Header */}
      <header className="pb-1">
        <h2 className="font-display text-[1.85rem] font-semibold tracking-[0.12em] text-onyx uppercase">
          {t("profilePage.title")}
        </h2>
        <p className="text-sm text-neutral-stone mt-2 max-w-xl">{t("profilePage.subtitle")}</p>
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

      <div
        className="relative rounded-[1.4rem] border border-outline-lucid/75 bg-background-luxury p-6 md:p-8 overflow-hidden transition-colors duration-300"
        style={{
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(90deg, rgba(10,13,17,0.9) 0%, rgba(10,13,17,0.72) 27%, rgba(10,13,17,0.95) 58%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDq1pgb7itlk2Bz9OfgHZyq8ttV149xAqSBJ899rckjHl47Tc9cXG-PwbVK4x_9YHwCn1x-Soml4jeOzWX8EmCJgxwGIHQ3kuYNiskuDbez6hholwJzkMDTYUUXfwx7gVkRqL0ecMptJEcGrKSRtTxQIKlFwV5J8_E2vW2k_IrsD8JCYwfdKwLJvzfnwQcnDa6aqMEROIRQbcfHrrLM-8mIIvE47_tn-vT91q8gsPftqUSbRq8wg1M7llhIrGUCs7Vrb7PQRP0jzI')"
              : "linear-gradient(90deg, rgba(245,241,234,0.92) 0%, rgba(245,241,234,0.74) 27%, rgba(245,241,234,0.95) 58%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDq1pgb7itlk2Bz9OfgHZyq8ttV149xAqSBJ899rckjHl47Tc9cXG-PwbVK4x_9YHwCn1x-Soml4jeOzWX8EmCJgxwGIHQ3kuYNiskuDbez6hholwJzkMDTYUUXfwx7gVkRqL0ecMptJEcGrKSRtTxQIKlFwV5J8_E2vW2k_IrsD8JCYwfdKwLJvzfnwQcnDa6aqMEROIRQbcfHrrLM-8mIIvE47_tn-vT91q8gsPftqUSbRq8wg1M7llhIrGUCs7Vrb7PQRP0jzI')",
          backgroundSize: "cover",
          backgroundPosition: "left center",
        }}
      >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: General Profile Card Info & Form (7 Columns) */}
        <form onSubmit={handleSaveProfile} className="md:col-span-7 bg-card-bg border border-outline-lucid/70 p-6 md:p-7 space-y-6 rounded-[1rem] transition-colors duration-300 backdrop-blur-sm">
          <div className="flex items-center gap-4 border-b border-outline-lucid/40 pb-5">
            <div className="h-16 w-16 rounded-full border border-primary text-[1.65rem] font-display text-primary flex items-center justify-center">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-onyx">{user.name}</h3>
              <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-semibold">{user.professionalTitle}</p>
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
                className={fieldClass}
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
                className={fieldClass}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="pref-lang">{t("profilePage.language")}</label>
              <select
                id="pref-lang"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className={fieldClass}
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
                className={fieldClass}
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
                className={fieldClass}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="pref-currency">{t("profilePage.currency")}</label>
              <select
                id="pref-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={fieldClass}
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>CHF (Fr)</option>
              </select>
            </div>
          </div>

          <hr className="border-outline-lucid/40" />

          {/* Alert Toggles */}
          <div className="space-y-3">
            <h5 className="font-display text-[10px] uppercase tracking-[0.2em] text-[#775a19] font-bold flex items-center gap-1.5 mb-1">
              <Bell className="w-3.5 h-3.5" /> {t("profilePage.notifications")}
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
            disabled={isSavingProfile}
            className="w-full bg-transparent border border-primary/80 hover:bg-primary/10 text-primary dark:text-[#f0e6d3] text-xs py-3.5 font-sans uppercase tracking-[0.24em] transition-colors flex items-center justify-center gap-1.5 rounded-[var(--radius-ui-sm)]"
          >
            <Save className="w-4 h-4" /> {isSavingProfile ? t("profilePage.savingPreferences") : t("profilePage.savePreferences")}
          </button>
        </form>

        {/* Right Side: Security Password Modifier (5 Columns) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Quick Metrics stats */}
          <div className="bg-card-bg border border-outline-lucid/70 p-5 rounded-[1rem] text-left relative overflow-hidden transition-colors duration-300">
            <h4 className="font-display text-[10px] uppercase tracking-[0.25em] text-[#775a19] font-bold">{t("profilePage.investedCapital")}</h4>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold font-display text-onyx">{user.totalAssets}</span>
              <span className="text-[9px] text-neutral-stone uppercase font-mono tracking-widest">{t("profilePage.aggregateValue")}</span>
            </div>
            <p className="text-[10px] text-neutral-stone leading-relaxed mt-2 border-t border-[#775a19]/10 pt-2 font-light">
              {t("profilePage.capitalLead", { count: user.activeBuildCount })}
            </p>
            <div className="absolute right-0 bottom-0 h-28 w-36 opacity-50 bg-[radial-gradient(circle_at_bottom_right,rgba(202,161,95,0.28),transparent_42%)]" />
          </div>

          {/* Change password section */}
          <form onSubmit={handleChangePassword} className="bg-card-bg border border-outline-lucid/70 p-6 space-y-4 rounded-[1rem] text-left transition-colors duration-300">
            <h4 className="font-display text-[10px] uppercase tracking-[0.2em] text-[#7c5800] dark:text-[#c5a059] font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> {t("profilePage.securityCredentials")}
            </h4>
            <p className="text-[10px] text-neutral-stone leading-relaxed font-light">
              {isPasswordRecovery ? t("profilePage.recoveryLead") : t("profilePage.securityLead")}
            </p>

            <div className="space-y-3">
              {isPasswordRecovery ? null : (
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="curr-pwd">{t("profilePage.oldCode")}</label>
                  <input
                    id="curr-pwd"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-cream-low border border-outline-lucid/60 focus:border-primary px-3 py-2 text-xs outline-none text-onyx"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="new-pwd">{t("profilePage.newCode")}</label>
                <input
                  id="new-pwd"
                  type="password"
                  placeholder={t("profilePage.minFiveChars")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-cream-low border border-outline-lucid/60 focus:border-primary px-3 py-2 text-xs outline-none text-onyx"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-stone uppercase tracking-widest block" htmlFor="conf-pwd">{t("profilePage.confirmNewCode")}</label>
                <input
                  id="conf-pwd"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-cream-low border border-outline-lucid/60 focus:border-primary px-3 py-2 text-xs outline-none text-onyx"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full bg-primary hover:brightness-110 text-[#15110b] text-[10px] font-sans py-3 uppercase tracking-[0.24em] transition-colors font-semibold text-center"
            >
              {isUpdatingPassword ? t("profilePage.updatingSecurity") : t("profilePage.updateSecurity")}
            </button>
          </form>

        </div>

      </div>
      </div>

    </div>
  );
}
