/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, Layers, Moon, Sun } from "lucide-react";
import { useI18n } from "../lib/i18n";

interface PasswordResetScreenProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onSubmit: (newPassword: string, confirmPassword: string) => Promise<void>;
  onBackToLogin: () => void;
  recoveryEmail?: string | null;
  isSessionReady?: boolean | null;
}

export default function PasswordResetScreen({
  theme,
  onToggleTheme,
  onSubmit,
  onBackToLogin,
  recoveryEmail = null,
  isSessionReady = null,
}: PasswordResetScreenProps) {
  const { t } = useI18n();
  const backgroundOverlay =
    theme === "dark"
      ? "linear-gradient(90deg, rgba(9,11,14,0.86) 0%, rgba(9,11,14,0.52) 34%, rgba(9,11,14,0.9) 100%)"
      : "linear-gradient(90deg, rgba(245,241,234,0.84) 0%, rgba(245,241,234,0.58) 34%, rgba(245,241,234,0.9) 100%)";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass = "w-full bg-cream-low border border-outline-lucid/70 focus:border-primary px-4 py-3 text-sm outline-none text-onyx transition-colors placeholder-neutral-stone/50 font-sans rounded-[var(--radius-ui-sm)]";

  useEffect(() => {
    if (isSessionReady === false) {
      setError(t("auth.recoverySessionMissing"));
    } else if (isSessionReady === true) {
      setError(null);
    }
  }, [isSessionReady, t]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (isSessionReady !== true) {
      setError(t("auth.recoverySessionMissing"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("profilePage.passwordMismatch"));
      return;
    }

    if (newPassword.length < 5) {
      setError(t("profilePage.passwordTooShort"));
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(newPassword, confirmPassword);
      setSuccess(t("profilePage.passwordUpdated"));
      setNewPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("profilePage.passwordUpdateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 min-h-[calc(100vh-2.5rem)] flex flex-col justify-center items-center px-4 relative bg-background-luxury transition-colors duration-300 overflow-hidden">
      <div
        className="absolute inset-0 opacity-25 pointer-events-none bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDq1pgb7itlk2Bz9OfgHZyq8ttV149xAqSBJ899rckjHl47Tc9cXG-PwbVK4x_9YHwCn1x-Soml4jeOzWX8EmCJgxwGIHQ3kuYNiskuDbez6hholwJzkMDTYUUXfwx7gVkRqL0ecMptJEcGrKSRtTxQIKlFwV5J8_E2vW2k_IrsD8JCYwfdKwLJvzfnwQcnDa6aqMEROIRQbcfHrrLM-8mIIvE47_tn-vT91q8gsPftqUSbRq8wg1M7llhIrGUCs7Vrb7PQRP0jzI')`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: backgroundOverlay }} />

      <div className="absolute top-6 right-6 md:top-8 md:right-16 z-50">
        <button
          onClick={onToggleTheme}
          type="button"
          className="h-9 w-9 text-neutral-stone hover:text-onyx bg-card-bg border border-outline-lucid/70 rounded-xl hover:bg-cream-low transition-all cursor-pointer focus:outline-none flex items-center justify-center"
          title={theme === "dark" ? t("topnav.switchToLight") : t("topnav.switchToDark")}
          aria-label={t("topnav.toggleTheme")}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-300 stroke-[1.75]" />
          ) : (
            <Moon className="w-4 h-4 text-[#775a19] stroke-[1.75]" />
          )}
        </button>
      </div>

      <main className="w-full max-w-[440px] z-10">
        <header className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-3 text-[#775a19] uppercase">
            <Layers className="w-6 h-6 stroke-[1.7]" />
            <div className="text-left">
              <h1 className="font-display text-2xl font-bold tracking-[0.24em] text-[#775a19]">
                Estate Portal
              </h1>
              <p className="text-[9px] tracking-[0.35em] text-neutral-stone uppercase">{t("common.byMach10")}</p>
            </div>
          </div>
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-stone-variant">
            {t("auth.recoverCredentials")}
          </p>
        </header>

        <section className="bg-card-bg/92 p-8 md:p-10 border border-outline-lucid/55 shadow-[0px_24px_60px_rgba(0,0,0,0.18)] rounded-[1rem] transition-colors duration-300 backdrop-blur-md">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg uppercase tracking-[0.16em] text-onyx">
                {t("auth.resetPasswordTitle")}
              </h2>
              <p className="mt-2 text-sm text-neutral-stone leading-relaxed">
                {t("auth.resetPasswordLead")}
              </p>
              {recoveryEmail ? (
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-primary">
                  {recoveryEmail}
                </p>
              ) : null}
              {isSessionReady === null ? (
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-stone">
                  {t("common.loading")}
                </p>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <div className="bg-red-950/25 border border-red-800/35 p-4 text-xs text-red-200 font-sans leading-relaxed rounded-[var(--radius-ui-sm)]">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="bg-emerald-950/20 border border-emerald-700/35 p-4 text-xs text-emerald-100 font-sans leading-relaxed rounded-[var(--radius-ui-sm)]">
                {success}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-stone" htmlFor="reset-new-password">
                {t("profilePage.newCode")}
              </label>
              <input
                id="reset-new-password"
                type="password"
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder={t("profilePage.minFiveChars")}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-stone" htmlFor="reset-confirm-password">
                {t("profilePage.confirmNewCode")}
              </label>
              <input
                id="reset-confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSessionReady !== true}
              className="w-full bg-primary hover:brightness-110 text-[#15110b] font-sans text-xs py-3.5 uppercase tracking-[0.24em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 rounded-[var(--radius-ui-sm)]"
            >
              {isSubmitting ? t("profilePage.updatingSecurity") : t("auth.resetPasswordAction")}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <button
            type="button"
            onClick={onBackToLogin}
            className="mt-6 text-[10px] uppercase font-semibold text-neutral-stone hover:text-onyx tracking-widest transition-colors"
          >
            {t("auth.backToSignIn")}
          </button>
        </section>
      </main>
    </div>
  );
}
