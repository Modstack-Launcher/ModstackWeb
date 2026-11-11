import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

type AuthenticatedUser = { id?: unknown; user?: { id?: unknown } };
type GithubAsset = { name?: unknown; download_count?: unknown };
type GithubRelease = { tag_name?: unknown; assets?: unknown };

const INSTALLER_PATTERN = /\.(?:exe|dmg|deb|rpm|appimage)$/i;

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseDays(value: string | undefined) {
  const days = Number(value);
  return days === 7 || days === 90 ? days : 30;
}

async function verifyAdmin(authorization: string) {
  const apiBase = process.env.MODSTACK_API_URL?.trim() || "https://api.modstack.online";
  const response = await fetch(`${apiBase}/users/me`, {
    headers: { Authorization: authorization, Accept: "application/json" },
  });
  if (!response.ok) return { status: 401 as const, userId: "" };
  const user = await response.json() as AuthenticatedUser;
  const rawUserId = user.id ?? user.user?.id;
  const userId = typeof rawUserId === "string" ? rawUserId : "";
  const adminIds = new Set((process.env.MODSTACK_ADMIN_USER_IDS || "").split(",").map((id) => id.trim()).filter(Boolean));
  if (!adminIds.size) return { status: 503 as const, userId };
  if (!userId || !adminIds.has(userId)) return { status: 403 as const, userId };
  return { status: 200 as const, userId };
}

async function getGithubStats() {
  const response = await fetch("https://api.github.com/repos/Modstack-Launcher/ModstackApp/releases?per_page=100", {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "Modstack-Web-Admin",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  const releases = await response.json() as GithubRelease[];
  const assets = releases.flatMap((release) => {
    const tag = typeof release.tag_name === "string" ? release.tag_name : "unknown";
    if (!Array.isArray(release.assets)) return [];
    return release.assets.flatMap((assetValue) => {
      const asset = assetValue as GithubAsset;
      const name = typeof asset.name === "string" ? asset.name : "";
      const downloads = typeof asset.download_count === "number" ? asset.download_count : 0;
      return INSTALLER_PATTERN.test(name) ? [{ name, downloads, tag }] : [];
    });
  }).sort((a, b) => b.downloads - a.downloads);

  return {
    totalDownloads: assets.reduce((sum, asset) => sum + asset.downloads, 0),
    latestTag: typeof releases[0]?.tag_name === "string" ? releases[0].tag_name : null,
    releaseCount: releases.length,
    assets,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  res.setHeader("Cache-Control", "private, no-store");

  const authorization = req.headers.authorization || "";
  if (!authorization.startsWith("Bearer ")) return res.status(401).json({ error: "Authentication required" });

  try {
    const access = await verifyAdmin(authorization);
    if (access.status === 503) return res.status(503).json({ error: "MODSTACK_ADMIN_USER_IDS is not configured" });
    if (access.status !== 200) return res.status(access.status).json({ error: access.status === 403 ? "Admin access required" : "Invalid session" });

    const days = parseDays(firstQueryValue(req.query.days));
    const githubPromise = getGithubStats().catch(() => null);
    const supabaseUrl = process.env.SUPABASE_URL?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(200).json({
        generatedAt: new Date().toISOString(),
        github: await githubPromise,
        telemetry: null,
        telemetryStatus: "not_configured",
        telemetryMessage: "Añade SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel para activar la telemetría.",
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const [{ data, error }, github] = await Promise.all([
      supabase.rpc("get_launcher_admin_stats", { p_days: days }),
      githubPromise,
    ]);

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      github,
      telemetry: error ? null : data,
      telemetryStatus: error ? "error" : "connected",
      ...(error ? { telemetryMessage: "La base de datos no tiene la migración de telemetría o no está disponible." } : {}),
    });
  } catch (error) {
    console.error("Admin stats error", error);
    return res.status(502).json({ error: "Unable to load admin statistics" });
  }
}
