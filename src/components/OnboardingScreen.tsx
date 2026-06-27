/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Layers } from "lucide-react";
import { useI18n } from "../lib/i18n";
import type { UserProfile } from "../types";

interface OnboardingScreenProps {
  user: UserProfile;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onComplete: (updatedUser: UserProfile) => Promise<void>;
}

export default function OnboardingScreen({ user, theme, onToggleTheme, onComplete }: OnboardingScreenProps) {
  const { t } = useI18n();
  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.company);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [country, setCountry] = useState(user.country);
  const [city, setCity] = useState(user.city);
  const [professionalTitle, setProfessionalTitle] = useState(user.professionalTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fieldClass =
    "mt-2 w-full bg-cream-low border border-outline-lucid/70 px-4 py-3 rounded-xl text-onyx placeholder:text-neutral-stone/60";
  const labelClass = "text-[10px] uppercase tracking-[0.18em] text-neutral-stone";
  const hintClass = "mt-2 text-xs text-neutral-stone/85";

  useEffect(() => {
    setName(user.name);
    setCompany(user.company);
    setPhoneNumber(user.phoneNumber);
    setCountry(user.country);
    setCity(user.city);
    setProfessionalTitle(user.professionalTitle);
  }, [user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!/^\+251\d{9}$/.test(phoneNumber.replace(/[\s()-]/g, ""))) {
      setError(t("auth.ethiopianPhoneError"));
      return;
    }

    setIsSubmitting(true);

    try {
      await onComplete({
        ...user,
        name,
        company,
        phoneNumber,
        country,
        city,
        professionalTitle,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("auth.unableToCreateAccount"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 min-h-[calc(100vh-2.5rem)] flex flex-col justify-center items-center px-4 relative bg-background-luxury transition-colors duration-300 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-cover bg-center" style={{ backgroundImage: theme === "dark" ? "linear-gradient(90deg, rgba(9,11,14,0.86) 0%, rgba(9,11,14,0.52) 34%, rgba(9,11,14,0.9) 100%)" : "linear-gradient(90deg, rgba(245,241,234,0.84) 0%, rgba(245,241,234,0.58) 34%, rgba(245,241,234,0.9) 100%)" }} />
      <div className="w-full max-w-[760px] z-10 bg-card-bg/95 backdrop-blur-md border border-outline-lucid/60 rounded-[1.5rem] p-8 md:p-10 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 text-[#775a19] uppercase">
            <Layers className="w-6 h-6 stroke-[1.7]" />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-[0.24em] text-[#775a19]">Estate Portal</h1>
              <p className="text-[9px] tracking-[0.35em] text-neutral-stone uppercase">{t("common.byMach10")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-xl border border-outline-lucid/70 bg-cream-low px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-onyx"
          >
            {theme === "dark" ? t("topnav.switchToLight") : t("topnav.switchToDark")}
          </button>
        </div>

        <h2 className="font-display text-lg uppercase tracking-[0.16em] text-onyx">{t("auth.completeProfile")}</h2>
        <p className="mt-2 text-sm text-neutral-stone">{t("auth.completeProfileLead")}</p>

        {error ? <div className="mt-5 rounded-xl border border-red-800/30 bg-red-950/20 p-4 text-sm text-red-200">{error}</div> : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className={labelClass} htmlFor="onboarding-name">{t("profilePage.registryName")}</label>
            <input id="onboarding-name" className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} placeholder={t("profilePage.registryName")} required />
            <p className={hintClass}>{t("auth.onboardingNameLead")}</p>
          </div>

          <div>
            <label className={labelClass} htmlFor="onboarding-company">{t("auth.company")}</label>
            <input id="onboarding-company" className={fieldClass} value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t("auth.company")} required />
            <p className={hintClass}>{t("auth.onboardingCompanyLead")}</p>
          </div>

          <div>
            <label className={labelClass} htmlFor="onboarding-phone">{t("auth.phoneNumber")}</label>
            <input id="onboarding-phone" className={fieldClass} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+251912345678" required />
            <p className={hintClass}>{t("auth.phoneHint")}</p>
          </div>

          <div>
            <label className={labelClass} htmlFor="onboarding-title">{t("profilePage.advisoryTitle")}</label>
            <input id="onboarding-title" className={fieldClass} value={professionalTitle} onChange={(e) => setProfessionalTitle(e.target.value)} placeholder={t("profilePage.advisoryTitle")} required />
            <p className={hintClass}>{t("auth.onboardingTitleLead")}</p>
          </div>

          <div>
            <label className={labelClass} htmlFor="onboarding-country">{t("profilePage.country")}</label>
            <input id="onboarding-country" className={fieldClass} value={country} onChange={(e) => setCountry(e.target.value)} placeholder={t("profilePage.country")} required />
          </div>

          <div>
            <label className={labelClass} htmlFor="onboarding-city">{t("profilePage.city")}</label>
            <input id="onboarding-city" className={fieldClass} value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("profilePage.city")} required />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[10px] uppercase tracking-[0.24em] font-semibold text-[#17120b]">
              {isSubmitting ? t("profilePage.savingPreferences") : t("auth.finishSetup")}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
