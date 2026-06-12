import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "../components/DashboardLayout";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import { FileText, Download, Calendar, Shield, AlertTriangle, Monitor, TrendingUp } from "lucide-react";

type Report = {
  id: number;
  title: string;
  period: string;
  score: number;
  devicesScanned: number;
  alertsTotal: number;
  alertsResolved: number;
  criticalFindings: number;
  createdAt: string;
};

function ScoreBadge({ score, c }: { score: number; c: any }) {
  const color = score >= 80 ? c.green : score >= 60 ? c.orange : c.red;
  const label = score >= 80 ? "Sécurisé" : score >= 60 ? "Attention" : "Critique";
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "16px 24px", borderRadius: 12,
      background: `${color}12`, border: `2px solid ${color}40`,
    }}>
      <div style={{
        fontSize: 40, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif",
        color, lineHeight: 1,
      }}>{score}</div>
      <div style={{ fontSize: 12, color, fontWeight: 600, marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>/ 100</div>
    </div>
  );
}

export default function Reports() {
  const { theme } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;

  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await fetch("/api/reports");
      const data = await res.json() as { reports: Report[] };
      return data.reports;
    },
  });

  const reports = data ?? [];
  const latest = reports[0];

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 700, color: c.textPrimary, margin: 0 }}>
              Rapports de sécurité
            </h1>
            <p style={{ fontSize: 14, color: c.textMuted, marginTop: 4 }}>
              Historique des analyses et évaluations de votre réseau
            </p>
          </div>
        </div>

        {/* Latest report highlight */}
        {latest && (
          <div style={{
            background: `linear-gradient(135deg, ${c.bgCard} 0%, ${c.bgElevated} 100%)`,
            border: `1px solid ${c.accent}40`,
            borderRadius: 20, padding: 28, marginBottom: 28,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -30, right: -30, width: 120, height: 120,
              borderRadius: "50%", background: `${c.accent}08`,
            }} />
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: c.accentDim,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <TrendingUp size={16} color={c.accent} />
                  </div>
                  <span style={{ fontSize: 12, color: c.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Dernier rapport
                  </span>
                </div>
                <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, fontWeight: 700, color: c.textPrimary, margin: "0 0 6px" }}>
                  {latest.title}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                  <Calendar size={13} color={c.textMuted} />
                  <span style={{ fontSize: 13, color: c.textMuted }}>
                    {new Date(latest.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { icon: Monitor, label: "Appareils scannés", value: latest.devicesScanned, color: c.accent },
                    { icon: AlertTriangle, label: "Alertes détectées", value: latest.alertsTotal, color: c.orange },
                    { icon: Shield, label: "Résolues", value: latest.alertsResolved, color: c.green },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: c.bg, borderRadius: 10, padding: "12px 14px",
                      border: `1px solid ${c.border}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <stat.icon size={14} color={stat.color} />
                        <span style={{ fontSize: 11, color: c.textMuted }}>{stat.label}</span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: stat.color }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <ScoreBadge score={latest.score} c={c} />
                <button style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: c.accentDim, border: `1px solid ${c.accent}40`,
                  color: c.accent, cursor: "pointer",
                }}>
                  <Download size={14} /> Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All reports */}
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 18, fontWeight: 700, color: c.textPrimary, margin: "0 0 16px" }}>
          Historique complet
        </h2>

        {isLoading ? (
          <div style={{
            background: c.bgCard, border: `1px solid ${c.border}`,
            borderRadius: 12, padding: 48, textAlign: "center", color: c.textMuted,
          }}>Chargement...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reports.map((report, i) => {
              const scoreColor = report.score >= 80 ? c.green : report.score >= 60 ? c.orange : c.red;
              const resolveRate = report.alertsTotal > 0
                ? Math.round((report.alertsResolved / report.alertsTotal) * 100)
                : 100;

              return (
                <div key={report.id} style={{
                  background: c.bgCard, border: `1px solid ${c.border}`,
                  borderRadius: 14, padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: 20,
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${c.accent}40`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}
                >
                  {/* Icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `${scoreColor}18`, border: `1px solid ${scoreColor}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FileText size={22} color={scoreColor} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: c.textPrimary }}>{report.title}</span>
                      {report.criticalFindings > 0 && (
                        <span style={{
                          padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: `${c.red}18`, color: c.red,
                        }}>{report.criticalFindings} critique{report.criticalFindings > 1 ? "s" : ""}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: c.textMuted }}>
                        <Calendar size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
                        {new Date(report.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                      </span>
                      <span style={{ fontSize: 12, color: c.textMuted }}>{report.devicesScanned} appareils</span>
                      <span style={{ fontSize: 12, color: c.textMuted }}>{report.alertsTotal} alertes</span>
                      <span style={{ fontSize: 12, color: c.green }}>{resolveRate}% résolues</span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: c.border, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 2,
                        width: `${resolveRate}%`,
                        background: `linear-gradient(90deg, ${c.accent}, ${c.green})`,
                        transition: "width 0.5s",
                      }} />
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: scoreColor }}>{report.score}</div>
                    <div style={{ fontSize: 11, color: c.textMuted }}>/100</div>
                  </div>

                  {/* Download */}
                  <button style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: c.bgElevated, border: `1px solid ${c.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: c.textMuted,
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.accentDim; e.currentTarget.style.color = c.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.background = c.bgElevated; e.currentTarget.style.color = c.textMuted; }}
                  >
                    <Download size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
