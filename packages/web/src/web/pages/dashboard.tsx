import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import { Shield, Monitor, Bell, AlertTriangle, TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ScoreRing({ score, c }: { score: number; c: any }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayed(score); clearInterval(timer); }
      else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const color = displayed >= 80 ? c.green : displayed >= 60 ? c.orange : c.red;
  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}>
      <svg width={200} height={200} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={100} cy={100} r={radius} fill="none" stroke={c.border} strokeWidth={12} />
        <circle cx={100} cy={100} r={radius} fill="none" stroke={color} strokeWidth={12}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s, stroke 0.5s", filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 44, fontWeight: 800, color, lineHeight: 1 }}>{displayed}</span>
        <span style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>/ 100</span>
        <span style={{ fontSize: 12, color, fontWeight: 600, marginTop: 4 }}>
          {displayed >= 80 ? "Sécurisé" : displayed >= 60 ? "Attention" : "Danger"}
        </span>
      </div>
    </div>
  );
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = 40;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id={`g${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#g${color.replace("#", "")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.dashboard.$get()).json(),
    refetchInterval: 30000,
  });

  const stats = data?.networkStats ?? [];
  const inbound = stats.map((s: any) => s.inboundMbps);
  const outbound = stats.map((s: any) => s.outboundMbps);

  if (isLoading) return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <div style={{ textAlign: "center" }}>
          <Activity size={40} color={c.accent} style={{ animation: "spin 1s linear infinite" }} />
          <div style={{ color: c.textSecondary, marginTop: 12 }}>Analyse du réseau...</div>
        </div>
      </div>
    </DashboardLayout>
  );

  const score = data?.score ?? 0;
  const scoreColor = score >= 80 ? c.green : score >= 60 ? c.orange : c.red;

  return (
    <DashboardLayout>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
        {/* Score card */}
        <div style={{
          background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 16, padding: 28,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{ fontSize: 13, color: c.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Score de sécurité</div>
          <ScoreRing score={score} c={c} />
          <div style={{
            marginTop: 20, padding: "8px 16px", borderRadius: 8,
            background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`,
            fontSize: 13, color: scoreColor, fontWeight: 600,
          }}>
            {score >= 80 ? "✓ Réseau sécurisé" : score >= 60 ? "⚠ Attention requise" : "✗ Action urgente"}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            {
              icon: Monitor, label: "Appareils en ligne",
              value: data?.devices.online, sub: `${data?.devices.suspicious ?? 0} suspect(s)`,
              color: c.accent, trend: data?.devices.suspicious > 0 ? "down" : "up",
              chart: inbound,
            },
            {
              icon: Bell, label: "Alertes ouvertes",
              value: data?.alerts.open, sub: `${data?.alerts.critical ?? 0} critique(s)`,
              color: data?.alerts.critical > 0 ? c.red : c.orange, trend: "down",
              chart: outbound,
            },
            {
              icon: Activity, label: "Trafic entrant",
              value: `${stats[stats.length - 1]?.inboundMbps ?? 0} Mb/s`,
              sub: "Moyenne 24h", color: c.green, trend: "up",
              chart: inbound,
            },
            {
              icon: Shield, label: "Requêtes bloquées",
              value: stats.reduce((acc: number, s: any) => acc + s.blockedRequests, 0),
              sub: "Dernières 24h", color: c.purple, trend: "up",
              chart: outbound,
            },
          ].map(({ icon: Icon, label, value, sub, color, chart }) => (
            <div key={label} style={{
              background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 16, padding: 20,
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} color={color} />
                </div>
                <MiniChart data={chart} color={color} />
              </div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 800, color: c.textPrimary }}>{value}</div>
              <div>
                <div style={{ fontSize: 13, color: c.textSecondary, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 12, color: c.textMuted }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic chart */}
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16, color: c.textPrimary }}>Trafic réseau — 24h</div>
            <div style={{ fontSize: 13, color: c.textMuted }}>Trafic entrant et sortant en Mb/s</div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 3, background: c.accent, borderRadius: 2 }} />
              <span style={{ color: c.textSecondary }}>Entrant</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 3, background: c.purple, borderRadius: 2 }} />
              <span style={{ color: c.textSecondary }}>Sortant</span>
            </div>
          </div>
        </div>

        {stats.length > 0 && (
          <div style={{ position: "relative", height: 160 }}>
            {(() => {
              const maxVal = Math.max(...inbound, ...outbound);
              const w = 100, h = 100;
              const pts = (arr: number[]) => arr.map((v, i) => {
                const x = (i / (arr.length - 1)) * w;
                const y = h - (v / maxVal) * h;
                return `${x}%,${y}%`;
              }).join(" ");

              return (
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.accent} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={c.accent} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gout" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.purple} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={c.purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <polyline points={`0%,100% ${pts(inbound)} 100%,100%`} fill="url(#gin)" />
                  <polyline points={pts(inbound)} fill="none" stroke={c.accent} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                  <polyline points={`0%,100% ${pts(outbound)} 100%,100%`} fill="url(#gout)" />
                  <polyline points={pts(outbound)} fill="none" stroke={c.purple} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                </svg>
              );
            })()}
          </div>
        )}
      </div>

      {/* Recent alerts */}
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16, color: c.textPrimary }}>Alertes récentes</div>
          <a href="/alerts" style={{ fontSize: 13, color: c.accent, textDecoration: "none" }}>Voir tout →</a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(data?.recentAlerts ?? []).map((alert: any) => {
            const sevColor = alert.severity === "critical" ? c.red : alert.severity === "high" ? c.orange : alert.severity === "medium" ? c.accent : c.textMuted;
            return (
              <div key={alert.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 10,
                background: c.bgElevated, border: `1px solid ${c.border}`,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: sevColor, flexShrink: 0,
                  boxShadow: alert.status === "open" ? `0 0 6px ${sevColor}` : "none",
                  animation: alert.status === "open" && alert.severity === "critical" ? "pulse 1.5s infinite" : "none",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{alert.title}</div>
                  <div style={{ fontSize: 12, color: c.textMuted }}>{alert.sourceIp ?? "Système"}</div>
                </div>
                <div style={{
                  padding: "3px 10px", borderRadius: 20,
                  background: `${sevColor}15`, border: `1px solid ${sevColor}30`,
                  fontSize: 11, color: sevColor, fontWeight: 600, textTransform: "uppercase", flexShrink: 0,
                }}>{alert.severity}</div>
                <div style={{ fontSize: 11, color: c.textMuted, flexShrink: 0, fontFamily: "JetBrains Mono, monospace" }}>
                  {new Date(alert.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
