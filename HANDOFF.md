# Handoff

## Exact Workspace Path

Use this exact absolute path, including the spaces:

`/Users/susu/Documents/Work /Estate Portal/Estate Portal Website `

Important:
- There is a trailing space in the folder name/path as configured in this environment.
- The `Work ` directory also contains a trailing space before `/Estate Portal/`.
- If another LLM or tool strips or normalizes spaces, it may fail to locate the repo.

## Working Shell

The shell that works in this environment is:

`zsh`

If another agent reports `/bin/zsh` is unavailable, it is likely an environment mismatch in that tool rather than a repo issue. It should be configured to use the workspace path above and `zsh`.

## Project Summary

This is a `React 19 + Vite + TypeScript` web app using:

- `vite`
- `react`
- `react-dom`
- `tailwindcss`
- `@supabase/supabase-js`
- `lucide-react`

The app is an `Estate Portal` client/admin property portal with:

- client login and onboarding
- Supabase auth
- password recovery
- profile management
- dashboard/project views
- admin portal
- new public landing page and pricing experience

## Current Route Model

- `/` = public marketing landing page
- `/portal` = client sign-in / portal entry
- `/admin` = admin entry
- `/reset-password` = password reset flow

## Key Files

- [src/App.tsx](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/App.tsx)
- [src/components/MarketingLandingPage.tsx](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/components/MarketingLandingPage.tsx)
- [src/components/LoginScreen.tsx](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/components/LoginScreen.tsx)
- [src/lib/portalData.ts](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/lib/portalData.ts)
- [src/lib/supabase.ts](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/src/lib/supabase.ts)
- [supabase/schema.sql](/Users/susu/Documents/Work%20/Estate%20Portal/Estate%20Portal%20Website%20/supabase/schema.sql)

## If Another LLM Still Cannot Read The Repo

Ask it to use one of these exact checks:

```bash
pwd
ls -la "/Users/susu/Documents/Work /Estate Portal/Estate Portal Website "
cat "/Users/susu/Documents/Work /Estate Portal/Estate Portal Website /package.json"
```

If it still says the path does not exist, the issue is in that tool runtime, not in this project.

## Current Objective

Recent work added a public landing page and integrated a branded pricing section based on the provided reference design, while preserving the existing authenticated portal.
