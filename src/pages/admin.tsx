import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Clock3,
  Download,
  Home,
  Laptop,
  Play,
  RefreshCw,
  Server,
  ShieldAlert,
  Users,
} from "lucide-react";
import { getAccessToken, getCurrentUser, initSession } from "../auth";
import iconImg from "../images/placeholder.png";
import titleImg from "../images/modstack-title.png";
import "../styles/admin.css";

type RangeDays = 7 | 30 | 90;

type DailyPoint = {
  date: string;
  installations: number;
  activePlayers: number;
  sessions: number;
};

type BreakdownItem = {
  name: string;
  count: number;
  percentage: number;
};

type TelemetryStats = {
  overview: {
    totalInstallations: number;
    activePlayers: number;
    dailyActivePlayers: number;
    monthlyActivePlayers: number;
    sessionsToday: number;
    averageSessionMinutes: number;
  };
  series: DailyPoint[];
  platforms: BreakdownItem[];
  versions: BreakdownItem[];
};

type GithubStats = {
  totalDownloads: number;
  latestTag: string | null;
  releaseCount: number;
  assets: Array<{ name: string; downloads: number; tag: string }>;
};

type AdminStatsResponse = {
  generatedAt: string;
  github: GithubStats | null;
  telemetry: TelemetryStats | null;
  telemetryStatus: "connected" | "not_configured" | "error";
  telemetryMessage?: string;
};

const numberFormatter = new Intl.NumberFormat("es-CR", { maximumFractionDigits: 1 });

function formatNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? numberFormatter.format(value) : "—";
}

