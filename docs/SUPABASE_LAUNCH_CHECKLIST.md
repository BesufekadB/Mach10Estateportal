# Supabase Launch Checklist

Use this checklist before launching Estate Portal to production.

## Environment

- Set `VITE_SUPABASE_URL` to your live Supabase project URL.
- Set `VITE_SUPABASE_ANON_KEY` to your live Supabase anon key.
- In Supabase Auth, set the site URL to your production domain.
- Add your production domain and local preview domains to the redirect URL allow-list.

## Required Tables

The frontend expects these tables to exist:

- `profiles`
- `projects`
- `project_assets`

The `projects` table must include:

- `id`
- `client_user_id`
- `company_name`
- `project_name`
- `location`
- `category`
- `status`
- `units`
- `description`
- `architectural_narrative`
- `notes`
- `beds`
- `baths`
- `living_area`
- `acreage`
- `built_year`
- `garage`
- `amenities`
- `price`
- `tour_embed_url`
- `showcase_scene_name`
- `showcase_scene_category`
- `showcase_scene_description`
- `created_at`
- `updated_at`

The `project_assets` table must include:

- `id`
- `project_id`
- `asset_type`
- `storage_path`
- `file_name`
- `mime_type`
- `size_bytes`
- `created_at`

## Storage

- Create a storage bucket named `project-assets`.
- Allow authenticated uploads, reads, updates, and deletes for files under this bucket.
- Asset types currently used by the app:
  - `tour_360`
  - `floor_plan`
  - `thumbnail`
  - `hero_image`
  - `attachment`

## RLS Expectations

Because this app writes directly to Supabase from the browser, RLS must be correct before launch.

Recommended access model:

- `profiles`
  - Users can `select` and `update` only their own profile row.
  - Admins can `select` all profiles.
- `projects`
  - Clients can `select` only rows where `client_user_id = auth.uid()`.
  - Admins can `select`, `insert`, and `update` all project rows.
- `project_assets`
  - Clients can `select` assets only for projects assigned to them.
  - Admins can `select`, `insert`, `update`, and `delete` all asset rows.
- Storage bucket `project-assets`
  - Clients can read files tied to their assigned projects.
  - Admins can upload, replace, and delete files.

## Auth

- Enable Email auth.
- Enable Google auth if you want Google sign-up live.
- Configure the Google OAuth client in Supabase Auth Providers.
- Verify password recovery emails use a redirect URL that returns to this app.

## Launch Smoke Test

Before going live, verify:

- Client sign-up works with Ethiopian phone format `+251XXXXXXXXX`.
- Google sign-up redirects back correctly.
- Forgot password sends a real recovery email.
- Recovery link opens the app and allows setting a new password.
- Admin can create a project without optional assets.
- Admin can upload and replace thumbnail, hero image, floor plan, tour file, and vault file.
- Client can open the 360 embed, floor plan, and vault download from the project page.
- English and Amharic both render correctly on admin and client views.
- Light and dark mode both render correctly on admin and client views.
