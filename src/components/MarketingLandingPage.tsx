/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Globe,
  Layers,
  Moon,
  ServerCog,
  ShieldCheck,
  Sun,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface MarketingLandingPageProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenPortal: (action?: "signin" | "signup", plan?: string) => void;
}

const sampleBackdrop =
  "linear-gradient(180deg, rgba(10,13,17,0.12), rgba(10,13,17,0.58)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAh6UOv8dxaqROF1MPP84PI74e7M686moMz9zQ-8lyg-KUBxD6QyUabIg2pvj7AnTvbkAQo6p4i05eNAAPkaN5nBRcQehGmKr9oVNv08soTOgfOHkc-0YjLyRikMK6IMNvdVo3UYmimlZRRaI6xQs-5k3LI8PAZkJsNpIZTlhrEVax2c4o3cdeP3kojN2d-kpj50VmiYuzT7z1NxYkY94RK3-e4MogYeKW8A9dVEPtJV46-2tH42VKgnQ')";

const productionFeatures = ["Full tour setup", "High-resolution 360° capture", "Custom branded webpage"];

const productionPlan = {
  name: "Production",
  price: "Br 20,000",
  cadence: "one-time",
  volume: "01",
  summary: "Tour setup & launch",
  features: productionFeatures,
  cta: "Get started",
  featured: false,
};

const recurringPlans = [
  {
    name: "Essential",
    price: "Br8,000",
    cadence: "/mo",
    volume: "01-05",
    summary: "Active virtual tours",
    features: ["Standard analytics", "Shared subdomain", "Client-ready hosting"],
    cta: "Select plan",
    featured: false,
  },
  {
    name: "Professional",
    price: "Br14,000",
    cadence: "/mo",
    volume: "06-12",
    summary: "Active virtual tours",
    features: ["Heatmap engagement data", "Custom root domain", "Priority email support"],
    cta: "Start professional",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Br26,000",
    cadence: "/mo",
    volume: "12+",
    summary: "Unlimited active tours",
    features: ["Website sync", "White-label portal", "Executive rollout support"],
    cta: "Contact sales",
    featured: false,
  },
];

const infrastructureItems = [
  {
    title: "360° Rendering Engine",
    copy: "Smooth node transitions, exposure balancing, and presentation controls built for premium property storytelling.",
    icon: Layers,
  },
  {
    title: "Global Edge Delivery",
    copy: "Fast media delivery across regions so international buyers can open tours without waiting on heavy files.",
    icon: Globe,
  },
  {
    title: "Real-Time Analytics",
    copy: "See where attention holds, which rooms drive interest, and how visitors move through each property experience.",
    icon: TrendingUp,
  },
];

const faqs = [
  {
    question: "Why is pricing split into setup and monthly hosting?",
    answer: "Production covers physical capture, editing, and launch. Hosting keeps the tour online, optimized, secure, and measurable over time.",
  },
  {
    question: "Can one property be onboarded first?",
    answer: "Yes. Most clients start with a flagship tour, then scale into a recurring hosting plan once the model proves its value.",
  },
  {
    question: "Do clients keep the tour assets?",
    answer: "Yes. You retain access to the delivered tour assets and can expand them into branded marketing or portal experiences.",
  },
  {
    question: "Who is this built for?",
    answer: "Developers, architects, premium brokers, and project marketing teams that need a polished digital presentation layer for high-value property.",
  },
];