function MiniChart({ points }: { points: DailyPoint[] }) {
  const values = points.map((point) => point.activePlayers);
  const maximum = Math.max(...values, 1);
  const coordinates = values.map((value, index) => {
    const x = values.length <= 1 ? 50 : (index / (values.length - 1)) * 100;
    const y = 46 - (value / maximum) * 40;
    return `${x},${y}`;
  }).join(" ");

  if (!points.length) return <div className="admin-empty-chart">Sin datos en este periodo</div>;

  return (
    <div className="admin-chart" aria-label="Jugadores activos por día">
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" role="img">
        <defs>
          <linearGradient id="adminChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.36" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,50 ${coordinates} 100,50`} fill="url(#adminChartFill)" />
        <polyline points={coordinates} fill="none" stroke="#38bdf8" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="admin-chart-labels">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function Breakdown({ title, icon: Icon, items }: { title: string; icon: typeof Laptop; items: BreakdownItem[] }) {
  const maximum = Math.max(...items.map((item) => item.count), 1);
  return (
    <section className="admin-panel admin-breakdown">
      <div className="admin-panel-heading"><Icon size={17} /><h2>{title}</h2></div>
      {items.length ? items.slice(0, 7).map((item) => (
        <div className="admin-breakdown-row" key={item.name}>
          <div><strong>{item.name || "Desconocido"}</strong><span>{formatNumber(item.count)}</span></div>
          <div className="admin-progress"><i style={{ width: `${(item.count / maximum) * 100}%` }} /></div>
        </div>
      )) : <p className="admin-muted">Todavía no hay datos.</p>}
    </section>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [range, setRange] = useState<RangeDays>(30);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [userId, setUserId] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");
    setForbidden(false);
    const user = getCurrentUser() ?? await initSession();
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    setUserId(user.id);
    const token = getAccessToken();
    try {
      const response = await fetch(`/api/admin-stats?days=${range}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json() as AdminStatsResponse & { error?: string };
      if (response.status === 403) {
        setForbidden(true);
        return;
      }
      if (!response.ok) throw new Error(data.error || "No se pudieron cargar las estadísticas.");
      setStats(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  }, [navigate, range]);

  useEffect(() => {
    document.title = "Admin Analytics - Modstack";
    void loadStats();
    return () => { document.title = "Modstack"; };
  }, [loadStats]);

  const metrics = useMemo(() => {
    const telemetry = stats?.telemetry?.overview;
    return [
      { label: "Descargas GitHub", value: formatNumber(stats?.github?.totalDownloads), helper: stats?.github?.latestTag ?? "Todos los releases", icon: Download, tone: "blue" },
      { label: "Instalaciones únicas", value: formatNumber(telemetry?.totalInstallations), helper: "IDs anónimos registrados", icon: Server, tone: "violet" },
      { label: "Activos ahora", value: formatNumber(telemetry?.activePlayers), helper: "Últimos 5 minutos", icon: Activity, tone: "green" },
      { label: "Jugadores diarios", value: formatNumber(telemetry?.dailyActivePlayers), helper: "DAU de hoy", icon: Users, tone: "cyan" },
      { label: "Sesiones hoy", value: formatNumber(telemetry?.sessionsToday), helper: "Inicios del launcher", icon: Play, tone: "orange" },
      { label: "Duración media", value: telemetry ? `${formatNumber(telemetry.averageSessionMinutes)} min` : "—", helper: "Sesiones finalizadas", icon: Clock3, tone: "pink" },
    ];
  }, [stats]);

  if (forbidden) {
    return (
      <main className="admin-gate">
        <div className="admin-gate-card">
          <ShieldAlert size={42} />
          <h1>Acceso restringido</h1>
          <p>Tu cuenta inició sesión correctamente, pero no está incluida en <code>MODSTACK_ADMIN_USER_IDS</code>.</p>
          <div className="admin-user-id"><span>Tu ID</span><code>{userId}</code></div>
          <Link to="/">Volver al inicio</Link>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-root">
      <header className="admin-header">
        <Link to="/" className="admin-brand"><img src={iconImg} alt="" /><img src={titleImg} alt="Modstack" /></Link>
        <div className="admin-private"><i />Panel privado</div>
        <Link to="/" className="admin-home"><Home size={15} />Inicio</Link>
      </header>

      <main className="admin-main">
        <div className="admin-title-row">
          <div><span>Launcher analytics</span><h1>Estado de Modstack</h1><p>Instalaciones, actividad y adopción por versión en un solo lugar.</p></div>
          <div className="admin-actions">
            <div className="admin-range" aria-label="Rango de fechas">
              {([7, 30, 90] as RangeDays[]).map((days) => <button key={days} className={range === days ? "active" : ""} onClick={() => setRange(days)}>{days}d</button>)}
            </div>
            <button className="admin-refresh" onClick={() => void loadStats()} disabled={loading}><RefreshCw size={15} className={loading ? "spin" : ""} />Actualizar</button>
          </div>
        </div>

        {error && <div className="admin-alert error"><ShieldAlert size={18} /><div><strong>No se pudo abrir el panel</strong><span>{error}</span>{userId && <code className="admin-inline-id">Tu ID: {userId}</code>}</div></div>}
        {stats?.telemetryStatus !== "connected" && !loading && !error && (
          <div className="admin-alert"><Server size={18} /><div><strong>Telemetría pendiente de conexión</strong><span>{stats?.telemetryMessage || "Configura Supabase y conecta el endpoint del launcher para activar estas métricas."}</span></div></div>
        )}

        <section className="admin-metrics" aria-busy={loading}>
          {metrics.map(({ label, value, helper, icon: Icon, tone }) => (
            <article className={`admin-metric ${tone}`} key={label}>
              <div className="admin-metric-icon"><Icon size={19} /></div>
              <span>{label}</span><strong>{loading ? "···" : value}</strong><small>{helper}</small>
            </article>
          ))}
        </section>

        <div className="admin-grid-main">
          <section className="admin-panel admin-activity-panel">
            <div className="admin-panel-heading"><BarChart3 size={18} /><div><h2>Actividad diaria</h2><p>Jugadores únicos con sesión registrada</p></div><strong>{formatNumber(stats?.telemetry?.overview.monthlyActivePlayers)} MAU</strong></div>
            <MiniChart points={stats?.telemetry?.series ?? []} />
          </section>
          <section className="admin-panel admin-release-panel">
            <div className="admin-panel-heading"><Download size={18} /><div><h2>Assets más descargados</h2><p>Datos públicos de GitHub Releases</p></div></div>
            {(stats?.github?.assets ?? []).slice(0, 6).map((asset) => (
              <div className="admin-asset" key={`${asset.tag}-${asset.name}`}><div><strong>{asset.name}</strong><span>{asset.tag}</span></div><b>{formatNumber(asset.downloads)}</b></div>
            ))}
            {!loading && !stats?.github?.assets.length && <p className="admin-muted">GitHub no devolvió datos.</p>}
          </section>
        </div>

        <div className="admin-grid-bottom">
          <Breakdown title="Sistemas operativos" icon={Laptop} items={stats?.telemetry?.platforms ?? []} />
          <Breakdown title="Versiones activas" icon={Server} items={stats?.telemetry?.versions ?? []} />
        </div>

        <footer className="admin-footer">
          <span><i className={stats?.telemetryStatus === "connected" ? "online" : ""} />{stats?.telemetryStatus === "connected" ? "Telemetría conectada" : "Telemetría desconectada"}</span>
          <span>{stats?.generatedAt ? `Actualizado ${new Date(stats.generatedAt).toLocaleString("es-CR")}` : "Esperando datos"}</span>
        </footer>
      </main>
    </div>
  );
}
