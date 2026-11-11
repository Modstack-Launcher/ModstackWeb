# Modstack launcher telemetry

The private `/admin` dashboard combines public GitHub download counts with anonymous launcher telemetry. No Minecraft username, Microsoft account, email address, hardware identifier, IP address, or world/mod list should be sent.

## Server setup

1. Run `supabase/migrations/20261110000000_launcher_telemetry.sql` in the selected Supabase project.
2. Configure the variables from `.env.example` in Vercel.
3. Add your Modstack account ID to `MODSTACK_ADMIN_USER_IDS`. Multiple IDs are comma-separated.
4. Use a long random value for `TELEMETRY_HASH_SALT` and another for `TELEMETRY_INGEST_TOKEN`.
5. Redeploy the website and open `/admin` while signed into an allowed Modstack account.

## Launcher integration

The launcher should create and persist a random UUID on first run. This is the `installationId`; it must not be derived from hardware. Create a new random `sessionId` every time the launcher starts.

Send events to:

```text
POST https://modstack.online/api/launcher-telemetry
Content-Type: application/json
X-Modstack-Telemetry-Key: <TELEMETRY_INGEST_TOKEN>
```

Installation/first run:

```json
{
  "event": "install",
  "installationId": "random-persistent-uuid",
  "version": "1.2.8",
  "os": "windows",
  "arch": "x64"
}
```

Launcher start:

```json
{
  "event": "session_start",
  "installationId": "random-persistent-uuid",
  "sessionId": "random-session-uuid",
  "version": "1.2.8",
  "os": "windows",
  "arch": "x64"
}
```

While open, send a `heartbeat` with the same IDs every 2–3 minutes. Send `session_end` when the application closes and include `durationSeconds` when available.

## Privacy requirements

- Make telemetry optional or provide a clear opt-out in launcher settings.
- Disclose the collected fields and retention period in the public privacy policy before enabling collection.
- Rotate the ingest token if it is abused. It is an abuse barrier, not a secret once distributed in a desktop application.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `TELEMETRY_HASH_SALT` only in Vercel; never bundle them with the launcher or website client.
