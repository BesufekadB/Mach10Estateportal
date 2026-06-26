import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { MOCK_PROJECTS } from "../data";
import { getLocaleFromLanguage, translate } from "./i18n";
import type {
  AdminClientSummary,
  AdminProjectRecord,
  CreateProjectInput,
  DataSourceMode,
  ProfileRow,
  Project,
  ProjectAssetRow,
  ProjectAssetType,
  ProjectRow,
  TourScene,
  UserProfile,
} from "../types";
import { allowMockAuth, isSupabaseConfigured, PROJECT_ASSETS_BUCKET, supabase } from "./supabase";

type MockUserRecord = UserProfile & { passwordHash: string };

export interface PortalAuthResult {
  user: UserProfile;
  mode: DataSourceMode;
}

export interface PortalBootstrapData {
  projects: Project[];
  mode: DataSourceMode;
}

export interface SignUpPayload {
  email: string;
  password: string;
  phoneNumber: string;
  company: string;
}

export interface SignUpResult {
  status: "signed_in" | "needs_confirmation";
  user?: UserProfile;
}

export interface ChangePasswordInput {
  email: string;
  currentPassword?: string;
  newPassword: string;
  requireCurrentPassword?: boolean;
}

const defaultAvatar = (seed: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=f3ead8&color=775a19`;

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizeEthiopianPhone = (phoneNumber: string) => phoneNumber.replace(/[\s()-]/g, "").trim();
const isValidEthiopianPhone = (phoneNumber: string) => /^\+251\d{9}$/.test(normalizeEthiopianPhone(phoneNumber));
const formatDateAdded = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-US", { month: "short", year: "numeric" });

export const normalizeTourEmbedUrl = (rawValue: string) => {
  const trimmed = rawValue.trim();
  if (!trimmed) return "";

  const iframeMatch = trimmed.match(/<iframe\b[^>]*\bsrc=(["'])(.*?)\1/i);
  if (iframeMatch?.[2]) {
    return iframeMatch[2].trim();
  }

  const srcMatch = trimmed.match(/\bsrc=(["'])(.*?)\1/i);
  if (srcMatch?.[2]) {
    return srcMatch[2].trim();
  }

  return trimmed;
};

const fallbackScene = (project: ProjectRow, imageUrl: string, preferredLanguage?: string): TourScene => {
  const locale = getLocaleFromLanguage(preferredLanguage);

  return {
    id: `${project.id}-scene`,
    name: project.showcase_scene_name || translate(locale, "adminPage.defaultSceneName"),
    category: project.showcase_scene_category || translate(locale, "adminPage.defaultSceneCategory"),
    imageUrl,
    description: project.showcase_scene_description || translate(locale, "adminPage.defaultSceneDescription"),
  };
};

const getLatestProjectAsset = (assets: ProjectAssetRow[], type: ProjectAssetType) =>
  assets
    .filter((asset) => asset.asset_type === type)
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())[0];

const buildMockAuthResult = async (email: string, password: string): Promise<PortalAuthResult | null> => {
  if (!allowMockAuth) return null;
  const { DEFAULT_USERS } = await import("../dev/mockUsers");
  const mockUser = DEFAULT_USERS[normalizeEmail(email)] as MockUserRecord | undefined;
  if (!mockUser || mockUser.passwordHash !== password) return null;
  const { passwordHash, ...profile } = mockUser;
  return { user: profile, mode: "mock" };
};

const buildProfileFromAuthUser = (
  authUser: User,
  role: UserProfile["role"],
  overrides?: Partial<UserProfile>
): UserProfile => {
  const email = authUser.email ?? overrides?.email ?? "";
  return {
    id: authUser.id,
    role,
    name: overrides?.name ?? authUser.user_metadata?.name ?? overrides?.company ?? "Estate Client",
    email,
    phoneNumber: overrides?.phoneNumber ?? authUser.user_metadata?.phone_number ?? "",
    country: overrides?.country ?? authUser.user_metadata?.country ?? "Ethiopia",
    city: overrides?.city ?? authUser.user_metadata?.city ?? "Addis Ababa",
    company: overrides?.company ?? authUser.user_metadata?.company ?? "Private Client",
    professionalTitle: overrides?.professionalTitle ?? (role === "admin" ? "Portal Administrator" : "Client Account"),
    avatarUrl: overrides?.avatarUrl ?? defaultAvatar((overrides?.company ?? email) || "Estate Portal"),
    preferredLanguage: overrides?.preferredLanguage ?? "English (International)",
    currency: overrides?.currency ?? "USD ($)",
    emailNotifications: overrides?.emailNotifications ?? true,
    marketInsights: overrides?.marketInsights ?? true,
    darkMode: overrides?.darkMode ?? false,
    totalAssets: overrides?.totalAssets ?? "$0.0M",
    activeBuildCount: overrides?.activeBuildCount ?? 0,
  };
};

const ensureSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
};

const mapProfileRow = (row: ProfileRow): UserProfile => ({
  id: row.id,
  role: row.role,
  name: row.name,
  email: row.email,
  phoneNumber: row.phone_number,
  country: row.country ?? "Ethiopia",
  city: row.city ?? "Addis Ababa",
  company: row.company,
  professionalTitle: row.professional_title,
  avatarUrl: row.avatar_url,
  preferredLanguage: row.preferred_language,
  currency: row.currency,
  emailNotifications: row.email_notifications,
  marketInsights: row.market_insights,
  darkMode: row.dark_mode,
  totalAssets: row.total_assets,
  activeBuildCount: row.active_build_count,
});

const mapUserToProfileRow = (user: UserProfile): Omit<ProfileRow, "created_at" | "updated_at"> => ({
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name,
  country: user.country,
  city: user.city,
  company: user.company,
  phone_number: user.phoneNumber,
  professional_title: user.professionalTitle,
  avatar_url: user.avatarUrl,
  preferred_language: user.preferredLanguage,
  currency: user.currency,
  email_notifications: user.emailNotifications,
  market_insights: user.marketInsights,
  dark_mode: user.darkMode,
  total_assets: user.totalAssets,
  active_build_count: user.activeBuildCount,
});

const buildLegacyProjects = async (
  projectRows: ProjectRow[],
  assetRows: ProjectAssetRow[],
  preferredLanguage?: string
): Promise<Project[]> => {
  const client = ensureSupabase();

  const uniquePaths = [...new Set(assetRows.map((asset) => asset.storage_path))];
  const signedUrlEntries = await Promise.all(
    uniquePaths.map(async (path) => {
      const { data } = await client.storage
        .from(PROJECT_ASSETS_BUCKET)
        .createSignedUrl(path, 60 * 60);
      return [path, data?.signedUrl ?? ""] as const;
    })
  );

  const urlMap = new Map<string, string>(signedUrlEntries);

  return projectRows.map((projectRow) => {
    const projectAssets = assetRows.filter((asset) => asset.project_id === projectRow.id);
    const getAssetUrl = (type: ProjectAssetType) =>
      urlMap.get(getLatestProjectAsset(projectAssets, type)?.storage_path ?? "") ?? "";

    const heroImageUrl = getAssetUrl("hero_image") || getAssetUrl("thumbnail") || "";
    const thumbnailUrl = getAssetUrl("thumbnail") || heroImageUrl;
    const tourUrl = getAssetUrl("tour_360") || heroImageUrl || thumbnailUrl;
    const floorPlanUrl = getAssetUrl("floor_plan");
    const attachmentUrl = getAssetUrl("attachment");

    const scenes: TourScene[] = tourUrl
      ? [fallbackScene(projectRow, tourUrl, preferredLanguage)]
      : heroImageUrl
        ? [fallbackScene(projectRow, heroImageUrl, preferredLanguage)]
        : [];

    return {
      id: projectRow.id,
      name: projectRow.project_name,
      location: projectRow.location,
      dateAdded: formatDateAdded(projectRow.created_at),
      thumbnailUrl,
      heroImageUrl,
      description: projectRow.description,
      architecturalNarrative: projectRow.architectural_narrative,
      specs: {
        beds: projectRow.beds,
        baths: projectRow.baths,
        livingArea: projectRow.living_area,
        acreage: projectRow.acreage,
        builtYear: projectRow.built_year,
        garage: projectRow.garage,
        amenities: projectRow.amenities,
        price: projectRow.price,
        brochureUrl: floorPlanUrl || undefined,
        attachmentUrl: attachmentUrl || floorPlanUrl || undefined,
      },
      category: projectRow.category,
      status: projectRow.status,
      assignedClientId: projectRow.client_user_id,
      tourEmbedUrl: projectRow.tour_embed_url || undefined,
      scenes,
    };
  });
};

const upsertProfileFromAuthUser = async (
  authUser: User,
  role: UserProfile["role"],
  overrides?: Partial<UserProfile>
): Promise<UserProfile> => {
  const client = ensureSupabase();
  const baseProfile = buildProfileFromAuthUser(authUser, role, overrides);

  const { data, error } = await client
    .from("profiles")
    .upsert(mapUserToProfileRow(baseProfile), { onConflict: "id" })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Unable to save your profile.");
  }

  return mapProfileRow(data as ProfileRow);
};

const getProfileForCurrentSession = async (): Promise<UserProfile | null> => {
  const client = ensureSupabase();
  const { data: authData, error: authError } = await client.auth.getUser();

  if (authError || !authData.user) {
    return null;
  }

  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (error) {
    return null;
  }

  if (!data) {
    try {
      return await upsertProfileFromAuthUser(authData.user, (authData.user.user_metadata?.role as UserProfile["role"]) || "client");
    } catch {
      return null;
    }
  }

  return mapProfileRow(data as ProfileRow);
};

export async function getCurrentPortalUser(): Promise<PortalAuthResult | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const profile = await getProfileForCurrentSession();
  if (!profile) return null;

  return {
    user: profile,
    mode: "supabase",
  };
}

export function subscribeToPortalAuthChanges(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  if (!isSupabaseConfigured || !supabase) {
    return () => undefined;
  }

  const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));
  return () => data.subscription.unsubscribe();
}

export async function loadPortalProjects(
  preferredMode: DataSourceMode,
  currentUser?: UserProfile | null
): Promise<PortalBootstrapData> {
  if (preferredMode === "mock") {
    return {
      projects: currentUser ? MOCK_PROJECTS.filter((project) => project.assignedClientId === currentUser.email) : MOCK_PROJECTS,
      mode: "mock",
    };
  }

  if (!currentUser) {
    return { projects: [], mode: "supabase" };
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before launching.");
  }

  const client = ensureSupabase();
  const projectsQuery = client.from("projects").select("*").order("created_at", { ascending: false });
  const scopedProjectsQuery =
    currentUser.role === "admin" ? projectsQuery : projectsQuery.eq("client_user_id", currentUser.id);

  const { data: projectData, error: projectError } = await scopedProjectsQuery;

  if (projectError || !projectData) {
    throw new Error(`Unable to load projects: ${projectError?.message ?? "unknown database error"}`);
  }

  const projectRows = projectData as ProjectRow[];
  const projectIds = projectRows.map((row) => row.id);

  if (projectIds.length === 0) {
    return { projects: [], mode: "supabase" };
  }

  const { data: assetData, error: assetError } = await client
    .from("project_assets")
    .select("*")
    .in("project_id", projectIds);

  if (assetError || !assetData) {
    throw new Error(`Unable to load project assets: ${assetError?.message ?? "unknown database error"}`);
  }

  return {
    projects: await buildLegacyProjects(projectRows, assetData as ProjectAssetRow[], currentUser.preferredLanguage),
    mode: "supabase",
  };
}

export async function authenticatePortalUser(email: string, password: string): Promise<PortalAuthResult | null> {
  const mockAuth = await buildMockAuthResult(email, password);
  if (mockAuth) {
    return mockAuth;
  }

  const client = ensureSupabase();
  const { data, error } = await client.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });

  if (error || !data.user) {
    return null;
  }

  const profile = await getProfileForCurrentSession();
  if (!profile) {
    throw new Error("Your account is missing a profile record.");
  }

  return {
    user: profile,
    mode: "supabase",
  };
}

export async function registerPortalUser(payload: SignUpPayload): Promise<SignUpResult> {
  const client = ensureSupabase();
  const normalizedEmail = normalizeEmail(payload.email);
  const normalizedPhone = normalizeEthiopianPhone(payload.phoneNumber);

  if (!isValidEthiopianPhone(normalizedPhone)) {
    throw new Error("Use an Ethiopian phone number in the format +251XXXXXXXXX.");
  }

  const { data, error } = await client.auth.signUp({
    email: normalizedEmail,
    password: payload.password,
    options: {
      data: {
        company: payload.company.trim(),
        phone_number: normalizedPhone,
      },
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message || "Unable to create your account.");
  }

  if (!data.session) {
    return {
      status: "needs_confirmation",
    };
  }

  const profile = await upsertProfileFromAuthUser(data.user, "client", {
    company: payload.company.trim(),
    phoneNumber: normalizedPhone,
    email: normalizedEmail,
  });

  return {
    status: "signed_in",
    user: profile,
  };
}

export async function signOutPortalUser() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}

export async function savePortalUserProfile(user: UserProfile): Promise<UserProfile> {
  if (!isSupabaseConfigured || !supabase) {
    if (allowMockAuth) {
      return user;
    }

    throw new Error("Supabase is not configured. Profile changes cannot be saved.");
  }

  const client = ensureSupabase();
  const { data, error } = await client
    .from("profiles")
    .update(mapUserToProfileRow(user))
    .eq("id", user.id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Unable to save your profile.");
  }

  return mapProfileRow(data as ProfileRow);
}

export async function sendPortalPasswordReset(email: string) {
  const client = ensureSupabase();
  const recoveryUrl = `${window.location.origin}/reset-password`;
  const { error } = await client.auth.resetPasswordForEmail(normalizeEmail(email), {
    redirectTo: recoveryUrl,
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("redirect") || message.includes("invalid") || message.includes("not allowed")) {
      throw new Error(
        `Supabase rejected the recovery redirect. Add ${recoveryUrl} to Authentication > URL Configuration > Redirect URLs.`
      );
    }

    throw new Error(`Unable to send recovery email: ${error.message}`);
  }
}

export async function updatePortalUserPassword({
  email,
  currentPassword,
  newPassword,
  requireCurrentPassword = true,
}: ChangePasswordInput) {
  const client = ensureSupabase();

  if (requireCurrentPassword) {
    if (!currentPassword) {
      throw new Error("Your current password is required.");
    }

    const { error: verifyError } = await client.auth.signInWithPassword({
      email: normalizeEmail(email),
      password: currentPassword,
    });

    if (verifyError) {
      throw new Error("Your current password is incorrect.");
    }
  }

  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function listAdminClients(): Promise<AdminClientSummary[]> {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("company", { ascending: true });

  if (error || !data) {
    throw new Error("Unable to load clients.");
  }

  return (data as ProfileRow[]).map((profile) => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    company: profile.company,
    phoneNumber: profile.phone_number,
    activeBuildCount: profile.active_build_count,
  }));
}

export async function listAdminProjects(): Promise<AdminProjectRecord[]> {
  const client = ensureSupabase();
  const [{ data: projectData, error: projectError }, { data: assetData, error: assetError }, clients] = await Promise.all([
    client.from("projects").select("*").order("created_at", { ascending: false }),
    client.from("project_assets").select("*"),
    listAdminClients(),
  ]);

  if (projectError || !projectData) {
    throw new Error("Unable to load projects.");
  }

  if (assetError || !assetData) {
    throw new Error("Unable to load project assets.");
  }

  const clientMap = new Map(clients.map((entry) => [entry.id, entry]));
  const assets = assetData as ProjectAssetRow[];

  return (projectData as ProjectRow[]).map((project) => ({
    project,
    client: clientMap.get(project.client_user_id) ?? null,
    assets: assets.filter((asset) => asset.project_id === project.id),
  }));
}

const uploadProjectAsset = async (projectId: string, clientUserId: string, assetType: ProjectAssetType, file: File) => {
  const client = ensureSupabase();
  const sanitizedName = file.name.replace(/\s+/g, "-").toLowerCase();
  const path = `${clientUserId}/${projectId}/${assetType}-${Date.now()}-${sanitizedName}`;

  const { error: uploadError } = await client.storage
    .from(PROJECT_ASSETS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(`Unable to upload ${assetType}.`);
  }

  const assetRow = {
    project_id: projectId,
    asset_type: assetType,
    storage_path: path,
    file_name: file.name,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
  };

  const { error: assetError } = await client.from("project_assets").insert(assetRow);
  if (assetError) {
    throw new Error(`Unable to save ${assetType} metadata.`);
  }
};

const replaceProjectAsset = async (projectId: string, clientUserId: string, assetType: ProjectAssetType, file: File) => {
  const client = ensureSupabase();
  const { data: existingAssetData, error: existingAssetError } = await client
    .from("project_assets")
    .select("*")
    .eq("project_id", projectId)
    .eq("asset_type", assetType);

  if (existingAssetError) {
    throw new Error(`Unable to check existing ${assetType} files: ${existingAssetError.message}`);
  }

  await uploadProjectAsset(projectId, clientUserId, assetType, file);

  const existingAssets = (existingAssetData as ProjectAssetRow[] | null) ?? [];
  if (existingAssets.length === 0) {
    return;
  }

  const assetIds = existingAssets.map((asset) => asset.id);
  const storagePaths = existingAssets.map((asset) => asset.storage_path);

  const { error: deleteMetadataError } = await client
    .from("project_assets")
    .delete()
    .in("id", assetIds);

  if (deleteMetadataError) {
    throw new Error(`Uploaded the new ${assetType}, but failed to remove older metadata: ${deleteMetadataError.message}`);
  }

  const { error: deleteStorageError } = await client.storage
    .from(PROJECT_ASSETS_BUCKET)
    .remove(storagePaths);

  if (deleteStorageError) {
    throw new Error(`Uploaded the new ${assetType}, but failed to remove older files: ${deleteStorageError.message}`);
  }
};

export async function createAdminProject(input: CreateProjectInput): Promise<void> {
  const client = ensureSupabase();
  const projectPayload = {
    client_user_id: input.clientUserId,
    company_name: input.companyName,
    project_name: input.projectName,
    location: input.location,
    category: input.category,
    status: input.status,
    units: input.units,
    description: input.description,
    architectural_narrative: input.architecturalNarrative,
    notes: input.notes,
    beds: input.beds,
    baths: input.baths,
    living_area: input.livingArea,
    acreage: input.acreage,
    built_year: input.builtYear,
    garage: input.garage,
    amenities: input.amenities,
    price: input.price,
    tour_embed_url: normalizeTourEmbedUrl(input.tourEmbedUrl),
    showcase_scene_name: input.showcaseSceneName,
    showcase_scene_category: input.showcaseSceneCategory,
    showcase_scene_description: input.showcaseSceneDescription,
  };

  const insertProject = async (payload: Record<string, unknown>) =>
    client.from("projects").insert(payload).select("id").single();

  let { data, error } = await insertProject(projectPayload);

  if (error && error.message.includes("tour_embed_url")) {
    const { tour_embed_url: _tourEmbedUrl, ...legacyPayload } = projectPayload;
    ({ data, error } = await insertProject(legacyPayload));
  }

  if (error || !data) {
    throw new Error(`Unable to create the project: ${error?.message ?? "unknown database error"}`);
  }

  const projectId = (data as { id: string }).id;
  const uploads = Object.entries(input.files).filter((entry): entry is [ProjectAssetType, File] => Boolean(entry[1]));

  for (const [assetType, file] of uploads) {
    await replaceProjectAsset(projectId, input.clientUserId, assetType, file);
  }
}

export async function updateAdminProject(projectId: string, input: CreateProjectInput): Promise<void> {
  const client = ensureSupabase();
  const projectPayload = {
    client_user_id: input.clientUserId,
    company_name: input.companyName,
    project_name: input.projectName,
    location: input.location,
    category: input.category,
    status: input.status,
    units: input.units,
    description: input.description,
    architectural_narrative: input.architecturalNarrative,
    notes: input.notes,
    beds: input.beds,
    baths: input.baths,
    living_area: input.livingArea,
    acreage: input.acreage,
    built_year: input.builtYear,
    garage: input.garage,
    amenities: input.amenities,
    price: input.price,
    tour_embed_url: normalizeTourEmbedUrl(input.tourEmbedUrl),
    showcase_scene_name: input.showcaseSceneName,
    showcase_scene_category: input.showcaseSceneCategory,
    showcase_scene_description: input.showcaseSceneDescription,
  };

  const { error } = await client.from("projects").update(projectPayload).eq("id", projectId);
  if (error) {
    throw new Error(`Unable to update the project: ${error.message}`);
  }

  const uploads = Object.entries(input.files).filter((entry): entry is [ProjectAssetType, File] => Boolean(entry[1]));
  for (const [assetType, file] of uploads) {
    await replaceProjectAsset(projectId, input.clientUserId, assetType, file);
  }
}
