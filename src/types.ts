/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppRole = "admin" | "client";
export type DataSourceMode = "supabase" | "mock";

export interface UserProfile {
  id: string;
  role: AppRole;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  company: string;
  professionalTitle: string;
  avatarUrl: string;
  preferredLanguage: string;
  currency: string;
  emailNotifications: boolean;
  marketInsights: boolean;
  darkMode: boolean;
  totalAssets: string;
  activeBuildCount: number;
}

export interface TourScene {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface PropertySpecs {
  beds: string;
  baths: string;
  livingArea: string;
  acreage: string;
  builtYear: string;
  garage: string;
  amenities: string;
  price: string;
  brochureUrl?: string;
  attachmentUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  dateAdded: string;
  thumbnailUrl: string;
  heroImageUrl: string;
  description: string;
  architecturalNarrative: string;
  specs: PropertySpecs;
  category: "Residential" | "Commercial" | "Acquisitions";
  status: "In Progress" | "Finalized" | "Design Phase" | "Excavation" | "Occupied";
  assignedClientId: string;
  tourEmbedUrl?: string;
  scenes: TourScene[];
}

export type ProjectAssetType = "tour_360" | "floor_plan" | "thumbnail" | "hero_image" | "attachment";

export interface ProfileRow {
  id: string;
  email: string;
  role: AppRole;
  name: string;
  country?: string;
  city?: string;
  company: string;
  phone_number: string;
  professional_title: string;
  avatar_url: string;
  preferred_language: string;
  currency: string;
  email_notifications: boolean;
  market_insights: boolean;
  dark_mode: boolean;
  total_assets: string;
  active_build_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  client_user_id: string;
  company_name: string;
  project_name: string;
  location: string;
  category: Project["category"];
  status: Project["status"];
  units: number;
  description: string;
  architectural_narrative: string;
  notes: string;
  beds: string;
  baths: string;
  living_area: string;
  acreage: string;
  built_year: string;
  garage: string;
  amenities: string;
  price: string;
  tour_embed_url: string;
  showcase_scene_name: string;
  showcase_scene_category: string;
  showcase_scene_description: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectAssetRow {
  id: string;
  project_id: string;
  asset_type: ProjectAssetType;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export interface AdminClientSummary {
  id: string;
  name: string;
  email: string;
  company: string;
  phoneNumber: string;
  activeBuildCount: number;
}

export interface AdminProjectRecord {
  project: ProjectRow;
  client: AdminClientSummary | null;
  assets: ProjectAssetRow[];
}

export interface CreateProjectInput {
  clientUserId: string;
  companyName: string;
  projectName: string;
  location: string;
  category: Project["category"];
  status: Project["status"];
  units: number;
  description: string;
  architecturalNarrative: string;
  notes: string;
  beds: string;
  baths: string;
  livingArea: string;
  acreage: string;
  builtYear: string;
  garage: string;
  amenities: string;
  price: string;
  showcaseSceneName: string;
  showcaseSceneCategory: string;
  showcaseSceneDescription: string;
  tourEmbedUrl: string;
  files: Partial<Record<ProjectAssetType, File>>;
}
