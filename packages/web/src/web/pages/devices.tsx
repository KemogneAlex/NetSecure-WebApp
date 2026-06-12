import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../components/DashboardLayout";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import { Monitor, Smartphone, Printer, Wifi, Server, HelpCircle, ShieldOff, ShieldCheck, RefreshCw } from "lucide-react";
import { useState } from "react";

type Device = {
  id: number;
  name: string;
  ip: string;
  mac: string;
  type: string;
  status: string;
  riskLevel: string;
  lastSeen: string;
};

function deviceIcon(type: string, color: string) {
  const props = { size: 18, color };
  switch (type) {
    case "smartphone": return <Smartphone {...props} />;
    case "printer": return <Printer {...props} />;
    case "router": return <Wifi {...props} />;
    case "server": return <Server {...props} />;
    default: return <Monitor {...props} />;
  }
}

function RiskBadge({ risk, c }: { risk: string; c: any }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    low: { bg: `${c.green}18`, color: c.green, label: "Faible" },
    medium: { bg: `${c.orange}18`, color: c.orange, label: "Moyen" },
    high: { bg: `${c.red}18`, color: c.red, label: "Élevé" },
  };
  const style = map[risk] ?? map.low;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: style.bg, color: style.color,
    }}>{style.label}</span>
  );
}

function StatusDot({ status, c }: { status: string; c: any }) {
  const color = status === "online" ? c.green : status === "suspicious" ? c.orange : c.textMuted;
  const label = status === "online" ? "En ligne" : status === "suspicious" ? "Suspect" : "Hors ligne";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: status !== "offline" ? `0 0 6px ${color}` : undefined }} />
      <span style={{ fontSize: 13, color }}>{label}</span>
    </div>
  );
}

export default function Devices() {
  const { theme } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;
  const qc = useQueryClient();
  const [blocking, setBlocking] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "online" | "offline" | "suspicious">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const res = await fetch("/api/devices");
      const data = await res.json() as { devices: Device[] };
      return data.devices;
    },
  });

  const blockMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/devices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["devices"] });
      setBlocking(null);
    },
  });

  const devices = (data ?? []).filter(d => filter === "all" || d.status === filter);

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 700, color: c.textPrimary, margin: 0 }}>
              Appareils réseau
            </h1>
            <p style={{ fontSize: 14, color: c.textMuted, marginTop: 4 }}>
              {data?.length ?? 0} appareils détectés sur votre réseau
            </p>
          </div>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ["devices"] })}
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

        {/* Stats row */}
        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total", value: data.length, color: c.textPrimary },
              { label: "En ligne", value: data.filter(d => d.status === "online").length, color: c.green },
              { label: "Suspects", value: data.filter(d => d.status === "suspicious").length, color: c.orange },
              { label: "Risque élevé", value: data.filter(d => d.riskLevel === "high").length, color: c.red },
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

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["all", "online", "suspicious", "offline"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
              background: filter === f ? c.accent : c.bgCard,
              color: filter === f ? "#fff" : c.textSecondary,
              border: `1px solid ${filter === f ? c.accent : c.border}`,
              transition: "all 0.2s",
            }}>
              {{ all: "Tous", online: "En ligne", suspicious: "Suspects", offline: "Hors ligne" }[f]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: c.bgCard, border: `1px solid ${c.border}`,
          borderRadius: 16, overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 1fr auto",
            padding: "12px 24px",
            background: c.bgElevated,
            borderBottom: `1px solid ${c.border}`,
          }}>
            {["Appareil", "Adresse IP", "MAC", "Type", "Statut", "Risque", "Action"].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
            ))}
          </div>

          {isLoading ? (
            <div style={{ padding: 48, textAlign: "center", color: c.textMuted }}>Chargement...</div>
          ) : devices.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: c.textMuted }}>Aucun appareil trouvé</div>
          ) : (
            devices.map((device, i) => (
              <div key={device.id} style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 1fr auto",
                padding: "16px 24px",
                borderBottom: i < devices.length - 1 ? `1px solid ${c.border}` : undefined,
                alignItems: "center",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = c.bgElevated)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: c.bgElevated, border: `1px solid ${c.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {deviceIcon(device.type, c.accent)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary }}>{device.name}</div>
                    <div style={{ fontSize: 11, color: c.textMuted, marginTop: 1 }}>
                      {new Date(device.lastSeen).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                {/* IP */}
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: c.accent }}>{device.ip}</div>

                {/* MAC */}
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: c.textMuted }}>{device.mac}</div>

                {/* Type */}
                <div style={{ fontSize: 13, color: c.textSecondary, textTransform: "capitalize" }}>{device.type}</div>

                {/* Status */}
                <StatusDot status={device.status} c={c} />

                {/* Risk */}
                <RiskBadge risk={device.riskLevel} c={c} />

                {/* Action */}
                <button
                  onClick={() => {
                    setBlocking(device.id);
                    blockMutation.mutate({ id: device.id, status: device.status === "blocked" ? "offline" : "blocked" });
                  }}
                  disabled={blocking === device.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                    background: device.status === "blocked" ? `${c.green}18` : `${c.red}18`,
                    color: device.status === "blocked" ? c.green : c.red,
                    border: `1px solid ${device.status === "blocked" ? c.green : c.red}40`,
                    opacity: blocking === device.id ? 0.6 : 1,
                  }}
                >
                  {device.status === "blocked"
                    ? <><ShieldCheck size={13} /> Débloquer</>
                    : <><ShieldOff size={13} /> Bloquer</>
                  }
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
