import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import { AlertTriangle, AlertOctagon, Info, CheckCircle2, Filter, RefreshCw } from "lucide-react";
import { useState } from "react";

type Alert = {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  deviceIp: string;
  createdAt: string;
};

function severityConfig(severity: string, c: any) {
  switch (severity) {
    case "critical": return { color: c.red, bg: `${c.red}18`, icon: AlertOctagon, label: "Critique" };
    case "high":     return { color: c.orange, bg: `${c.orange}18`, icon: AlertTriangle, label: "Élevée" };
    case "medium":   return { color: "#F59E0B", bg: "#F59E0B18", icon: AlertTriangle, label: "Moyenne" };
    default:         return { color: c.accent, bg: c.accentDim, icon: Info, label: "Faible" };
  }
}

export default function Alerts() {
  const { theme } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;
  const qc = useQueryClient();
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [resolving, setResolving] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["alerts", severityFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (severityFilter !== "all") params.set("severity", severityFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/alerts?${params.toString()}`);
      const data = await res.json() as { alerts: Alert[] };
      return data.alerts;
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/alerts/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
      setResolving(null);
    },
  });

  const alerts = data ?? [];
  const critical = alerts.filter(a => a.severity === "critical").length;
  const open = alerts.filter(a => a.status === "open").length;

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 700, color: c.textPrimary, margin: 0 }}>
              Alertes de sécurité
            </h1>
            <p style={{ fontSize: 14, color: c.textMuted, marginTop: 4 }}>
              {open} alerte{open !== 1 ? "s" : ""} ouverte{open !== 1 ? "s" : ""} · {critical} critique{critical !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ["alerts"] })}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 8,
              background: c.accentDim, border: `1px solid ${c.accent}40`,
              color: c.accent, cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}
          >
            <RefreshCw size={15} /> Actualiser
          </button>
        </div>

        {/* Stats */}
        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total", value: alerts.length, color: c.textPrimary },
              { label: "Critiques", value: critical, color: c.red },
              { label: "Ouvertes", value: open, color: c.orange },
              { label: "Résolues", value: alerts.filter(a => a.status === "resolved").length, color: c.green },
            ].map(stat => (
              <div key={stat.label} style={{
                background: c.bgCard, border: `1px solid ${c.border}`,
                borderRadius: 12, padding: "16px 20px",
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 24, marginBottom: 20, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={14} color={c.textMuted} />
            <span style={{ fontSize: 13, color: c.textMuted }}>Sévérité :</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "critical", "high", "medium", "low"].map(f => (
                <button key={f} onClick={() => setSeverityFilter(f)} style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: severityFilter === f ? c.accent : c.bgCard,
                  color: severityFilter === f ? "#fff" : c.textSecondary,
                  border: `1px solid ${severityFilter === f ? c.accent : c.border}`,
                  transition: "all 0.2s",
                }}>
                  {{ all: "Toutes", critical: "Critique", high: "Élevée", medium: "Moyenne", low: "Faible" }[f]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: c.textMuted }}>Statut :</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "open", "resolved"].map(f => (
                <button key={f} onClick={() => setStatusFilter(f)} style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: statusFilter === f ? c.accent : c.bgCard,
                  color: statusFilter === f ? "#fff" : c.textSecondary,
                  border: `1px solid ${statusFilter === f ? c.accent : c.border}`,
                  transition: "all 0.2s",
                }}>
                  {{ all: "Tous", open: "Ouvertes", resolved: "Résolues" }[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alert list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {isLoading ? (
            <div style={{
              background: c.bgCard, border: `1px solid ${c.border}`,
              borderRadius: 12, padding: 48, textAlign: "center", color: c.textMuted,
            }}>Chargement...</div>
          ) : alerts.length === 0 ? (
            <div style={{
              background: c.bgCard, border: `1px solid ${c.border}`,
              borderRadius: 12, padding: 48, textAlign: "center",
            }}>
              <CheckCircle2 size={40} color={c.green} style={{ margin: "0 auto 12px" }} />
              <div style={{ color: c.textPrimary, fontWeight: 600 }}>Aucune alerte</div>
              <div style={{ color: c.textMuted, fontSize: 14, marginTop: 4 }}>Tout est sous contrôle</div>
            </div>
          ) : (
            alerts.map(alert => {
              const cfg = severityConfig(alert.severity, c);
              const IconComp = cfg.icon;
              const isResolved = alert.status === "resolved";
              return (
                <div key={alert.id} style={{
                  background: c.bgCard,
                  border: `1px solid ${isResolved ? c.border : cfg.color + "40"}`,
                  borderLeft: `4px solid ${isResolved ? c.border : cfg.color}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  display: "flex", alignItems: "flex-start", gap: 16,
                  opacity: isResolved ? 0.65 : 1,
                  transition: "opacity 0.2s",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <IconComp size={20} color={cfg.color} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: c.textPrimary }}>{alert.title}</span>
                      <span style={{
                        padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: cfg.bg, color: cfg.color,
                      }}>{cfg.label}</span>
                      {isResolved && (
                        <span style={{
                          padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: `${c.green}18`, color: c.green,
                        }}>Résolue</span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: c.textSecondary, margin: "6px 0 0", lineHeight: 1.5 }}>{alert.description}</p>
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: c.accent }}>{alert.deviceIp}</span>
                      <span style={{ fontSize: 12, color: c.textMuted }}>
                        {new Date(alert.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => { setResolving(alert.id); resolveMutation.mutate(alert.id); }}
                      disabled={resolving === alert.id}
                      style={{
                        flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                        cursor: "pointer", transition: "all 0.2s",
                        background: `${c.green}18`, color: c.green,
                        border: `1px solid ${c.green}40`,
                        opacity: resolving === alert.id ? 0.6 : 1,
                      }}
                    >
                      <CheckCircle2 size={14} /> Résoudre
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
