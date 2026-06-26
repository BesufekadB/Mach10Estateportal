/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Lock, Eye, EyeOff, ArrowRight, Sun, Moon, Layers, Mail } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface LoginScreenProps {
  onLoginSuccess: (email: string, password: string) => Promise<void> | void;
  onSignUp: (
    email: string,
    password: string,
    phoneNumber: string,
    company: string
  ) => Promise<{ status: "signed_in" | "needs_confirmation"; user?: unknown }> | { status: "signed_in" | "needs_confirmation"; user?: unknown } | void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  authMode: "supabase" | "mock";
  portalVariant?: "client" | "admin";
}

export default function LoginScreen({
  onLoginSuccess,
  onSignUp,
  theme,
  onToggleTheme,
  authMode,
  portalVariant = "client",
}: LoginScreenProps) {
  const { t } = useI18n();
  const isAdminPortal = portalVariant === "admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Forgot password flow states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Request Access trigger states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPhoneNumber, setSignUpPhoneNumber] = useState("");
  const [signUpCompany, setSignUpCompany] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState<string | null>(null);

  // Form handle
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onLoginSuccess(email, password);
    } catch {
      setError(t("auth.invalidCredentials"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail("");
    }, 4000);
  };

  const handleRequestAccess = async (e: FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpSuccessMessage(null);

    if (!signUpEmail || !signUpPassword || !signUpPhoneNumber || !signUpCompany) return;
    if (!/^\+251\d{9}$/.test(signUpPhoneNumber.replace(/[\s()-]/g, ""))) {
      setSignUpError(t("auth.ethiopianPhoneError"));
      return;
    }

    try {
      const result = await onSignUp(signUpEmail, signUpPassword, signUpPhoneNumber, signUpCompany);
      setRequestSubmitted(true);
      if (result && result.status === "needs_confirmation") {
        setSignUpSuccessMessage(t("auth.confirmationNeeded"));
      } else {
        setSignUpSuccessMessage(t("auth.signedInSuccess"));
        setTimeout(() => {
          setRequestSubmitted(false);
          setShowRequestModal(false);
          setSignUpEmail("");
          setSignUpPassword("");
          setSignUpPhoneNumber("");
          setSignUpCompany("");
          setSignUpSuccessMessage(null);
        }, 2000);
      }
    } catch (signupError) {
      setSignUpError(signupError instanceof Error ? signupError.message : t("auth.unableToCreateAccount"));
    }
  };

  const handleGoogleSignUp = async () => {
    setSignUpError(null);
    setSignUpSuccessMessage(null);

    if (!isSupabaseConfigured || !supabase) {
      setSignUpError(t("auth.googleRequiresSupabase"));
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setSignUpError(error.message);
    }
  };

  return (
    <div className="w-full flex-1 min-h-[calc(100vh-2.5rem)] flex flex-col justify-center items-center px-4 relative bg-background-luxury transition-colors duration-300">
      
      {/* Absolute high-key architectural background vignette */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none bg-cover bg-center mix-blend-soft-light"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDq1pgb7itlk2Bz9OfgHZyq8ttV149xAqSBJ899rckjHl47Tc9cXG-PwbVK4x_9YHwCn1x-Soml4jeOzWX8EmCJgxwGIHQ3kuYNiskuDbez6hholwJzkMDTYUUXfwx7gVkRqL0ecMptJEcGrKSRtTxQIKlFwV5J8_E2vW2k_IrsD8JCYwfdKwLJvzfnwQcnDa6aqMEROIRQbcfHrrLM-8mIIvE47_tn-vT91q8gsPftqUSbRq8wg1M7llhIrGUCs7Vrb7PQRP0jzI')`,
        }}
      />

      {/* Absolute theme toggle on the top right of light/dark */}
      <div className="absolute top-6 right-6 md:top-8 md:right-16 z-50">
        <button
          onClick={onToggleTheme}
          type="button"
          className="p-2.5 text-neutral-stone hover:text-onyx dark:text-[#9e9380] dark:hover:text-onyx bg-white dark:bg-card-bg border border-outline-lucid/40 dark:border-outline-lucid/10 rounded-full hover:bg-stone-50 dark:hover:bg-cream-low transition-all shadow-xs cursor-pointer focus:outline-none"
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
        
        {/* Branding Title Block */}
        <header className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-3 text-[#775a19] uppercase">
            <Layers className="w-6 h-6 stroke-[1.7]" />
            <div className="text-left">
              <h1 className="font-display text-2xl font-bold tracking-[0.24em] text-[#775a19]">
                Estate Portal
              </h1>
              <p className="text-[9px] tracking-[0.35em] text-neutral-stone uppercase">By Mach10</p>
              <p className="text-[9px] tracking-[0.35em] text-neutral-stone uppercase">{t("common.byMach10")}</p>
            </div>
          </div>
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-stone">
            {isAdminPortal ? t("auth.adminAccess") : t("auth.secureClientAccess")}
          </p>
        </header>

        {/* Content Box */}
        <section className="bg-white/95 dark:bg-card-bg p-8 md:p-10 border border-outline-lucid dark:border-outline-lucid/15 shadow-[0px_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0px_20px_40px_rgba(0,0,0,0.35)] rounded-[var(--radius-ui)] transition-colors duration-300">
          
          <form onSubmit={handleLogin} className="space-y-8">
            
            {/* Display validation error */}
            {error && (
              <div className="bg-red-50 border-l border-red-800 p-4 text-xs text-red-950 font-sans leading-relaxed">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-stone" htmlFor="email">
                {t("auth.yourEmail")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminPortal ? t("auth.adminPlaceholder") : t("auth.clientPlaceholder")}
                className="w-full bg-stone-50/80 dark:bg-cream-low border border-outline-lucid/60 dark:border-outline-lucid/15 focus:border-primary px-4 py-3 text-sm outline-none text-onyx transition-colors placeholder-neutral-stone/40 font-sans rounded-[var(--radius-ui-sm)]"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-stone" htmlFor="password">
                  {t("auth.yourPassword")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] uppercase font-semibold text-primary/80 hover:text-primary tracking-widest transition-colors"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>
              
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50/80 dark:bg-cream-low border border-outline-lucid/60 dark:border-outline-lucid/15 focus:border-primary px-4 py-3 pr-10 text-sm outline-none text-onyx transition-colors placeholder-neutral-stone/40 font-sans rounded-[var(--radius-ui-sm)]"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-stone/50 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-onyx hover:bg-neutral-stone text-white font-sans text-xs py-4 uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 rounded-[var(--radius-ui-sm)]"
            >
              {isSubmitting ? t("auth.signingIn") : isAdminPortal ? t("auth.adminSignIn") : t("auth.signIn")} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Prompt Request Acceses Section */}
          {!isAdminPortal ? (
            <footer className="mt-8 pt-6 border-t border-outline-lucid/40 text-center">
              <p className="text-[11px] text-neutral-stone uppercase tracking-widest font-sans">
                {t("auth.newMember")}{" "}
                <button 
                  onClick={() => setShowRequestModal(true)}
                  className="text-onyx font-bold hover:underline ml-1"
                >
                  {t("auth.signUp")}
                </button>
              </p>
            </footer>
          ) : (
            <footer className="mt-8 pt-6 border-t border-outline-lucid/40 text-center">
              <p className="text-[11px] text-neutral-stone uppercase tracking-widest font-sans">
                {t("auth.portalAdminsOnly")}
              </p>
            </footer>
          )}
        </section>

        {/* Footnote Encrypt Badge */}
        <div className="mt-6 flex justify-center items-center gap-2 text-neutral-stone/40 text-[10px] uppercase tracking-widest font-sans">
          <Lock className="w-3 h-3" />
          <span>{t("auth.encryptedGateway")}</span>
        </div>

        {/* Footer legalities */}
            <footer className="mt-16 text-center text-[10px] text-neutral-stone/60 uppercase tracking-[0.12em] font-sans">
          © {new Date().getFullYear()} {t("auth.allRightsReserved")}
        </footer>
      </main>

      {/* Forgot Password Modal Module */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card-bg border border-outline-lucid dark:border-outline-lucid/15 rounded-[var(--radius-ui)] shadow-2xl p-8 max-w-sm w-full relative transition-colors duration-300">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-onyx mb-2">
              {t("auth.recoverCredentials")}
            </h3>
            <p className="text-xs text-neutral-stone leading-relaxed mb-6">
              {t("auth.recoverLead")}
            </p>

            {forgotSuccess ? (
              <div className="bg-stone-50 dark:bg-cream-low border border-primary/20 text-xs p-4 text-primary leading-relaxed uppercase tracking-wider font-semibold text-center rounded-[var(--radius-ui-sm)]">
                {t("auth.instructionsSent")}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder={t("auth.clientPlaceholder")}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-stone-50/80 dark:bg-cream-low border border-outline-lucid/60 dark:border-outline-lucid/15 focus:border-primary px-4 py-3 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-[10px] uppercase font-semibold text-neutral-stone px-4 py-2 hover:bg-stone-100 dark:hover:bg-cream-low transition-colors rounded-[var(--radius-ui-sm)]"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white text-[10px] uppercase font-medium tracking-widest px-6 py-2 transition-transform hover:scale-102 rounded-[var(--radius-ui-sm)]"
                  >
                    {t("auth.sendInstructions")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Request Access Registry Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card-bg border border-outline-lucid dark:border-outline-lucid/15 rounded-[var(--radius-ui)] shadow-2xl p-8 max-w-md w-full relative transition-colors duration-300">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-onyx mb-2">
              {t("auth.signUpTitle")}
            </h3>
            <p className="text-xs text-neutral-stone leading-relaxed mb-6">
              {t("auth.signUpLead")}
            </p>

            {requestSubmitted ? (
              <div className="bg-stone-50 dark:bg-cream-low border border-primary/35 text-xs p-6 text-primary leading-relaxed text-center space-y-2">
                <div className="font-semibold uppercase tracking-wider">{t("auth.accountCreatedTitle")}</div>
                <p className="text-[10px] text-stone-variant">{signUpSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleRequestAccess} className="space-y-4 text-left">
                {signUpError ? (
                  <div className="bg-red-50 border border-red-200 text-red-900 text-xs px-4 py-3 rounded-[var(--radius-ui-sm)]">
                    {signUpError}
                  </div>
                ) : null}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-stone">{t("auth.email")}</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-stone-50/80 dark:bg-cream-low border border-outline-lucid/60 dark:border-outline-lucid/15 focus:border-primary px-4 py-3 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-stone">{t("auth.password")}</label>
                  <input
                    type="password"
                    required
                    placeholder={t("auth.passwordPlaceholder")}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-stone-50/80 dark:bg-cream-low border border-outline-lucid/60 dark:border-outline-lucid/15 focus:border-primary px-4 py-3 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-stone">{t("auth.phoneNumber")}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+251912345678"
                    value={signUpPhoneNumber}
                    onChange={(e) => setSignUpPhoneNumber(e.target.value)}
                    className="w-full bg-stone-50/80 dark:bg-cream-low border border-outline-lucid/60 dark:border-outline-lucid/15 focus:border-primary px-4 py-3 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
                  />
                  <p className="text-[10px] text-neutral-stone">{t("auth.phoneHint")}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#775a19]">{t("auth.company")}</label>
                  <input
                    type="text"
                    required
                    placeholder={t("auth.companyPlaceholder")}
                    value={signUpCompany}
                    onChange={(e) => setSignUpCompany(e.target.value)}
                    className="w-full bg-stone-50/80 dark:bg-cream-low border border-outline-lucid/60 dark:border-outline-lucid/15 focus:border-primary px-4 py-3 text-xs outline-none text-onyx rounded-[var(--radius-ui-sm)]"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="text-[10px] uppercase font-semibold text-neutral-stone px-4 py-2 hover:bg-stone-100 transition-colors rounded-[var(--radius-ui-sm)]"
                  >
                    {t("auth.close")}
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white text-[10px] uppercase font-medium tracking-widest px-6 py-2.5 shadow rounded-[var(--radius-ui-sm)]"
                  >
                    {t("auth.createAccount")}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center gap-2 border border-outline-lucid/40 px-4 py-3 text-[10px] uppercase tracking-widest text-onyx rounded-[var(--radius-ui-sm)]"
                >
                  <Mail className="w-4 h-4" />
                  {t("auth.googleSignup")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}
