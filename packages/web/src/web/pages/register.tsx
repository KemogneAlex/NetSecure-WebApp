import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme, darkColors, lightColors } from "../lib/theme";
import { Shield, Mail, Lock, Eye, EyeOff, User, Building2, Sun, Moon, ArrowRight, Check } from "lucide-react";

const perks = [
  "14 jours d'essai gratuit",
  "Aucune carte bancaire requise",
  "Configuration en 5 minutes",
  "Support en français inclus",
];

export default function Register() {
  const { theme, toggle } = useTheme();
  const c = theme === "dark" ? darkColors : lightColors;
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", company: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/dashboard"), 900);
  };

  const fields = [
    { key: "name", label: "Nom complet", icon: User, type: "text", placeholder: "Jean Dupont" },
    { key: "company", label: "Entreprise", icon: Building2, type: "text", placeholder: "Ma Société SAS" },
    { key: "email", label: "Email professionnel", icon: Mail, type: "email", placeholder: "jean@masociete.fr" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: c.bg,
      display: "flex", fontFamily: "Inter, sans-serif",
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 40, position: "relative", overflow: "hidden",
        background: theme === "dark"
          ? `linear-gradient(135deg, #0A0E1A 0%, #0F1628 100%)`
          : `linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)`,
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${c.accent}10 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -50, right: -50, width: 300, height: 300, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${c.purple}10 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 360, position: "relative", zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Shield size={22} color="#fff" />
            </div>
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 800, color: c.textPrimary }}>NetSecure</span>
          </Link>

          <h1 style={{
            fontFamily: "Space Grotesk, sans-serif", fontSize: 36, fontWeight: 800,
            color: c.textPrimary, lineHeight: 1.15, margin: "0 0 16px",
          }}>
            Protégez votre réseau<br />
            <span style={{
              background: `linear-gradient(90deg, ${c.accent}, ${c.purple})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>dès aujourd'hui</span>
          </h1>
          <p style={{ fontSize: 15, color: c.textSecondary, lineHeight: 1.6, marginBottom: 36 }}>
            Rejoignez des centaines de PME qui font confiance à NetSecure pour surveiller leur réseau.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {perks.map(perk => (
              <div key={perk} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: `${c.green}18`, border: `1px solid ${c.green}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Check size={12} color={c.green} strokeWidth={3} />
                </div>
                <span style={{ fontSize: 14, color: c.textSecondary }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: 480, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 40, background: c.bgSecondary, borderLeft: `1px solid ${c.border}`,
        position: "relative",
      }}>
        <button onClick={toggle} style={{
          position: "absolute", top: 20, right: 20,
          width: 40, height: 40, borderRadius: 10,
          border: `1px solid ${c.border}`, background: c.bgCard,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: c.textSecondary,
        }}>
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 26, fontWeight: 700, color: c.textPrimary, margin: "0 0 6px" }}>
              Créer un compte
            </h2>
            <p style={{ fontSize: 14, color: c.textMuted, margin: 0 }}>Déjà inscrit ? <Link to="/login" style={{ color: c.accent, fontWeight: 600, textDecoration: "none" }}>Se connecter</Link></p>
          </div>

          <form onSubmit={handleRegister}>
            {fields.map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: c.textSecondary, marginBottom: 6 }}>
                  {f.label}
                </label>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  border: `1.5px solid ${focused === f.key ? c.accent : c.border}`,
                  borderRadius: 10, padding: "0 14px",
                  background: c.bg, transition: "border-color 0.2s",
                }}>
                  <f.icon size={16} color={focused === f.key ? c.accent : c.textMuted} />
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={set(f.key)}
                    onFocus={() => setFocused(f.key)}
                    onBlur={() => setFocused(null)}
                    placeholder={f.placeholder}
                    style={{
                      flex: 1, padding: "11px 0", border: "none", background: "transparent",
                      fontSize: 14, color: c.textPrimary, outline: "none",
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: c.textSecondary, marginBottom: 6 }}>
                Mot de passe
              </label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                border: `1.5px solid ${focused === "password" ? c.accent : c.border}`,
                borderRadius: 10, padding: "0 14px",
                background: c.bg, transition: "border-color 0.2s",
              }}>
                <Lock size={16} color={focused === "password" ? c.accent : c.textMuted} />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Au moins 8 caractères"
                  style={{
                    flex: 1, padding: "11px 0", border: "none", background: "transparent",
                    fontSize: 14, color: c.textPrimary, outline: "none",
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  background: "none", border: "none", cursor: "pointer", color: c.textMuted, padding: 0,
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
              background: loading
                ? c.bgElevated
                : `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
              color: loading ? c.textMuted : "#fff",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
              boxShadow: loading ? "none" : `0 4px 20px ${c.accent}30`,
            }}>
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: `2px solid ${c.textMuted}40`,
                    borderTopColor: c.textMuted,
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Création en cours...
                </>
              ) : (
                <>Créer mon compte gratuitement <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ fontSize: 11, color: c.textMuted, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
            En créant un compte, vous acceptez nos{" "}
            <a href="#" style={{ color: c.accent, textDecoration: "none" }}>Conditions d'utilisation</a>
            {" "}et notre{" "}
            <a href="#" style={{ color: c.accent, textDecoration: "none" }}>Politique de confidentialité</a>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
