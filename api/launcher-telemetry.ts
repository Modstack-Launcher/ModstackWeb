import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const EVENTS = new Set(["install", "heartbeat", "session_start", "session_end"]);

type TelemetryBody = {
  event?: unknown;
  installationId?: unknown;
  sessionId?: unknown;
  version?: unknown;
  os?: unknown;
  arch?: unknown;
  durationSeconds?: unknown;
};

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function normalize(value: unknown, maximum: number, fallback = "unknown") {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim().replace(/[^a-zA-Z0-9._ -]/g, "").slice(0, maximum);
  return cleaned || fallback;
}

function hashIdentifier(value: string, salt: string) {
  return createHmac("sha256", salt).update(value).digest("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Modstack-Telemetry-Key");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const expectedKey = process.env.TELEMETRY_INGEST_TOKEN?.trim() || "";
  const receivedKey = typeof req.headers["x-modstack-telemetry-key"] === "string" ? req.headers["x-modstack-telemetry-key"] : "";
  if (!expectedKey || !safeEqual(receivedKey, expectedKey)) return res.status(401).json({ error: "Invalid telemetry key" });

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const hashSalt = process.env.TELEMETRY_HASH_SALT?.trim();
  if (!supabaseUrl || !serviceRoleKey || !hashSalt) return res.status(503).json({ error: "Telemetry is not configured" });

  let body: TelemetryBody;
  try {
    body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as TelemetryBody;
  } catch {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Invalid telemetry payload" });
  const event = typeof body.event === "string" ? body.event : "";
  const installationId = typeof body.installationId === "string" ? body.installationId.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  if (!EVENTS.has(event) || installationId.length < 8 || installationId.length > 128) {
    return res.status(400).json({ error: "Invalid telemetry payload" });
  }
  if (event !== "install" && (sessionId.length < 8 || sessionId.length > 128)) {
    return res.status(400).json({ error: "A valid sessionId is required" });
  }

  const duration = typeof body.durationSeconds === "number" && Number.isFinite(body.durationSeconds)
    ? Math.max(0, Math.min(Math.round(body.durationSeconds), 60 * 60 * 24))
    : null;
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.rpc("record_launcher_event", {
    p_installation_hash: hashIdentifier(installationId, hashSalt),
    p_session_hash: sessionId ? hashIdentifier(sessionId, hashSalt) : null,
    p_event: event,
    p_app_version: normalize(body.version, 32),
    p_os: normalize(body.os, 32),
    p_arch: normalize(body.arch, 24),
    p_duration_seconds: duration,
  });
  if (error) {
    console.error("Telemetry write error", error);
    return res.status(500).json({ error: "Unable to record telemetry" });
  }
  return res.status(202).json({ accepted: true });
}