export default function MarketingLandingPage({
  theme,
  onToggleTheme,
  onOpenPortal,
}: MarketingLandingPageProps) {
  return (
    <div className="min-h-screen bg-background-luxury text-onyx transition-colors duration-300">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(179,137,69,0.12),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(179,137,69,0.08),transparent_24%)] pointer-events-none" />

        <header className="sticky top-0 z-40 border-b border-outline-lucid/70 bg-card-bg/88 backdrop-blur-xl">
          <div className="max-w-[1720px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-5">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 uppercase text-left"
            >
              <Layers className="w-4 h-4 text-primary stroke-[1.8]" />
              <div className="leading-none">
                <div className="font-display text-[0.8rem] tracking-[0.24em] text-onyx">Estate Portal</div>
                <div className="text-[0.42rem] tracking-[0.38em] text-neutral-stone">By Mach10</div>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.22em] text-stone-variant">
              <a href="#about" className="hover:text-onyx transition-colors">About</a>
              <a href="#services" className="hover:text-onyx transition-colors">Services</a>
              <a href="#pricing" className="hover:text-onyx transition-colors">Pricing</a>
              <a href="#infrastructure" className="hover:text-onyx transition-colors">Infrastructure</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleTheme}
                className="interactive-press h-9 w-9 rounded-xl border border-outline-lucid/80 bg-card-bg hover:bg-cream-low flex items-center justify-center text-primary"
              >
                {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => onOpenPortal("signin")}
                className="interactive-press rounded-xl bg-primary px-4 py-2 text-[9px] uppercase tracking-[0.22em] font-semibold text-[#17120b]"
              >
                Open Portal
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="max-w-[1720px] mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-16 md:pb-24">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] text-neutral-stone">
                <span className="text-primary">01</span>
                <span className="h-px w-14 bg-outline-lucid/60" />
                <span>The immersive property platform</span>
              </motion.div>

              <div className="space-y-5 max-w-4xl">
                <motion.h1 variants={fadeInUp} className="font-display text-[2.9rem] leading-[0.95] tracking-[-0.04em] uppercase text-onyx sm:text-[4.3rem] xl:text-[5.7rem]">
                  Show the property. Sell the confidence.
                </motion.h1>
                <motion.p variants={fadeInUp} className="max-w-2xl text-base md:text-lg leading-8 text-stone-variant">
                  Estate Portal helps real estate teams present projects through cinematic 360° tours, branded client workspaces,
                  and measurable digital hosting that feels as premium as the properties themselves.
                </motion.p>
              </div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onOpenPortal("signin")}
                  className="interactive-press inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-[10px] uppercase tracking-[0.24em] font-semibold text-[#17120b]"
                >
                  View client portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-lucid/80 bg-card-bg px-6 py-4 text-[10px] uppercase tracking-[0.24em] text-onyx hover:bg-cream-low"
                >
                  Explore pricing
                </motion.a>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  { label: "Tour production", value: "360° capture + launch" },
                  { label: "Client delivery", value: "Private branded workspace" },
                  { label: "Reporting", value: "Hosting + analytics retained" },
                ].map((item) => (
                  <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    key={item.label}
                    className="rounded-[1rem] border border-outline-lucid/65 bg-card-bg/90 p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-[9px] uppercase tracking-[0.22em] text-primary">{item.label}</div>
                    <div className="mt-3 text-sm leading-6 text-stone-variant">{item.value}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          <section id="about" className="max-w-[1720px] mx-auto px-5 md:px-8 pb-14 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-[1.5rem] border border-outline-lucid/70 min-h-[26rem] md:min-h-[34rem]"
              style={{ backgroundImage: sampleBackdrop, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-black/50" />
              <div className="relative z-10 flex h-full flex-col justify-end p-7 md:p-10 lg:p-12">
                <div className="max-w-3xl">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary">What the business does</div>
                  <h2 className="mt-4 font-display text-3xl md:text-5xl uppercase tracking-[0.1em] text-[#f7f1e8]">
                    We turn physical spaces into premium digital sales experiences.
                  </h2>
                  <p className="mt-5 max-w-2xl text-sm md:text-base leading-7 text-[#ddd3c7]">
                    Mach10 captures and packages high-value properties into immersive virtual tours, then keeps those experiences
                    online through branded hosting, analytics, and client-facing delivery. The result is a sharper way to present
                    architecture, developments, and finished homes to buyers, investors, and stakeholders.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          <section id="services" className="max-w-[1720px] mx-auto px-5 md:px-8 pb-16 md:pb-24">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6"
            >
              {[
                {
                  title: "Production for premium property",
                  copy: "On-site capture, editorial finishing, and a polished launch package for each tour.",
                  icon: BellRing,
                },
                {
                  title: "Private client portal delivery",
                  copy: "A secure workspace where clients can review projects, materials, visuals, and updates in one place.",
                  icon: ShieldCheck,
                },
                {
                  title: "Managed hosting and analytics",
                  copy: "Monthly infrastructure that keeps tours fast, monitored, and ready for real buyer traffic.",
                  icon: ServerCog,
                },
                {
                  title: "Sales-ready brand presentation",
                  copy: "Custom pages and presentation framing that make each tour feel like a premium product, not a utility link.",
                  icon: TrendingUp,
                },
              ].map((item) => (
                <motion.article
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  key={item.title}
                  className="rounded-[1.2rem] border border-outline-lucid/65 bg-card-bg p-7 md:p-8 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <h3 className="mt-5 font-display text-xl uppercase tracking-[0.12em] text-onyx">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-stone-variant">{item.copy}</p>
                </motion.article>
              ))}
            </motion.div>
          </section>

          <section id="pricing" className="max-w-[1720px] mx-auto px-5 md:px-8 pb-16 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12"
            >
              <div>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] text-neutral-stone">
                  <span className="text-primary">02</span>
                  <span className="h-px w-14 bg-outline-lucid/60" />
                  <span>Hosting & analytics</span>
                </div>
                <h2 className="mt-5 font-display text-3xl md:text-5xl uppercase tracking-[0.1em] text-onyx">Transparent pricing: one setup, flexible hosting</h2>
              </div>
              <p className="max-w-xl text-sm md:text-base leading-7 text-stone-variant">
                A single production fee covers tour capture and launch. Then choose the monthly hosting tier that matches how many
                active tours you need, the reporting depth, and how closely the experience should integrate with your brand.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
            >
              {/* Production — one-time setup card */}
              <motion.article
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="rounded-[1.2rem] p-7 md:p-8 border-2 border-dashed border-primary/40 bg-[radial-gradient(circle_at_top,rgba(179,137,69,0.08),transparent_45%)] bg-card-bg shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-primary">Production</div>
                  <div className="mt-5 flex items-end gap-2">
                    <span className="font-display text-[3rem] leading-none tracking-[-0.05em] text-onyx">{productionPlan.price}</span>
                    <span className="pb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-stone">one-time</span>
                  </div>
                </div>

                <div className="mt-7 text-sm text-stone-variant">
                  <span className="font-mono text-primary">{productionPlan.volume}</span> {productionPlan.summary}
                </div>

                <div className="mt-8 space-y-4">
                  {productionPlan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-stone-variant">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1rem] border border-primary/20 bg-primary/10 px-4 py-4 text-sm leading-6 text-stone-variant">
                  Best for premium listings, development launches, and investor presentations that need more than static media.
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPortal("signup", "production")}
                  className="interactive-press mt-8 w-full rounded-xl border border-outline-lucid/80 bg-card-bg px-5 py-4 text-[10px] uppercase tracking-[0.24em] font-semibold text-onyx hover:border-primary hover:bg-primary/10 transition-colors"
                >
                  {productionPlan.cta}
                </button>
              </motion.article>

              {recurringPlans.map((plan) => (
                <motion.article
                  variants={fadeInUp}
                  whileHover={plan.featured ? { y: -12, scale: 1.01, transition: { duration: 0.25 } } : { y: -8, transition: { duration: 0.25 } }}
                  key={plan.name}
                  className={`rounded-[1.2rem] p-7 md:p-8 border transition-all duration-300 ${
                    plan.featured
                      ? "border-primary bg-[radial-gradient(circle_at_top,rgba(179,137,69,0.16),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,245,239,0.98))] dark:bg-[radial-gradient(circle_at_top,rgba(179,137,69,0.16),transparent_45%),linear-gradient(180deg,rgba(15,20,25,0.95),rgba(11,15,19,0.98))] shadow-[0_24px_80px_rgba(179,137,69,0.16)] dark:shadow-[0_24px_80px_rgba(179,137,69,0.24)] md:-translate-y-2"
                      : "border-outline-lucid/65 bg-card-bg shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`text-[10px] uppercase tracking-[0.24em] ${plan.featured ? "text-primary" : "text-neutral-stone"}`}>{plan.name}</div>
                      <div className="mt-5 flex items-end gap-2">
                        <span className="font-display text-[3rem] leading-none tracking-[-0.05em] text-onyx">{plan.price}</span>
                        <span className="pb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-stone">{plan.cadence}</span>
                      </div>
                    </div>
                    {plan.featured ? (
                      <span className="rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-primary">
                        Most popular
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-7 text-sm text-stone-variant">
                    <span className="font-mono text-primary">{plan.volume}</span> {plan.summary}
                  </div>

                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm text-stone-variant">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.featured ? "text-primary" : "text-neutral-stone"}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenPortal("signup", plan.name.toLowerCase())}
                    className={`interactive-press mt-10 w-full rounded-xl border px-5 py-4 text-[10px] uppercase tracking-[0.24em] font-semibold transition-colors ${
                      plan.featured
                        ? "border-primary bg-primary text-[#17120b]"
                        : "border-outline-lucid/80 bg-card-bg text-onyx hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.article>
              ))}
            </motion.div>
          </section>

          <section id="infrastructure" className="max-w-[1720px] mx-auto px-5 md:px-8 pb-20 md:pb-28">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 xl:gap-12 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="rounded-[1.2rem] border border-outline-lucid/65 bg-card-bg p-7 md:p-8"
              >
                <div className="text-[10px] uppercase tracking-[0.24em] text-primary">03</div>
                <h2 className="mt-4 font-display text-2xl md:text-4xl uppercase tracking-[0.12em] text-onyx">Technical infrastructure</h2>
                <div className="mt-8 space-y-5">
                  {infrastructureItems.map((item) => (
                    <motion.div
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      key={item.title}
                      className="rounded-[1rem] border border-outline-lucid/55 bg-cream-low px-5 py-5 transition-shadow duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-primary" />
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-onyx">{item.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-stone-variant">{item.copy}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="rounded-[1.2rem] border border-outline-lucid/65 bg-card-bg p-7 md:p-8"
              >
                <h2 className="font-display text-2xl md:text-4xl uppercase tracking-[0.12em] text-onyx">Frequently asked</h2>
                <div className="mt-8 divide-y divide-outline-lucid/45">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group py-5">
                      <summary className="cursor-pointer list-none pr-8 text-[11px] uppercase tracking-[0.18em] text-onyx flex items-center justify-between gap-4">
                        <span>{faq.question}</span>
                        <span className="text-primary transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-variant">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <section className="max-w-[1720px] mx-auto px-5 md:px-8 pb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="rounded-[1.5rem] border border-outline-lucid/70 bg-[linear-gradient(145deg,rgba(179,137,69,0.14),rgba(255,255,255,0.92)_24%,rgba(245,241,234,0.98)_100%)] dark:bg-[linear-gradient(145deg,rgba(179,137,69,0.16),rgba(15,20,25,0.92)_24%,rgba(11,15,19,0.98)_100%)] p-8 md:p-12 lg:p-14"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-3xl">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-primary">Ready to launch</div>
                  <h2 className="mt-4 font-display text-3xl md:text-5xl uppercase tracking-[0.1em] text-onyx">
                    Bring your property portfolio into a more immersive sales environment.
                  </h2>
                  <p className="mt-5 text-sm md:text-base leading-7 text-stone-variant">
                    Open the portal to preview the client experience, or move straight into the account flow and start onboarding a new workspace.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => onOpenPortal("signin")}
                    className="interactive-press rounded-xl bg-primary px-6 py-4 text-[10px] uppercase tracking-[0.24em] font-semibold text-[#17120b]"
                  >
                    Enter portal
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href="#pricing"
                    className="rounded-xl border border-outline-lucid/80 bg-card-bg px-6 py-4 text-[10px] uppercase tracking-[0.24em] text-onyx inline-flex items-center justify-center"
                  >
                    View pricing
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="border-t border-outline-lucid/60 bg-card-bg/88 backdrop-blur-xl">
          <div className="max-w-[1720px] mx-auto px-5 md:px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-neutral-stone">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-onyx">Estate Portal by Mach10</span>
            </div>
            <div className="text-center">Immersive tours • branded hosting • client delivery</div>
            <div>© {new Date().getFullYear()} Mach10</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
