import { Link, useLocation } from "wouter";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import {
  Shield, LayoutDashboard, Monitor, Bell, FileText,
  Settings, LogOut, Sun, Moon, Menu, X, Wifi, ChevronRight
} from "lucide-react";
import { useState } from "react";

const nav = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/devices", label: "Appareils", icon: Monitor },
  { path: "/alerts", label: "Alertes", icon: Bell },
  { path: "/reports", label: "Rapports", icon: FileText },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: c.bg, fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: c.bgSecondary,
        borderRight: `1px solid ${c.border}`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transform: mobileOpen ? "translateX(0)" : undefined,
        transition: "transform 0.3s",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: `1px solid ${c.border}` }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16, color: c.textPrimary }}>NetSecure</div>
              <div style={{ fontSize: 11, color: c.textMuted }}>Pro Plan</div>
            </div>
          </Link>
        </div>

        {/* Network status */}
        <div style={{ padding: "12px 20px", margin: "8px 12px", background: c.bgCard, borderRadius: 8, border: `1px solid ${c.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Wifi size={14} color={c.green} />
            <span style={{ fontSize: 12, color: c.textSecondary }}>Réseau surveillé</span>
            <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: c.green, boxShadow: `0 0 6px ${c.green}` }} />
          </div>
          <div style={{ fontSize: 11, color: c.textMuted, marginTop: 4, fontFamily: "JetBrains Mono, monospace" }}>192.168.1.0/24</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {nav.map(({ path, label, icon: Icon }) => {
            const active = location === path;
            return (
              <Link key={path} to={path} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                  background: active ? c.accentDim : "transparent",
                  border: active ? `1px solid ${c.accent}30` : "1px solid transparent",
                  color: active ? c.accent : c.textSecondary,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                  <Icon size={18} />
                  <span style={{ fontSize: 14, fontWeight: active ? 600 : 400 }}>{label}</span>
                  {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px", borderTop: `1px solid ${c.border}` }}>
          <button onClick={toggle} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "10px 12px", borderRadius: 8, border: "none",
            background: "transparent", color: c.textSecondary, cursor: "pointer", fontSize: 14,
          }}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Mode clair" : "Mode sombre"}
          </button>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8,
              color: c.textSecondary, cursor: "pointer", fontSize: 14,
            }}>
              <LogOut size={18} />
              Déconnexion
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: "100vh", background: c.bg }}>
        {/* Top bar */}
        <header style={{
          height: 64, padding: "0 32px",
          borderBottom: `1px solid ${c.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: c.bgSecondary, position: "sticky", top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: c.textPrimary }}>
              {nav.find(n => n.path === location)?.label ?? "NetSecure"}
            </div>
            <div style={{ fontSize: 12, color: c.textMuted }}>Dernière analyse : il y a 2 minutes</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              padding: "6px 14px", borderRadius: 20,
              background: `${c.green}15`, border: `1px solid ${c.green}40`,
              fontSize: 12, color: c.green, fontWeight: 600,
            }}>● Surveillance active</div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff",
            }}>A</div>
          </div>
        </header>

        <div style={{ padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
