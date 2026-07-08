# Worklog

## Environment

- Workspace path confirmed:
  - `/Users/susu/Documents/Work /Estate Portal/Estate Portal Website `
- Shell confirmed:
  - `zsh`
- Stack confirmed from `package.json`:
  - React 19
  - Vite
  - TypeScript
  - Tailwind CSS
  - Supabase

## Completed Work

### 1. Profile save / onboarding save fix

- Investigated onboarding failure where the UI said profile save failed even when the row was created.
- Fixed the save flow in [src/lib/portalData.ts](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/lib/portalData.ts) so it no longer depends on row data being returned from the mutation itself.
- Added a follow-up fetch after successful upsert instead of treating missing returned row data as a hard failure.
- Added fallback handling for legacy databases missing `country` and `city`.

### 2. Supabase schema alignment

- Updated [supabase/schema.sql](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/supabase/schema.sql) to include:
  - `country`
  - `city`
- Updated the auth-user trigger to populate those fields.

### 3. Password reset flow hardening

- Updated [src/lib/supabase.ts](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/lib/supabase.ts) to support `VITE_SITE_URL`.
- Updated [src/lib/portalData.ts](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/lib/portalData.ts) so password reset uses a stable configurable site URL.
- Improved error messaging to distinguish:
  - redirect/config problems
  - SMTP/email delivery problems
- Updated [.env.example](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/.env.example) with `VITE_SITE_URL`.

### 4. Email templates

- Added password reset templates:
  - [docs/password-reset-email-template.html](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/docs/password-reset-email-template.html)
  - [docs/password-reset-email-template.txt](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/docs/password-reset-email-template.txt)
- Added email confirmation templates:
  - [docs/email-confirmation-template.html](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/docs/email-confirmation-template.html)
  - [docs/email-confirmation-template.txt](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/docs/email-confirmation-template.txt)

### 5. Public landing page + pricing integration

- Added [src/components/MarketingLandingPage.tsx](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/components/MarketingLandingPage.tsx).
- Integrated a public marketing page describing the business and embedding pricing content inspired by the supplied external design.
- Matched it to the current site’s visual language rather than copying the external mock verbatim.
- Updated [src/App.tsx](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/App.tsx) route behavior:
  - `/` => marketing landing page
  - `/portal` => sign-in/client portal entry
  - `/admin` => admin entry
  - `/reset-password` => reset flow

### 6. Minor auth UI cleanup

- Updated [src/components/LoginScreen.tsx](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/components/LoginScreen.tsx) so the reset redirect hint only appears when the error actually references redirect issues.

## Build Status

Build succeeded after the landing page integration:

```bash
npm run build
```

## Current Uncommitted Changes

At the time this log was written:

- modified: `package-lock.json`
- modified: `src/App.tsx`
- modified: `src/components/LoginScreen.tsx`
- new: `src/components/MarketingLandingPage.tsx`
- new: `docs/password-reset-email-template.html`
- new: `docs/password-reset-email-template.txt`
- new: `docs/email-confirmation-template.html`
- new: `docs/email-confirmation-template.txt`

## Suggested Next Steps

1. Review landing page copy and pricing numbers for final business approval.
2. Add direct navigation buttons/links from any external marketing CTA to `/portal`.
3. Optionally create a dedicated public pricing route if pricing should live separately from the landing page.
4. Test deployed routing on Vercel or the production host to ensure `/portal`, `/admin`, and `/reset-password` all resolve correctly on refresh.
5. If desired, add more public-facing sections:
   - portfolio samples
   - testimonials
   - resources
   - booking/demo CTA
